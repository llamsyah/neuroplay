# NEUROPLAY — Feature and content playbook

**Purpose:** A catalog of experience systems NEUROPLAY may grow into.  
**Not:** A frozen backlog, a required launch checklist, or permission to implement every idea at once.

## Feature priority language

- **Foundation:** necessary to prove or express the core product.
- **Pilot:** suitable for a first complete learner journey after the foundation is approved.
- **Expansion:** useful later, after observing the pilot.

These are **priority hints**, not locked milestone numbers. A human may reorder or replace them.

## 1. Curiosity entry points (pilot)

**User value:** start with a human experience rather than a label on a diagram.

Examples: why some memories feel vivid, why routine actions become easier, why attention slips, how perception can mislead, why recall sometimes fails. Each entry should invite an achievable exploration with a scientifically defensible explanation.

Possible behavior: a lightweight card, short prompt, prediction, or visual teaser that leads into a focused learning journey. Avoid claiming the entire phenomenon is explained by one structure.

## 2. Brain Explorer (foundation)

**User value:** independently explore scientifically grounded 3D anatomy.

Potential capabilities: whole-brain rotation/zoom, hover/selection, understandable region labels, contextual highlighting, focus/restore, and responsive camera control. Advanced anatomy controls should be layered rather than exposed indiscriminately to beginners.

**Existing evidence:** The Phase 0 proof of concept already loads a real segmented HRA brain atlas and demonstrates reveal/isolate behavior for six meshes representing bilateral hippocampus head/body/tail. The result is **conditionally feasible**, not final product quality. See `PHASE-0.md` for caveats, license, mirrored anatomy, and unvalidated mobile performance.

**Product status:** `/lab` is an internal technical workbench, not an approved user-facing Brain Explorer or an automatic destination for primary exploration actions. Preserve its capabilities as foundations. The public Explorer needs fresh information architecture, intuitive controls, and visual/interaction continuity with the homepage; a recolored workbench is insufficient. Its design and implementation await explicit approval.

## 3. Anatomy Reveal (foundation → pilot)

**User value:** understand where a structure is located before studying it alone.

Intended pattern: **whole brain → show internal context → reveal relevant structure → optional isolation → restore anatomical context**. Animated transparency, cutaway, context dimming, or alternative camera framing are candidate techniques, not hard requirements.

Avoid breaking anatomical orientation, moving a region into a false anatomical position while presenting it as in-situ, or implying an inaccurate border. If isolated, indicate that the object is no longer shown in full context.

## 4. Progressive Deep Dive (pilot)

**User value:** control how much science to consume at once.

Possible layers:

- **Quick idea (10–30 seconds):** accessible, one key insight.
- **See it:** a linked view/visual of the mechanism or spatial relationship.
- **Go deeper:** networks, processes, terminology, caveats.
- **Sources and limits:** what research supports, what remains uncertain, and where the illustration simplifies.

The seconds are an editorial intuition, not an exact requirement. Avoid walls of prose by default. Keep advanced layers available rather than withholding them indefinitely.

## 5. Thought Playground (pilot)

**User value:** actively reason about an idea, not passively memorize it.

Formats to explore:

- **Predict and reveal:** “What do you think changes when ...?” → reveal reasoning, not just a correct answer.
- **Choose a hypothesis:** offer plausible explanations and follow each with useful evidence or distinctions.
- **Spot the difference:** compare two circumstances, noticing what information is and isn't available.
- **Order the process:** arrange conceptual steps (e.g., encoding, consolidation, retrieval) while clarifying their limitations and interactions.
- **What-if:** change a simplified variable to inspect a *conceptual*, not biologically exact, consequence.

Feedback should be respectful, informative, and non-punitive. Incorrect guesses should create curiosity rather than embarrassment.

## 6. Mini-experiments and learning games (pilot → expansion)

These should be short, engaging, and connected to the explanation. Candidate types include:

### Association Builder

Let a visitor link words or pictures using different strategies, then reflect on encoding and associations. Explain that personal results are affected by many factors and cannot diagnose memory ability. Do not invent population benchmarks.

### Attention Switch

Invite users to focus on one visual element while irrelevant information competes for attention, then discuss attention limits. Do not present a simulated heat map as actual measured neural activity.

### Prediction Lab

Offer a simplified system (e.g., “more competing cues” vs. “fewer competing cues”) and ask for an intuitive prediction. Display a clearly labeled illustrative outcome, not fabricated empirical data.

### Connection Puzzle

Arrange cards linking **everyday experience → cognitive process → relevant brain network/structure**. Multiple structures may contribute; do not enforce a simplistic one-to-one mapping when it is scientifically misleading.

### Perspective Switch

Compare how information appears when viewed as behavior, a cognitive model, a brain network, and an anatomical location. Let learners connect complementary explanations.

**Editorial rule:** Some activities can measure only the user's interactions with the activity, not what their hippocampus or neurons are doing. Label any computer-generated curve or visualization as illustrative unless it is derived from cited published measurements.

## 7. Connections Map (expansion)

**User value:** discover neuroscience as an interconnected system rather than isolated vocabulary.

Allow exploration between experiences, processes, networks, and structures. The map may be a visual graph, connected cards, or navigable 3D relationships. Interaction design remains open.

Represent association types carefully: *involved in*, *interacts with*, *may contribute to*, *associated with*, and *causally necessary for* are not interchangeable.

## 8. Teach / Presentation Mode (expansion)

**User value:** allow a facilitator to guide a group without constructing slides.

Candidates: staged reveals, audience prediction prompts, presentation-friendly focus controls, reveal-answer moments, and simple screen-sharing layouts. No accounts or complicated classroom management are necessary for the initial concept.

## 9. Content engine (foundation for scalable learning)

The **content must be separable from component implementation**, so new experiences do not require recreating the entire UI. JSON, Markdown/MDX, or a small TypeScript object schema can be evaluated based on the codebase; do not lock the format prematurely.

A future content unit might contain:

```yaml
id: memory-association-pilot
question: Why can a face feel familiar while a name is hard to recall?
audience: curious-beginner
quick_explanation: <plain-language reviewed text>
concepts: [familiarity, associations, retrieval]
anatomy_links: [hippocampus]  # relevant piece, not sole explanation
interactions: [predict, reveal, association-game]
deep_dive: <optional reviewed explanation>
evidence_status: <established | simplified | debated>
references: [<peer-reviewed source or reputable scientific resource>]
review_status: draft
```

This is **an illustrative authoring vocabulary, not a schema contract**. Fields, validation, routes, and content format can be revised based on actual authoring needs. Avoid putting unreviewed neuroscience claims directly into application copy without an editorial pass.

## Proposed first complete slice

A suitable **candidate** for an end-to-end vertical slice:

1. A relatable memory question.
2. One low-stakes prediction.
3. Enter 3D exploration.
4. Reveal and inspect the hippocampus in spatial context.
5. Read a concise, scientifically reviewed explanation with an optional deeper layer.
6. Try one association-focused mini-game or thought experiment.
7. Return to the original question and explore a related concept.

**Why this slice?** It exercises the whole philosophy while reusing the current anatomical proof of concept. The first pilot topic and game should be approved before extensive content production.

## Things intentionally deferred

A large content catalog, personalized profiles, social feeds, gamified rankings, cross-session persistence, complex authoring CMS, paid AI narration, adaptive recommendations, and comprehensive neural simulations are **not required to demonstrate NEUROPLAY's educational value**. They may be considered later if genuine user needs emerge.

## A good feature review asks

- Does this interaction make a mental model clearer?
- Can a beginner use it without a tutorial full of jargon?
- Is the science accurate, appropriately qualified, and sourced?
- Does it preserve curiosity and user agency?
- Can we deliver it simply and cheaply?
- Can it be reused for a different topic without hardcoding a new app?
