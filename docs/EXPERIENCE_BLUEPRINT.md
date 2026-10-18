# NEUROPLAY — Experience blueprint

**Type:** Design direction and interaction vocabulary; deliberately not a pixel-perfect design specification.  
**Status:** Hybrid atmosphere, beginner-first behavior-driven exploration, and Indonesian-first UI are confirmed. The implemented homepage is rejected as a product design. A large interactive brain below the headline remains the preferred hierarchy; exact visual and interaction treatments require collaborative design and explicit approval before implementation.

## Homepage direction after the design reset

The homepage should be an entrance to an interactive world: minimal navigation, a clear engaging headline, concise supporting copy, then a large, fully visible real interactive brain and an intuitive entry into coherent exploration. Preserve headline-above-brain order on mobile, with comfortable framing and usable controls. The light-lavender to deep-violet transition should express a change of experience, rather than a theme toggle; its treatment remains open.

The rejected implementation's oversized editorial typography, excessive empty space, gradients, navigation, section structure, and inactive question previews must not become the next design baseline. Real model interaction is necessary but does not by itself create a playground. Do not fill the page with inactive topic lists or placeholders. No new homepage, Explorer, curriculum, or mini-game implementation is currently authorized.

## An experience, not a dashboard

The Phase 0 proof of concept presents a technical anatomy workbench. That is appropriate for testing meshes and visibility, but **not** the desired public-facing learning experience. The future product should lead with questions, visual discovery, and inviting actions rather than exposing all technical controls immediately.

`/lab` may remain accessible for internal technical testing. It is not the approved public Brain Explorer, and future primary exploration actions must not automatically lead there. The future Explorer needs a dedicated immersive experience connected to the homepage, with fresh information architecture, controls, and transitions—not a recolored workbench. Design this flow collaboratively before implementation.

A useful rule: **begin with a reason to care, not with a configuration panel**.

## The experiential loop

```text
RELATE             PREDICT              ENTER / EXPLORE
A human moment  →  What do you think? →  Explore the brain in 3D
      ↑                                          ↓
CONNECT BACK   ←  PLAY / TRY AGAIN    ←  REVEAL / UNDERSTAND
Everyday life     Change a variable       See a visual explanation
```

The loop can be rearranged. Some visitors will start by freely exploring anatomy. Others will arrive through a mini-game. Do not force everyone through one linear tutorial.

## Two worlds, one design language

### Discovery World — light lavender

**Purpose:** approachability, orientation, and curiosity.

Possible elements:

- A question-led landing experience; e.g., *“Why do we sometimes recognize a face but forget the name?”*
- Short story-like cards rooted in ordinary experiences, not abstract textbook chapters.
- Quick “What do you think?” prediction interactions with no penalty.
- Playful educational cards, subtle movement, generous breathing room, high readability.
- Visible pathways to **Explore the Brain**, **Try an Experiment**, and **Go Deeper**.

Mood: bright, welcoming, inquisitive, smart—not childish, sterile, or textbook-like.

### Exploration World — deep violet

**Purpose:** focus and wonder while examining real 3D anatomy.

Possible elements:

- A prominent, interactive, realistic brain model, comfortably framed.
- Progressive controls: rotate, zoom, select, reveal, isolate, return. Show more advanced controls only when context calls for them.
- Contextual descriptions close to the selected structure, with a route back to the original behavior question.
- Smooth camera movement, controlled transparency/occlusion, and clear understanding of the original anatomical placement.
- Small, useful navigation and status UI—not a permanently overwhelming technical sidebar.

Mood: immersive, sophisticated, exploratory—not intimidating, excessively dark, or reminiscent of a terminal.

### The transition

A transition from learning to exploration might gradually deepen the background, reposition the content, and bring anatomical space into prominence. The reverse transition should return the learner to the question or experiment with their context intact.

**Direction, not prescription:** exact choreography, page boundaries, scroll behavior, full-screen vs. split-screen arrangements, and animation libraries remain open. Prefer reduced-motion fallbacks; never make a lengthy animation mandatory.

## Example learning journey: memory and hippocampus

This is an **illustrative pilot path**, not a medically complete explanation or final screen script.

1. **Curiosity:** “Why might a face feel familiar when the name doesn't come to mind?”
2. **Prediction:** Offer a choice of plausible interpretations, or let visitors reflect before revealing an explanation. Avoid a graded test atmosphere.
3. **First insight:** Familiarity, associations, and retrieving a name involve interacting processes; one brain region does not explain the entire experience.
4. **Enter the brain:** Transition to 3D, orient the user and select the hippocampal region as **one relevant piece** of the memory story.
5. **Anatomical reveal:** Fade surrounding context enough to reveal the internal location. Provide a clear return to whole-brain orientation.
6. **Isolate to inspect:** Rotate the hippocampal structures, with a short approachable explanation of their role in forming certain kinds of new memories.
7. **Play:** Try a carefully designed associative-memory activity; let users compare strategies or conditions. Make clear that this is a learning demonstration, not an experiment measuring their brain.
8. **Explore deeper (optional):** episodic/relational memory, encoding vs. retrieval, systems and networks, sources and uncertainties.
9. **Connect back:** “What might help create a stronger association?” Leave with an insight, not an unsupported diagnostic conclusion.

Content accuracy and the exact behavior-to-structure link require editorial review before publication.

## Interaction design vocabulary

**Invite:** “Explore what happens inside,” not “Initiate anatomical segmentation view.”  
**Reveal:** clarify what changed in the view and where the region sits.  
**Isolate:** retain an escape route to anatomical context.  
**Predict:** ask an open, curiosity-provoking question with useful feedback.  
**Experiment:** let a learner change a meaningful condition and compare an *illustration* or their own observable response.  
**Connect:** link a structure, mechanism, and everyday phenomenon.  
**Deepen:** offer optional advanced explanations without imposing them.

Visible labels should name actions in ordinary language. Internal technical IDs may use exact anatomy terminology.

## Guidance for the 3D explorer

- Keep the **whole-brain → reveal → isolate → restore** interaction from Phase 0 as a useful technical foundation, not a mandate to preserve its current UI.
- Explicitly distinguish **source-certified anatomy** from illustrative graphics and animations.
- Maintain spatial context when selecting interior structures; if in doubt, explain location before isolation.
- Avoid inventing subregions or anatomical boundaries beyond verified meshes.
- Consider simple labels and brief supporting text before a detail drawer or deep-dive page.
- Restore orientation predictably; provide reset, escape/back, and an obvious way to return to the original question.
- Maintain usable controls on mouse, touch, and keyboard where practical; add non-WebGL or reduced-interaction fallback if necessary.
- Profile loading/performance on target hardware. Beauty cannot require a high-end desktop GPU.

## Playfulness and visual restraint

- Use small moments of delight: gentle reactions to selection, contextual highlights, satisfying reveals, responsive cards, and expressive but restrained microcopy.
- Do not rely on confetti, overstimulation, fake badges, or gamified pressure for engagement.
- Use violet as the continuity color, supported by readable neutrals. Precise hex values remain design exploration.
- Make it feel handmade and cohesive, not like a generic AI-generated dashboard.
- Avoid presenting scientific illustrations or game visuals as clinical or research-grade evidence.

## Accessibility and comfort

Design considerations from the beginning: strong text contrast, readable font sizes, keyboard and touch support, focus states, reduced-motion behavior, no essential information conveyed by color alone, explanations usable without 3D manipulation, predictable back/exit behavior, and fair mobile ergonomics. These are constraints on the experience, not optional polish.

## UX questions to test, not assume

- Does the homepage spark curiosity within seconds?
- Does a beginner understand why entering 3D helps answer the question?
- Is the hippocampus visibly inside the brain before being isolated?
- Are advanced options discoverable without cluttering the first impression?
- Does the transition preserve the learning thread?
- Do mini-games teach an idea, or merely reward clicks?
- Does this still feel enjoyable on a small screen?

These questions guide prototypes; they do not prescribe final layout.
