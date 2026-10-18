import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Box3, Mesh, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const manifest = JSON.parse(await readFile(new URL("../public/models/brain-manifest.json", import.meta.url), "utf8"));
const bytes = await readFile(new URL(`../public/models/${manifest.localFile}`, import.meta.url));
const sha256 = createHash("sha256").update(bytes).digest("hex");
assert.equal(sha256, manifest.sha256, "Asset differs from the version whose source/license was inspected");
assert.equal(bytes.length, manifest.bytes);
assert.equal(bytes.readUInt32LE(0), 0x46546c67, "Not a binary glTF file");
assert.equal(bytes.readUInt32LE(4), 2);
assert.equal(bytes.readUInt32LE(8), bytes.length);
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "");
gltf.scene.updateMatrixWorld(true);
const brainBox = new Box3().setFromObject(gltf.scene);
const meshes = [];
let triangleCount = 0;
let vertexCount = 0;
gltf.scene.traverse((object) => {
  if (!(object instanceof Mesh)) return;
  assert.ok(!meshes.some((mesh) => mesh.name === object.name), `Duplicate node: ${object.name}`);
  const position = object.geometry.attributes.position;
  const indices = object.geometry.index;
  assert.ok(position.count > 0 && indices && indices.count > 0);
  assert.equal(indices.count % 3, 0);
  for (let i = 0; i < position.count; i++) {
    assert.ok(Number.isFinite(position.getX(i)) && Number.isFinite(position.getY(i)) && Number.isFinite(position.getZ(i)), `Invalid vertex in ${object.name}`);
  }
  for (let i = 0; i < indices.count; i++) assert.ok(indices.getX(i) < position.count, `Out-of-range index in ${object.name}`);
  vertexCount += position.count;
  triangleCount += indices.count / 3;
  meshes.push(object);
});
assert.equal(meshes.length, manifest.meshCount);
assert.equal(triangleCount, manifest.triangleCount);
const hippocampi = Object.entries(manifest.hippocampusNodes).flatMap(([side, names]) => names.map((name) => {
  const mesh = gltf.scene.getObjectByName(name);
  assert.ok(mesh instanceof Mesh, `Missing hippocampus component: ${name}`);
  const box = new Box3().setFromObject(mesh);
  assert.ok(brainBox.containsBox(box), `${name} lies outside atlas bounding box`);
  assert.ok(side === "left" ? box.max.x < 0 : box.min.x > 0, `${name} has unexpected laterality coordinates`);
  return { name, side, triangles: mesh.geometry.index.count / 3, bounds: { min: box.min.toArray(), max: box.max.toArray() }, ontologyId: mesh.userData.ontologyid ?? null };
}));
assert.equal(hippocampi.length, 6);
const documentJson = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
assert.ok(documentJson.nodes.every((node) => !node.matrix && !node.translation && !node.rotation && !node.scale), "Source transforms changed; revisit coordinate assumptions");
const report = {
  checkedOn: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date()), sha256, bytes: bytes.length, sourceCommit: manifest.commit,
  meshCount: meshes.length, triangleCount, vertexCount,
  sourceBounds: { min: brainBox.min.toArray(), max: brainBox.max.toArray() },
  dimensionsInSourceUnits: brainBox.getSize(new Vector3()).toArray(),
  meshNodesWithTransforms: 0, textures: documentJson.textures?.length ?? 0,
  hippocampi,
  limitations: ["Bounding-box and laterality checks are coordinate sanity checks, not independent anatomical validation.", "Source metadata states that one hemisphere was mirrored and resized.", "The six hippocampus nodes have no valid ontology ID in the source extras or crosswalk.", "No mesh repair, registration, simplification, or per-structure transform was performed."]
};
await writeFile(new URL("../docs/asset-audit.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(`PASS: checksum, GLTFLoader parsing, ${meshes.length} meshes, ${triangleCount.toLocaleString("en-US")} triangles, finite vertices / valid indices, six separately named hippocampus parts, bounding-box containment, source transforms, and laterality sanity checks.`);
