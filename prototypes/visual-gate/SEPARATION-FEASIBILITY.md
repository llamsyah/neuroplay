# Anatomical separation: feasibility audit

**Decision: no displacement experiment is enabled in this iteration.** This is a limit of the evidence established for this asset, not a claim that translation is technically impossible. Highlight, reveal and isolation remain available in their original meanings.

The requested [BrainFacts reference](https://www.brainfacts.org/3d-brain) was opened. Its retrieved public page exposes attribution, but not the interactive separation sequence; no firsthand observation of its animation is claimed. No BrainFacts assets, code or descriptions are copied.

## Reproducible source inspection

Run `node prototypes/visual-gate/audit-separation.mjs`. It reads the original GLB, verifies its SHA-256 against the manifest, and writes only [separation-feasibility.json](separation-feasibility.json) in this prototype folder. The atlas and all source transforms remain unchanged.

Pinned atlas commit: `29888dcc5f32dae28c7a07c41171c822275360c3`. GLB SHA-256: `2b9ad5b53e40e9f0936da74f7be38d2eed15604e26358c3870a0ea13499b9a35`.

### Hemisphere parents are not a defensible separation manifest

The source has two named parent nodes, rather than a completely flat hierarchy:

| Source parent | Mesh children | Side-name conflicts |
| --- | ---: | ---: |
| `Allen_brain_Hemisphere_L` | 135 | 0 |
| `Allen_brain_Hemisphere_R` | 147 | 6 |

The right parent includes `Allen_hypothalamus_L`, `Allen_midbrain_tegmentum_L`, `Allen_red_nucleus_L`, `Allen_inferior_colliculus_L`, `Allen_mammillary_region_of_HTH_L`, and `Allen_subthalamic_nucleus_L`. The optic chiasm is outside both groups. A parent name therefore cannot be treated as authoritative membership for a left/right cerebral-hemisphere movement. This inspection does not decide which source names or parent assignments should be corrected.

The earlier identity audit also found 180 placeholder/missing mesh identities. Inferring a corrected partition from position, appearance, or suffixes would exceed the reviewed catalog. Neither parent has been independently certified here as an anatomical separation unit.

### Limited parcel candidates

Existing selectable surface identities were inspected without enabling additional anatomy:

| Candidate, each side | Source identity | Exact-position connectivity / edge check | Result |
| --- | --- | --- | --- |
| Precentral gyrus | Exact name, label, ontology and publisher crosswalk | 1 component; 0 open edges; 0 edges with more than 2 incident triangles | Technical candidate; extraction interface/path not cleared |
| Postcentral gyrus | Same evidence level | 1 component; 0 open edges; 0 edges with more than 2 incident triangles | Technical candidate; extraction interface/path not cleared |
| Superior temporal gyrus | Same evidence level | 1 component; 0 open edges; **4 nonmanifold edges per mesh** | Not cleared as a separation pilot |
| Hippocampus head/body/tail | Existing explicit-name exception; ontology/crosswalk missing | Each component passes basic closed-edge counting | Keep existing reveal/isolation; no new displacement claim |

The topology check welds only exactly identical source positions for counting. It does not remesh, move vertices, check every vertex link, certify triangle winding, test self-intersection, or prove anatomical correctness. Passing it does not establish a physically detachable piece.

Precentral mesh bounds overlap 53/54 other mesh bounds and postcentral bounds overlap 43/44. **These are broad-phase overlaps, not proof of triangle collisions.** No continuous collision sweep or safe extraction trajectory has been established. Displaying one of these parcels moving outward would therefore claim a stronger separation result than this audit supports.

## Smallest next requirement

For a hemisphere pilot, obtain a reviewed node-membership manifest that distinguishes the two cerebral hemispheres from shared/midline and brainstem structures, resolves the six hierarchy conflicts, and retains original transforms. That may be metadata alone; a replacement asset is not automatically required.

For an even smaller single-gyrus pilot, review one existing verified parcel's boundaries/caps and validate a specific collision-free extraction-and-return trajectory. Corrected geometry is needed only if that inspection finds the exported interface unsuitable. This step must precede an illustrative displacement control.

## Rendering and camera implications

A future approved pilot should move a validated group under a temporary parent offset while retaining immutable original local transforms, never rewriting source vertex coordinates. It must label displacement as illustrative rather than natural anatomical placement, restore exact transforms, and block conflicting picking/reveal/history operations during travel.

Camera bounds must include original anatomy and the displaced group for the full trajectory; the stage itself should remain fixed. Picking must use the transformed world matrices. A verified trajectory must avoid passing through other structures, and surface interfaces must not expose invented biological walls. Reduced motion should switch to the same disclosed separated state without animated travel. None of this displacement behavior is implemented or presented as functional here.
