# Rejected homepage prototype — retained technical record

18 October 2026. **Status: rejected as a product design.** The implementation remains at `/` for reference and technical reuse, not as a design baseline. No replacement homepage or Explorer implementation is authorized. This record describes retained code and historical verification, not product acceptance.

## Retained principles and technical requirements

- Preferred hierarchy: clear headline and concise supporting copy **above** a large, fully visible, genuinely interactive anatomical brain on desktop and mobile. Exact visual treatment awaits collaborative design and explicit approval.
- Indonesian-first, respectful and accessible public copy; English developer documentation.
- Light lavender/warm white discovery leading into a deep-violet exploration atmosphere.
- Reuse the existing licensed anatomical asset, preserve verified hippocampus behavior, and keep the Phase 0 workbench accessible.
- Meaningful discovery rather than inactive topic lists or placeholder sections. No lessons, games, quizzes, accounts, database, AI service, or paid dependency is authorized by this reset.

## Rejected design decisions

The implemented editorial landing page used Manrope with oversized Instrument Serif Italic, excessive empty space, a continuous lavender-to-violet gradient, and inactive neuroscience question previews. The real interactive model functioned primarily as a visual centerpiece. These typography, layout, gradient, section, navigation, and visual decisions are rejected references for future work.

The primary exploration action enters the visually disconnected Phase 0 workbench. This flow is rejected. `/lab` may remain for internal technical testing; it is not the approved public Brain Explorer and must not automatically receive future primary exploration actions. A future Explorer needs a dedicated, coherent product experience, not a recolored workbench.

The preferred headline-above-brain hierarchy, Indonesian-first respectful language, violet identity, and real anatomical interaction remain direction. A new visual reference, interaction blueprint, typography, spacing, staging, navigation, and transition design need review before implementation.

## Routes and code

| Location | Responsibility |
| --- | --- |
| `/`, `src/components/homepage.tsx` | Homepage, navigation, concept previews, input controls, loading/error handling, attribution |
| `src/components/homepage.module.css` | Responsive composition and homepage styling |
| `src/components/hero-brain-scene.tsx` | Client-loaded real 3D model, orbit/zoom/reset, keyboard command handling, framing and lighting |
| `/lab`, `src/app/lab/page.tsx` | Existing Phase 0 workbench with route-specific metadata |
| `src/app/lab/lab.css` | Original workbench styles scoped to `.lab`, avoiding homepage style leakage |
| `src/lib/brain-model.ts` | Shared scene preparation: clone, one uniform normalization, independent display materials, required hippocampus-node checks |
| `scripts/serve.mjs` | Local static preview, including extensionless `/lab` resolution |

Both views use the same unmodified `brain-male-v1.3.glb`. The shared helper preserves all relative anatomical coordinates and the original workbench material defaults. Homepage lighting/materials differ for staging only. Reveal/isolation, source-name selection, and camera restoration remain in the original workbench component; no synthetic substitute or anatomical rearrangement was introduced.

Self-hosted font files and original SIL OFL 1.1 notices are in `public/fonts/`. There are no added npm dependencies or runtime font/model CDN requests. The atlas attribution and source limitations remain accessible from both experiences.

## Retained working interactions

- Existing in-page navigation and routing into `/lab`; the workbench logo returns home. These links work technically but do not establish an approved navigation model.
- Desktop drag orbit and wheel zoom; reset and rotate/zoom buttons.
- Focus the model for arrow-key rotation, `+`/`-` zoom, and `0`/Home reset. Supporting buttons have explicit accessible names.
- At widths up to 720px, direct manipulation is opt-in through **Putar dengan sentuhan**. The default allows vertical page scrolling over the canvas. **Selesai memutar** restores that default. Buttons and keyboard controls also work when direct manipulation is off.
- Reduced-motion preferences disable optional CSS motion and camera smoothing. No model auto-rotation occurs.
- Loading feedback, a failed-model message with retry, visible focus states, a skip link, and expandable provenance details.

The three inactive discovery questions have visible unavailability labels and do not link to games. Their presence is part of the rejected design, not a pattern to preserve. The deeper destination remains an English technical prototype, not a learner-facing Explorer.

## Historical technical validation

The checks below were recorded for the original implementation. They establish technical behavior at that time, not design approval. No new runtime checks are implied by this documentation reset.

- TypeScript check and source-asset audit passed. The asset checksum, 283 meshes, 656,268 triangles, and six explicit hippocampus components remain unchanged.
- Production static export passed for `/` and `/lab`.
- Browser checks at 1440×1000 and 390×844 confirmed headline-above-model composition, real rendering, and no horizontal overflow. Keyboard rotation, zoom buttons, reset, mobile interaction toggling, route entry, and workbench reveal/isolation/left selection responded correctly.
- Mobile interaction states were checked through the responsive viewport and computed touch/pointer styles. Physical touchscreen/pinch ergonomics and mobile GPU performance are **not** certified by viewport testing. Reduced-motion behavior is implemented and source-reviewed; OS preference switching was not automated.
- An additional 320×740 check preserved the hierarchy and produced no horizontal overflow. Production `/` and `/lab`, both local font files, and the attribution notice returned HTTP 200 with appropriate content types; missing routes returned 404. Homepage → workbench → back navigation preserved the homepage's typography and light palette. No application errors appeared in browser console checks.
- Review captures: ignored local `artifacts/homepage-desktop.jpg`, `artifacts/homepage-mobile.jpg`, and `artifacts/homepage-full.jpg`.

## Current boundary

Preserve the GLB, license/attribution, model-loading and scene utilities, camera controls, and hippocampus reveal/isolation/selection/context functionality. Existing Phase 0 risks still apply: mirrored anatomy, segmentation detail/seams, missing hippocampus ontology IDs, transparency limits, and target-device performance. This experiment does not resolve those scientific or performance questions.

Stop after the documentation reset. Establish the visual reference and interaction blueprint collaboratively and obtain explicit design approval before any new homepage or Explorer implementation.
