import situation from './situation.js'; import audienceWriting from './audience-writing.js';
import claimsReading from './claims-reading.js'; import claimsWriting from './claims-writing.js';
import reasoningReading from './reasoning-reading.js'; import reasoningWriting from './reasoning-writing.js';
import styleReading from './style-reading.js'; import styleWriting from './style-writing.js';
import {stimuli as originalStimuli} from './stimuli.js';
import {conceptStimuli} from './concept-stimuli.js';
import {existingConceptAllocation} from './concept-allocation.js';
import {rawConcepts} from '../nodes.js';
import u1 from './concepts/unit1.js'; import u2 from './concepts/unit2.js'; import u3 from './concepts/unit3.js';
import u4 from './concepts/unit4.js'; import u5 from './concepts/unit5.js'; import u6 from './concepts/unit6.js';
import u7 from './concepts/unit7.js'; import u8 from './concepts/unit8.js'; import u9 from './concepts/unit9.js';

export const stimuli={...originalStimuli,...conceptStimuli};
// Original IDs, option order, wording, and explanations are preserved for saved work.
// Skill reviews are alternate views of these items, never additional counted items.
export const skillSets=[...situation,...audienceWriting,...claimsReading,...claimsWriting,...reasoningReading,...reasoningWriting,...styleReading,...styleWriting].sort((a,b)=>a.skill.localeCompare(b.skill)).map(set=>({...set,questions:set.questions.map((q,i)=>({...q,concept:existingConceptAllocation[set.id][i]}))}));
export const skillSetById=Object.fromEntries(skillSets.map(s=>[s.id,s]));
export const questionBank=[...skillSets.flatMap(s=>s.questions),...u1,...u2,...u3,...u4,...u5,...u6,...u7,...u8,...u9];
export const questionById=Object.fromEntries(questionBank.map(q=>[q.id,q]));
export const conceptSets=[...rawConcepts].sort((a,b)=>a.unit-b.unit).map(n=>({id:n.id,title:n.title,unit:n.unit,questions:questionBank.filter(q=>q.concept===n.id)}));
export const conceptSetById=Object.fromEntries(conceptSets.map(s=>[s.id,s]));
export const setsForConcept=node=>[conceptSetById[node.id]];
export const questionsForConcept=node=>conceptSetById[node.id]?.questions||[];
export const bankNotice='810 original questions: 10 exclusive to each of 81 concepts. Official-skill reviews reuse 220 of these same items, with shared progress. These are focused AP-style exercises, not released questions or a calibrated full-exam simulation.';
