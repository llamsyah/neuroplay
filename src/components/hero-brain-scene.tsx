"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Vector3 } from "three";
import { manifest } from "../lib/anatomy";
import { prepareBrain } from "../lib/brain-model";

export type BrainAction = "left" | "right" | "up" | "down" | "in" | "out" | "reset";
export type BrainCommand = { action: BrainAction; sequence: number };
type Props = { command: BrainCommand; reducedMotion: boolean; interactive: boolean; onReady: () => void };

function Model({ command, reducedMotion, interactive, onReady }: Props) {
  const { scene } = useGLTF(`/models/${manifest.localFile}`);
  const { size } = useThree();
  const controls = useRef<CameraControlsImpl>(null);
  const model = useMemo(() => prepareBrain(scene, { color: "#d7c3bb", roughness: 0.61 }), [scene]);
  const home = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance = 3.2 / (2 * Math.tan(16 * Math.PI / 180) * Math.min(aspect, 1));
    return new Vector3(4, 1.9, 5.7).normalize().multiplyScalar(distance);
  }, [size.width, size.height]);

  useEffect(() => {
    void controls.current?.setLookAt(home.x, home.y, home.z, 0, 0, 0, false);
    onReady();
  }, [home, onReady]);

  useEffect(() => {
    const control = controls.current;
    if (!control || command.sequence === 0) return;
    const smooth = !reducedMotion;
    switch (command.action) {
      case "left": void control.rotate(Math.PI / 10, 0, smooth); break;
      case "right": void control.rotate(-Math.PI / 10, 0, smooth); break;
      case "up": void control.rotate(0, -Math.PI / 12, smooth); break;
      case "down": void control.rotate(0, Math.PI / 12, smooth); break;
      case "in": void control.dolly(0.65, smooth); break;
      case "out": void control.dolly(-0.65, smooth); break;
      case "reset": void control.setLookAt(home.x, home.y, home.z, 0, 0, 0, smooth); break;
    }
  }, [command, reducedMotion, home]);

  useEffect(() => () => {
    model.meshes.forEach((mesh) => (mesh.material as MeshStandardMaterial).dispose());
  }, [model]);

  return <>
    <primitive object={model.root} dispose={null} />
    <CameraControls ref={controls} makeDefault enabled={interactive} minDistance={3.3} maxDistance={12}
      smoothTime={reducedMotion ? 0 : 0.38} draggingSmoothTime={reducedMotion ? 0 : 0.1}
      mouseButtons={{ left: CameraControlsImpl.ACTION.ROTATE, middle: CameraControlsImpl.ACTION.DOLLY, right: CameraControlsImpl.ACTION.NONE, wheel: CameraControlsImpl.ACTION.DOLLY }}
      touches={{ one: CameraControlsImpl.ACTION.TOUCH_ROTATE, two: CameraControlsImpl.ACTION.TOUCH_DOLLY, three: CameraControlsImpl.ACTION.NONE }} />
  </>;
}

export default function HeroBrainScene(props: Props) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4, 1.9, 5.7], fov: 32, near: 0.01, far: 60 }}
    gl={{ antialias: true, alpha: true }} aria-label="Model anatomi otak manusia yang dapat diputar dan diperbesar"
    fallback={<span>Model anatomi 3D interaktif. Gunakan kontrol di bawah model untuk menjelajah.</span>}>
    <ambientLight intensity={0.62} />
    <directionalLight position={[3, 5, 5]} intensity={2.7} color="#fff1df" />
    <directionalLight position={[-4, 1, -3]} intensity={1.65} color="#bfa5f4" />
    <directionalLight position={[-2, 4, 1]} intensity={0.4} color="#efe3fb" />
    <Suspense fallback={null}><Model {...props} /></Suspense>
  </Canvas>;
}
