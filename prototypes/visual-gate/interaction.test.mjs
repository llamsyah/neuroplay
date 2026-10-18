import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SURFACE_REGIONS, HIPPOCAMPUS, SURFACE_BY_NODE, validateSelectableAnatomy } from './anatomy.js';
import { pickSupportedRegion, createGestureGuard, createSelectionHistory, interpolateOrbit } from './interaction.js';

const repo = new URL('../../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('public/models/brain-manifest.json', repo)));
const audit = JSON.parse(await readFile(new URL('anatomy-audit.json', import.meta.url)));
const bytes = await readFile(new URL(`public/models/${manifest.localFile}`, repo));
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
gltf.scene.updateMatrixWorld(true);
const meshes = [];
gltf.scene.traverse((object) => {
  if (!object.isMesh) return;
  object.geometry.computeBoundingBox();
  object.material = new THREE.MeshStandardMaterial();
  object.userData.educationalRegion = SURFACE_BY_NODE.get(object.name) ?? (HIPPOCAMPUS.nodes.includes(object.name) ? HIPPOCAMPUS : null);
  meshes.push(object);
});

test('the six exposed surface identities match the exact asset, GLB extras, and publisher crosswalk', () => {
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.sha256);
  assert.equal(meshes.length, 283);
  assert.equal(audit.summary.crosswalkMatchedCandidates, 102);
  assert.equal(audit.summary.missingOrPlaceholderIdentity, 180);
  assert.equal(SURFACE_REGIONS.length, 6);
  validateSelectableAnatomy(meshes, manifest, audit);
  const mesh = gltf.scene.getObjectByName(SURFACE_REGIONS[0].nodes[0]);
  const original = mesh.userData.label;
  mesh.userData.label = 'unverified replacement label';
  assert.throws(() => validateSelectableAnatomy(meshes, manifest, audit), /matching source evidence/);
  mesh.userData.label = original;
  for (const name of HIPPOCAMPUS.nodes) assert.equal(gltf.scene.getObjectByName(name).userData.ontologyid, '-');
});

let successfulRay;
test('each supported surface can be a first visible hit in the actual atlas, without picking through cortex', () => {
  const sphere = new THREE.Box3().setFromObject(gltf.scene).getBoundingSphere(new THREE.Sphere());
  const found = [];
  for (const region of SURFACE_REGIONS) {
    const mesh = gltf.scene.getObjectByName(region.nodes[0]);
    const positions = mesh.geometry.attributes.position, index = mesh.geometry.index;
    let hit = null;
    outer: for (const elevation of [.35, 1]) {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const origin = sphere.center.clone().addScaledVector(new THREE.Vector3(Math.sin(angle), elevation, Math.cos(angle)).normalize(), sphere.radius * 3.5);
        for (let fraction = 0; fraction < 20; fraction++) {
          const triangle = Math.floor((index.count / 3 - 1) * fraction / 19) * 3;
          const point = new THREE.Vector3();
          for (let vertex = 0; vertex < 3; vertex++) point.add(new THREE.Vector3().fromBufferAttribute(positions, index.getX(triangle + vertex)));
          point.divideScalar(3).applyMatrix4(mesh.matrixWorld);
          const raycaster = new THREE.Raycaster(origin, point.clone().sub(origin).normalize());
          const candidate = pickSupportedRegion(raycaster, meshes, 'whole');
          if (candidate?.region.id === region.id) {
            hit = candidate;
            successfulRay ??= { origin:origin.clone(), direction:raycaster.ray.direction.clone(), distance:origin.distanceTo(candidate.point), sphereRadius:sphere.radius };
            break outer;
          }
        }
      }
    }
    assert.ok(hit, `${region.name} could not be reached as the nearest supported surface`);
    found.push(region.id);
  }
  assert.equal(new Set(found).size, 6);
});

test('an unsupported foreground mesh blocks a supported target instead of selecting through it', () => {
  assert.ok(successfulRay);
  const { origin, direction, distance, sphereRadius } = successfulRay;
  const blocker = new THREE.Mesh(new THREE.BoxGeometry(sphereRadius * .08, sphereRadius * .08, sphereRadius * .08), new THREE.MeshStandardMaterial());
  blocker.position.copy(origin).addScaledVector(direction, distance * .5);
  blocker.updateMatrixWorld(true);
  assert.equal(pickSupportedRegion(new THREE.Raycaster(origin, direction), [blocker, ...meshes], 'whole'), null);
  blocker.material.opacity = .024;
  assert.ok(pickSupportedRegion(new THREE.Raycaster(origin, direction), [blocker, ...meshes], 'whole'));
  blocker.geometry.dispose(); blocker.material.dispose();
});

test('internal hippocampus meshes cannot be selected through whole-brain context', () => {
  const hip = gltf.scene.getObjectByName(HIPPOCAMPUS.nodes[0]);
  const raycaster = { intersectObjects:() => [{ object:hip, point:new THREE.Vector3() }] };
  assert.equal(pickSupportedRegion(raycaster, [hip], 'whole'), null);
  assert.equal(pickSupportedRegion(raycaster, [hip], 'reveal').region.id, 'hippocampus');
});

const event = (x, y, extra = {}) => ({ pointerId:1, clientX:x, clientY:y, pointerType:'mouse', button:0, timeStamp:0, ...extra });
test('click/tap selection excludes drags, drags returning to their start, scrolling cancellation, and pinches', () => {
  const guard = createGestureGuard();
  guard.down(event(10, 10)); assert.equal(guard.up(event(12, 11, { timeStamp:100 })), true);
  guard.down(event(10, 10)); guard.move(event(40, 10)); assert.equal(guard.up(event(10, 10, { timeStamp:100 })), false);
  guard.down(event(10, 10, { pointerType:'touch' })); guard.cancel(); assert.equal(guard.up(event(10, 10, { pointerType:'touch', timeStamp:100 })), false);
  guard.down(event(10, 10, { pointerType:'touch' })); guard.down(event(30, 10, { pointerId:2, pointerType:'touch' }));
  assert.equal(guard.up(event(10, 10, { pointerType:'touch', timeStamp:100 })), false);
  assert.equal(guard.up(event(30, 10, { pointerId:2, pointerType:'touch', timeStamp:110 })), false);
  guard.down(event(10, 10, { button:2 })); assert.equal(guard.up(event(10, 10, { button:2, timeStamp:100 })), false);
  guard.down(event(10, 10, { pointerType:'touch' })); assert.equal(guard.up(event(10, 10, { pointerType:'touch', timeStamp:1100 })), false);
});

test('previous selection preserves identity, reveal mode, side, camera, and overview independently', () => {
  const history = createSelectionHistory();
  const first = { id:'precentral-left', mode:'whole', side:'both', focused:true, pose:{ position:[1, 2, 3], target:[0, 0, 0] }, overview:{ position:[4, 2, 4], target:[0, 0, 0] } };
  history.push(first);
  first.pose.position[0] = 999;
  history.push({ id:'hippocampus', mode:'isolate', side:'left', focused:true, pose:{ position:[1, 1, 1], target:[.1, 0, 0] } });
  assert.equal(history.length, 2);
  assert.equal(history.back().mode, 'isolate');
  const previous = history.back();
  assert.equal(previous.id, 'precentral-left'); assert.equal(previous.pose.position[0], 1); assert.deepEqual(previous.overview.position, [4, 2, 4]);
  assert.equal(history.back(), null);
  history.push(previous); history.clear(); assert.equal(history.length, 0);
});

test('opposite-side camera transitions orbit around the target rather than passing through it', () => {
  const start = { position:new THREE.Vector3(-6, 2, 0), target:new THREE.Vector3() };
  const end = { position:new THREE.Vector3(6, 2, 0), target:new THREE.Vector3() };
  const midpoint = interpolateOrbit(start, end, .5);
  assert.ok(midpoint.position.distanceTo(midpoint.target) > 6);
  const final = interpolateOrbit(start, end, 1);
  assert.deepEqual(final.position.toArray(), end.position.toArray()); assert.deepEqual(final.target.toArray(), end.target.toArray());
});

test('external selection keeps every atlas mesh opaque; fading is restricted to explicit reveal/isolate modes', async () => {
  const source = await readFile(new URL('prototype.js', import.meta.url), 'utf8');
  const materialFunction = source.match(/function materialsForState\(\) \{[\s\S]*?(?=\nfunction clearHover)/)?.[0];
  assert.ok(materialFunction, 'Exercise the actual prototype material transition, not a duplicate formula');
  const context = { meshes, mode:'whole', selected:() => false, clearHover:() => {}, applyColors:() => {}, invalidate:() => {}, preference:{ matches:true }, performance:{ now:() => 0 }, materialMotion:null };
  for (const region of SURFACE_REGIONS) {
    context.selected = (mesh) => region.nodes.includes(mesh.name);
    // Also test restoration from an already faded view into an external selection.
    for (const mesh of meshes) mesh.material.opacity = .024;
    vm.runInNewContext(materialFunction + '\nmaterialsForState();', context);
    for (const mesh of meshes) {
      assert.equal(mesh.userData.endOpacity, 1, `${region.id} must not fade ${mesh.name}`);
      assert.equal(mesh.material.depthWrite, true);
      assert.equal(mesh.visible, true);
    }
  }
  context.selected = (mesh) => HIPPOCAMPUS.nodes.includes(mesh.name);
  for (const mode of ['reveal', 'isolate']) {
    context.mode = mode;
    vm.runInNewContext(materialFunction + '\nmaterialsForState();', context);
    for (const mesh of meshes) assert.equal(mesh.userData.endOpacity, context.selected(mesh) ? 1 : mode === 'reveal' ? .024 : 0);
  }
  for (const mesh of meshes) mesh.material.opacity = 1;
});
