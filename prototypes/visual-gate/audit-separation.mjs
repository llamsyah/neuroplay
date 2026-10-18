import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SURFACE_REGIONS, HIPPOCAMPUS } from './anatomy.js';

const manifest = JSON.parse(await readFile(new URL('../../public/models/brain-manifest.json', import.meta.url)));
const bytes = await readFile(new URL(`../../public/models/${manifest.localFile}`, import.meta.url));
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== manifest.sha256) throw new Error('Source checksum changed');
const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
gltf.scene.updateMatrixWorld(true);
const meshes = []; gltf.scene.traverse((object) => { if (object.isMesh) meshes.push(object); });

// Weld only exactly equal source positions for topological accounting. No
// tolerance, remeshing, vertex movement, or corrected identities are introduced.
function topology(mesh) {
  const position = mesh.geometry.attributes.position, index = mesh.geometry.index;
  const vertices = new Map(), ids = [], parents = [], edges = new Map();
  const root = (id) => parents[id] === id ? id : parents[id] = root(parents[id]);
  const join = (a, b) => { a = root(a); b = root(b); if (a !== b) parents[b] = a; };
  for (let i = 0; i < position.count; i++) {
    const key = [position.getX(i), position.getY(i), position.getZ(i)].join(',');
    if (!vertices.has(key)) { vertices.set(key, vertices.size); parents.push(parents.length); }
    ids.push(vertices.get(key));
  }
  let degenerateTriangles = 0;
  const count = index?.count ?? position.count;
  for (let i = 0; i < count; i += 3) {
    const tri = [0, 1, 2].map((offset) => ids[index ? index.getX(i + offset) : i + offset]);
    if (new Set(tri).size !== 3) { degenerateTriangles++; continue; }
    for (let k = 0; k < 3; k++) {
      let a = tri[k], b = tri[(k + 1) % 3]; join(a, b);
      if (a > b) [a, b] = [b, a];
      const key = `${a},${b}`; edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  }
  return { triangles:count / 3, exactPositionVertices:vertices.size,
    components:new Set(parents.map((_, i) => root(i))).size,
    boundaryEdges:[...edges.values()].filter((count) => count === 1).length,
    nonmanifoldEdges:[...edges.values()].filter((count) => count > 2).length, degenerateTriangles };
}
const groups = json.nodes.filter((node) => node.children && /Hemisphere/.test(node.name)).map((node) => {
  const side = node.name.endsWith('_L') ? '_L' : '_R';
  const members = node.children.map((id) => json.nodes[id]);
  return { name:node.name, meshMembers:members.length,
    sourceSideNameMismatches:members.filter((member) => !member.name.endsWith(side)).map((member) => member.name),
    members:members.map((member) => member.name),
  };
});
const candidates = [...SURFACE_REGIONS, HIPPOCAMPUS].flatMap((region) => region.nodes.map((name) => {
  const mesh = gltf.scene.getObjectByName(name), box = new THREE.Box3().setFromObject(mesh);
  return { name, region:region.id, evidence:region.evidence, ...topology(mesh),
    overlappingOtherMeshBounds:meshes.filter((other) => other !== mesh && box.intersectsBox(new THREE.Box3().setFromObject(other))).length,
  };
}));
const result = {
  sourceCommit:manifest.commit, sha256, meshCount:meshes.length,
  method:'Read-only GLB hierarchy and exact-position edge/component analysis. AABB overlap is only a broad-phase warning, not proof of triangle collision. No path sweep, self-intersection certification, or independent anatomy validation is claimed.',
  hemisphereGroups:groups, candidateMeshes:candidates,
  decision:'No displacement experiment enabled. Hemisphere hierarchy fails side-membership consistency. Verified precentral/postcentral parcels pass basic closed/connected edge-count checks but have no reviewed separation-interface or collision-checked extraction trajectory. Superior temporal parcels have nonmanifold edges. Hippocampus retains its source-name-only evidence exception.',
  minimumNextInput:'A reviewed explicit group-membership manifest separating cerebral hemispheres from midline/brainstem structures, retaining original node transforms; for a single-parcel pilot, a reviewed interface/cap assessment and tested extraction trajectory. A replacement asset is only needed if those interfaces require corrected geometry.',
};
await writeFile(new URL('./separation-feasibility.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ sha256, hemisphereGroups:groups.map(({ members, ...rest }) => rest), candidateMeshes:candidates, decision:result.decision }, null, 2));
