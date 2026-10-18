import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { SURFACE_BY_NODE, SURFACE_REGIONS } from './anatomy.js';
import { surfaceFeedback, keepWheelForPage } from './discovery-aid.js';

test('the discovery aid marks exactly the verified six surface meshes, without expanding the catalog', async () => {
  const audit = JSON.parse(await readFile(new URL('./anatomy-audit.json', import.meta.url)));
  const options = { selected:false, hovered:false, previewId:null, showAreas:true, mode:'whole', surfaceByNode:SURFACE_BY_NODE };
  const marked = audit.allMeshIdentityRecords.filter((entry) => surfaceFeedback({ ...options, node:entry.name }) === 'available');
  assert.deepEqual(marked.map((entry) => entry.name).sort(), SURFACE_REGIONS.flatMap((region) => region.nodes).sort());
  for (const mode of ['reveal', 'isolate']) {
    for (const region of SURFACE_REGIONS) assert.equal(surfaceFeedback({ ...options, mode, node:region.nodes[0] }), 'base');
  }
});

test('selection outranks all temporary cues; preview is source-limited and changes no selection state', () => {
  const state = { node:SURFACE_REGIONS[0].nodes[0], selected:false, hovered:false, previewId:SURFACE_REGIONS[0].id, showAreas:true, mode:'whole', surfaceByNode:SURFACE_BY_NODE };
  assert.equal(surfaceFeedback(state), 'preview');
  assert.equal(surfaceFeedback({ ...state, selected:true, hovered:true }), 'selected');
  assert.equal(surfaceFeedback({ ...state, previewId:null, hovered:true }), 'hover');
  assert.equal(surfaceFeedback({ ...state, previewId:null, showAreas:false }), 'base');
  assert.equal(surfaceFeedback({ ...state, node:'unsupported' }), 'base');
  assert.equal(state.selected, false); assert.equal(state.previewId, SURFACE_REGIONS[0].id);
});

test('wheel input stops before orbit handlers while retaining the native page-scroll default', () => {
  const calls = [];
  keepWheelForPage({ stopImmediatePropagation() { calls.push('stop'); }, preventDefault() { calls.push('prevent'); } });
  assert.deepEqual(calls, ['stop']);
});

test('stylesheet reserves independent stage/context tracks and contains no state-based observation geometry', async () => {
  const require = createRequire(import.meta.url), postcss = require('postcss');
  const css = await readFile(new URL('./style.css', import.meta.url), 'utf8');
  assert.equal(css.includes('translateX'), false);
  const geometry = /^(transform|translate|width|height|min-height|margin.*|padding.*|position|top|left|grid-.*|gap|column-gap|row-gap|display|align-self)$/;
  postcss.parse(css).walkRules((rule) => {
    if (/data-(?:view|selection|navigator)/.test(rule.selector) && /\.(?:scene|structure-toolbar|observation-tools|observation|experience)(?:[\s,:]|$)/.test(rule.selector)) {
      for (const declaration of rule.nodes) assert.equal(geometry.test(declaration.prop), false, `${rule.selector}: ${declaration.prop}`);
    }
  });
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) 332px/);
  assert.match(css, /grid-template-rows: 60px var\(--stage-height\) 176px/);
});
