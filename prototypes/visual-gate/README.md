# NEUROPLAY — free anatomy exploration prototype

The existing light-lavender Discovery / deep-violet Explorer visual baseline is **provisionally accepted**. This iteration adds anatomy-first free selection for interaction review. It does not authorize a production rebuild, a new visual redesign, behavioral topics, games, or curriculum work.

The subsequent **visual UI refinement pass** preserves that interaction foundation. See [VISUAL-REFINEMENT.md](VISUAL-REFINEMENT.md) for the typography system, shared grid, fixed-size stage, integrated context, control grouping, and visual review boundary. The latest styling awaits product-owner review.

Only this isolated folder is changed. Production routes/components, the internal `/lab`, original scientific records, licensing notices, and GLB bytes are preserved. There are no new dependencies or external runtime services. The small local `package.json` only scopes JavaScript modules and commands to this prototype.

## Run and review

From the repository root:

```sh
node prototypes/visual-gate/serve.mjs
```

Open **http://127.0.0.1:3011/review.html**. If the prototype server is already running, refresh its page; source files are served without caching. Stop a server you launched with Ctrl+C. Port 3011 is separate from the existing app on port 3000.

The review page offers actual **1440 × 900 desktop** and **390 × 844 mobile** iframe viewports for Discovery, Quick Insight, selected-surface Explorer, and preserved hippocampus reveal. These are live states, not captured or visually inspected screenshots. One review iframe is active at a time.

Useful direct states:

- `/`: free Discovery; no preselected structure.
- `/?selection=precentral-right`: Discovery with a source-supported Quick Insight selection.
- `/?view=explorer&selection=precentral-right`: Explorer focused on that same identity.
- `/?view=explorer`: unselected free Explorer.
- `/?view=explorer&mode=reveal`: preserved hippocampus reveal.
- `/?view=explorer&mode=isolate`: preserved hippocampus isolation.
- `/storyboard.html`: Discovery → Quick Insight → selected Explorer, plus entry-transition notes.
- `/ANATOMY-AUDIT.md`: evidence, enabled regions, deferred groups, and limitations.

## Anatomy audit first

See [ANATOMY-AUDIT.md](ANATOMY-AUDIT.md) and the reproducible [anatomy-audit.json](anatomy-audit.json).

- Of 283 meshes, 103 have usable embedded labels/ontology IDs. Of those, 102 also match the pinned publisher crosswalk; the optic chiasm lacks a matching crosswalk row.
- **Six surface selections:** left/right precentral gyrus, postcentral gyrus, and superior temporal gyrus. Exact node names, GLB labels/IDs, and crosswalk entries agree.
- These are individual gyri, not whole lobes or exhaustive functional regions. Most source meshes are intentionally not interactive.
- **Separate existing exception:** the hippocampus group uses six explicit head/body/tail names but lacks ontology IDs/crosswalk rows. Its original reveal/side/isolation/restoration flow is preserved without claiming a stronger evidence level.
- Independent anatomical review, mirrored-hemisphere limitations, coarse hippocampus geometry, and transparency artifacts remain unresolved.

The descriptions teach anatomy rather than assigning complex cognition to one structure. Primary references are the UBERON definitions for the three surface gyri; the hippocampus explanation retains its [memory research source](https://pubmed.ncbi.nlm.nih.gov/12359833/). Full asset attribution remains in the unchanged [anatomical notice](../../public/models/ATTRIBUTION.md).

## Discovery → Quick Insight → Deep Explorer

**Desktop:** hover supported visible surfaces for a restrained highlight and label, then click to select. A compact information panel gives the name, a short description, **Jelajahi lebih dalam**, **Ganti bagian**, and dismissal. Unsupported foreground anatomy blocks selection through it.

**Mobile:** tap to select while rotation is off. Vertical page scrolling remains available; pointer cancellation suppresses selection during scrolling. **Aktifkan putar** activates drag/pinch; **Selesai memutar** releases it. The full pointer path and multi-touch participation distinguish rotation/pinch from a tap. Physical touch ergonomics still need review.

Both layouts provide a labeled anatomy menu as a keyboard/touch alternative. Discovery's menu is under **Pilih dari daftar**; Explorer's is under **Pilih bagian lain**. Arrow keys rotate while the model container has focus; `+`/`−` zoom and `0` resets framing/orientation for the current state. Controls do not require dragging.

**Jelajahi lebih dalam** carries the selected identity into the deep-violet Explorer. Entry retains the existing camera direction for a picked visible surface and reframes around its context. Choosing an opposite-side region from a menu may turn the camera toward that already-identified region. Camera interpolation follows an orbital path instead of crossing through the brain. One canvas remains mounted within this isolated implementation; production React/router continuity has not been verified.

## Free navigation inside Explorer

**Pilih bagian lain** offers the same six surface selections plus the existing hippocampus group. Switching updates the name, explanation, highlight, and framing. Surface selection restores opaque context and never exposes hippocampus-only isolation controls.

These actions remain distinct:

1. **Pilihan sebelumnya:** restore the prior selection, mode, side, camera, and saved context. Side changes in the hippocampus view also participate in this history.
2. **Kembali ke otak utuh:** restore opaque anatomical context and saved overview; keep the selected identity so the visitor knows what they were studying. This does not pop selection history.
3. **Kembali ke beranda:** restore the Discovery entry selection and view. Explorer-local selection history is cleared.

For **Hipokampus · bagian dalam**, choose **Temukan hipokampus** deliberately, then select left/both/right, optionally hide surrounding anatomy, and restore context. Direct picking of those internal structures is unavailable through an opaque whole brain. Other regions do not imply an internal-reveal/isolation feature.

## Checks and remaining validation

```sh
node prototypes/visual-gate/audit-anatomy.mjs
node --test prototypes/visual-gate/interaction.test.mjs
node --check prototypes/visual-gate/prototype.js
```

Eight Node tests passed: exact source identity/checksum validation (including rejection of a mismatched label), first-visible-hit reachability of all six surface meshes in the real atlas, unsupported occlusion, internal-picking restrictions, drag/pinch/cancel filtering, previous-selection snapshots, opposite-side orbital camera interpolation, and the actual prototype opacity function keeping every mesh opaque during external selection. A separate coarse default-camera ray sample reached the three right-hand supported gyri; this is geometry evidence, not a visual or touch usability assessment.

JavaScript syntax, HTML inline scripts/import map, unique DOM IDs and referenced selector targets, local module paths, and CSS parsing also passed static checks. Production source, original scientific records, and licensing/assets have no changes from this task.

Rendered appearance, DOM/browser integration, physical touch, screen-reader behavior, reduced-motion preference switching, and target-device performance are **not visually/browser verified**. The prior browser URL policy denial has not been bypassed. Use the desktop/mobile review frames to inspect layout, source-region targeting, camera continuity, and every return action. Production build/type checks do not validate this separate vanilla-JavaScript prototype and are not represented as having done so.

Stop after this focused interaction review. Further production work requires product-owner approval.
