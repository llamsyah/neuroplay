import { Box3, Mesh, MeshStandardMaterial, Vector3, type Object3D, type MeshStandardMaterialParameters } from "three";
import { manifest } from "./anatomy";

/** Center and uniformly scale the complete atlas; preserve every relative coordinate. */
export function prepareBrain(scene: Object3D, material: MeshStandardMaterialParameters = {}) {
  const root = scene.clone(true);
  const sourceBox = new Box3().setFromObject(root);
  const center = sourceBox.getCenter(new Vector3());
  const dimensions = sourceBox.getSize(new Vector3());
  const scale = 3 / Math.max(dimensions.x, dimensions.y, dimensions.z);
  root.scale.setScalar(scale);
  root.position.copy(center).multiplyScalar(-scale);
  root.updateMatrixWorld(true);

  const meshes: Mesh[] = [];
  let triangles = 0;
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.material = new MeshStandardMaterial({ color: "#c6a89d", roughness: 0.68, metalness: 0, ...material });
    meshes.push(object);
    triangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3;
  });
  for (const name of [...manifest.hippocampusNodes.left, ...manifest.hippocampusNodes.right]) {
    if (!(root.getObjectByName(name) instanceof Mesh)) throw new Error(`Required anatomical node missing: ${name}`);
  }
  return { root, meshes, triangles, box: new Box3().setFromObject(root) };
}
