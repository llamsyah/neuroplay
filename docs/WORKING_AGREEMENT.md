# NEUROPLAY — Living decisions & Codex working agreement

**Audience:** Product owner, design collaborators, Codex, and engineering contributors.  
**Purpose:** Give AI-assisted development enough direction to move independently **without turning old documentation into an obstacle**.

## Read this before modifying the product

The existing Phase 0 interface was built to test anatomy rendering and hippocampus interactions. It is a technical workbench, **not** a final UI design. Preserve its verified technical capabilities as useful foundations, but do not replicate its layout or copy as a product constraint.

Read these in order for product work:

1. `docs/README.md` (documentation map)
2. `docs/PRODUCT_VISION.md` (why and for whom)
3. `docs/EXPERIENCE_BLUEPRINT.md` (desired learner experience)
4. `docs/FEATURE_PLAYBOOK.md` (possible interaction systems)
5. `docs/PHASE-0.md` and existing source code (verified technical constraints)

Also obey the repository's existing `AGENTS.md` Next.js rules. Do not remove or overwrite those generated guidance blocks.

## Decision levels

### A. Confirmed product decisions

- Name: **NEUROPLAY**.
- Beginner-friendly, behavior-first interactive neuroscience playground; not a textbook or anatomy workstation.
- Progressive depth, scientifically honest explanations, and meaningful interactive questions/games.
- **Hybrid atmosphere by experience:** light/lavender for learning/discovery; deep violet for immersive anatomical exploration; cohesive branding across both.
- Real anatomical context where 3D anatomy is presented as factual.
- No paid AI requirement for the MVP/core educational experience.
- Keep design and code adaptable to new approved decisions.

### B. Proven / observed technical facts

- Current Phase 0 demonstration works with a legally reusable segmented HRA brain atlas under conditions documented in `PHASE-0.md` and the model attribution.
- Whole-brain display, camera interaction, revealing/fading context, and hippocampus isolation were demonstrated in a browser.
- Anatomical quality review, source mirroring trade-offs, mobile performance, and final design remain unresolved.

**Do not describe a technical proof of concept as completed product validation.**

### C. Open design decisions and hypotheses

The homepage structure, card composition, exact typography/palette, scene transition mechanics, panel arrangement, content format, default navigation, exact mini-game implementations, and expansion schedule are proposals until reviewed.

The memory/hippocampus pilot is **a recommended example**, not a mandatory lesson order or a factual claim that one structure explains all memory problems.

## Authority and conflicts

- **Latest explicit product-owner approval** governs the intended user experience, even when an older document disagrees.
- **Verified scientific and licensing constraints** cannot be overridden by a visual preference. Escalate these trade-offs clearly.
- **Working code** describes current behavior, not always the desired behavior. Do not treat an existing experimental screen as an approved design.
- When docs disagree with one another, identify the contradiction; update only the affected passages after direction is resolved. Never silently restore an outdated visual concept.
- Ask for approval when changing core learning philosophy, anatomical representation, major navigation model, paid-service dependencies, or the agreed phase boundary.

## How Codex should work

1. **Inspect first.** Read relevant documents and existing code before proposing architectural changes.
2. **State the scope.** Restate what the requested change affects and what must remain untouched.
3. **Explore with judgment.** Choose ordinary implementation details independently; do not block on every small choice.
4. **Prototype in small slices.** Prioritize working experiences over large speculative systems.
5. **Preserve approved work.** Do not redesign unrelated pages, restore superseded layouts, or remove working controls without a reason.
6. **Verify.** Run the appropriate typecheck/build/tests; report what was verified and what was not tested.
7. **Update only relevant docs.** Keep decisions synchronized with code without turning exploratory designs into rigid mandates.
8. **Pause at meaningful boundaries.** Do not auto-implement multiple major phases or invent a new product direction without review.

## Revision protocol

When a user requests a change, respond to its **delta**, not by starting from the initial mockup again.

A concise change summary is enough:

```text
Requested change: <what is changing>
Preserve: <current behaviors/decisions that must stay>
Open questions: <only materially blocking issues>
Implementation: <smallest coherent change>
Verification: <tests and visual checks>
Docs updated: <only impacted files>
```

An already-approved design should be the baseline for subsequent iteration. Use Git history to compare and recover working versions if needed; avoid large unsolicited rewrites.

## Design reviews: what to bring back

For a meaningful UX change, provide:

- A runnable preview or inspectable screenshots, when possible.
- The learning flow being improved and why.
- What changed from the previous approved version.
- Any compromise involving anatomy accuracy, accessible controls, responsiveness, or performance.
- One or two unresolved decisions, **not** a massive questionnaire.

For technical research, report exact asset sources, license status, experiments performed, and limitations; do not overstate feasibility.

## Current next step

**Do not automatically start Phase 1 based solely on these documents.** Review Phase 0 anatomical quality and constraints with the product owner. Then agree on a small next slice for the hybrid discovery → immersive exploration experience. The Phase 0 technical UI is free to be redesigned, but its proven 3D operations should remain available unless deliberately replaced.

A good next design exercise is to sketch or prototype **one journey from a relatable question to the 3D hippocampus reveal and back to a playful learning interaction**, without making the layout permanent before review.

## Maintenance guideline

Update this file only when a **meaningful product decision changes**. Keep implementation details close to code and technical findings in their own documents. Prefer replacing a superseded sentence to adding endless historical caveats. Keep the documentation useful to the next contributor, not a record of every chat.
