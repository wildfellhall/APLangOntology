// Original classroom projects. Content is deliberately authored per concept;
// this helper supplies only shared scoring rules and access provisions.
export function project(p) {
  const [target, partial, missing] = p.criteria;
  return {
    ...p,
    brief:p.question,
    composition:p.compose, visual:p.design, analysis:p.commentary,
    argument:p.test, reflection:p.reflect,
    workload:p.workload || '5–7 class sessions plus research and drafting',
    evidence:'Use at least three traceable sources, including two independent perspectives. Record creator, title, date, location or URL, the claim supported, and a limitation. A primary artifact or a documented observation can count. Clearly label any fictional setting; invented numbers or testimony cannot stand in for research.',
    access:'Paper, slides, a text-only wireframe, or an annotated script are equivalent formats. Include a reading order and a text description of visual relationships. No public posting, purchases, performance, or interviews are required. A peer test can be replaced by two documented readings from contrasting stakeholder positions. Partners may share the artifact; each submits their own commentary and reflection.',
    stages:[
      {title:'Investigate the question',level:'Understand · Evaluate',text:p.inquiry},
      {title:p.composeTitle || 'Compose the central artifact',level:'Apply · Create',text:p.compose},
      {title:p.designTitle || 'Make the visual reasoning visible',level:'Create · Analyze',text:p.design},
      {title:'Examine your rhetorical decisions',level:'Analyze',text:p.commentary+' Write 350–500 words, quoting at least four precise choices from your own artifact. Explain how each choice works, why this audience might respond to it, and what its limits are.'},
      {title:p.testTitle || 'Challenge and revise',level:'Evaluate · Apply',text:p.test+' Preserve two substantive before-and-after changes. In a 250–350 word defense, explain why your final position survives the strongest objection; cite your evidence rather than reporting preference.'},
      {title:'Reflect and transfer',level:'Evaluate · Transfer',text:p.reflect+' Write 250–350 words total. Refer to a specific draft, a test result, and a change you would make for a different audience.'},
    ],
    rubric:[
      {criterion:p.criterionTitle || 'Concept in the composition',points:30,strong:target,proficient:partial,developing:missing,beginning:'The required composition is present but does not yet demonstrate '+p.focus+'.'},
      {criterion:'Visual reasoning & access',points:20,strong:p.designCriterion+' The reading order and text equivalent preserve that reasoning.',proficient:p.designCriterion+' One relationship or access cue remains underexplained.',developing:'The visual includes relevant material, but its arrangement does not yet make the required relationship clear.',beginning:'The visual is mainly decoration or lacks a usable text equivalent.'},
      {criterion:'Evidence & defended position',points:20,strong:'The final defense answers the project question, uses three traceable sources from differing perspectives, addresses the strongest objection, and limits the claim where evidence stops.',proficient:'The defense is supported and sources are traceable, but a consequential objection or source limitation receives only brief treatment.',developing:'Sources are listed or quoted, but the defense leaves gaps between evidence and its claims.',beginning:'The position is asserted; factual claims or invented material are not reliably identified.'},
      {criterion:'Rhetorical self-analysis',points:15,strong:'Four precise choices are analyzed through mechanism, plausible audience effect, and purpose; an alternative interpretation is tested against the artifact.',proficient:'Four choices are explained in context, but one effect or alternative reading is insufficiently supported.',developing:'The commentary identifies choices and intended effects but often skips how the language or arrangement produces those effects.',beginning:'The commentary mainly retells the artifact or lists devices.'},
      {criterion:'Testing, revision & reflection',points:15,strong:'The specified test examines a genuine uncertainty; two substantial revisions respond to evidence; reflection explains a remaining limitation and a workable transfer.',proficient:'The test informs two revisions; reflection explains their effects but gives a general transfer or limitation.',developing:'Testing or revision is documented, but the link between feedback, changes, and learning is weak.',beginning:'Changes are mostly cosmetic and reflection reports effort rather than examining decisions.'},
    ],
  };
}
export const rubricScoring = 'For each criterion, select the best-supported level: Accomplished = 100% of its points; Proficient = 80%; Developing = 60%; Beginning = 40%; Missing or unassessable = 0%. Add the five criterion scores for a total out of 100. Judge the submitted evidence, not agreement with a position or artistic expense. This classroom rubric is independent of the AP essay rubric.';
