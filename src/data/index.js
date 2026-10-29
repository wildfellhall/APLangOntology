import u1 from './unit1.js'; import u2 from './unit2.js'; import u3 from './unit3.js';
import u4 from './unit4.js'; import u5 from './unit5.js'; import u6 from './unit6.js';
import u7 from './unit7.js'; import u8 from './unit8.js'; import u9 from './unit9.js';
import extensions from './extensions.js';
export * from './framework.js';
export * from './passages.js';

const externalByDomain = {situation:['appeals','visual'],evidence:['toulmin','synthesis'],reasoning:['organization','toulmin','fallacies'],style:['appeals','visual']};
const originalNodes = [...u1,...u2,...u3,...u4,...u5,...u6,...u7,...u8,...u9];
// Keep existing answer orders stable when concepts are inserted into the study path.
const assessmentOrder = Object.fromEntries([...originalNodes,...extensions].map((node,index)=>[node.id,index]));
const unitCounts = {};
const additionalSources = {
  'kairos':['kairos'], 'genre-conventions':['genre'], 'stasis':['stasis'],
  'paraphrase-summary':['paraphrase'], 'ethical-representation':['paraphrase'],
  'primary-secondary':['source-types'],
};
export const concepts = [...originalNodes,...extensions].sort((a,b)=>a.unit-b.unit).map((node,index)=>{
  const practice = {...node.practice};
  for (const [j,kind] of ['read','write'].entries()) {
    const question=node.practice[kind], shift=(assessmentOrder[node.id]*3+j)%4;
    const order=Array.from({length:4},(_,i)=>(i+shift)%4);
    practice[kind]={...question,options:order.map(i=>question.options[i]),rationales:order.map(i=>question.rationales[i]),correct:order.indexOf(0),kind:kind==='read'?'Reading':'Writing & revision',id:`${node.id}-${kind}`};
  }
  unitCounts[node.unit]=(unitCounts[node.unit]||0)+1;
  return {...node,practice,skills:[...new Set([...node.skills,practice.read.skill,practice.write.skill])].sort(),index,indexInUnit:unitCounts[node.unit],sources:[...new Set(['ced',...externalByDomain[node.domain],...(additionalSources[node.id]||[])])]};
});
export const conceptById=Object.fromEntries(concepts.map(n=>[n.id,n]));
const transfers=[
  ['kairos','introductions','informs','The decision window helps determine which opening gives an audience a reason to act.'],
  ['genre-conventions','multimodal-composition','informs','Genre expectations shape how readers move between textual and visual forms.'],
  ['relevance-sufficiency','limitations','extends','Testing the reach of evidence identifies the limits an argument should acknowledge.'],
  ['enthymeme','ethical-representation','tests','Making shared assumptions visible helps a writer distinguish another speaker’s premises from inferred motives.'],
  ['problem-solution','stasis','complements','Locating the real disagreement helps test whether a proposed solution addresses the disputed problem.'],
  ['close-reading','paraphrase-summary','informs','Careful inference and attention to qualifications protect meaning during restatement.'],
  ['rhetorical-shifts','organization','informs','Identifying strategic shifts reveals how a sequence develops its argument.'],
  ['cumulative-periodic','emphasis','extends','Clause placement changes when readers encounter the information receiving emphasis.'],
  ['cohesion-reference','revision','informs','Tracing reference chains reveals where revision can remove unintended ambiguity.'],
  ['primary-secondary','source-conversation','informs','Source roles help distinguish direct evidence from interpretations in a synthesis.'],
  ['antithesis','fallacies','tests','Examining a balanced opposition helps detect whether it unfairly excludes other possibilities.'],
  ['modality-hedging','limitations','informs','Language of possibility and obligation should reflect the reach of available evidence.'],
  ['allusion','audience-values','complements','A shared reference can activate an audience’s assumptions while excluding readers who do not share it.'],
  ['understatement-hyperbole','ethical-representation','tests','Testing how readers distinguish nonliteral language from factual claims supports responsible framing.'],
  ['claims','purpose-message','complements','A message can contain claims; a writer’s purpose explains what presenting those claims seeks to accomplish.'],
  ['rhetorical-situation','synthesis','informs','The situation determines what evidence an audience needs.'],
  ['audience','diction','informs','Word choice anticipates readers’ knowledge and expectations.'],
  ['evidence','quantitative-evidence','extends','Quantitative material requires the same relevance test plus attention to measurement.'],
  ['warrants','qualification','informs','A disputed assumption can reveal where a claim needs limits.'],
  ['tone','irony-satire','extends','A gap between literal voice and implied attitude can produce irony.'],
  ['visual-rhetoric','multimodal-composition','extends','Visual choices become part of a coordinated argument.'],
  ['counterargument','synthesis','informs','Source disagreement can refine the writer’s own position.'],
  ['citation','ethos','informs','Traceable support gives readers grounds for warranted trust.'],
  ['revision','reflection','extends','Explaining revisions turns decisions into transferable learning.'],
  ['complexity','rhetorical-analysis','informs','Analysis can develop tensions between a writer’s purpose and an audience’s constraints.'],
  ['pathos','quantitative-evidence','complements','Individual consequences and patterns can illuminate different dimensions of a claim.'],
  ['definition','source-conversation','informs','Apparent disagreements may depend on different definitions.'],
  ['parallelism','comparison','complements','Balanced syntax can emphasize a meaningful comparison.'],
  ['fallacies','logos','tests','Examining faulty inferences tests the soundness of appeals to reason.'],
];
export const edges=[
  ...concepts.flatMap(n=>n.prerequisites.map(id=>({from:id,to:n.id,type:'prerequisite',reason:`Study ${conceptById[id].title.toLowerCase()} before extending it through ${n.title.toLowerCase()}.`}))),
  ...transfers.map(([from,to,type,reason])=>({from,to,type,reason})),
];
export const connectionsFor=id=>edges.filter(e=>e.from===id||e.to===id);
export const frqPrompt=node=>node.frq.type==='analysis'
  ? 'Read the complete passage below. Compose an essay analyzing how the writer’s rhetorical choices advance the purpose described in the context. Support your interpretation with precise textual evidence and explain the contribution of those choices to a connected argument.'
  : node.frq.type==='synthesis'
  ? `Read all six sources and their introductory notes. ${node.frq.prompt} Build your own argument using material from at least three sources, identify each source you use, and explain how the evidence supports your reasoning.`
  : `${node.frq.prompt} Support your position with specific evidence and explain how that evidence develops your reasoning.`;

export const projectStages = node=>[
  {level:'Remember · Understand',title:'Frame the inquiry',text:`Define ${node.title.toLowerCase()} in your own words. Identify the audience, purpose, and a real disagreement in this project. Record two questions that cannot be answered by definition alone.`},
  {level:'Apply · Create',title:'Compose the perspectives',text:`${node.project.composition} Unless a length is specified above, aim for 450–600 words per substantial text; for three or more perspectives, 350–500 words per perspective is sufficient. Keep opening variants, notices, and visual labels as concise as their function requires. Distinguish invented scenarios from factual claims, and support factual claims with traceable sources.`},
  {level:'Create · Analyze',title:'Build the visual argument',text:`${node.project.visual} Include an accessible text description. Explain how at least three visual decisions carry meaning; artistic technique itself is not the basis of the grade.`},
  {level:'Analyze',title:'Write the rhetorical commentary',text:`${node.project.analysis} Unless otherwise specified, write 500–700 words with at least six quoted or precisely described choices. Link each choice to its mechanism, a plausible audience response, and your purpose.`},
  {level:'Evaluate',title:'Argue, test & revise',text:`${node.project.argument} Unless otherwise specified, write a 500–700 word position essay. Invite a peer to identify the strongest objection, or conduct a two-pass self-review. Make two substantive revisions and preserve before-and-after excerpts with explanations.`},
  {level:'Evaluate · Transfer',title:'Reflect',text:`Respond in 150–200 words to each question: (1) ${node.project.reflection} (2) Which textual and visual choices reinforced or contradicted one another? Cite an example. (3) What would you change for a new audience, and what evidence would test whether that adaptation works?`},
];
