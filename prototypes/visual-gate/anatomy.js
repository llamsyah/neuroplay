// Explicit educational allowlist. Positions and appearances never determine identity.
const surfaceDefinitions = [
  {
    key: 'precentral', name: 'Girus presentral', sourceLabel: 'precentral gyrus', ontologyId: 'UBERON:0002703',
    nodes: ['Allen_precentral_gyrus_L', 'Allen_precentral_gyrus_R'],
    description: 'Lipatan korteks yang termasuk lobus frontal. Girus adalah tonjolan korteks; sulkus adalah lekukan di antaranya.',
  },
  {
    key: 'postcentral', name: 'Girus postsentral', sourceLabel: 'postcentral gyrus', ontologyId: 'UBERON:0002581',
    nodes: ['Allen_postcentral_gyrus_L', 'Allen_postcentral_gyrus_R'],
    description: 'Lipatan korteks yang termasuk lobus parietal. Bagian yang disorot adalah satu girus, bukan seluruh lobus.',
  },
  {
    key: 'superior-temporal', name: 'Girus temporal superior', sourceLabel: 'superior temporal gyrus', ontologyId: 'UBERON:0002769',
    nodes: ['Allen_superior_temporal_gyrus_L', 'Allen_superior_temporal_gyrus_R'],
    description: 'Lipatan pada sisi luar lobus temporal. Nama superior membedakannya dari girus temporal lain dalam penamaan anatomi.',
  },
];

export const SURFACE_REGIONS = surfaceDefinitions.flatMap((definition) => definition.nodes.map((node, index) => ({
  id: `${definition.key}-${index === 0 ? 'left' : 'right'}`,
  name: `${definition.name} ${index === 0 ? 'kiri' : 'kanan'}`,
  description: definition.description,
  sourceLabel: definition.sourceLabel,
  ontologyId: definition.ontologyId,
  nodes: [node],
  kind: 'surface',
  evidence: 'exact-node-label-ontology-crosswalk',
  sourceUrl: `https://www.ebi.ac.uk/ols4/ontologies/uberon/classes?obo_id=${definition.ontologyId}`,
})));

export const HIPPOCAMPUS = {
  id: 'hippocampus', name: 'Hipokampus', kind: 'internal', evidence: 'explicit-source-names-only',
  nodes: [
    'Allen_head_of_hippocampus_L', 'Allen_body_of_hippocampus_L', 'Allen_tail_of_hippocampus_L',
    'Allen_head_of_hippocampus_R', 'Allen_body_of_hippocampus_R', 'Allen_tail_of_hippocampus_R',
  ],
  description: 'Berperan penting dalam membentuk ingatan baru tentang peristiwa dan fakta. Struktur ini bekerja bersama bagian otak lain; ingatan tidak berada di satu tempat saja.',
  sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/12359833/',
};
export const REGIONS = [...SURFACE_REGIONS, HIPPOCAMPUS];
export const REGION_BY_ID = new Map(REGIONS.map((region) => [region.id, region]));
export const SURFACE_BY_NODE = new Map(SURFACE_REGIONS.flatMap((region) => region.nodes.map((name) => [name, region])));

export function validateSelectableAnatomy(meshes, manifest, audit) {
  if (audit.sha256 !== manifest.sha256) throw new Error('Anatomy audit does not match this asset');
  const byName = new Map(meshes.map((mesh) => [mesh.name, mesh]));
  if (byName.size !== meshes.length) throw new Error('Duplicate anatomical mesh names');
  for (const region of SURFACE_REGIONS) {
    for (const name of region.nodes) {
      const mesh = byName.get(name);
      const evidence = audit.selectableSurfaceNodes.find((entry) => entry.name === name);
      if (!mesh || !evidence || mesh.userData.label !== region.sourceLabel || mesh.userData.ontologyid !== region.ontologyId || evidence.ontologyId !== region.ontologyId || evidence.label !== region.sourceLabel) {
        throw new Error(`Selectable anatomy lacks matching source evidence: ${name}`);
      }
    }
  }
  const hipNames = [...manifest.hippocampusNodes.left, ...manifest.hippocampusNodes.right];
  if (hipNames.length !== HIPPOCAMPUS.nodes.length || !HIPPOCAMPUS.nodes.every((name) => hipNames.includes(name) && byName.has(name))) {
    throw new Error('Hippocampus source group does not match the verified manifest');
  }
}
