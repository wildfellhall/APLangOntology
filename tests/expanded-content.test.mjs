import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {concepts,skills,questionBank,skillSets,stimuli,questionsForConcept,setsForConcept} from '../src/data/index.js';
import {assignmentText,skillSetText} from '../src/assignment-export.js';

test('all 22 official skills have ten unique complete passage-based items',()=>{
 assert.equal(skillSets.length,22);assert.equal(questionBank.length,220);
 assert.equal(new Set(questionBank.map(q=>q.id)).size,220);
 assert.deepEqual(skillSets.map(s=>s.id),Object.keys(skills));
 for(const set of skillSets){
  assert.equal(set.questions.length,10);
  assert.ok(new Set(set.questions.map(q=>q.stimulus)).size>=3,`${set.id}: practice should transfer between contexts`);
  for(const q of set.questions){
   assert.equal(q.skill,set.skill);assert.equal(q.options.length,4);assert.equal(q.rationales.length,4);
   assert.equal(new Set(q.options).size,4);assert.ok(q.correct>=0&&q.correct<4);
   assert.ok(q.options.every(t=>t.trim()));assert.ok(q.rationales.every(t=>t.length>25));
   const p=stimuli[q.stimulus];assert.ok(p,`${q.id}: missing stimulus`);
   const reading=Number(q.skill[0])%2===1;assert.equal(p.type,reading?'reading':'writing');
   const max=reading?p.paragraphs.length:p.paragraphs.flat().length;
   assert.ok(q.anchor.length&&q.anchor.every(n=>Number.isInteger(n)&&n>0&&n<=max),`${q.id}: invalid anchor`);
   for(const m of q.stem.matchAll(/sentences? (\d+)(?:[–-](\d+))?/g)){
    assert.equal(p.type,'writing');assert.ok(Number(m[1])<=max&&Number(m[2]||m[1])<=max,`${q.id}: invalid sentence reference`);
   }
  }
 }
 for(const p of Object.values(stimuli)){assert.match(p.context,/fictional/i);assert.ok(p.paragraphs.length>=4);assert.ok(p.paragraphs.flat().join(' ').split(/\s+/).length>=(p.type==='reading'?300:180));}
 for(const n of concepts){assert.ok(questionsForConcept(n).length>=10);assert.equal(setsForConcept(n).length,n.skills.length);assert.equal(new Set(questionsForConcept(n).map(q=>q.id)).size,questionsForConcept(n).length);}
 const counts=[0,0,0,0];questionBank.forEach(q=>counts[q.correct]++);assert.ok(counts.every(n=>n>=45&&n<=65));
});

test('every project has a distinct inquiry, topic choices, explicit work, and a scored analytic rubric',()=>{
 assert.equal(new Set(concepts.map(n=>n.project.title)).size,81);
 assert.equal(new Set(concepts.map(n=>n.project.question)).size,81);
 assert.equal(new Set(concepts.map(n=>n.project.composition)).size,81);
 assert.equal(new Set(concepts.map(n=>n.project.rubric[0].strong)).size,81);
 for(const n of concepts){const p=n.project;
  for(const field of ['theme','audience','question','focus','evidence','access'])assert.ok(p[field]?.length>15,`${n.id}: ${field}`);
  assert.equal(p.topics.length,3);assert.equal(new Set(p.topics).size,3);
  assert.equal(p.stages.length,6);assert.ok(p.stages.every(s=>s.text.length>90));
  assert.match(p.composition,/\d+[–-]?\d*[- ]word/);
  assert.equal(p.rubric.length,5);assert.equal(p.rubric.reduce((s,r)=>s+r.points,0),100);
  for(const r of p.rubric)for(const level of ['strong','proficient','developing','beginning'])assert.ok(r[level]?.length>40,`${n.id} ${r.criterion} ${level}`);
 }
});

test('downloads include all required stimuli, assignments, rubric levels, and answer explanations',()=>{
 for(const set of skillSets){const text=skillSetText(set);assert.match(text,/ANSWER KEY/);for(const q of set.questions){assert.ok(text.includes(q.stem));assert.ok(text.includes(q.id));assert.ok(text.includes(stimuli[q.stimulus].context));assert.ok(q.rationales.every(r=>text.includes(r)));}}
 for(const n of concepts){const text=assignmentText(n);assert.ok(text.includes(n.project.title));assert.ok(text.includes('POSSIBLE TOPICS'));assert.ok(text.includes('Missing or unassessable: 0'));assert.ok(text.includes('Proficient'));for(const t of n.project.topics)assert.ok(text.includes(t));assert.ok(questionsForConcept(n).every(q=>text.includes(q.stem)));}
});

test('exported ontology resolves active question sets and includes their source materials',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../public/ontology.json',import.meta.url),'utf8'));
 assert.equal(data.version,2);assert.equal(data.questionBank.length,220);
 const ids=new Set(data.questionBank.map(q=>q.id));
 for(const s of data.skillSets){assert.equal(s.questionIds.length,10);assert.ok(s.questionIds.every(id=>ids.has(id)));}
 for(const n of data.concepts){assert.ok(n.practiceSetIds.every(id=>data.skillSets.some(s=>s.id===id)));assert.equal(n.project.rubric.reduce((s,r)=>s+r.points,0),100);}
 for(const q of data.questionBank)assert.ok(data.stimuli[q.stimulus]);
 assert.ok(data.passages&&data.synthesisPacket.sources.length===6);
});

test('new interface styles preserve the prohibition on gradients',()=>{
 assert.ok(!fs.readFileSync(new URL('../src/assignments.css',import.meta.url),'utf8').includes('gradient('));
});
