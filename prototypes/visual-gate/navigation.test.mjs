import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createAnatomyNavigator, groupsFor, locationFor } from './navigation.js';
import { REGIONS, HIPPOCAMPUS, REGION_BY_ID } from './anatomy.js';
import { createSelectionHistory } from './interaction.js';

// Minimal event/focus adapter: exercises the actual controller without claiming
// browser layout, native focus navigation, WebGL integration, or assistive-tech QA.
class Element {
  constructor(document) {
    this.ownerDocument = document; this.children = []; this.dataset = {};
    this.attributes = {}; this.events = {}; this.isConnected = true; this.disabled = false;
  }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; }
  insertAdjacentHTML() {}
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key]; }
  addEventListener(key, listener) { (this.events[key] ??= []).push(listener); }
  dispatch(key, event = {}) { this.events[key]?.forEach((listener) => listener(event)); }
  focus() { this.ownerDocument.activeElement = this; }
}
function fixture() {
  const document = { createElement() { return new Element(document); } };
  const [panel, list, current, trigger, closeButton, root, informationButton, mobileTrigger] = Array.from({ length: 8 }, () => document.createElement());
  const selections = [], previews = [];
  const controller = createAnatomyNavigator({ panel, list, current, triggers: [trigger, mobileTrigger], closeButton, root, informationButton, onSelect: (id) => selections.push(id), onPreview: (id) => previews.push(id) });
  const descend = (element) => [element, ...element.children.flatMap(descend)];
  const buttons = () => descend(list).filter((element) => element.dataset.region);
  return { document, panel, list, current, trigger, closeButton, root, informationButton, mobileTrigger, selections, previews, controller, buttons };
}

test('navigation exposes only the existing six surface identities and separate internal exception', () => {
  const home = groupsFor('discovery'), explorer = groupsFor('explorer');
  assert.equal(home.length, 3);
  assert.equal(home.flatMap((group) => group.regions).length, 6);
  assert.deepEqual(explorer.flatMap((group) => group.regions).map((region) => region.id), REGIONS.map((region) => region.id));
  assert.equal(locationFor('precentral-right'), 'Permukaan · lobus frontal');
  assert.equal(locationFor('postcentral-left'), 'Permukaan · lobus parietal');
  assert.equal(locationFor('superior-temporal-right'), 'Permukaan · lobus temporal');
  assert.equal(locationFor('hippocampus'), 'Bagian dalam · kiri dan kanan');
  assert.equal(locationFor('unsupported'), '');
});

test('navigator opens at the current selection, marks it, and Escape/close restore the opener', () => {
  const f = fixture();
  f.controller.sync({ view: 'discovery', activeId: 'postcentral-right', loaded: true });
  f.trigger.dispatch('click');
  assert.equal(f.panel.hidden, false);
  assert.equal(f.root.dataset.navigator, 'open');
  assert.equal(f.trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(f.document.activeElement.dataset.region, 'postcentral-right');
  assert.equal(f.buttons().filter((button) => button.getAttribute('aria-pressed') === 'true').length, 1);
  let prevented = false;
  f.root.dispatch('keydown', { key: 'Escape', preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(f.panel.hidden, true);
  assert.equal(f.document.activeElement, f.trigger);
  f.trigger.dispatch('click'); f.closeButton.dispatch('click');
  assert.equal(f.controller.isOpen, false);
  assert.equal(f.trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(f.document.activeElement, f.trigger);
});

test('navigator delegates a real identity, closes, and updates without losing its opener', () => {
  const f = fixture();
  f.controller.sync({ view: 'explorer', activeId: 'precentral-right', loaded: true });
  f.trigger.dispatch('click');
  f.buttons().find((button) => button.dataset.region === 'hippocampus').dispatch('click');
  assert.deepEqual(f.selections, ['hippocampus']);
  assert.equal(f.panel.hidden, true); assert.equal(f.document.activeElement, f.trigger);
  f.controller.sync({ view: 'explorer', activeId: 'hippocampus', loaded: true });
  f.trigger.dispatch('click');
  assert.equal(f.document.activeElement.dataset.region, 'hippocampus');
  assert.equal(f.current.textContent, 'Pilihan: Hipokampus');
  // A mode change closes the panel and removes the internal option in Discovery.
  f.controller.sync({ view: 'discovery', activeId: null, loaded: true });
  assert.equal(f.panel.hidden, true); assert.equal(f.buttons().length, 6);
  assert.equal(f.current.textContent, 'Belum ada bagian yang dipilih.');
});

test('navigator cannot open before the source has validated; Tab is not trapped', () => {
  const f = fixture();
  f.controller.sync({ view: 'discovery', activeId: null, loaded: false });
  assert.equal(f.buttons().every((button) => button.disabled), true);
  f.controller.show(f.trigger); assert.equal(f.controller.isOpen, false);
  f.controller.sync({ view: 'discovery', activeId: null, loaded: true }); f.controller.show(f.trigger);
  assert.equal(f.document.activeElement, f.buttons()[0]);
  let prevented = false;
  f.root.dispatch('keydown', { key: 'Tab', preventDefault() { prevented = true; } });
  assert.equal(prevented, false); assert.equal(f.controller.isOpen, true);
});

test('compact side choices retain full names; hover/focus preview never selects; mobile close restores its own trigger', () => {
  const f = fixture();
  f.controller.sync({ view:'explorer', activeId:'precentral-right', loaded:true });
  f.mobileTrigger.dispatch('click');
  const left = f.buttons().find((button) => button.dataset.region === 'postcentral-left');
  assert.equal(left.getAttribute('aria-label'), 'Girus postsentral kiri');
  assert.equal(left.children[0].textContent, 'Kiri');
  left.dispatch('mouseenter'); assert.equal(f.previews.at(-1), 'postcentral-left');
  left.dispatch('mouseleave'); assert.equal(f.previews.at(-1), null);
  left.dispatch('focus'); assert.equal(f.previews.at(-1), 'postcentral-left');
  left.dispatch('blur'); assert.equal(f.previews.at(-1), null);
  const hip = f.buttons().find((button) => button.dataset.region === 'hippocampus');
  hip.dispatch('focus'); assert.equal(f.previews.at(-1), null);
  assert.deepEqual(f.selections, []);
  assert.equal(f.informationButton.getAttribute('aria-pressed'), 'false');
  f.closeButton.dispatch('click'); assert.equal(f.document.activeElement, f.mobileTrigger);
  assert.equal(f.informationButton.getAttribute('aria-pressed'), 'true');
});

test('actual prototype handlers distinguish history, restoration, and leaving Explorer', async () => {
  const source = (await readFile(new URL('./prototype.js', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
  const names = ['chooseRegion', 'setView', 'reveal', 'selectSide', 'previousSelection', 'action'];
  const functions = names.map((name) => source.match(new RegExp(`function ${name}\\([\\s\\S]*?(?=\\n(?:async )?function |\\ndocument\\.)`))[0]).join('\n');
  const pose = { position: [4, 2, 4], target: [0, 0, 0] };
  const elements = new Map();
  const context = vm.createContext({
    view: 'discovery', activeId: 'precentral-right', mode: 'whole', side: 'both', focused: false, loaded: true,
    cameraMotion: null, touch: false, selectionFromPointer: false, homePose: null, homeSelection: null, overview: null,
    history: createSelectionHistory(), REGION_BY_ID, HIPPOCAMPUS,
    navigator: { close() {} },
    currentPose: () => structuredClone(pose), unpackPose: (value) => structuredClone(value),
    snapshot() { return { id: context.activeId, mode: context.mode, side: context.side, focused: context.focused, pose: structuredClone(pose), overview: context.overview }; },
    active: () => REGION_BY_ID.get(context.activeId),
    clearHover() {}, updateUI() {}, materialsForState() {}, frameCurrent() {}, moveTo() {}, announce() {},
    window: { scrollTo() {} }, $: (selector) => {
      if (!elements.has(selector)) elements.set(selector, { focus() {} });
      return elements.get(selector);
    },
  });
  vm.runInContext(functions, context);
  context.setView('explorer');
  assert.equal(context.homeSelection, 'precentral-right');
  context.chooseRegion('postcentral-right');
  assert.equal(context.history.length, 1);
  context.reveal(); assert.equal(context.mode, 'reveal');
  context.selectSide('left');
  context.action('isolate'); assert.equal(context.mode, 'isolate');
  context.previousSelection();
  assert.equal(context.side, 'both'); assert.equal(context.mode, 'reveal');
  context.action('isolate'); context.action('restore');
  assert.equal(context.view, 'explorer'); assert.equal(context.mode, 'whole');
  assert.equal(context.activeId, 'hippocampus'); assert.equal(context.focused, false);
  context.previousSelection();
  assert.equal(context.activeId, 'postcentral-right'); assert.equal(context.mode, 'whole');
  context.previousSelection(); assert.equal(context.activeId, 'precentral-right');
  context.chooseRegion('postcentral-left'); context.action('home');
  assert.equal(context.view, 'discovery'); assert.equal(context.activeId, 'precentral-right');
  assert.equal(context.history.length, 0);
});
