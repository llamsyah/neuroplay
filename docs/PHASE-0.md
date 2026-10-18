# Phase 0 findings

Investigated 18 October 2026. Status: technical experiment; Phase 1 is not authorized.

## Verdict

**Conditionally feasible.** The core mechanism works with one legally reusable, segmented anatomical asset: render the brain, orbit/zoom, fade or hide context, focus the hippocampi, isolate either side, and return to the previous whole-brain camera context. No synthetic anatomical stand-ins or registration between unrelated models were used.

This establishes rendering and interaction feasibility. It does not independently certify segmentation accuracy, production visual quality, or performance on target mobile devices. The source's mirrored anatomy is a material product trade-off requiring review.

## Repository and environment

Initially: one 16-byte README and Git history; no application, dependencies, configuration, anatomical files, or project-specific agent instructions. The installed Next.js development command subsequently generated `AGENTS.md`; its version-specific guidance applies to further edits.

Test environment: Windows, PowerShell, Node 24.15.0, npm 11.12.1. Public asset downloads/package installation and browser loopback access needed execution outside the sandbox's network isolation. The application itself needs no external services.

## Asset comparison

Inspection levels distinguish a downloaded and parsed mesh from a catalog entry. No blanket license is inferred from a repository's institution or from its software license.

| Candidate and primary source | Format and anatomical coverage | License / redistribution | Inspection and limitations |
| --- | --- | --- | --- |
| **HRA Brain, Male v1.3 — selected**, [NIH entry](https://3d.nih.gov/entries/20960?version=1.01), [publisher metadata](https://github.com/hubmapconsortium/hra-kg/blob/29888dcc5f32dae28c7a07c41171c822275360c3/digital-objects/ref-organ/brain-male/v1.3/raw/metadata.yaml), [DOI](https://doi.org/10.48539/HBM929.XKCL.339) | Binary glTF; cortical gyri, deep structures, cerebellum, brainstem; individually named bilateral hippocampus head/body/tail. | Exact version metadata specifies **CC BY 4.0**. Attribute Browne & Schlehlein/HuBMAP, link license, record changes, preserve notices; commercial redistribution permitted under those terms. | **Downloaded, checksum pinned, parsed, numerically audited, rendered in browser.** Cortex and hippocampi share one scene. Source describes hemisphere mirroring and reference-body resizing. Not a textured photorealistic scan or representation of natural bilateral variation. |
| **BodyParts3D archived 4.0**, [downloads](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html), [organ list](https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_parts_list_e.txt) | OBJ ZIPs; cortex, cerebellum, brainstem, bilateral hippocampus. Right FMA72713/BP10499; left FMA72714/BP10528. Catalog lists 99% polygon reduction, 62 MB PART-OF / 136 MB IS-A archives. | [Archive license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), updated 2025-02-27, states **CC BY 4.0**, with DBCLS credit. [Legacy site](https://lifesciencedb.jp/bp3d/info_en/license/index.html) still says **CC BY-SA 2.1 Japan**. Pin the specific archive/applicable notice before redistribution; do not generalize to arbitrary copies. | **Catalog, organ list, license pages inspected; meshes not downloaded.** Useful fallback. Coordinate consistency and retained mesh detail are untested. Alignment to HRA is unverified. |
| **EBRAINS / Julich DG (Hippocampus), v11.1**, [dataset record](https://search.kg.ebrains.eu/instances/677c84c3-56b2-4671-bc63-15d3dda730a2?noSilentSSO=true), [DOI](https://doi.org/10.25493/M8JP-XQT) | NIfTI probability volumes for bilateral dentate gyrus in Colin27/MNI152 spaces, based on histological mapping from 10 brains. DG is only part of the hippocampal formation. | This **specific record** states **CC BY-NC-SA 4.0**: attribution, noncommercial use, share-alike. Unsuitable for unrestricted commercial reuse. This does not describe all EBRAINS data. | **Metadata/license inspected; volumes not downloaded or meshed.** Needs threshold selection, surface extraction, matching reference cortex, and affine validation. Probability maps are not individual boundaries and cannot be inserted into HRA coordinates directly. |
| **NIH 3DPX-001944**, [entry](https://3d.nih.gov/entries/3DPX-001944?version=1) | Indexed entry describes original X3D and MRI/FSL-FIRST bilateral hippocampus, amygdala, thalamus, striatal structures, brainstem. No matching outer cortex described. | **Not cleared.** Available entry text did not expose a usable license value. NIH hosting alone grants no reuse rights. | **Identified from indexed entry description only; no mesh inspection.** Separability, newer processed format, license, and cortex alignment are unverified. Not used. |

The [HRA library](https://humanatlas.io/3d-reference-library) also documents its reference-object process/licensing. Permissions were checked against the [CC BY 4.0 terms](https://creativecommons.org/licenses/by/4.0/). The data license does not assign an open-source license to NEUROPLAY's application code.

## Measured asset findings

Exact provenance and bounds are in `asset-audit.json` and `public/models/brain-manifest.json`. `npm run verify:asset` repeats inspection through Three.js GLTFLoader.

| Measurement | Result |
| --- | --- |
| Original GLB size | 11,977,312 bytes / 11.42 MiB |
| Meshes / glTF nodes | 283 / 286 |
| Triangles / vertices | 656,268 / 324,855 |
| Texture maps / compression extensions | 0 / none |
| Hippocampus geometry | 6 addressable meshes; 1,470 triangles per side |
| Shared coordinates | Identity transforms on every source node; negative X for left named parts, positive X for right; all six inside whole-atlas bounds |
| Basic geometry checks | Finite vertices, valid indices, unique mesh names, successful GLTFLoader parse |

Containment uses the whole-atlas **bounding box**, not the cortical surface. It does not prove anatomical containment, non-intersection, watertightness, or segmentation correctness. Correct positioning is supported by shared source provenance and visual inspection, pending anatomical review.

The six supported nodes are exactly `Allen_{head,body,tail}_of_hippocampus_{L,R}`. Selection excludes parahippocampal gyri and the amygdalohippocampal area. These six nodes have `ontologyid: "-"` and no rows in the supplied ontology crosswalk. Labels derive from explicit source mesh names; they are not validated ontology/subfield annotations. Head/body/tail are not CA1–CA4 or dentate gyrus segmentations.

One uniform scale and translation center the entire scene. No individual component transforms or registrations are introduced, including during isolation: only visibility and camera framing change. Source left/right naming is retained. A formal anatomical-axis overlay has not been validated or added.

## Technology decision

Use **Next.js + TypeScript + Three.js + React Three Fiber + Drei**. Exact versions are locked in `package-lock.json`. Fiber 9 pairs with React 19 per its [official compatibility guidance](https://r3f.docs.pmnd.rs/getting-started/introduction).

- **Next.js:** one route, client-loaded WebGL viewer, [static export](https://nextjs.org/docs/app/guides/static-exports) to `out/`; no runtime API or paid platform required.
- **TypeScript:** explicit view/selection state and scene types; no domain framework/global state package.
- **Three.js:** glTF, picking, materials, bounds, and measurements. Independent scene materials avoid mutating shared loader materials.
- **React Three Fiber:** React controls drive scene state. Material animation runs outside React state; demand rendering avoids unnecessary idle frames.
- **Drei:** `useGLTF` and [CameraControls](https://drei.docs.pmnd.rs/controls/camera-controls) supply loading, orbit/dolly, and smooth `setLookAt` transitions. Save position/target before focusing.
- **GSAP:** not justified; existing camera smoothing and frame-rate-independent opacity damping cover this experiment.

Vanilla Three.js with Vite would be slightly simpler for a disposable non-React viewer. It offers no anatomical/rendering advantage here; the selected stack directly tests the user's proposed technologies with no server infrastructure.

## Validation and limitations

- Asset audit, `npm run typecheck`, and `npm run build`: passed. Production output is static.
- Browser verification on the built static export passed: whole-brain rendering, source-label picking (including right middle frontal gyrus), drag orbit, wheel zoom, camera reset, smooth focus, reveal/isolate switching, and visually restoring the saved whole-brain camera orientation. Left/right selection each reported 3 meshes, both sides 6. Directly clicking an isolated hippocampus selected its side and entered reveal mode. Keyboard adjustment of opacity to 0% hid context. Camera restoration was visually checked, not numerically or frame-time benchmarked.
- Static HTTP checks: page, model, manifest, and attribution returned 200 with appropriate content types; a missing path returned 404. The served model's SHA-256 matched the original. Browser error logs contained no application errors. Local visual evidence is saved in ignored `artifacts/whole-brain.jpg`, `artifacts/reveal-hippocampi.jpg`, and `artifacts/isolated-left-hippocampus.jpg`.
- The model has uncompressed geometry and many draw calls. Device pixel ratio is capped at 1.5 and frames render on demand. These modest defaults are not a measured performance guarantee. Mobile GPU, touch ergonomics, memory, slow-network load, Safari/Firefox, and frame-time budgets remain untested.
- Transparency accumulates through overlapping source structures. Default context opacity is 2%; selected meshes render after ghost context. This illustrative reveal is not physical X-ray rendering. [Three.js documents transparency sorting limits](https://threejs.org/manual/pages/transparency.html). Zero opacity/isolation provides an unambiguous visibility fallback.
- Segmentation seams and coarse hippocampus surfaces become visible when enlarged. No anatomical smoothing was applied to obscure that finding.
- Fiber emits a Three.js Clock deprecation warning with the installed release; rendering still works. Do not suppress it; revisit dependency compatibility before production.

## Review before Phase 1

1. Have an anatomist/neuroscience educator review hippocampus extent, cortex context, labels, and laterality. Decide whether mirrored anatomy and coarse isolated detail meet the educational standard.
2. Review the actual reveal/isolate views and approve this dataset or a replacement from one consistent atlas. For MRI-derived replacements, obtain cortex and hippocampus from the same licensed volume/segmentation and preserve voxel-to-world transforms. Do not hand-position unmatched models.
3. Establish target devices and loading/frame-time budgets, then profile this baseline. If needed, derive reviewed lower-detail/compressed GLBs while preserving node identity and relative coordinates; record derivatives in the manifest.
4. Approve a transparency or hide-context treatment before developing elaborate cutaways and educational UI.
5. Retain credits, source version, license, and modification notices in distributed anatomy. Review these findings before authorizing Phase 1.

The product vision and technology decisions remain adaptable. No curriculum, quizzes, CMS, accounts, database, AI service, or Phase 1 feature work has started.
