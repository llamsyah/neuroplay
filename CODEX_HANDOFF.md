# Codex handoff — NEUROPLAY UX reset (send after copying UX_DIRECTION_V2.md into docs/)

We are **restarting the user-facing experience design**, not the technical neuroscience/3D foundation.

Read `AGENTS.md`, `docs/PRODUCT_VISION.md`, `docs/FEATURE_PLAYBOOK.md`, `docs/PHASE-0.md`, the existing design documents, **and the new `docs/UX_DIRECTION_V2.md`**. Treat the new UX direction and latest explicit owner decisions as authoritative for user-facing design, while preserving scientific, licensing, and verified technical constraints.

The October 18 homepage prototype has been rejected. It is a conventional editorial landing page with an oversized serif treatment, a passive gradient, a poorly framed brain, inactive questions, and a primary action that sends visitors to the old `/lab` technical workbench. Do not use that prototype or the old green lab UI as the design baseline for the product.

**Preserve** the licensed real brain asset, attribution, documented science/limitations, valid model utilities, camera and hippocampus reveal/isolate/restore functionality, and the `/lab` route as an *internal technical test surface*. **Discard as product direction** the previous homepage layout, presentation styling, dead-end concept section, and public navigation to `/lab`. No destructive Git operations, deletion of the 3D assets, or forced resets.

## Your task now — NO NEW PRODUCT UI CODE

1. Review `docs/UX_DIRECTION_V2.md` against the current source code and living documentation.
2. Update only the affected documentation to eliminate contradictory claims that the October 18 homepage or navigation pattern is approved. Mark `docs/HOMEPAGE-PROTOTYPE.md` as a historical/rejected UX experiment. Ensure `docs/README.md` and `docs/WORKING_AGREEMENT.md` point to the new document. Retain the historical technical findings.
3. Propose a coherent **end-to-end UX** for Home -> Enter immersive Explorer -> Reveal hippocampus in context -> Restore/Return. **Do not** route the learner through `/lab`.
4. Present an actionable UX journey map, desktop/mobile layout concepts, motion storyboard (including reduced-motion behavior), a concise visual-language proposal, preserved technical assets, and at most three approval questions.
5. Clearly separate **confirmed constraints**, **recommendations**, and **decisions pending approval**.
6. **STOP** for product-owner design review. Do not implement, rewrite routes/components, or proceed to new learning modules without approval.

We will implement a single coherent user-facing vertical slice **only after the design and interaction proposal has been approved**. Visual appearance and motion must be reviewed in actual desktop/mobile previews; build success alone is not sufficient.
