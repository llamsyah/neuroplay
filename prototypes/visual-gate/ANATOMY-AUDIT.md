# Selectable anatomy audit — free exploration prototype

## Scope and evidence standard

This audit concerns the existing HRA Brain Male v1.3 GLB and the pinned publisher metadata/crosswalk already in the repository. It does not certify segmentation accuracy, natural bilateral variation, or educational suitability of all meshes. No mesh is named from its approximate position or appearance.

Reproduce with `node prototypes/visual-gate/audit-anatomy.mjs` from the repository root. The script writes only this prototype's [anatomy-audit.json](anatomy-audit.json); it does not change the original scientific records. The JSON includes all 283 mesh identity records and the exact selected crosswalk matches.

| Evidence category | Meshes | Treatment |
| --- | ---: | --- |
| Non-placeholder GLB label and UBERON ID, also matching the pinned crosswalk | 102 | Candidates for review, not automatically enabled |
| Non-placeholder GLB identity without a crosswalk row | 1 | `VH_M_optic_chiasm`; deferred |
| Missing or placeholder label/ontology identity | 180 | Not exposed by default; includes the existing named hippocampus exception below |
| Total | 283 | Mesh count is not a count of independent educational regions |

The source GLB SHA-256 is `2b9ad5b53e40e9f0936da74f7be38d2eed15604e26358c3870a0ea13499b9a35`. The source commit is `29888dcc5f32dae28c7a07c41171c822275360c3`. The audit also records the crosswalk checksum. Browser initialization checks the GLB hash, audit hash reference, and exact selected-node labels/IDs; mismatches fail closed instead of enabling unverified selection.

## Small enabled surface set

Each left/right side is a distinct selectable mesh. No whole lobe is implied.

| UI region | Exact source nodes | Matched label / ontology |
| --- | --- | --- |
| Girus presentral kiri / kanan | `Allen_precentral_gyrus_L`, `Allen_precentral_gyrus_R` | precentral gyrus / UBERON:0002703 |
| Girus postsentral kiri / kanan | `Allen_postcentral_gyrus_L`, `Allen_postcentral_gyrus_R` | postcentral gyrus / UBERON:0002581 |
| Girus temporal superior kiri / kanan | `Allen_superior_temporal_gyrus_L`, `Allen_superior_temporal_gyrus_R` | superior temporal gyrus / UBERON:0002769 |

These six entries agree across exact mesh names, embedded source labels/IDs, and publisher crosswalk rows. Node tests additionally confirm that each can be reached as a nearest visible surface hit in the actual atlas from at least one tested view. That does not guarantee easy touch targeting from every view.

Short descriptions deliberately teach anatomical form and lobe membership rather than equating a gyrus with one function or a functional cortical area. The descriptions were checked against the primary UBERON definitions served by EMBL-EBI OLS:

- [Precentral gyrus](https://www.ebi.ac.uk/ols4/ontologies/uberon/classes?obo_id=UBERON:0002703): frontal-lobe component.
- [Postcentral gyrus](https://www.ebi.ac.uk/ols4/ontologies/uberon/classes?obo_id=UBERON:0002581): parietal-lobe component.
- [Superior temporal gyrus](https://www.ebi.ac.uk/ols4/ontologies/uberon/classes?obo_id=UBERON:0002769): lateral temporal-lobe component.

Left/right labels follow source node names; they do not mean left/right on the screen. The source's hemisphere mirroring remains a limitation. No independent anatomist review has been added by this audit.

## Existing hippocampus group — separate evidence level

The preserved guide uses the six explicit `Allen_{head,body,tail}_of_hippocampus_{L,R}` names already pinned in the Phase 0 manifest. These nodes have placeholder `label`/`ontologyid` values and no crosswalk rows. They are retained as the existing source-name-based group, not reclassified as ontology-verified surface entries.

The group is available in Explorer as **Hipokampus · bagian dalam**. Whole-brain context must be revealed deliberately before direct picking of those internal meshes becomes available. Head/body/tail are not CA fields or dentate-gyrus subfields. Side selection, isolation, and restoration apply only to this group.

## Grouping and identity limits

- **Whole lobes:** several gyri would require a reviewed membership map. The prototype does not union approximate nearby meshes into a lobe.
- **Whole cerebellum:** paravermis and lateral-hemisphere meshes lack ontology IDs; only the left vermis is crosswalk-labeled. No whole-cerebellum selection is claimed.
- **Pons:** `Allen_basilar_part_of_pons_*` carries the label/ID for a pontine nuclear group. The name/label granularity needs review before offering a simplified whole-pons label.
- **Other named components with placeholders:** explicit names can support further investigation, but are not blanket permission to expose every structure. Only the previously demonstrated hippocampus group is carried forward here.
- **Other ontology-matched meshes:** excluded from the small slice even when their identity metadata agrees. Internal visibility, grouping, descriptions, and usability still need review.

Unsupported foreground anatomy blocks selection of supported anatomy behind it. Transparent reveal context can be excluded from picking only after it becomes sufficiently faint; this is an interaction rule, not biological transparency. No anatomical coordinates, source geometry, licensing notices, or production code are altered.
