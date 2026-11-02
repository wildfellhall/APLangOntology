import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {concepts,skills,questionBank,skillSets,conceptSets,stimuli,questionsForConcept,setsForConcept} from '../src/data/index.js';
import {assignmentText,skillSetText} from '../src/assignment-export.js';

test('81 concepts have ten exclusive passage-based items and preserve official-skill coverage',()=>{
 assert.equal(skillSets.length,22);assert.equal(conceptSets.length,81);assert.equal(questionBank.length,810);
 assert.equal(new Set(questionBank.map(q=>q.id)).size,810);
 const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
 assert.equal(new Set(questionBank.map(q=>normalize(q.stem))).size,810,'Repeated question stems');
 assert.deepEqual(skillSets.map(s=>s.id),Object.keys(skills));
 for(const set of skillSets){assert.equal(set.questions.length,10);assert.ok(set.questions.every(q=>q.skill===set.skill));}
 for(const q of questionBank){
  assert.ok(skills[q.skill]);assert.equal(q.options.length,4);assert.equal(q.rationales.length,4);
  assert.equal(new Set(q.options.map(s=>s.toLowerCase().trim())).size,4);assert.ok(q.correct>=0&&q.correct<4);
  assert.ok(q.options.every(t=>t.trim()));assert.ok(q.rationales.every(t=>t.length>25),q.id);
  const p=stimuli[q.stimulus];assert.ok(p,`${q.id}: missing stimulus`);
  const reading=Number(q.skill[0])%2===1;assert.equal(p.type,reading?'reading':'writing',q.id);
  const max=reading?p.paragraphs.length:p.paragraphs.flat().length;
  assert.ok(q.anchor.length&&q.anchor.every(n=>Number.isInteger(n)&&n>0&&n<=max),`${q.id}: invalid anchor`);
  for(const m of q.stem.matchAll(/sentences? (\d+)(?:[–-](\d+))?/g)){
   assert.equal(p.type,'writing',q.id);assert.ok(Number(m[1])<=max&&Number(m[2]||m[1])<=max,`${q.id}: invalid sentence reference`);
  }
  for(const m of q.stem.matchAll(/paragraphs? (\d+)/g))assert.ok(Number(m[1])<=p.paragraphs.length,q.id);
 }
 for(const p of Object.values(stimuli)){
  assert.match(p.context,/fictional/i);assert.ok(p.paragraphs.length>=4);
  assert.ok(p.paragraphs.flat().join(' ').split(/\s+/).length>=(p.type==='reading'&&!p.sourceId?300:180),p.id);
  if(p.figure){assert.ok(p.figure.alt.length>100);assert.ok(fs.existsSync(new URL('../public'+p.figure.src,import.meta.url)));}
 }
 const exclusive=[];
 for(const n of concepts){
  const qs=questionsForConcept(n);assert.equal(qs.length,10,n.id);assert.equal(setsForConcept(n).length,1);
  assert.ok(qs.every(q=>q.concept===n.id&&n.skills.includes(q.skill)),n.id);exclusive.push(...qs.map(q=>q.id));
 }
 assert.equal(new Set(exclusive).size,810,'A question belongs to more than one concept');
 const counts=[0,0,0,0];questionBank.forEach(q=>counts[q.correct]++);assert.ok(counts.every(n=>n>=180&&n<=225));
});

test('previous question wording, answer order, and saved-answer semantics remain unchanged',()=>{
 const prior=skillSets.flatMap(s=>s.questions).map(({concept,...q})=>q);
 const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
 assert.equal(hash(prior),'bd4477a2be97a86059b315215d3a9f52dcec3d024c667d8a95fbdf1f0f2aa381');
 assert.equal(hash(concepts.map(n=>[n.id,n.practice])),'a7811e67796a5aa9e59916dded6dcb8c0b786e53f92107f7e92783f0e036d0ac');
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
 for(const set of [...skillSets,...conceptSets]){const text=skillSetText(set);assert.match(text,/ANSWER KEY/);for(const q of set.questions){assert.ok(text.includes(q.stem));assert.ok(text.includes(q.id));assert.ok(text.includes(stimuli[q.stimulus].context));assert.ok(q.rationales.every(r=>text.includes(r)));}}
 for(const n of concepts){const text=assignmentText(n);assert.ok(text.includes(n.project.title));assert.ok(text.includes('POSSIBLE TOPICS'));assert.ok(text.includes('Missing or unassessable: 0'));assert.ok(text.includes('Proficient'));for(const t of n.project.topics)assert.ok(text.includes(t));assert.ok(questionsForConcept(n).every(q=>text.includes(q.stem)));}
});

test('exported ontology resolves active question sets and includes their source materials',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../public/ontology.json',import.meta.url),'utf8'));
 assert.equal(data.version,3);assert.equal(data.questionBank.length,810);assert.equal(data.conceptSets.length,81);
 const ids=new Set(data.questionBank.map(q=>q.id));
 for(const s of [...data.skillSets,...data.conceptSets]){assert.equal(s.questionIds.length,10);assert.ok(s.questionIds.every(id=>ids.has(id)));}
 for(const n of data.concepts){assert.ok(n.practiceSetIds.every(id=>data.conceptSets.some(s=>s.id===id)));assert.equal(n.project.rubric.reduce((s,r)=>s+r.points,0),100);}
 for(const q of data.questionBank)assert.ok(data.stimuli[q.stimulus]);
 assert.ok(data.passages&&data.synthesisPacket.sources.length===6);
});

test('new interface styles preserve the prohibition on gradients',()=>{
 assert.ok(!fs.readFileSync(new URL('../src/assignments.css',import.meta.url),'utf8').includes('gradient('));
});
