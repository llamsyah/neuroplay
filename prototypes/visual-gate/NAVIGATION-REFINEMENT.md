# Navigation and information architecture refinement

> Historical navigation-pass record. The subsequent [spatial UX iteration](SPATIAL-UX.md) supersedes its stage positioning, list layout, and restoration-control placement. Navigation remains unapproved.

Status: implemented isolated proposal, awaiting product-owner review. No production rebuild is authorized by this work.

## Five responsibilities

| Responsibility | Placement and behavior |
| --- | --- |
| Global navigation | NEUROPLAY identity, Discovery/Explorer indicator, model information and attribution in the header. Explorer's orientation row has the explicit return to Discovery. Credits remain in the footer. |
| Observation | Existing real atlas and fixed-size stage. One camera group below it contains left/right orbit, zoom out/in, and reset. Mobile rotation remains explicitly enabled/released to preserve page scrolling. |
| Selection identity | Adjacent context column: supported location/category, full anatomical name, short existing explanation, relevant next action. Below the stage/tools on smaller screens. Discovery retains Quick Insight and deeper entry. |
| Exploration navigation | Visible **Pilih anatomi** above the stage in both environments. Previous selection and whole-brain restoration occupy a separate orientation row in Explorer. They never exit Explorer. |
| Scientific information | Expandable sources after the explanation; global atlas limitations and licensing in **Info model**. No new educational claims or advanced filler content. |

## Shared anatomy navigator

An inline panel replaces the reading area temporarily, beside the model on desktop and in normal flow below camera tools at widths up to 1055 px. It has no backdrop and never overlays or resizes the stage. The trigger stays above the model, so a visitor need not scroll to the end of an explanation to switch structures.

The six existing surface selections are grouped under frontal, parietal, and temporal lobe headings, following the already reviewed descriptions. These headings are not whole-lobe selections. Full left/right names remain visible. Explorer adds the existing hippocampus group under **Bagian dalam**; choosing it still requires the separate, deliberate reveal action. No new atlas identities are enabled.

Current selection has a text summary, persistent border/check, and `aria-pressed` state. Native buttons support keyboard, mouse and touch; this replaces the dropdown/disclosure as the principal selection UI. There is no additional navigation screen or dependency.

Opening focuses the current option, or the first option when unselected. Selection, explicit close, repeated trigger activation, and Escape close predictably and return focus to the opener. Tab remains native and untrapped because this is nonmodal. Selection directly on the model closes an open navigator without stealing model focus. Global view changes and return actions close it before focusing their relevant content. Opening global model information also closes it before the native modal opens.

## Control changes

- Promoted: shared anatomy switcher and anatomical identity/category.
- Separated: **Pilihan sebelumnya** (history), **Pulihkan otak utuh** (context and overview, retaining identity), **Kembali ke Discovery** (leave Explorer and restore the entry view).
- Consolidated: camera controls remain one group; global model information has one header entry. Footer retains attribution links without repeating the information action.
- Demoted: detailed identity evidence and limitations remain expandable after the explanation.
- Removed: separate Discovery/Explorer native dropdown disclosures and the redundant Quick Insight change link. The visible shared trigger replaces all three.

`icons.js` supplies a small reusable 24-unit SVG vocabulary with 1.6-unit rounded strokes. Functional icons cover navigation, orbit, zoom, reset, deeper entry, anatomy switching, context, show/hide, details, information, close and selected state. Ambiguous actions retain text; camera and close buttons have accessible names and 44 px targets. No fullscreen control is implied.

## Preserved behavior and boundaries

The nine existing functions for anatomical framing, selection-facing orientation, opacity modes, selection, environment transition, reveal, side selection, previous-selection restoration, and pointer gestures are unchanged after line-ending normalization. `anatomy.js`, `interaction.js`, audit records, model bytes, scientific/licensing records, production source, and `/lab` are unchanged.

External selection highlights only the chosen structure. All surrounding meshes remain opaque. Only explicit hippocampus reveal/isolation fades or hides context. Camera pose/history and scientific caveats retain their existing meanings. No catalog expansion, learning modules, games or production architecture work is included.

## Verification

Run from the repository root:

```sh
node --test prototypes/visual-gate/interaction.test.mjs prototypes/visual-gate/navigation.test.mjs
node --check prototypes/visual-gate/prototype.js
node --check prototypes/visual-gate/navigation.js
node --check prototypes/visual-gate/icons.js
```

**13 passing Node checks:** eight existing anatomy/interaction regressions plus five navigation checks covering allowlist/grouping, selected focus and Escape/close restoration, switching and view-specific entries, loading/Tab behavior, and the actual prototype handlers for reveal, isolation, previous return, whole-brain restoration and leaving Explorer. The controller tests use a minimal DOM adapter; the journey test uses actual handler functions with rendering/UI adapters. Neither is a browser integration test.

JavaScript and review-page inline scripts parse. CSS parses with the existing PostCSS package; DOM IDs, references and presentation selector targets pass static checks. Protected function comparisons and Git scope checks pass. No dependency is added. A production Next build/type check is not used as evidence for this separate vanilla JavaScript prototype.

**Not browser/visually verified:** rendered desktop/mobile layouts, native focus/scroll behavior, screen-reader output, physical touch ergonomics and target-device performance. The earlier browser URL policy denial was not bypassed. Live review frames are supplied for inspection, not represented as captured or inspected screenshots.

## Review at desktop and mobile sizes

Refresh <http://127.0.0.1:3011/review.html> if the existing local prototype server is running. Otherwise run `node prototypes/visual-gate/serve.mjs`. Select desktop (1440 × 900) and mobile (390 × 844); open independently to also inspect at 320 px.

1. Discovery: compare unselected, selected Quick Insight, and navigator open. Check headline-above-brain order, model prominence, full selection names, sources and deeper entry.
2. Navigator: use Tab/Shift+Tab, activate an option, reopen, Escape and explicit close. Verify focus returns visibly to **Pilih anatomi**. On mobile check the in-flow panel and page scrolling rather than an anatomy-covering overlay.
3. Explorer: compare unselected, surface selected and navigator open. Switch between two surface regions, then **Pilihan sebelumnya**; check identity and camera return. Surrounding tissue must remain opaque.
4. Hippocampus: choose it, reveal, select a side, isolate, then previous selection. Check side/mode/camera restoration. Isolate again and **Pulihkan otak utuh**; keep the identity, restore context, stay in Explorer.
5. Return to Discovery: enter from a selected Discovery region, switch within Explorer, then return. Check that the original Discovery selection and view return rather than the most recent Explorer selection.
6. Check mobile scroll versus rotate, 44 px targets, long names, optional expanded science, reduced motion, and horizontal overflow.

The eight gallery presets are real initial states: Discovery unselected/selected/navigator and Explorer unselected/selected/navigator/reveal/isolate. Previous return and restoration are deliberately reached through working controls, not fabricated history presets.

The visual proposal requiring approval is the shared inline navigator, its above-stage trigger and mobile stacking, the separate Explorer orientation row, and the revised category/name hierarchy. Stop here for review; do not begin a production UI rebuild.
