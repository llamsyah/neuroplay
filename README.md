# NEUROPLAY

**Product UI status:** the current homepage is **rejected as a product design**. Its code remains for reference and technical reuse, not as the design baseline. No new homepage or Brain Explorer implementation is authorized; a visual reference and interaction blueprint need collaborative review and explicit design approval first. Read [the living product documentation](docs/README.md) before product work.

- `/`: retained rejected homepage prototype with working 3D controls and inactive concept previews.
- `/lab`: internal Phase 0 anatomy workbench, including hippocampus reveal/isolation; not the approved public Brain Explorer.
- [Rejected homepage implementation and historical validation notes](docs/HOMEPAGE-PROTOTYPE.md)

**Phase 0 verdict: conditionally feasible.** A real human brain atlas loads locally, and its six hippocampus component meshes can be revealed, selected, and isolated without combining or repositioning unrelated anatomy. Anatomical review and device performance validation remain prerequisites for a production decision.

NEUROPLAY's direction is a beginner-friendly neuroscience playground: start with familiar behavior, invite experimentation, and progressively reveal the underlying biology. The experience should feel like a sophisticated interactive science museum. Working code records current behavior; the latest explicitly approved product decisions govern future design while verified scientific and licensing constraints remain binding.

## Run

Node.js 22 or newer; tested with Node 24.15.0 and npm 11.12.1 on Windows.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 for the homepage or http://127.0.0.1:3000/lab for the workbench. The model and licensed fonts are included locally; no account, API key, external model/font CDN, or inference service is needed at runtime.

```sh
npm run verify:asset
npm run typecheck
npm run build
npm start
```

`npm start` serves the built `out/` directory on loopback. Stop the development server first if it uses the same port. The static export can also be served by a conventional static host; the bundled preview server is for local review.

## Inspect the retained prototypes

On the rejected homepage, use the model controls or focus the model and use arrow keys, `+`/`-`, and `0`. On narrow screens, direct touch manipulation is opt-in so the page remains scrollable. The existing **Jelajahi otak** action opens `/lab`; this disconnected product flow is rejected and must not be reused automatically for future primary exploration actions. The inactive discovery questions do not open lessons or games and are not an approved content pattern.

In `/lab`:

1. Drag the whole brain to rotate; scroll or pinch to zoom.
2. Hover anatomy to inspect source labels.
3. Choose **Reveal hippocampus** to fade other meshes and move the camera toward the selection.
4. Choose **Left**, **Right**, or **Both sides**. Only explicitly named head/body/tail meshes are treated as hippocampus.
5. Adjust context opacity; **0%** hides context. **Isolate hippocampus** also removes it completely. A visible hippocampus component can be clicked to select its side.
6. Choose **Whole brain** to restore the camera context saved before entering the reveal/isolate views. **Reset camera** reframes the current selection.

The HRA model has mirrored hemispheres, no texture maps, and some visible segmentation boundaries. Transparency is an experiment with sorting/overlap limitations. It is not yet the long-term immersive anatomical presentation.

## Findings and provenance

- [Phase 0 findings, candidate comparison, risks, and recommendation](docs/PHASE-0.md)
- [Measured asset audit](docs/asset-audit.json)
- [Anatomical data attribution and license](public/models/ATTRIBUTION.md)
- [Pinned asset manifest](public/models/brain-manifest.json)

`npm run fetch:asset` can restore the GLB from the pinned publisher URL and refuses a checksum mismatch. The original metadata and ontology crosswalk are retained in `docs/sources/`.

No learning modules, quizzes, CMS, authentication, database, AI API, or further learning-platform phase is included. Preserve the technical foundation and outstanding Phase 0 findings; wait for explicit design approval before another homepage or Explorer implementation.
