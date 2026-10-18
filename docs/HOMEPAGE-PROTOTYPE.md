# Homepage experience prototype

18 October 2026. Scope: one local, runnable homepage design experiment. No learning-platform phase or final interface approval is implied.

## Approved constraints

- Centered headline and supporting copy **above** a large, genuinely interactive anatomical brain, on desktop and mobile.
- Indonesian-first, respectful and accessible public copy; English developer documentation.
- Light lavender/warm white discovery leading into a deep-violet exploration atmosphere.
- Reuse the existing licensed anatomical asset, preserve verified hippocampus behavior, and keep the Phase 0 workbench accessible.
- Brief discovery concepts only; no lessons, games, quizzes, accounts, database, AI service, or paid dependency.

## Candidate design

Manrope paired with Instrument Serif Italic, a quiet typographic opening, and a continuous lavender-to-violet environment around the model. The model has no enclosing dashboard card, automatic spin, fabricated activity, or invented anatomy. A small editorial question section gives context for future learning without offering unavailable actions.

Exact fonts, palette, model framing/lighting, gradient treatment, copy, and navigation remain review candidates. The approved composition and language should survive later revisions unless explicitly superseded.

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

## Working interactions

- In-page navigation and a real entry into `/lab`; the workbench logo returns home.
- Desktop drag orbit and wheel zoom; reset and rotate/zoom buttons.
- Focus the model for arrow-key rotation, `+`/`-` zoom, and `0`/Home reset. Supporting buttons have explicit accessible names.
- At widths up to 720px, direct manipulation is opt-in through **Putar dengan sentuhan**. The default allows vertical page scrolling over the canvas. **Selesai memutar** restores that default. Buttons and keyboard controls also work when direct manipulation is off.
- Reduced-motion preferences disable optional CSS motion and camera smoothing. No model auto-rotation occurs.
- Loading feedback, a failed-model message with retry, visible focus states, a skip link, and expandable provenance details.

The three discovery questions are editorial concepts with visible unavailability labels. They do not link to games or imply completed educational modules. The deeper destination remains an English technical prototype, not a new learner-facing explorer.

## Validation

- TypeScript check and source-asset audit passed. The asset checksum, 283 meshes, 656,268 triangles, and six explicit hippocampus components remain unchanged.
- Production static export passed for `/` and `/lab`.
- Browser checks at 1440×1000 and 390×844 confirmed headline-above-model composition, real rendering, and no horizontal overflow. Keyboard rotation, zoom buttons, reset, mobile interaction toggling, route entry, and workbench reveal/isolation/left selection responded correctly.
- Mobile interaction states were checked through the responsive viewport and computed touch/pointer styles. Physical touchscreen/pinch ergonomics and mobile GPU performance are **not** certified by viewport testing. Reduced-motion behavior is implemented and source-reviewed; OS preference switching was not automated.
- An additional 320×740 check preserved the hierarchy and produced no horizontal overflow. Production `/` and `/lab`, both local font files, and the attribution notice returned HTTP 200 with appropriate content types; missing routes returned 404. Homepage → workbench → back navigation preserved the homepage's typography and light palette. No application errors appeared in browser console checks.
- Review captures: ignored local `artifacts/homepage-desktop.jpg`, `artifacts/homepage-mobile.jpg`, and `artifacts/homepage-full.jpg`.

## Review boundary

Review the typography, atmosphere transition, framing, and opt-in mobile interaction treatment. Existing Phase 0 risks still apply: mirrored anatomy, segmentation detail/seams, missing hippocampus ontology IDs, transparency limits, and target-device performance. This experiment does not resolve those scientific or performance questions.

Stop at this homepage. Further experience design, instructional content production, and platform development require explicit approval.
