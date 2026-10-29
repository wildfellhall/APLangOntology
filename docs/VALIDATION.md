# Validation

Reviewed October 29, 2026.

## Content

- 81 concepts across nine units; nine concepts per unit.
- 162 original MCQs with four choices and explanations.
- 81 essay assignments: 32 rhetorical analysis, 40 argument, nine synthesis.
- 81 projects combining writing, visual composition, analysis, argument, revision, and reflection.
- 198 typed graph connections; prerequisites are acyclic and precede dependent concepts.
- All 22 College Board skill codes are represented.
- Five complete original analysis passages. Nine synthesis assignments share one six-source simulated packet.
- New references cover kairos, genre, stasis, source roles, and paraphrase. Links appear in the library.

The 18 new concepts have distinct passages, assessments, and projects. The new extended passage is “The notice at the gate.” Existing question IDs and answer orders remain stable so earlier saved responses retain their meaning. The supplied project is unchanged.

Five content test suites pass. These check completeness, skill alignment, graph integrity, saved-answer compatibility, stimulus requirements, and visual constraints. They do not measure instructional effectiveness or exam-equivalent difficulty.

## Browser

The production build is tested locally at http://127.0.0.1:4175/ using Playwright and axe.

- All 243 concept-section routes render their own material.
- Answer feedback, bookmarks, completion, drafts, search, filters, timers, and assignment downloads work.
- Graph and list navigation work. The new bottom row scrolls into view when selected.
- The exported ontology contains 81 concepts and 198 connections.
- Saved work from the original library remains usable after expansion.
- Overview, units, lesson, projects, workspace, and map layouts have no page overflow at 320, 390, 768, 1024, and 1440 pixels.
- Mobile navigation supports Escape and selecting the current page.
- axe reports zero WCAG A/AA violations in ten standard states plus new practice and project pages. No uncaught page errors were recorded.
- Screenshots were reviewed on desktop and mobile.

Browser artifacts stay in ignored `test-results/`. Automated accessibility checks are not a complete assistive-technology audit.

## Build

`npm test` and `npm run build` pass. The build regenerates `public/ontology.json`. Fonts are self-hosted Grenze and DM Sans; license texts are included. Routing uses hashes and assets use relative paths.

## Limits

Student work is stored in the browser, separately for each origin. There is no account synchronization, import interface, automatic essay grading, or AP-score prediction. Essay assignments reuse the supplied stimulus materials. Practice questions are original and are not released College Board items. Projects are alternatives, not a requirement to complete all 81.

GitHub work uses the GitHub CLI. Port 4173 belongs to another application and is left untouched.
