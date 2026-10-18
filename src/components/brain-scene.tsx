"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, useGLTF, useProgress } from "@react-three/drei";
import { Box3, Color, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, Sphere, Vector3 } from "three";
import { isHippocampus, manifest, structureLabel, type SceneStats, type Side, type ViewMode } from "../lib/anatomy";
import { prepareBrain } from "../lib/brain-model";

type Props = {
  mode: ViewMode;
  side: Side;
  contextOpacity: number;
  focusRequest: number;
  resetRequest: number;
  onHover: (label: string) => void;
  onReady: (stats: SceneStats) => void;
  onSelectHippocampus: (side: Side) => void;
};

const targetColor = new Color("#b2f2ce");
const contextColor = new Color("#c6a89d");
const hoverColor = new Color("#e6d3b4");

function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="loading-overlay" role="status"><span>Loading reference anatomy…</span><div className="loading-bar"><span style={{ width: `${progress}%` }} /></div><small>11.42 MiB · stored locally</small></div>;
}

function Anatomy(props: Props) {
  const { scene } = useGLTF(`/models/${manifest.localFile}`);
  const { camera, invalidate } = useThree();
  const controls = useRef<CameraControlsImpl>(null);
  const hovered = useRef<Mesh | null>(null);
  const previousMode = useRef<ViewMode>("whole");
  const lastReset = useRef(0);
  const initialized = useRef(false);
  const overview = useRef<{ position: Vector3; target: Vector3 } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const model = useMemo(() => prepareBrain(scene), [scene]);

  const targetBox = useMemo(() => {
    const box = new Box3();
    model.meshes.filter((mesh) => isHippocampus(mesh.name, props.side)).forEach((mesh) => box.union(new Box3().setFromObject(mesh)));
    return box;
  }, [model, props.side]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    props.onReady({ meshes: model.meshes.length, triangles: model.triangles, targetMeshes: model.meshes.filter((mesh) => isHippocampus(mesh.name, props.side)).length });
  }, [model, props.side, props.onReady]);

  useEffect(() => () => {
    model.meshes.forEach((mesh) => (mesh.material as MeshStandardMaterial).dispose());
    document.body.style.cursor = "";
  }, [model]);

  useEffect(() => {
    const control = controls.current;
    if (!control) return;
    const smooth = !reducedMotion && initialized.current;
    const reset = lastReset.current !== props.resetRequest;
    const modeBefore = previousMode.current;
    if (props.mode !== "whole" && modeBefore === "whole" && initialized.current) {
      overview.current = { position: control.getPosition(new Vector3()), target: control.getTarget(new Vector3()) };
    }
    function frame(box: Box3, initial = false, minimumRadius = 0) {
      const sphere = box.getBoundingSphere(new Sphere());
      sphere.radius = Math.max(sphere.radius, minimumRadius);
      const perspective = camera as PerspectiveCamera;
      const verticalFov = MathUtils.degToRad(perspective.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * perspective.aspect);
      const distance = sphere.radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2) * 1.12;
      const direction = initial ? new Vector3(4, 2.1, 4.5).normalize() : control!.getPosition(new Vector3()).sub(control!.getTarget(new Vector3())).normalize();
      const position = sphere.center.clone().addScaledVector(direction, distance);
      void control!.setLookAt(position.x, position.y, position.z, sphere.center.x, sphere.center.y, sphere.center.z, smooth);
    }
    if (props.mode === "whole" && modeBefore !== "whole" && overview.current && !reset) {
      const { position, target } = overview.current;
      void control.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, smooth);
    } else if (props.mode === "whole") {
      if (!initialized.current || reset) frame(model.box, true);
    } else {
      // Reveal keeps the brain silhouette in view; isolation can fill the frame.
      const contextRadius = props.mode === "reveal" ? model.box.getBoundingSphere(new Sphere()).radius * 0.8 : 0;
      frame(targetBox, false, contextRadius);
    }
    initialized.current = true;
    previousMode.current = props.mode;
    lastReset.current = props.resetRequest;
    invalidate();
  }, [props.mode, props.side, props.focusRequest, props.resetRequest, model, targetBox, camera, invalidate, reducedMotion]);

  useEffect(() => { hovered.current = null; props.onHover(""); document.body.style.cursor = ""; invalidate(); }, [props.mode, props.side, props.onHover, invalidate]);
  useEffect(() => { invalidate(); }, [props.contextOpacity, invalidate]);

  useFrame((_, delta) => {
    let transitioning = false;
    for (const mesh of model.meshes) {
      const target = isHippocampus(mesh.name, props.side);
      const desired = target || props.mode === "whole" ? 1 : props.mode === "reveal" ? props.contextOpacity : 0;
      const material = mesh.material as MeshStandardMaterial;
      const opacity = reducedMotion ? desired : MathUtils.damp(material.opacity, desired, 7, Math.min(delta, 0.1));
      material.opacity = Math.abs(opacity - desired) < 0.002 ? desired : opacity;
      mesh.visible = material.opacity > 0.002;
      // Keep hidden / ghost anatomy out of selection so it cannot steal hippocampus clicks.
      mesh.userData.pickable = desired > 0.02 && (props.mode === "whole" || target);
      const transparent = material.opacity < 1 || (target && props.mode !== "whole");
      if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
      material.depthWrite = target || !transparent;
      // Context first, solid target afterwards. Triangle sorting can still cause artifacts.
      mesh.renderOrder = target ? 1 : 0;
      material.color.copy(mesh === hovered.current ? hoverColor : target ? targetColor : contextColor);
      material.emissive.copy(target ? targetColor : contextColor);
      material.emissiveIntensity = target && props.mode !== "whole" ? 0.13 : 0;
      transitioning ||= material.opacity !== desired;
    }
    if (transitioning) invalidate();
  });

  function hover(event: ThreeEvent<PointerEvent>) {
    if (event.object instanceof Mesh && event.object.userData.pickable && event.object.visible) {
      event.stopPropagation();
      hovered.current = event.object;
      props.onHover(structureLabel(event.object.name, event.object.userData.label));
      document.body.style.cursor = isHippocampus(event.object.name) ? "pointer" : "grab";
      invalidate();
    }
  }

  return <>
    <primitive object={model.root} dispose={null} onPointerMove={hover} onPointerOut={() => { hovered.current = null; props.onHover(""); document.body.style.cursor = ""; invalidate(); }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        if (event.delta > 5 || !event.object.userData.pickable || !isHippocampus(event.object.name)) return;
        event.stopPropagation();
        props.onSelectHippocampus(event.object.name.endsWith("_L") ? "left" : "right");
      }} />
    <CameraControls ref={controls} makeDefault minDistance={0.15} maxDistance={20} smoothTime={0.65} draggingSmoothTime={0.12} />
  </>;
}

export default function BrainScene(props: Props) {
  return <div className="canvas-wrap">
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4, 2.1, 4.5], fov: 38, near: 0.01, far: 100 }}
      gl={{ antialias: true, alpha: true }} fallback={<span>Interactive anatomical atlas. Use the workbench controls to select a view.</span>}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 5]} intensity={2.6} color="#fff0df" />
      <directionalLight position={[-4, 1, -3]} intensity={1.8} color="#a6c6d8" />
      <Suspense fallback={null}><Anatomy {...props} /></Suspense>
    </Canvas>
    <LoadingOverlay />
  </div>;
}
