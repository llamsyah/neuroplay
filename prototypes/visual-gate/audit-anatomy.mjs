import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SURFACE_REGIONS, HIPPOCAMPUS } from './anatomy.js';

const repo = new URL('../../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('public/models/brain-manifest.json', repo), 'utf8'));
const bytes = await readFile(new URL(`public/models/${manifest.localFile}`, repo));
const sha256 = createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256, manifest.sha256);
const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
const crosswalkBytes = await readFile(new URL('docs/sources/hra-brain-male-v1.3.crosswalk.csv', repo));
// This publisher CSV has three unquoted fields; reject format drift rather than guess.
const rows = crosswalkBytes.toString().trim().split(/\r?\n/).slice(1).map((line) => {
  const fields = line.split(','); assert.equal(fields.length, 3, 'Crosswalk format needs a proper parser');
  return { name:fields[0], ontologyId:fields[1], label:fields[2] };
});
const crosswalk = new Map(rows.map((row) => [row.name, row]));
const meshNodes = gltf.nodes.filter((node) => node.mesh !== undefined);
const sourceRows = meshNodes.map((node) => {
  const label = node.extras?.label ?? null, ontologyId = node.extras?.ontologyid ?? null;
  const mapped = crosswalk.get(node.name);
  const usable = /^UBERON:\d+$/.test(ontologyId) && label && label !== '-';
  return { name:node.name, label, ontologyId,
    classification:usable && mapped?.ontologyId === ontologyId && mapped?.label === label ? 'crosswalk-matched-candidate' : usable ? 'metadata-crosswalk-review' : 'missing-or-placeholder-identity',
    crosswalk: mapped ?? null,
  };
});
const selectableSurfaceNodes = SURFACE_REGIONS.flatMap((region) => region.nodes.map((name) => {
  const row = sourceRows.find((entry) => entry.name === name);
  assert.equal(row?.classification, 'crosswalk-matched-candidate');
  assert.equal(row.ontologyId, region.ontologyId); assert.equal(row.label, region.sourceLabel);
  return { ...row, regionId:region.id, evidence:'exact node + GLB label/ontology + pinned publisher crosswalk' };
}));
for (const name of HIPPOCAMPUS.nodes) {
  const row = sourceRows.find((entry) => entry.name === name);
  assert.ok(row); assert.equal(row.ontologyId, '-'); assert.equal(row.crosswalk, null);
}
const summary = {
  meshes:meshNodes.length,
  usableLabelAndOntology:sourceRows.filter((row) => row.ontologyId?.startsWith('UBERON:') && row.label && row.label !== '-').length,
  crosswalkMatchedCandidates:sourceRows.filter((row) => row.classification === 'crosswalk-matched-candidate').length,
  metadataCrosswalkReview:sourceRows.filter((row) => row.classification === 'metadata-crosswalk-review').length,
  missingOrPlaceholderIdentity:sourceRows.filter((row) => row.classification === 'missing-or-placeholder-identity').length,
  exposedSurfaceSelections:selectableSurfaceNodes.length,
  hippocampusNamedComponents:HIPPOCAMPUS.nodes.length,
};
const report = {
  sourceCommit:manifest.commit, sha256, crosswalkSha256:createHash('sha256').update(crosswalkBytes).digest('hex'), summary,
  meaning:'Source-identity checks, not independent anatomical segmentation certification. Ontology-bearing meshes outside the explicit allowlist are not exposed.',
  selectableSurfaceNodes,
  hippocampus:{ nodes:HIPPOCAMPUS.nodes, evidence:'Explicit names and existing Phase 0 group only; no ontology IDs/crosswalk rows; head/body/tail are not cellular subfields.' },
  deferredGroupingExamples:[
    'Cerebellum: paravermis/lateral hemisphere meshes lack IDs, and only the left vermis is crosswalk-labeled. Do not label the whole cerebellum from this evidence.',
    'Frontal/temporal/parietal lobes: multiple gyri require a reviewed membership map; this allowlist does not claim complete lobe coverage.',
    'Basilar pons: the node name and ontology label (pontine nuclear group) have different granularity; defer a simple whole-pons label.',
  ],
  allMeshIdentityRecords:sourceRows,
};
await writeFile(new URL('anatomy-audit.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
