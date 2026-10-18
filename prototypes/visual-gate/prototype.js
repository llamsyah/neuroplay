import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SURFACE_REGIONS, HIPPOCAMPUS, REGION_BY_ID, SURFACE_BY_NODE, validateSelectableAnatomy } from './anatomy.js';
import { mountIcons, icon } from './icons.js';
import { createAnatomyNavigator, locationFor } from './navigation.js';
import { surfaceFeedback, keepWheelForPage } from './discovery-aid.js';
import { pickSupportedRegion, createGestureGuard, createSelectionHistory, interpolateOrbit } from './interaction.js';

// Isolated prototype only. Source anatomy and production code remain unchanged.
const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
let view = ['explorer', 'transition'].includes(params.get('view')) ? params.get('view') : 'discovery';
let activeId = REGION_BY_ID.has(params.get('selection')) ? params.get('selection') : null;
let mode = view === 'explorer' && ['reveal', 'isolate'].includes(params.get('mode')) ? params.get('mode') : 'whole';
if (mode !== 'whole') activeId = HIPPOCAMPUS.id;
if (view !== 'explorer' && activeId === HIPPOCAMPUS.id) activeId = null;
let side = 'both', focused = view === 'explorer' && Boolean(activeId);
let loaded = false, touch = false, hovered = null, selectionFromPointer = false;
let showAreas = params.get('areas') === 'on', previewId = null;
let manifest, root, meshes, wholeBox, renderer, camera, scene, controls;
let framePending = false, cameraMotion = null, materialMotion = null;
let homePose = null, homeSelection = null, overview = null;
let lastWidth = 0, lastHeight = 0, hoverPoint = null;
const boxes = new Map();
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 760px)');
const mount = $('#canvas-mount'), shell = $('#scene'), label = $('#anatomy-label');
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
const gestures = createGestureGuard(), history = createSelectionHistory();
const active = () => REGION_BY_ID.get(activeId) ?? null;
const announce = (text) => { $('#announcement').textContent = text; };
const selected = (mesh) => activeId === HIPPOCAMPUS.id
  ? (side === 'both' ? HIPPOCAMPUS.nodes : manifest.hippocampusNodes[side]).includes(mesh.name)
  : Boolean(active()?.nodes.includes(mesh.name));

mountIcons();
const navigator = createAnatomyNavigator({
  panel: $('#anatomy-navigator'), list: $('#anatomy-list'), current: $('#navigator-current'),
  triggers: [$('#anatomy-toggle'), $('#stage-anatomy-toggle')], closeButton: $('#navigator-close'), root: document.body,
  informationButton: $('#information-toggle'), onPreview: previewRegion,
  onSelect: (id) => chooseRegion(id),
});

function targetBox() {
  if (activeId === HIPPOCAMPUS.id) return boxes.get(`hippocampus-${side}`);
  return boxes.get(activeId) ?? wholeBox;
}
function currentPose() { return { position:camera.position.clone(), target:controls.target.clone() }; }
function snapshot() {
  return { id:activeId, mode, side, focused, pose:{ position:camera.position.toArray(), target:controls.target.toArray() },
    overview:overview ? { position:overview.position.toArray(), target:overview.target.toArray() } : null };
}
function unpackPose(pose) { return { position:new THREE.Vector3().fromArray(pose.position), target:new THREE.Vector3().fromArray(pose.target) }; }
function poseForState(direction) {
  const sphere = (mode === 'isolate' ? targetBox() : wholeBox).getBoundingSphere(new THREE.Sphere());
  if (mode === 'reveal' || (focused && active()?.kind === 'surface')) {
    const oldCenter = sphere.center.clone();
    sphere.center.lerp(targetBox().getCenter(new THREE.Vector3()), mode === 'reveal' ? .12 : .22);
    // Keep the surrounding whole-brain bounds in view when focusing a surface region.
    sphere.radius += sphere.center.distanceTo(oldCenter);
  }
  sphere.radius = Math.max(sphere.radius, .22);
  const vfov = THREE.MathUtils.degToRad(camera.fov);
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
  const distance = sphere.radius / Math.sin(Math.min(vfov, hfov) / 2) * 1.06;
  return { position:sphere.center.clone().addScaledVector(direction, distance), target:sphere.center };
}
function directionTowardSelection(direction) {
  if (active()?.kind !== 'surface') return direction;
  // Geometry is used only to frame an already identified region, never to name it.
  const outward = targetBox().getCenter(new THREE.Vector3()).sub(wholeBox.getCenter(new THREE.Vector3()));
  outward.y = 0;
  const horizontal = new THREE.Vector3(direction.x, 0, direction.z);
  if (outward.lengthSq() < .001 || horizontal.lengthSq() < .001 || outward.normalize().dot(horizontal.clone().normalize()) > .15) return direction;
  const adjusted = outward.multiplyScalar(.8).add(horizontal.clone().normalize().multiplyScalar(.2)).normalize();
  adjusted.y = direction.y / horizontal.length();
  return adjusted.normalize();
}
function moveTo(poseOrDirection, duration = 500) {
  clearHover();
  const start = currentPose();
  if (preference.matches) {
    const end = poseOrDirection.direction ? poseForState(poseOrDirection.direction) : poseOrDirection;
    camera.position.copy(end.position); controls.target.copy(end.target); controls.update(); cameraMotion = null;
  } else cameraMotion = { start, ...poseOrDirection, time:performance.now(), duration };
  invalidate();
}
function frameCurrent(duration = 400, faceSelection = false) {
  let direction = camera.position.clone().sub(controls.target).normalize();
  if (faceSelection) direction = directionTowardSelection(direction);
  moveTo({ direction }, duration);
}
function invalidate() {
  if (!framePending && renderer) { framePending = true; requestAnimationFrame(render); }
}
function previewRegion(id) {
  previewId = mode === 'whole' && REGION_BY_ID.get(id)?.kind === 'surface' ? id : null;
  applyColors(); syncDiscoveryAid();
}
function syncDiscoveryAid() {
  const enabled = showAreas && mode === 'whole';
  $('#areas-toggle').setAttribute('aria-pressed', String(enabled));
  $('#areas-toggle').disabled = !loaded || mode !== 'whole';
  $('#areas-toggle-label').textContent = enabled ? 'Sembunyikan penanda area' : 'Tampilkan area interaktif';
  $('#aid-legend').hidden = !enabled && !previewId;
}
function applyColors() {
  if (!loaded) return;
  for (const mesh of meshes) {
    const feedback = surfaceFeedback({ node:mesh.name, selected:selected(mesh), hovered:hovered?.mesh === mesh,
      previewId, showAreas, mode, surfaceByNode:SURFACE_BY_NODE });
    const colors = {
      base:view === 'discovery' ? '#c4aebe' : '#baa7c6',
      selected:active()?.kind === 'surface' ? (view === 'discovery' ? '#8550cc' : '#b784ee') : '#d6b6ff',
      hover:view === 'discovery' ? '#ad84d9' : '#c8a5f1',
      available:view === 'discovery' ? '#65999b' : '#77b3b5',
      preview:view === 'discovery' ? '#397e83' : '#80d2d1',
    };
    mesh.material.color.set(colors[feedback]);
    mesh.material.emissive.set(feedback === 'selected' || feedback === 'hover' ? '#8853be' : feedback === 'preview' ? '#367d83' : '#000000');
    mesh.material.emissiveIntensity = feedback === 'selected' && mode !== 'whole' ? .18 : feedback === 'selected' ? .025 : feedback === 'hover' || feedback === 'preview' ? .055 : 0;
  }
  invalidate();
}

function materialsForState() {
  clearHover();
  for (const mesh of meshes) {
    const desired = mode === 'whole' || selected(mesh) ? 1 : mode === 'reveal' ? .024 : 0;
    mesh.userData.startOpacity = mesh.material.opacity; mesh.userData.endOpacity = desired;
    mesh.renderOrder = mode !== 'whole' && selected(mesh) ? 2 : 0;
    mesh.material.transparent = desired < 1 || mesh.material.opacity < 1;
    mesh.material.depthWrite = desired === 1; mesh.material.needsUpdate = true;
    if (desired > 0) mesh.visible = true;
  }
  applyColors();
  materialMotion = meshes.some((mesh) => Math.abs(mesh.userData.startOpacity - mesh.userData.endOpacity) > .001)
    ? { time:performance.now(), duration:preference.matches ? 0 : 520 } : null;
  invalidate();
}
function clearHover() {
  const hadHover = hovered; hovered = null; hoverPoint = null;
  $('#hover-label').hidden = true;
  shell.removeAttribute('data-hover');
  if (hadHover) applyColors();
}
function showHover(hit, event) {
  if (hovered?.mesh !== hit?.mesh) { hovered = hit; applyColors(); }
  const tooltip = $('#hover-label');
  tooltip.hidden = !hit;
  shell.toggleAttribute('data-hover', Boolean(hit));
  if (!hit) return;
  tooltip.textContent = hit.region.name;
  const rect = mount.getBoundingClientRect();
  tooltip.style.left = Math.max(8, Math.min(lastWidth - tooltip.offsetWidth - 8, event.clientX - rect.left + 16)) + 'px';
  tooltip.style.top = Math.max(8, Math.min(lastHeight - tooltip.offsetHeight - 8, event.clientY - rect.top + 15)) + 'px';
}
function updateUI() {
  const region = active(), surface = region?.kind === 'surface', isHip = activeId === HIPPOCAMPUS.id;
  document.body.dataset.view = view; document.body.dataset.mode = mode;
  document.body.dataset.selection = surface ? 'surface' : isHip ? 'internal' : 'none';
  $('.discovery-entry').inert = view !== 'discovery';
  $('.discovery-panel').inert = view !== 'explorer';
  $('.explorer-heading').inert = view !== 'explorer';
  $('#quick-insight').hidden = !(view === 'discovery' && surface);
  $('#discovery-welcome').hidden = view !== 'discovery' || surface;
  if (mode !== 'whole') { showAreas = false; previewId = null; }
  syncDiscoveryAid();
  $('#quick-title').textContent = surface ? region.name : '';
  $('#quick-description').textContent = surface ? region.description : '';
  $('#experience-label').textContent = view === 'explorer' ? 'Explorer' : 'Discovery';
  $('#quick-category').textContent = locationFor(activeId);
  $('#region-category').textContent = locationFor(activeId, side);
  $('#prompt-category').textContent = isHip ? locationFor(activeId) : '';
  $('#prompt-category').hidden = !isHip;
  if (surface) $('#quick-source').href = region.sourceUrl;
  navigator.sync({ view, activeId, loaded });
  const showingDetail = surface || (isHip && mode !== 'whole');
  $('#prompt-content').hidden = showingDetail; $('#reveal-content').hidden = !showingDetail;
  $('#discovery-panel').setAttribute('aria-labelledby', showingDetail ? 'reveal-title' : 'discovery-title');
  $('#discovery-title').textContent = isHip ? 'Hipokampus di bagian dalam.' : 'Kenali bagian-bagian otak.';
  $('#prompt-description').textContent = isHip ? 'Lihat letak hipokampus dalam otak utuh sebelum mengamatinya tanpa jaringan sekitar.' : 'Pilih bagian pada model atau gunakan daftar anatomi. Anda juga dapat melihat letak hipokampus di bagian dalam.';
  $('#chapter-label').textContent = surface ? 'ANATOMI PERMUKAAN' : isHip ? 'STRUKTUR DI BAGIAN DALAM' : 'PILIH SUDUT PANDANG ANDA';
  $('#reveal-title').textContent = region?.name ?? '';
  $('#region-description').textContent = region?.description ?? '';
  $('#hip-actions').hidden = !(isHip && mode !== 'whole');
  $('[data-action=restore]').hidden = !focused && mode === 'whole';
  $('[data-action=previous]').hidden = !history.length;
  $('#identity-note').textContent = surface ? `Label sumber: ${region.sourceLabel}. Identitas dicocokkan dengan nama mesh, ontologi, dan crosswalk penerbit. Batas girus tidak menyatakan batas fungsi tunggal.` : 'Kelompok enam mesh kepala, badan, dan ekor hipokampus mengikuti nama sumber. ID ontologi dan crosswalk belum tersedia; bukan segmentasi CA1–CA4 atau dentate gyrus.';
  $('#region-source').href = region?.sourceUrl ?? HIPPOCAMPUS.sourceUrl;
  $('#region-source').textContent = surface ? 'Definisi anatomi UBERON ↗' : 'Stark, Bayley & Squire (2002) ↗';
  $('#view-status').textContent = mode === 'reveal' ? 'Jaringan sekitar dibuat samar.' : mode === 'isolate' ? 'Jaringan sekitar disembunyikan.' : surface ? 'Jaringan sekitar tetap utuh.' : 'Anatomi otak utuh.';
  $('#scene-label').textContent = surface ? region.name.toUpperCase() : mode === 'reveal' ? 'HIPOKAMPUS DALAM KONTEKS' : mode === 'isolate' ? 'HIPOKAMPUS TANPA JARINGAN SEKITAR' : 'SUDUT PANDANG BEBAS';
  $('#model-caption').textContent = mode === 'whole' ? 'Pilih bagian yang tersedia. Anatomi lain tetap menjadi konteks.' : mode === 'reveal' ? 'Posisinya tetap. Konteksnya diperlihatkan.' : 'Struktur tetap di posisi aslinya.';
  $('[data-action=isolate]').innerHTML = icon(mode === 'isolate' ? 'show' : 'hide') + (mode === 'isolate' ? 'Tampilkan konteks otak' : 'Lihat tanpa jaringan sekitar');
  $('#anatomy-label-name').textContent = isHip ? 'Hipokampus' : '';
  label.hidden = !isHip || mode === 'whole';
  $('#label-side').textContent = side === 'both' ? 'kiri & kanan' : side === 'left' ? 'kiri' : 'kanan';
  document.querySelectorAll('[data-side]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.side === side)));
  $('[data-action=deeper]').disabled = !loaded;
  syncTouch();
}
function syncTouch() {
  shell.classList.toggle('touch-enabled', touch);
  const button = $('[data-action=touch]');
  button.setAttribute('aria-pressed', String(touch)); button.textContent = touch ? 'Selesai memutar' : 'Aktifkan putar';
  if (controls) controls.enabled = view !== 'transition' && (!narrow.matches || touch);
  $('#gesture-copy').textContent = narrow.matches ? touch ? 'Seret untuk memutar. Ketuk bagian untuk memilih.' : 'Ketuk bagian untuk memilih. Aktifkan putar untuk menyeret.' : 'Seret untuk memutar. Gulir untuk halaman; gunakan + / − untuk zoom.';
}
function chooseRegion(id, { fromPointer = false, focusTitle = false } = {}) {
  if (!loaded || !REGION_BY_ID.has(id)) return;
  if (view === 'discovery' && REGION_BY_ID.get(id).kind !== 'surface') return;
  if (activeId === id) return;
  if (view === 'explorer') { history.push(snapshot()); if (!overview) overview = currentPose(); }
  activeId = id; side = 'both'; mode = 'whole'; focused = view === 'explorer';
  selectionFromPointer = fromPointer;
  clearHover(); updateUI(); materialsForState();
  if (view === 'explorer') frameCurrent(480, !fromPointer);
  if (focusTitle) (view === 'explorer' ? $('#reveal-title') : $('#quick-title')).focus({ preventScroll:true });
  announce(`${active().name} dipilih. ${view === 'discovery' ? 'Informasi tersedia di dekat model; gunakan Jelajahi lebih dalam untuk melanjutkan.' : 'Pilihan dan konteks diperbarui.'}`);
}
function setView(next) {
  if (!loaded) return;
  clearHover(); cameraMotion = null; touch = false;
  if (next === 'explorer') {
    homePose = currentPose(); homeSelection = activeId; overview = currentPose(); history.clear();
    view = next; mode = 'whole'; side = 'both'; focused = Boolean(activeId);
  } else {
    view = next; activeId = homeSelection; mode = 'whole'; side = 'both'; focused = false; history.clear();
  }
  updateUI(); materialsForState(); window.scrollTo({ top:0, behavior:'instant' });
  if (next === 'discovery' && homePose) moveTo(homePose, 520); else frameCurrent(600, Boolean(activeId) && !selectionFromPointer);
  if (next === 'discovery') (activeId ? $('[data-action=deeper]') : $('#primary')).focus({ preventScroll:true });
  else (activeId ? $('#reveal-title') : $('#discovery-title')).focus({ preventScroll:true });
  announce(next === 'explorer' ? `Eksplorasi anatomi. ${active()?.name ?? 'Otak utuh'} ditampilkan.` : 'Kembali ke ruang penemuan dan sudut pandang sebelumnya.');
}
function reveal() {
  if (!loaded || view !== 'explorer') return;
  if (activeId !== HIPPOCAMPUS.id) history.push(snapshot());
  if (mode === 'whole') overview = currentPose();
  activeId = HIPPOCAMPUS.id; mode = 'reveal'; side = 'both'; focused = true;
  updateUI(); materialsForState(); frameCurrent(600); $('#reveal-title').focus({ preventScroll:true });
  announce('Hipokampus ditampilkan dalam konteks. Jaringan sekitar dibuat samar, bukan dipindahkan.');
}
function selectSide(nextSide) {
  if (activeId !== HIPPOCAMPUS.id || mode === 'whole' || side === nextSide) return;
  history.push(snapshot()); side = nextSide; updateUI(); materialsForState();
  if (mode === 'isolate') frameCurrent(350);
  announce('Hipokampus ' + (side === 'both' ? 'kiri dan kanan' : side === 'left' ? 'kiri' : 'kanan') + ' dipilih.');
}
function previousSelection() {
  const previous = history.back(); if (!previous) return;
  activeId = previous.id; mode = previous.mode; side = previous.side; focused = previous.focused;
  overview = previous.overview ? unpackPose(previous.overview) : null;
  updateUI(); materialsForState(); moveTo(unpackPose(previous.pose), 450);
  (mode === 'whole' && activeId === HIPPOCAMPUS.id ? $('#discovery-title') : $('#reveal-title')).focus({ preventScroll:true });
  announce(`Kembali ke pilihan sebelumnya: ${active().name}.`);
}
function rotate(horizontal, vertical = 0) {
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += horizontal; spherical.phi = THREE.MathUtils.clamp(spherical.phi + vertical, .1, Math.PI - .1);
  moveTo({ position:new THREE.Vector3().setFromSpherical(spherical).add(controls.target), target:controls.target.clone() }, 180);
}
function zoom(factor) {
  const offset = camera.position.clone().sub(controls.target);
  const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
  moveTo({ position:controls.target.clone().add(offset.normalize().multiplyScalar(distance)), target:controls.target.clone() }, 160);
}
function action(name) {
  if (name === 'about') { navigator.close({ restoreFocus: false }); clearHover(); $('#about-dialog').showModal(); return; }
  if (name === 'retry') { location.reload(); return; }
  if (!loaded) return;
  if (['previous', 'restore', 'home', 'enter', 'deeper', 'reveal'].includes(name)) navigator.close({ restoreFocus: false });
  switch (name) {
    case 'enter': case 'deeper': setView('explorer'); break;
    case 'home': if (view !== 'discovery') setView('discovery'); break;
    case 'reveal': reveal(); break;
    case 'previous': previousSelection(); break;
    case 'dismiss': activeId = null; focused = false; clearHover(); updateUI(); materialsForState(); $('#anatomy-toggle').focus({ preventScroll:true }); announce('Pilihan ditutup. Pilih bagian lain pada model atau daftar anatomi.'); break;
    case 'restore':
      mode = 'whole'; side = 'both'; focused = false; updateUI(); materialsForState();
      if (overview) moveTo(overview, 450); else frameCurrent();
      (activeId === HIPPOCAMPUS.id ? $('[data-action=reveal]') : $('#anatomy-toggle')).focus({ preventScroll:true });
      announce('Anatomi utuh dan sudut pandang konteks dipulihkan. Identitas pilihan dipertahankan.'); break;
    case 'isolate':
      if (activeId !== HIPPOCAMPUS.id || mode === 'whole') return;
      mode = mode === 'isolate' ? 'reveal' : 'isolate'; focused = true;
      updateUI(); materialsForState(); frameCurrent(450);
      announce(mode === 'isolate' ? 'Jaringan sekitar disembunyikan. Hipokampus tetap di posisi aslinya.' : 'Konteks otak ditampilkan kembali.'); break;
    case 'areas':
      if (mode !== 'whole') return;
      showAreas = !showAreas; syncDiscoveryAid(); applyColors();
      announce(showAreas ? 'Penanda enam area permukaan aktif. Putar untuk melihat sisi lain. Pilihan tetap berwarna violet.' : 'Penanda area interaktif disembunyikan; pilihan tetap dipertahankan.'); break;
    case 'touch': gestures.cancel(); touch = !touch; clearHover(); syncTouch(); break;
    case 'left': rotate(Math.PI/12); break;
    case 'right': rotate(-Math.PI/12); break;
    case 'in': zoom(.85); break;
    case 'out': zoom(1.17); break;
    case 'reset':
      focused = active()?.kind === 'surface' || mode !== 'whole'; updateUI();
      moveTo({ direction:directionTowardSelection(new THREE.Vector3(4, 2.1, 4.5).normalize()) }, 400); break;
  }
}
document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));
document.querySelectorAll('[data-side]').forEach((button) => button.addEventListener('click', () => selectSide(button.dataset.side)));
shell.addEventListener('keydown', (event) => {
  if (!loaded || view === 'transition') return;
  const actions = { '+':'in', '=':'in', '-':'out', '0':'reset', Home:'reset', ArrowLeft:'left', ArrowRight:'right' };
  if (actions[event.key]) { event.preventDefault(); action(actions[event.key]); }
  if (['ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); rotate(0, event.key === 'ArrowUp' ? -.2 : .2); }
});
narrow.addEventListener('change', () => { gestures.cancel(); touch = false; clearHover(); syncTouch(); });
preference.addEventListener('change', () => {
  if (!loaded) return;
  if (preference.matches && cameraMotion) {
    const end = cameraMotion.direction ? poseForState(cameraMotion.direction) : cameraMotion;
    camera.position.copy(end.position); controls.target.copy(end.target); controls.update(); cameraMotion = null;
  }
  materialsForState();
});

function resize() {
  if (!renderer) return;
  const { width, height } = mount.getBoundingClientRect();
  if (!width || !height || (width === lastWidth && height === lastHeight)) return;
  lastWidth = width; lastHeight = height; clearHover();
  renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
  if (loaded && !cameraMotion) {
    const pose = poseForState(camera.position.clone().sub(controls.target).normalize());
    camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update();
  }
  invalidate();
}
function hitAt(event) {
  if (!loaded || view === 'transition' || cameraMotion || materialMotion) return null;
  const rect = mount.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return null;
  pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
  camera.updateMatrixWorld(); raycaster.setFromCamera(pointer, camera);
  return pickSupportedRegion(raycaster, meshes, mode);
}
function wirePointerInteractions() {
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (event) => { gestures.down(event); clearHover(); shell.focus({ preventScroll:true }); });
  canvas.addEventListener('pointermove', (event) => {
    gestures.move(event);
    if (event.pointerType === 'mouse' && !gestures.active) { hoverPoint = { clientX:event.clientX, clientY:event.clientY }; invalidate(); }
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!gestures.up(event)) return;
    if (cameraMotion || materialMotion) { announce('Tampilan sedang berubah. Pilih bagian setelah gerak selesai; model tetap dapat diputar.'); return; }
    const hit = hitAt(event);
    if (!hit) { announce('Bagian ini belum tersedia untuk dipilih. Gunakan menu anatomi untuk melihat pilihan yang didukung.'); return; }
    if (hit.region.kind === 'internal') selectSide(hit.mesh.name.endsWith('_L') ? 'left' : 'right');
    else chooseRegion(hit.region.id, { fromPointer:true });
  });
  canvas.addEventListener('pointerleave', () => clearHover());
  canvas.addEventListener('pointercancel', () => { gestures.cancel(); clearHover(); });
  window.addEventListener('pointerup', (event) => { if (event.target !== canvas) gestures.up(event); });
  window.addEventListener('blur', () => { gestures.cancel(); clearHover(); });
}
function positionLabel() {
  if (activeId !== HIPPOCAMPUS.id || mode === 'whole') return;
  const projected = targetBox().getCenter(new THREE.Vector3()).project(camera);
  label.style.left = Math.max(8, Math.min(lastWidth - label.offsetWidth - 8, (projected.x + 1) * lastWidth / 2 + 20)) + 'px';
  label.style.top = Math.max(8, Math.min(lastHeight - label.offsetHeight - 8, (-projected.y + 1) * lastHeight / 2 - 15)) + 'px';
}
function render(now) {
  framePending = false; let animating = false;
  if (cameraMotion) {
    const motion = cameraMotion, progress = Math.min(1, (now - motion.time) / motion.duration);
    const end = motion.direction ? poseForState(motion.direction) : motion;
    const pose = interpolateOrbit(motion.start, end, 1 - (1 - progress) ** 3);
    camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update();
    if (progress === 1) cameraMotion = null; else animating = true;
  }
  if (materialMotion) {
    const progress = materialMotion.duration === 0 ? 1 : Math.min(1, (now - materialMotion.time) / materialMotion.duration);
    for (const mesh of meshes) {
      mesh.material.opacity = THREE.MathUtils.lerp(mesh.userData.startOpacity, mesh.userData.endOpacity, progress);
      mesh.visible = mesh.material.opacity > .001;
      if (progress === 1) { mesh.material.transparent = mesh.material.opacity < 1; mesh.material.needsUpdate = true; }
    }
    if (progress === 1) materialMotion = null; else animating = true;
  }
  if (loaded) {
    positionLabel();
    if (hoverPoint) { const event = hoverPoint; hoverPoint = null; showHover(hitAt(event), event); }
  }
  renderer.render(scene, camera);
  if (animating) invalidate();
}

async function initialize() {
  try {
    const [manifestResponse, auditResponse] = await Promise.all([fetch('/models/brain-manifest.json'), fetch('/anatomy-audit.json')]);
    if (!manifestResponse.ok || !auditResponse.ok) throw new Error('Anatomical evidence unavailable');
    manifest = await manifestResponse.json(); const audit = await auditResponse.json();
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setClearColor('#000000', 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
    mount.append(renderer.domElement); renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.addEventListener('wheel', keepWheelForPage, { capture:true, passive:true });
    scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(32, 1, .01, 60); camera.position.set(4, 2.1, 4.5);
    controls = new OrbitControls(camera, renderer.domElement); controls.enablePan = false; controls.enableDamping = false;
    controls.minDistance = .7; controls.maxDistance = 16;
    controls.addEventListener('change', invalidate);
    controls.addEventListener('start', () => { cameraMotion = null; clearHover(); });
    scene.add(new THREE.AmbientLight('#f0e1ff', .85));
    const key = new THREE.DirectionalLight('#fff0df', 3.1); key.position.set(3, 5, 5); scene.add(key);
    const fill = new THREE.DirectionalLight('#ad87ed', 1.7); fill.position.set(-4, 1, -3); scene.add(fill);
    const rim = new THREE.DirectionalLight('#d4b9f9', .65); rim.position.set(-2, 4, 1); scene.add(rim);
    resize(); new ResizeObserver(resize).observe(mount);
    const response = await fetch('/models/' + manifest.localFile);
    if (!response.ok) throw new Error('Source atlas unavailable');
    const bytes = await response.arrayBuffer();
    const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((value) => value.toString(16).padStart(2, '0')).join('');
    if (digest !== manifest.sha256) throw new Error('Source atlas checksum differs from the audited version');
    const asset = await new GLTFLoader().parseAsync(bytes, ''); root = asset.scene;
    const bounds = new THREE.Box3().setFromObject(root), center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
    const scale = 3 / Math.max(size.x, size.y, size.z);
    root.scale.setScalar(scale); root.position.copy(center).multiplyScalar(-scale); root.updateMatrixWorld(true);
    meshes = [];
    root.traverse((object) => {
      if (!object.isMesh) return;
      object.material = new THREE.MeshStandardMaterial({ color:'#c4aebe', roughness:.65, metalness:0 });
      object.geometry.computeBoundingBox(); meshes.push(object);
    });
    validateSelectableAnatomy(meshes, manifest, audit);
    for (const mesh of meshes) mesh.userData.educationalRegion = SURFACE_BY_NODE.get(mesh.name) ?? (HIPPOCAMPUS.nodes.includes(mesh.name) ? HIPPOCAMPUS : null);
    wholeBox = new THREE.Box3().setFromObject(root);
    for (const region of SURFACE_REGIONS) boxes.set(region.id, new THREE.Box3().setFromObject(root.getObjectByName(region.nodes[0])));
    for (const selectedSide of ['both', 'left', 'right']) {
      const names = selectedSide === 'both' ? HIPPOCAMPUS.nodes : manifest.hippocampusNodes[selectedSide];
      const box = new THREE.Box3(); names.forEach((name) => box.union(new THREE.Box3().setFromObject(root.getObjectByName(name))));
      boxes.set(`hippocampus-${selectedSide}`, box);
    }
    scene.add(root); loaded = true; $('#loading').hidden = true;
    document.querySelectorAll('button[disabled],select[disabled]').forEach((element) => element.disabled = false);
    updateUI(); materialsForState();
    const pose = poseForState(directionTowardSelection(new THREE.Vector3(4, 2.1, 4.5).normalize()));
    camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update();
    homePose = view === 'discovery' ? currentPose() : null;
    homeSelection = view === 'discovery' ? activeId : null;
    const initialMode = mode, initialFocus = focused;
    mode = 'whole'; focused = false;
    overview = poseForState(new THREE.Vector3(4, 2.1, 4.5).normalize());
    mode = initialMode; focused = initialFocus;
    wirePointerInteractions();
    if (params.get('navigator') === 'open') navigator.show($('#anatomy-toggle'));
    renderer.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); loaded = false; controls.enabled = false; clearHover(); $('#failure').hidden = false; announce('Tampilan 3D terhenti. Muat ulang untuk mencoba lagi.'); });
    announce('Anatomi 3D siap. Enam bagian permukaan dapat dipilih; hipokampus tersedia di Explorer.'); invalidate();
  } catch (error) {
    console.error('Anatomy prototype failed to load or validate its source evidence:', error);
    loaded = false; if (controls) controls.enabled = false;
    $('#loading').hidden = true; $('#failure').hidden = false;
    announce('Model atau bukti anatomi tidak tersedia. Pilihan tidak diaktifkan tanpa bukti sumber yang cocok.');
  }
}
updateUI();
initialize();
