# Visual UI refinement — review notes

This is a presentation pass on the provisionally accepted anatomy-first prototype. It does not expand anatomy, alter source identities/geometry, replace the exploration model, or integrate production UI. Only this isolated folder changes.

## Visual changes

The header, hero, anatomical stage, contextual reading area, control dock, and footer now use one shared grid. The page is bounded at 1320px with consistent gutters and a 4/8/12/16/24/32/48px spacing scale. The former independently positioned floating card, decorative orbital ellipse, peripheral notes, numbered micro-labels, and technical status labels are removed from the visible composition.

Discovery retains its headline above the real brain. Selecting a surface opens an adjacent reading area on desktop; it has no separate card background. The canvas keeps the **same width and height before and after selection** at each viewport. On desktop, its bounded 620px viewport shifts toward the reading area rather than shrinking. Context text has a stable column width during that move. Below 1056px, context stacks beneath the stage and controls; opening context does not reduce stage dimensions.

Camera controls share one dock beneath the anatomical view. Discovery's alternative anatomy list is a secondary disclosure, not the primary introduction. The generic Explorer entry yields to the selected region's deeper-exploration action, avoiding competing primary buttons. Explorer leads with identity, concise explanation, and supported actions, followed by optional sources and the secondary anatomy picker. Selection history and whole-context restoration remain distinct.

| Typography role | Desktop | Mobile | Intent |
| --- | --- | --- | --- |
| Hero | 34–44px, 1.16, weight 650 | 29–37px, 1.18 | Clear, compact two-part headline; no decorative serif |
| Structure heading | 29px, 1.25, weight 650 | 26px, 1.3 | Readable identity with controlled line length |
| Essential explanation | 16px, 1.7, regular | 15px, 1.7 | Up to 36ch beside anatomy; relaxed reading without dense metadata |
| Primary action | 14px, 1.5, weight 600 | Same | Minimum 48px height |
| Supporting instruction/status | 13px, approximately 1.6 | Same | Sentence case, sufficient contrast |
| Optional metadata | 12–14px | 12–14px | Disclosure or quiet footer, never default scientific exposition |

The existing Manrope font, lavender/violet environments, source model, lighting setup, and persistent canvas are retained. Selected surface tissue uses a stronger violet tone distinct from neutral anatomy. Hover remains temporary; active selection keeps its stronger color even while hovered. Neither changes opacity. Only deliberate supported reveal/isolation modes affect surrounding visibility.

## Functional scope

The anatomical catalog, audit records, picking/gesture helpers, state transitions, camera framing/path functions, selection history, and material-opacity transition function are preserved. The limited functional adjustments concern presentation: **Pilih bagian lain** opens the Discovery list before focusing it; dismiss/restore focus a visible disclosure summary rather than a hidden select. Labels use their measured dimensions when clamped to the viewport, replacing fixed-width assumptions after typography changes.

No new lesson, game, anatomy group, route, dependency, or paid service is introduced. The six surface selections and the separate source-name-based hippocampus group retain their existing evidence and limitations.

## Review matrix

Open `/review.html`, and inspect both viewport sizes for:

1. Discovery / unselected.
2. Discovery / selected.
3. Explorer / unselected.
4. Explorer / selected.
5. Preserved hippocampus reveal, then isolation, side switching, and restoration.

Compare model prominence before/after selection, information proximity, reading hierarchy, control alignment, body-text legibility, and mobile scrolling. Expand/collapse both navigation lists and scientific sources; check focus after changing/dismissing/restoring a selection. Confirm surface selection leaves surrounding anatomy opaque.

Browser rendering and screenshot capture remain unavailable following the prior browser URL policy block; it has not been bypassed. Static/geometry checks and interaction regression tests are reported separately and **do not constitute visual verification**. Actual desktop/mobile layout, text wrapping, perceived highlight contrast, motion quality, physical touch, and screen-reader behavior require rendered review.

Eight Node regression checks passed, including the actual prototype opacity function applied across all six surface selections and all 283 meshes. External selection targets full opacity for every mesh, including restoration from a previously faded view. Only explicit reveal/isolate modes target faint/hidden context.

JavaScript/inline-script syntax, import-map JSON, CSS parsing, unique DOM IDs and references, ornament removal, and local documentation links passed static checks. Before/after hashes match for the five anatomy/evidence files and nine core functions covering framing, opacity, selection transitions, history, and pointer interaction. Text-palette contrast calculations pass 4.5:1: supporting text is 5.65:1 in Discovery and 9.43:1 in Explorer; primary-action text is 6.37:1 and 7.20:1 respectively. These calculations do not measure the lit 3D highlight or certify rendered accessibility.

Stop at this visual review. Production rebuilding remains outside scope.
