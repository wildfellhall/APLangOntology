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

`npm test` runs twenty content and writing-tool checks covering the original lessons and graph, legacy answer compatibility, 22-by-10 question coverage, source references, distinct project briefs, scoring totals, complete downloads, portable ontology references, and the prohibition on gradients. Writing checks cover published readability formulas, Unicode ranges, conservative grammar exceptions, actual spelling suggestions, stale edits, WordNet senses, lookup recovery, and the ink-and-paper palette.

The production build is tested on `http://127.0.0.1:4175/` with Playwright and axe. Port 4173 belongs to another application and is left untouched.

- `npm run test:browser`: all 243 concept-section routes, student workflows, responsive layouts, navigation, exports, and ten accessibility states.
- `npm run test:assignments`: all 220 active MCQs rendered through 22 sets; question navigation; keyboard input; saved answers across concepts and direct skill pages; complete-set print behavior; downloads; rubric levels; 320–1440px layouts; expanded practice and project accessibility.
- `npm run test:writing`: local worker analysis, explicit corrections and undo/redo, annotated text, personal dictionary, selected-word substitution, saved-assignment round trips, exports, missing assets and retry, oversized drafts, no external requests, responsive layouts, and accessibility.
- `npm run test:ledger`: planning-ledger persistence, task-specific prompts, workspace links, export, narrow layouts, and accessibility.

Artifacts and screenshots remain in ignored `test-results/`. Automated accessibility checks are not a complete assistive-technology audit.

`npm run build` regenerates the version 2 ontology, including all active questions, their complete source texts, project rubrics, and essay packets. The content-rich JavaScript bundle triggers Vite's size advisory; the build succeeds.

## Interface and storage

The nineteenth-century typography, centered masthead, fine rules, Roman unit numbers, and ink-and-paper palette carry the newspaper aesthetic. The former colored pastel fills have been removed across the interface, graph, exported ontology, and favicon. Fonts are self-hosted [Old Standard TT](https://fontsource.org/fonts/old-standard-tt/about) and [Bodoni Moda SC](https://fontsource.org/fonts/bodoni-moda-sc/about), with licenses included. No gradients or additional favicons were added. The README remains minimal.

The practice library provides direct access to all 22 skill sets. Students can answer one item at a time or show a complete set, with a visible passage, progress, and answer explanations. The optional argument ledger remains available for every essay; it is a planning aid, not a required essay structure.

Student work stays in browser storage, separately for each origin. There is no account synchronization, automatic essay grading, or AP-score prediction. GitHub operations use the GitHub CLI and git.

## Writing tools

The writing desk is available from the top navigation and from every essay, project, and notes field. It edits the selected saved document directly. A separate free draft appears in My workspace and its export. Undo/redo history and dismissed review notes are session-local; drafts and the personal spelling dictionary persist in browser storage.

The checker runs in a worker. It estimates Flesch–Kincaid grade and Flesch reading ease, sentence length, syllables, possible passive constructions, adverbs, and selected wordy phrases. Mechanics rules cover repeated words, a/an, selected pronoun agreement, modal + have, I, and spacing. These are limited pattern checks, not a comprehensive grammatical parse, essay evaluation, or AP-score predictor. The interface explains these limits and distinguishes review prompts from errors. Readability estimates require 30 words and three sentences. Analysis accepts up to 100,000 characters without truncating longer saved drafts. Spelling uses a US English dictionary, skips initial capitals, and displays at most 60 spelling notes; a review displays at most 200 notes.

The thesaurus uses Princeton WordNet 3.1. Its 110,543 entries retain senses with at least one alternative, part of speech, definitions, and examples. Exact entries take precedence over inflection fallbacks. Synonym replacement is explicit and verifies the selected range before editing. All processing is local; dictionary assets load from the same site on demand. There are no external lookup or grammar APIs.

`npm run lexicon:build` generates 553 lookup shards, spelling assets, and license notices from pinned lockfile dependencies. It runs before development, tests, and production builds. Generated lexicon assets are ignored by git and included in `dist` during builds. Their combined size is about 29 MB; the browser requests only the relevant shards. The writing interface is loaded separately from the course bundle. WordNet’s complete copyright and permission notice is embedded in every shard, with third-party licenses also available under `public/licenses/`. Delete `public/lexicon/manifest.json` and rebuild if generated assets need to be recreated.

## Interface simplification

The header has six primary destinations, with home on the wordmark and sources in the footer. The homepage leads with the course entry point and a compact unit index. Repeated counters, ornamental flourishes, feature panels, generic section labels, and the header progress count have been removed. The concept-map preview appears on wider screens; its link remains available on phones.

Connected concepts, practice notes, project rubrics, and design references use labeled disclosures. Project requirements, topic suggestions, passages, questions, and correction explanations remain available. Rubrics and practice instructions expand for printing and restore their previous state afterward.

The writing desk shows word count, estimated grade, and long-sentence count first. More statistics and export options are grouped; selection lookup appears when text is selected, and the document selector appears when there are documents to switch between. Extra save messages, repeated headings, and duplicate Locate buttons have been removed. Clicking a quoted review excerpt locates it in the manuscript. Browser checks cover these revised workflows, keyboard access, printing, saved work, and responsive layouts.
