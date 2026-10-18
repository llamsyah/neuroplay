# NEUROPLAY

The current experiment is an Indonesian-first homepage with a real interactive brain below its centered headline. It introduces a light-lavender discovery atmosphere and a deep-violet exploration area. This is a reviewable homepage prototype, not the full learning platform.

- `/`: homepage with orbit, zoom, reset, keyboard controls, and concept previews.
- `/lab`: preserved Phase 0 anatomy workbench, including hippocampus reveal/isolation.
- [Homepage implementation and review notes](docs/HOMEPAGE-PROTOTYPE.md)

**Phase 0 verdict: conditionally feasible.** A real human brain atlas loads locally, and its six hippocampus component meshes can be revealed, selected, and isolated without combining or repositioning unrelated anatomy. Anatomical review and device performance validation remain prerequisites for a production decision.

NEUROPLAY's direction is a beginner-friendly neuroscience playground: start with familiar behavior, invite experimentation, and progressively reveal the underlying biology. The eventual experience should feel like an interactive science museum. This repository currently tests the anatomical interaction only; its interface is not an approved product design. Working code and newer user-approved decisions supersede earlier suggestions.

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

## Try the experiment

On the homepage, use the model controls or focus the model and use arrow keys, `+`/`-`, and `0`. On narrow screens, direct touch manipulation is opt-in so the page remains scrollable. **Jelajahi otak** opens the workbench. The discovery questions are labeled concepts; they do not open lessons or games.

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

No learning modules, quizzes, CMS, authentication, database, AI API, or further learning-platform phase is included. Review the homepage candidate and outstanding Phase 0 findings before authorizing further development.
