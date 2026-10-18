# NEUROPLAY — Product documentation

> **Living product direction, not a fixed specification.**  
> Intended for designers, educators, Codex, and other contributors.  
> Current context: the homepage implementation is **rejected as a product design** and retained only as a rejected prototype. Phase 0 remains **conditionally feasible**; `/lab` is an internal technical workbench, not the public Brain Explorer. No new homepage or Explorer implementation is authorized. Establish a visual reference and interaction blueprint collaboratively, then obtain explicit design approval before implementation.

NEUROPLAY is an interactive, beginner-friendly neuroscience playground. It connects everyday experiences, human behavior, and the brain through discovery, playful experiments, accurate 3D anatomy, and progressively deeper explanations.

## Read in this order

| Document | Purpose | Answers |
| --- | --- | --- |
| [PRODUCT_VISION.md](PRODUCT_VISION.md) | Identity and product philosophy | Why does NEUROPLAY exist? Who is it for? What must it feel like? |
| [EXPERIENCE_BLUEPRINT.md](EXPERIENCE_BLUEPRINT.md) | Interaction and visual direction | How should curiosity flow into 3D exploration and back into play? |
| [FEATURE_PLAYBOOK.md](FEATURE_PLAYBOOK.md) | Feature concepts and learning content | What kinds of interactions, games, and content should be possible? |
| [WORKING_AGREEMENT.md](WORKING_AGREEMENT.md) | How people and coding agents collaborate | What is approved? How can implementation evolve without reverting decisions? |

## How these documents should be used

- Preserve **intent and principles**, not arbitrary screen layouts or exact component choices.
- Treat examples as **illustrations**, not mandatory content or pixel-level UI specifications.
- Separate **approved product principles**, **verified technical capabilities**, **rejected UI decisions**, and **open visual/UX decisions**. See the current decision levels in `WORKING_AGREEMENT.md`.
- When a new design is explicitly approved, update the relevant documentation and implementation together; do not resurrect a superseded design.
- Respect existing Phase 0 technical findings in [`PHASE-0.md`](PHASE-0.md) and the current codebase. A promising demo is not a completed anatomical or accessibility audit.
- Get product approval before changing fundamental learning philosophy or starting a new major development phase.

## Current confirmed direction (October 2026)

1. NEUROPLAY is **playground-first, beginner-friendly, behavior-first**, with optional deep scientific exploration.
2. **Experience-based hybrid atmosphere:** a light/lavender discovery-and-learning world, contrasted with an immersive dark-violet 3D exploration world. Violet is a shared visual identity, not a claim that psychology scientifically has one color.
3. Real 3D anatomy matters; do not fake biological accuracy. The current segmented model is a **technical prototype**, not a final design endorsement.
4. Interactive questions, conceptual mini-games, and meaningful feedback belong to the product; it must not become a textbook or conventional multiple-choice course.
5. **No paid AI dependence for core functionality.** Scientific content should be separately authored, reviewable, and expandable.
6. The experience should feel like a sophisticated, interactive science museum: **playful in experience, thoughtful in language, rigorous in science**. Use clean modern typography, subtle futuristic details, and comfortable spacing without excessive emptiness. The exact visual treatment remains unapproved.
7. The preferred homepage hierarchy remains minimal navigation, clear headline, concise support, then a **large, fully visible, real interactive brain below the headline**, followed by an intuitive entry into coherent exploration. The rejected homepage's typography, layout, gradients, navigation, and sections are not a design baseline.
8. Public-facing copy is **Indonesian-first**, accessible, semi-formal, and respectful of beginners and teenagers. Branding, established scientific terms, and selected experience labels may use English. Developer documentation remains English.
9. Preserve the existing anatomical asset, loading utilities, camera controls, hippocampus reveal/isolation/selection, and context restoration. Preserve scientific findings and licensing records. This does not approve either prototype's interface or the homepage-to-`/lab` primary action.

## Existing repository resources

- Root `README.md`: how to run the current proof of concept.
- `docs/HOMEPAGE-PROTOTYPE.md`: rejected homepage status, retained implementation, and historical technical verification; not a visual reference.
- `docs/PHASE-0.md`: source model provenance, anatomy and licensing findings, and outstanding risks.
- `public/models/ATTRIBUTION.md`: actual atlas attribution requirements.

These product documents complement those records; they do not replace or weaken them.
