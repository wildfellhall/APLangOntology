import {sources,essayRubric} from './data/framework.js';
import {passages,synthesisPacket} from './data/passages.js';
import {frqPrompt} from './data/index.js';
import {stimuli,setsForConcept,bankNotice} from './data/mcq/index.js';
import {rubricScoring} from './data/projects/index.js';

export function stimulusText(s){let number=0;return `${s.title}\n${s.context}\n\n${s.paragraphs.map((p,i)=>s.type==='reading'?`[Paragraph ${i+1}] ${p}`:p.map(t=>`(${++number}) ${t}`).join(' ')).join('\n\n')}${s.figure?`\n\nFIGURE: ${s.figure.caption}\nText equivalent: ${s.figure.alt}\nFigure file: ${s.figure.src}`:''}`;}
const questionText=(q,i)=>`${i+1}. [${q.skill}; ${stimuli[q.stimulus].title}] ${q.stem}\n${q.options.map((v,j)=>`${'ABCD'[j]}. ${v}`).join('\n')}`;
const keyText=(q,i)=>`${i+1}. ${'ABCD'[q.correct]} · ${q.id}\n${q.rationales.map((v,j)=>`${'ABCD'[j]}. ${v}`).join('\n')}`;
export function skillSetText(set){
  const texts=[...new Set(set.questions.map(q=>q.stimulus))];
  return `COMMONPLACE · ${set.title||`SKILL ${set.id}`}\n10 QUESTIONS\n${bankNotice}\nRead each supplied text before answering its questions. For revision items, evaluate each proposed change independently against the original draft.\n\n${texts.map(id=>stimulusText(stimuli[id])).join('\n\n')}\n\nQUESTIONS\n${set.questions.map(questionText).join('\n\n')}\n\nANSWER KEY — review after attempting\n${set.questions.map(keyText).join('\n\n')}\n`;
}
export function projectText(p){return `PROJECT: ${p.title}\nTheme: ${p.theme}\nQuestion: ${p.question}\nAudience: ${p.audience}\nFocus: ${p.focus}\nWorkload: ${p.workload}\n\nPOSSIBLE TOPICS\n${p.topics.map(t=>`- ${t}`).join('\n')}\nThese are topics, not completed project examples. Choose your own position and evidence.\n\nRESEARCH\n${p.evidence}\n\nMATERIALS & ACCESS\n${p.access}\n\n${p.stages.map((s,i)=>`${i+1}. ${s.title} (${s.level})\n${s.text}`).join('\n\n')}\n\nPROJECT RUBRIC · 100 POINTS\n${rubricScoring}\n\n${p.rubric.map(r=>`${r.criterion} (${r.points} points)\nAccomplished (${r.points}): ${r.strong}\nProficient (${r.points*.8}): ${r.proficient}\nDeveloping (${r.points*.6}): ${r.developing}\nBeginning (${r.points*.4}): ${r.beginning}\nMissing or unassessable: 0`).join('\n\n')}`;}
export function assignmentText(n){
  let text=`COMMONPLACE · AP ENGLISH LANGUAGE\n${n.title}\nUnit ${n.unit} · Skills ${n.skills.join(', ')}\n\nLESSON\n${n.definition}\n${n.insight}\n\nExample: ${n.example}\nDistinction: ${n.misconception}\n\nPRACTICE\n${bankNotice}\nRevision items are independent: evaluate each proposed change against the original draft.\n`;
  const sets=setsForConcept(n),questions=sets.flatMap(s=>s.questions);
  for(const id of new Set(questions.map(q=>q.stimulus)))text+=`\n${stimulusText(stimuli[id])}\n`;
  for(const set of sets)text+=`\n${set.title||`SKILL ${set.id}`} · QUESTIONS\n${set.questions.map(questionText).join('\n\n')}\n`;
  text+=`\nESSAY\n${frqPrompt(n)}\nFocus: ${n.frq.focus}\n`;
  if(n.frq.type==='analysis'){const p=passages[n.frq.packet];text+=`\n${p.title}\n${p.context}\n${p.paragraphs.map((v,i)=>`[${i+1}] ${v}`).join('\n\n')}\n`;}
  if(n.frq.type==='synthesis'){text+=`\n${synthesisPacket.context}\n`;for(const s of synthesisPacket.sources)text+=`\nSOURCE ${s.label}: ${s.title}\n${s.attribution}\n${s.text}\n${s.table?[s.table.headers,...s.table.rows].map(r=>r.join(' | ')).join('\n'):''}${s.visual?'\nVisual text equivalent: Current parking separates the bus stop and civic entrance. Proposed layout connects them with a pedestrian route through trees and seating, retaining parking at one edge.':''}\n`;}
  text+=`\n${projectText(n.project)}\n\nESSAY SELF-REVIEW\n${essayRubric.map(r=>`${r.title} (${r.range}): ${r.text}`).join('\n')}\n\nANSWER KEY — review after attempting\n`;
  for(const set of sets)text+=`\n${set.title||`SKILL ${set.id}`}\n${set.questions.map(keyText).join('\n\n')}\n`;
  text+=`\nSOURCES\n${sources.map(s=>`${s.title}: ${s.url}`).join('\n')}`;
  return text;
}
