# NEUROPLAY — UX Direction v2

**Status:** Product-owner direction for a fresh design iteration, **not a final approved layout**.  
**Supersedes:** The product-design interpretation of the rejected 18 October 2026 homepage prototype.  
**Does not supersede:** Verified Phase 0 model behavior, factual/scientific constraints, attribution, licenses, and the long-term product vision.

## 1. What we are building

NEUROPLAY is an **interactive neuroscience playground**. The visitor should feel like they have entered a modern science museum: curious, capable, invited to manipulate and discover, and taken seriously as a learner. This is **not a marketing/portfolio landing page**, a course catalog, a static article list, or an anatomy-engineering control panel.

**North star:** *Playful in experience. Thoughtful in language. Rigorous in science.*

The primary distinction is **meaningful interaction**, not merely adding animated visuals. A visitor must be able to do something useful, observe a response, understand what changed, and continue exploring.

## 2. Decision ledger

### Confirmed, preserve

- Violet is the shared brand identity; discovery uses light lavender / warm neutrals, and immersive 3D exploration uses deep violet. The experiences should feel related.
- The homepage hero has a **clear headline above a large, fully framed, real interactive 3D brain** (not a headline beside a tiny 3D widget).
- Indonesian-first, semi-formal, clear, mature, scientifically credible user-facing language. Select English brand/mode/scientific terms may remain.
- Science is behavior-first and approachable, with optional greater detail; do not reduce complex cognition to one brain region.
- Reuse the real licensed brain model, camera controls, and Phase 0 hippocampus reveal/isolate/restore implementation concepts. Preserve scientific and licensing notes.
- No paid APIs, accounts, analytics, or backend services are needed for this design slice.

### Explicitly rejected as a design baseline

- The October 18 homepage with an oversized editorial headline, dominant italic serif, large passive gradient, visually cropped brain, and inactive list of questions.
- A promotional web page that advertises experiences instead of delivering one.
- A primary CTA that takes learners to the old green `/lab` Phase 0 technical workbench.
- An abrupt jump between unrelated light homepage and technical UI. Merely changing the technical UI from green to purple is **not** a redesign.
- Controls that present segmentation testing terminology before a beginner has any reason to use them.
- Using blank space, gradients, scroll effects, or ornamental cards as substitutes for usable interaction.

### Open for collaborative design review

Exact typefaces, headline copy, visual proportions, 3D camera framing, overlay placement, animation choreography, entry route vs. in-page expansion, responsive composition, and what the first pilot topic should be. A coding agent may propose these, but must not silently declare them approved.

## 3. First-time visitor experience — UX contract

The initial design must demonstrate an **end-to-end, coherent learner-facing interaction**, not just a styled homepage.

| Beat | Visitor understands / does | Interface response | Success condition |
| --- | --- | --- | --- |
| 1. Arrive | Sees concise headline and a prominent, fully visible 3D brain underneath | The interface feels clean, modern, science-oriented, alive but not distracting | Brain is not unintentionally cut off at a common desktop viewport; clear entry action |
| 2. Touch curiosity | Rotates/inspects the real brain | Immediate, controllable movement and minimal contextual guidance | Obvious that the brain is interactive, not decorative |
| 3. Enter | Chooses to explore further | A coherent transition/expansion into the immersive deep-violet exploration environment | Never enters `/lab` or changes into a different product's UI |
| 4. Discover | Chooses an accessible reveal/focus action | Camera leads attention; surrounding anatomy fades or is otherwise contextually revealed; short Indonesian explanation accompanies it | A beginner understands **what** is revealed and **where** it sits |
| 5. Return | Restores whole-brain context and/or returns to discovery | Predictable visual and navigation return, no dead end | User keeps their bearings, sees a sensible next action |

This is the **minimum vertical slice** for evaluating the UX direction. A later prediction, mini-game, or full lesson is **not required to prove this slice**. If any part is not implemented, the primary route must not imply it works.

### Recommended demonstrator

Whole brain -> optional **"Lihat bagian dalam"** -> contextual reveal of the hippocampal region -> concise, accurate explanation -> **"Kembali ke otak utuh"**. This is a candidate UX flow, not a claim that the hippocampus alone explains memory.

## 4. Screen roles, not disconnected pages

### Home / Discovery

The home is an **entry experience**, not a feature catalog.

- Minimal navigation and a concise hero. Distinctive modern, legible typography; avoid enormous editorial serif headline styling.
- A generous, dominant 3D brain **below the headline**, fully framed and responsive. A well-lit brain should stand out without an enormous field of dead space.
- A visible affordance that invites a first interaction: e.g., subtle drag cue, localized reactive hint, hover/tap behavior, or immediately actionable control. Do not rely solely on tiny footer instructions.
- One strong primary journey action, with meaning and a working destination.
- Avoid filler sections. Inactive questions should not become the main content below the hero. If additional content exists, it should deepen or launch genuine interaction.

### Explorer / Immersive 3D

The Explorer is a **user-facing learning experience**, not the Phase 0 workbench.

- Deep violet with the same NEUROPLAY typography, spacing, and interaction vocabulary as Home.
- Prioritize the brain view. Reveal controls only when relevant; avoid a permanently dominant engineering-style sidebar.
- Use simple Indonesian actions: *Putar*, *Perbesar*, *Lihat bagian dalam*, *Fokus*, *Kembali*. Exact copy is exploratory.
- Tie selection to a clear explanation beside/near the anatomy; allow optional details later.
- Always provide a recognizable exit, an orientation-reset affordance, and a way to restore anatomical context.
- Internal technical model identifiers may remain, but they are not beginner-facing defaults.

### Technical lab

`/lab` remains available for internal testing, source verification, and future debugging. It is **not** a destination for the public primary CTA or a visual template for Explorer. Do not delete it solely because its UI is rejected.

## 5. Motion and interaction language

**Motion is functional, not a decorative layer added at the end.** Every key transition must clarify orientation, attention, cause/effect, or navigation.

- **Entry into exploration:** foreground/background and brain presentation should shift as one connected experience. Avoid hard visual jumps. A route transition or an in-page expansion are both viable; choose after comparing feasibility and UX.
- **3D camera:** smooth, interruptible and user-controllable; it should guide focus without trapping the viewer. Prevent surprise spin or disorienting snaps.
- **Anatomy reveal:** show relation to the whole brain before or while focusing on an internal part. Do not simply teleport to an isolated small object with no context.
- **Interface feedback:** immediate hover/focus/press response, small purposeful micro-interactions, consistent easing. Avoid lengthy compulsory sequences.
- **Return:** reverse the journey intelligibly, with a clear path back to where the user began.
- **Accessibility/performance:** honor `prefers-reduced-motion`, keyboard/touch support, legible controls, and mobile scroll/gesture conflicts. Reduced-motion users must have equivalent information and navigation. Avoid expensive effects that degrade 3D performance.

**Motion acceptance test:** A visitor can describe where they were, what changed, and how to reverse it at each step.

## 6. Visual language

**Intended mood:** modern science museum + friendly intellectual curiosity + understated futurism + playful experimentation.

**Not:** a 2020s template SaaS landing page, futuristic cyberpunk neon dashboard, children's quiz app, oversized editorial magazine, or medical instrument panel.

Use violet consistently but intelligently. Light surfaces should feel fresh rather than washed out; dark exploration should feel atmospheric rather than black/green. Typography should be modern, legible, and confidently academic without relying on decorative display serifs. Density should balance breathing room with meaningful content. Distinctiveness should come from composition, anatomical presence, interaction, and careful detail.

Science quality is part of the aesthetic: accurate labeling, meaningful transitions, appropriate terminology, citations/attributions where relevant, and honest explanation of educational simplification.

## 7. Do not confuse interaction with decoration

**Counts as meaningful:** rotating the model, selecting a structure, seeing its placement, unveiling it with context, comparing a scientifically honest idea, returning/revising a mental model.

**Does not count by itself:** a gradient fade, parallax, scroll-triggered headline animation, a glowing button, decorative particles, auto-rotating objects without control, or links to unbuilt topics.

Animation can complement interaction, not replace it.

## 8. Required design handoff BEFORE new implementation

The agent must first return a **UX proposal** for review, not a coded page:

1. An explicit journey map with states and transitions: **Home -> Explore -> Reveal -> Restore/Return**.
2. Proposed desktop and mobile compositions; identify viewport/framing expectations and where functional controls live.
3. A motion storyboard explaining what moves, why it moves, and the reduced-motion equivalent.
4. One coherent design-language proposal (typography direction, violet system, surfaces, spacing, UI controls). No need to lock exact tokens before visual review.
5. An inventory of Phase 0 components/assets to reuse and rejected UI/components to replace.
6. A list of **maximum three important unresolved decisions** requiring product-owner approval.

Provide a visual reference or actual UI mockup if permitted by available tooling, and make it distinguishable from implementation. Do not claim a written mood board is a visually validated design.

**Stop at review.** Do not build another homepage/Explorer or change public routes until the product owner explicitly approves the proposed UX.

## 9. Implementation approval gates (after review)

- **Gate A — Journey accepted:** clear path from curiosity to meaningful 3D exploration and back; no public navigation to `/lab`.
- **Gate B — Visual direction accepted:** inspect desktop and mobile appearance; brain legible/fully framed; not a generic landing page.
- **Gate C — One working slice accepted:** end-to-end interaction works; technical model behavior is preserved; motion and reduced-motion states tested.

A passing build, responsive width test, or absence of console errors **does not equal UX approval**. Visual and interaction review are independent requirements.

## 10. Documentation rules

- Preserve `docs/PRODUCT_VISION.md`, `docs/FEATURE_PLAYBOOK.md`, `docs/PHASE-0.md` and original anatomy attribution as durable inputs.
- Mark `docs/HOMEPAGE-PROTOTYPE.md` clearly **REJECTED FOR PRODUCT UX — HISTORICAL TECHNICAL RECORD ONLY**. Its implementation details are not approval for its navigation or visual style.
- Remove stale approval language from `docs/EXPERIENCE_BLUEPRINT.md`, `docs/README.md`, and `docs/WORKING_AGREEMENT.md` only where needed, and link this UX direction as the current design brief.
- Never treat an old mockup, placeholder, or implemented route as an approved design just because it exists in the repository.
- Prefer targeted revisions over rewriting the vision or feature inventory.
