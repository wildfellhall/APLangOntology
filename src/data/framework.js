export const sources = [
  {id:'rubric-design',type:'Teaching & learning',title:'Grading and performance rubrics',publisher:'Carnegie Mellon Eberly Center',url:'https://www.cmu.edu/teaching/designteach/teach/rubrics.html',note:'Analytic criteria with explicit performance levels; the project-specific rubrics here are original classroom tools.'},
  {id:'kairos', type:'Writing & rhetoric', title:'Rhetorical situation and kairos', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/academic_writing/rhetorical_situation/aristotles_rhetorical_situation.html', note:'The relationships among setting, purpose, audience, and rhetorical choices.'},
  {id:'genre', type:'Writing & rhetoric', title:'Genre and reader expectations', publisher:'Writing Commons', url:'https://writingcommons.org/section/genre/', note:'Genre as a social practice shaped by recurring purposes and expectations.'},
  {id:'stasis', type:'Writing & rhetoric', title:'Stasis theory', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/the_writing_process/stasis_theory/index.html', note:'Questions about fact, definition, evaluation, and policy help locate the issue in dispute.'},
  {id:'paraphrase', type:'Writing & rhetoric', title:'Quoting, paraphrasing, and summarizing', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/research_and_citation/using_research/quoting_paraphrasing_and_summarizing/index.html', note:'Distinguishing forms of source use and maintaining attribution.'},
  {id:'source-types', type:'Writing & rhetoric', title:'Primary, secondary, and tertiary sources', publisher:'University of Minnesota Crookston', url:'https://crk.umn.edu/library/primary-secondary-and-tertiary-sources', note:'Source roles depend on the question and the relationship to the evidence.'},
  {id:'ced', type:'College Board', title:'Course and Exam Description', publisher:'College Board', url:'https://apcentral.collegeboard.org/media/pdf/ap-english-language-and-composition-course-and-exam-description.pdf', note:'Official skill codes and nine-unit framework; sample reading and revision questions on printed pages 112–124. Effective fall 2024.'},
  {id:'exam', type:'College Board', title:'Exam format and preparation', publisher:'College Board', url:'https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam', note:'Current exam structure, Bluebook information, and official rubric links.'},
  {id:'frq26', type:'College Board', title:'2026 released free-response questions', publisher:'College Board', url:'https://apcentral.collegeboard.org/media/pdf/ap26-frq-english-language.pdf', note:'Model for prompt architecture: a six-source synthesis packet, contextualized rhetorical analysis, and an open argument.'},
  {id:'rubric26', type:'College Board', title:'2026 scoring guidelines', publisher:'College Board', url:'https://apcentral.collegeboard.org/media/pdf/ap26-sg-english-language.pdf', note:'Official task-specific scoring criteria. Use these to calibrate a self-assessment or a conference with your teacher.'},
  {id:'frq25', type:'College Board', title:'2025 released questions · Set 1', publisher:'College Board', url:'https://apcentral.collegeboard.org/media/pdf/ap25-frq-english-language-set-1.pdf', note:'A second released set used to compare recurring prompt structures across years.'},
  {id:'rubric25', type:'College Board', title:'2025 scoring guidelines · Set 1', publisher:'College Board', url:'https://apcentral.collegeboard.org/media/pdf/ap25-sg-english-language-set-1.pdf', note:'Additional examples of evidence, commentary, and sophistication decisions.'},
  {id:'appeals', type:'Writing & rhetoric', title:'Rhetorical strategies', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/academic_writing/establishing_arguments/rhetorical_strategies.html', note:'Audience-sensitive uses of credibility, reasoning, and emotional appeals.'},
  {id:'toulmin', type:'Writing & rhetoric', title:'Toulmin argument', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/academic_writing/historical_perspectives_on_argumentation/toulmin_argument.html', note:'A useful model for testing the relationship between grounds, warrants, and claims.'},
  {id:'organization', type:'Writing & rhetoric', title:'Organizing your argument', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/academic_writing/establishing_arguments/organizing_your_argument.html', note:'Classical, Rogerian, and Toulmin structures as options, not mandatory essay templates.'},
  {id:'visual', type:'Writing & rhetoric', title:'Visual rhetoric: overview', publisher:'Purdue OWL', url:'https://owl.purdue.edu/owl/general_writing/visual_rhetoric/visual_rhetoric/index.html', note:'Images, typography, and spatial arrangement as rhetorical choices.'},
  {id:'fallacies', type:'Writing & rhetoric', title:'Identifying illogical arguments', publisher:'Vanderbilt Writing Studio', url:'https://www.vanderbilt.edu/writing/resources/handouts/illogical-arguments/', note:'Support for evaluating faulty inferences without reducing analysis to a list of labels.'},
  {id:'synthesis', type:'Writing & rhetoric', title:'Synthesis', publisher:'Missouri S&T Writing and Communication Center', url:'https://writingcenter.mst.edu/resources/literaturereviews/synthesis/', note:'Connecting sources through an argument instead of arranging isolated summaries.'},
  {id:'bloom', type:'Teaching & learning', title:'Bloom’s taxonomy of educational objectives', publisher:'University of Illinois Chicago', url:'https://teaching.uic.edu/blooms-taxonomy-of-educational-objectives/', note:'Basis for the projects’ observable tasks across remembering, understanding, applying, analyzing, evaluating, and creating.'},
];

export const domains = [
  {id:'situation', title:'Rhetorical situation', color:'#f5f1e8', ink:'#242321', short:'Situation'},
  {id:'evidence', title:'Claims & evidence', color:'#e8e2d6', ink:'#242321', short:'Evidence'},
  {id:'reasoning', title:'Reasoning & organization', color:'#d3ccbf', ink:'#242321', short:'Reasoning'},
  {id:'style', title:'Style', color:'#b7afa1', ink:'#242321', short:'Style'},
];

// Concise editorial labels; the codes are College Board's, the descriptions are ours.
export const skills = {
  '1.A':'Read a rhetorical situation','1.B':'Interpret audience appeals',
  '2.A':'Frame beginnings and endings','2.B':'Compose for an audience',
  '3.A':'Read claims and support','3.B':'Locate the governing thesis','3.C':'Read qualifications',
  '4.A':'Support a paragraph claim','4.B':'Develop a defensible thesis','4.C':'Limit and complicate claims',
  '5.A':'Trace reasoning','5.B':'Explain structural coherence','5.C':'Analyze development',
  '6.A':'Develop reasoning and commentary','6.B':'Connect ideas','6.C':'Choose development',
  '7.A':'Interpret stylistic choices','7.B':'Analyze clause relationships','7.C':'Explain mechanics in context',
  '8.A':'Compose a purposeful style','8.B':'Control sentence relationships','8.C':'Use clear conventions',
};

export const units = [
  {id:1, title:'The rhetorical situation', description:'Read the situation. Distinguish a claim from its support.', color:'lavender', skills:['1.A','3.A','4.A']},
  {id:2, title:'Claims, audiences & appeals', description:'Build a defensible position for a particular audience.', color:'sage', skills:['1.B','2.B','3.A','3.B','4.A','4.B']},
  {id:3, title:'Reasoning & development', description:'Examine the connections that make an argument hold.', color:'peach', skills:['3.A','4.A','5.A','6.A','5.C','6.C']},
  {id:4, title:'Reading like a writer', description:'Analyze structure, purpose, and the work of a rhetorical choice.', color:'blue', skills:['1.A','2.A','3.B','4.B','5.C','6.C']},
  {id:5, title:'Organization & style', description:'Guide a reader through a coherent, deliberate argument.', color:'yellow', skills:['5.A','6.A','5.B','6.B','7.A','8.A']},
  {id:6, title:'Sources & synthesis', description:'Bring evidence into conversation and build your own position.', color:'sage', skills:['3.A','4.A','3.B','4.B','7.A','8.A']},
  {id:7, title:'Precision & qualification', description:'Refine what a claim means and how a sentence delivers it.', color:'lavender', skills:['1.A','2.A','3.C','4.C','7.B','8.B','7.C','8.C']},
  {id:8, title:'Rhetorical choices', description:'Adapt a voice and test its effects on different readers.', color:'peach', skills:['1.B','2.B','7.A','8.A','7.B','8.B']},
  {id:9, title:'Complexity & transfer', description:'Test limitations and carry your learning into a new context.', color:'blue', skills:['3.C','4.C']},
];

export const projectRubric = [
  {criterion:'Composition & argument', points:30, strong:'Sustains distinct, audience-aware positions with specific support and defensible limits.', developing:'Positions are identifiable but evidence or audience adaptation remains inconsistent.', beginning:'Positions rely on assertion or repeat one another.'},
  {criterion:'Rhetorical self-analysis', points:25, strong:'Quotes precise choices, explains mechanisms and plausible audience effects, and evaluates alternatives.', developing:'Explains some effects but sometimes labels or summarizes.', beginning:'Lists devices without explaining their contribution.'},
  {criterion:'Visual reasoning', points:20, strong:'Layout, symbols, and sequence do argumentative work; an accessible description conveys the same logic.', developing:'Visuals support the topic but some choices are decorative.', beginning:'Visuals are disconnected from the claim or obscure it.'},
  {criterion:'Evidence & revision', points:15, strong:'Separates fact from invention, represents sources accurately, and makes documented substantive revisions.', developing:'Support is mostly traceable; revision addresses some reasoning problems.', beginning:'Support is untraceable or revision is only cosmetic.'},
  {criterion:'Reflection & transfer', points:10, strong:'Uses examples to assess a changed decision, an unresolved limitation, and transfer to a new situation.', developing:'Describes learning but provides limited evidence of changed decisions.', beginning:'Reports enjoyment or effort without analyzing learning.'},
];

export const essayRubric = [
  {title:'Thesis', range:'0–1', text:'Does the response make a defensible claim that answers the actual task? In rhetorical analysis, the claim must interpret the writer’s choices.'},
  {title:'Evidence & commentary', range:'0–4', text:'Does specific support develop a connected argument, with explanations of how the support justifies each claim? For synthesis, use and identify at least three supplied sources. For analysis, explain how choices work in this situation.'},
  {title:'Sophistication', range:'0–1', text:'Does the argument develop complexity rather than merely announce it? Examine a consequential tension, limitation, or relationship throughout the reasoning. Ornate wording alone does not establish complexity.'},
];

export function q(stem, answers, skill) {
  return {stem, options:answers.map(a=>a[0]), rationales:answers.map(a=>a[1]), correct:0, skill};
}

export function concept(id,title,unit,domain,skillCodes,definition,insight,example,misconception,prerequisites,project,practice,frq) {
  return {id,title,unit,domain,skills:skillCodes.split(' '),definition,insight,example,misconception,prerequisites:prerequisites?prerequisites.split(' '):[],project,practice,frq};
}

export function project(title,brief,composition,visual,analysis,argument,reflection) {
  return {title,brief,composition,visual,analysis,argument,reflection};
}

export const practiceNotice = 'Original AP-style practice. Ten-question MCQ sets practice official skills; they are not released questions or a calibrated exam. All invented passages, people, and data are labeled.';
export const checkedDate = 'October 29, 2026';
