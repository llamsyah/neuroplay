# Stable observation and anatomical discoverability

Status: isolated implementation for review. Navigation and visual design remain **unapproved**. Production integration is outside this task.

## Root causes and correction

The prior stage spanned both grid columns and used a fixed 620 px width plus state-dependent `translateX(...)` to make room for context. The toolbar and camera controls copied that movement. Selection and navigator state therefore changed the apparent position of unrelated controls. The introduction also collapsed when entering Explorer, changing the viewport's vertical origin; long contextual content could affect the shared grid tracks.

The replacement uses a real stage column and a reserved 332 px context column (300 px at intermediate desktop widths). The scene occupies only the stage column. Its toolbar, viewport, and camera controls have explicit rows, without geometry rules keyed to selection, navigator, or environment state. The arrival row retains the same height between Discovery and Explorer; its text changes within that space. Responsive breakpoints alter the composition, not selection state.

On desktop the context region stretches across those existing rows, with its own overflow area for long optional science. On smaller screens it follows the complete stage and tools in normal flow. It never overlays anatomy. **Informasi** and **Jelajahi anatomi** switch content within the same contextual region. Mobile also has a shortcut beside the area-marker control above the stage.

The 3D boundary now has a restrained lavender surface and edge in Discovery, and a differentiated deep-violet surface in Explorer. Localized background lighting establishes the interaction area without adding ornamental geometry or moving the model out of its original coordinate system.

## Scroll, rotation and zoom

- Wheel events at the canvas stop before the OrbitControls wheel handler in capture phase, with a passive listener. They are not canceled with `preventDefault`; ordinary browser page scrolling remains the default. Wheel zoom is unavailable in this prototype, with no additional wheel mode to manage.
- Explicit zoom buttons and model-focused `+` / `−` keyboard shortcuts remain available.
- Desktop drag rotation remains direct within the bounded surface.
- Mobile initially allows page scrolling and tap selection. **Aktifkan putar** enables rotation and pinch; **Selesai memutar** returns to scrolling. The wheel guard does not intercept touch/pinch events.

These event policies are code/unit verified; actual browser scrolling and device touch ergonomics still require inspection.

## Finding available anatomy

**Tampilkan area interaktif** is optional and reversible. It gives the exact six verified surface meshes a teal tint while keeping selected anatomy violet. It changes color only: selection, opacity, source identity, history and camera are untouched. Unsupported meshes stay opaque. Hidden/back-side regions are not rendered through anatomy; rotate to find the other side.

The cue is disabled and cleared during internal reveal/isolation so it cannot imply an additional x-ray feature. Navigator pointer hover or keyboard focus temporarily previews a supported surface region in teal; the selected region always takes priority. No hippocampus preview is shown through opaque anatomy. Mobile has the explicit marker action rather than relying on hover.

The navigator now groups each existing gyrus family with compact **Kiri / Kanan** buttons. Each button retains its full anatomical accessible name. Current selection remains marked and named. Selection, explicit close and Escape return focus to the opening trigger, including the mobile shortcut. **Informasi** returns directly to reading. Native buttons preserve keyboard use; no modal overlay or focus trap is introduced.

## Navigation, viewing and information

Return to Discovery and previous selection remain in the Explorer navigation area. Whole-brain restoration moves beside the camera controls because it changes anatomical viewing, while retaining selection. Reveal/isolation remain relevant contextual actions. Name, supported category, explanation and optional science retain their hierarchy. Global **Info model** is a bordered, labeled control, with unchanged attribution accessible inside it and in the footer.

Camera orientation logic is unchanged: direct picking preserves viewing direction, and choosing a far-side region can deliberately orbit toward it. The navigator explains that behavior. Visible-side choices do not force an arbitrary turn. The existing orbit, contextual framing, reduced-motion paths, and saved camera/history poses remain in place.

## Separation audit

No displacement control was added. [SEPARATION-FEASIBILITY.md](SEPARATION-FEASIBILITY.md) records the reproducible audit and smallest next input. The source right-hemisphere parent contains six left-named children. Precentral/postcentral parcels pass basic connectivity/edge counting but lack cleared extraction interfaces/trajectories; superior temporal meshes have four nonmanifold edges each. This establishes limits, not a proof that all future separation is impossible.

## Validation and scope

**18 Node tests pass:** eight existing atlas/picking/gesture/opacity/history/camera checks; six navigator/actual-handler checks; four discovery-aid, priority, wheel-default and static-layout checks. Navigator tests use a minimal DOM adapter, and handler tests use rendering/UI adapters. Static CSS checks confirm no state-dependent observation geometry; they do not measure rendered pixels.

JavaScript syntax, CSS parsing, inline review scripts, unique DOM IDs/ARIA references, presentation selector targets and Git whitespace/scope checks pass. Nine protected anatomical framing/selection/opacity/transition/reveal/side/history/pointer functions are unchanged after line-ending normalization. GLB checksum remains identical; no source identities, original licensing records, production `src/`, or `/lab` change. No dependency is added.

```sh
node --test prototypes/visual-gate/interaction.test.mjs prototypes/visual-gate/navigation.test.mjs prototypes/visual-gate/discovery-aid.test.mjs
node prototypes/visual-gate/audit-separation.mjs
```

**Browser/visual inspection was not performed.** The earlier browser URL-policy denial was not bypassed. Native scroll/focus behavior, rendered stage bounds across states, touch ergonomics, assistive technology and device performance remain unverified. No screenshots are represented as verified renders. The production Next build/type check would not validate this isolated vanilla JavaScript prototype and was not run for it.

## Desktop and mobile review

Refresh <http://127.0.0.1:3011/review.html> with the existing local server running, or run `node prototypes/visual-gate/serve.mjs`. Use the 1440 × 900 and 390 × 844 review sizes; open independently to inspect 320 px and tablet widths too.

1. Compare Discovery unselected, selected, markers enabled, and navigator open. The stage edges and camera-control position should remain fixed. Enter Explorer without changing the viewport's outer position.
2. Wheel-scroll while over the brain; the page should scroll and the model's scale should stay unchanged. Check explicit zoom, keyboard zoom, direct drag and reset separately.
3. Toggle markers, rotate to find the other side, and select a tinted structure. Selection must remain violet and context opaque. Turning markers off must retain the selection.
4. Open **Jelajahi anatomi**; hover and keyboard-focus a side choice to preview without selecting. Choose it, reopen, Escape and close. Check focus restoration from both desktop and mobile triggers.
5. Switch structures in Explorer, return to the previous selection, restore whole-brain viewing, then return to Discovery. Inspect name, mode, saved pose and entry selection for each distinct return.
6. Reveal hippocampus, choose a side, isolate and restore. Check the marker action is unavailable during reveal/isolation; external selection restores opaque context. No separation/explode control should appear.
7. On mobile, scroll with rotation off; activate rotation for drag/pinch, then release. Check no horizontal shifts, clipped controls, anatomy-covering panel, or overflow. Repeat with reduced motion.

Only the spatial/discoverability iteration is implemented. Further separation development and any production UI work remain proposals requiring the next product-owner decision.
