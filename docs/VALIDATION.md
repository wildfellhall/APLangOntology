# Validation

Reviewed October 29, 2026.

## Content

- 81 concepts across nine units, connected by 198 typed relationships.
- 220 active original MCQs in 22 official-skill sets: 10 distinct questions per skill.
- Concept pages link to their associated sets, providing 20–40 questions per concept. Sets and answers are shared; these are not separate banks of newly authored questions for every concept or every named device.
- Five original reading passages and five numbered revision drafts support the MCQ bank. Each set uses five contexts. All simulated circumstances and figures are labeled.
- 81 essay assignments: 32 rhetorical analysis, 40 argument, and nine synthesis. Five extended analysis passages and one six-source synthesis packet are reused across those assignments.
- 81 rewritten projects with distinct inquiries, audiences, topic suggestions, detailed deliverables, visual reasoning, self-analysis, testing, revision, and reflection.
- Every project has a 100-point analytic rubric. Its central concept and visual criterion are specific to the assignment; evidence, self-analysis, and revision criteria supply common expectations. Four scored performance levels and a missing-work level are explicit.

Projects are alternatives, not 81 required submissions. Topic suggestions are subjects to investigate, not completed project examples. The supplied `AP Lang Project.md` remains unchanged.

The earlier 162 short MCQs remain in the source data and ontology as legacy fields so saved answer positions retain their meaning. The active interface and its displayed counts use the new bank. New items have versioned, stable IDs and deterministic option order. No existing student drafts or saved responses are erased.

## Assessment design

The College Board CED's public reading and revision samples and current exam overview were checked. Reading questions now use sustained passage context; revision questions specify a purpose and operate on numbered drafts. Proposed revisions are independent of one another. Every option has an explanation. Reference checks corrected sentence-number drift; a length-cue review led to revisions of 27 items and more plausible alternatives.

The reusable `ap-lang-assessment-design` skill now includes references for passage construction, distractor review, source-dependent reasoning, versioned answer storage, themed project design, and analytic rubrics. Both the repository copy and installed copy were updated and validated.

Original practice is not released College Board material. These focused sets are not a full-exam simulation or a calibrated measure of AP difficulty. Automated completeness and interface tests do not establish psychometric validity; student attempts and independent teacher review remain useful for refining difficulty and ambiguity.

## Checks

`npm test` runs ten content checks covering the original lessons and graph, legacy answer compatibility, 22-by-10 question coverage, source references, distinct project briefs, scoring totals, complete downloads, portable ontology references, and the prohibition on gradients.

The production build is tested on `http://127.0.0.1:4175/` with Playwright and axe. Port 4173 belongs to another application and is left untouched.

- `npm run test:browser`: all 243 concept-section routes, student workflows, responsive layouts, navigation, exports, and ten accessibility states.
- `npm run test:assignments`: all 220 active MCQs rendered through 22 sets; question navigation; keyboard input; saved answers across concepts and direct skill pages; complete-set print behavior; downloads; rubric levels; 320–1440px layouts; expanded practice and project accessibility.
- `npm run test:ledger`: planning-ledger persistence, task-specific prompts, workspace links, export, narrow layouts, and accessibility.

Artifacts and screenshots remain in ignored `test-results/`. Automated accessibility checks are not a complete assistive-technology audit.

`npm run build` regenerates the version 2 ontology, including all active questions, their complete source texts, project rubrics, and essay packets. The content-rich JavaScript bundle triggers Vite's size advisory; the build succeeds.

## Interface and storage

The nineteenth-century typography, centered masthead, printer's ornaments, double rules, Roman unit numbers, and pastel palette remain. Fonts are self-hosted [Old Standard TT](https://fontsource.org/fonts/old-standard-tt/about) and [Bodoni Moda SC](https://fontsource.org/fonts/bodoni-moda-sc/about), with licenses included. No gradients or additional favicons were added. The README remains minimal.

The practice library provides direct access to all 22 skill sets. Students can answer one item at a time or show a complete set, with a visible passage, progress, and answer explanations. The optional argument ledger remains available for every essay; it is a planning aid, not a required essay structure.

Student work stays in browser storage, separately for each origin. There is no account synchronization, automatic essay grading, or AP-score prediction. GitHub operations use the GitHub CLI and git.
