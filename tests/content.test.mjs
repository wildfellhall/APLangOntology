import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {concepts,conceptById,edges,skills,units,domains,sources,passages,synthesisPacket,projectStages,projectRubric,frqPrompt} from '../src/data/index.js';

test('every concept has usable lesson, two complete assessments, essay materials, and a distinct project',()=>{
 assert.equal(concepts.length,81);
 assert.equal(new Set(concepts.map(n=>n.id)).size,81);
 assert.equal(new Set(concepts.map(n=>n.project.title)).size,81);
 for(const n of concepts){
  assert.ok(units.some(u=>u.id===n.unit));assert.ok(domains.some(d=>d.id===n.domain));
  for(const key of ['title','definition','insight','example','misconception'])assert.ok(n[key]?.trim(),`${n.id} missing ${key}`);
  for(const [type,q] of Object.entries({read:n.practice.read,write:n.practice.write})){
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.rationales.length,4);
   assert.ok(q.options.every(s=>s.length>0));assert.ok(q.rationales.every(s=>s.length>15));assert.ok(q.correct>=0&&q.correct<4);
   assert.ok(skills[q.skill],`${n.id}: unknown ${q.skill}`);
   assert.equal(Number(q.skill[0])%2,type==='read'?1:0,`${n.id}: ${type} skill category`);
  }
  assert.ok(n.practice.passage.length>100);
  assert.ok(frqPrompt(n).length>150);
  if(n.frq.type==='analysis')assert.ok(passages[n.frq.packet]?.paragraphs.length>=5);
  for(const field of ['title','brief','composition','visual','analysis','argument','reflection'])assert.ok(n.project[field]?.length>10,`${n.id} project ${field}`);
  assert.equal(projectStages(n).length,6);
  assert.ok(n.sources.every(id=>sources.some(s=>s.id===id)));
 }
 for(const u of units){const nodes=concepts.filter(n=>n.unit===u.id);assert.equal(nodes.length,9);assert.deepEqual(nodes.map(n=>n.indexInUnit),Array.from({length:9},(_,i)=>i+1));}
});

test('all official skill codes are covered and relationships resolve without prerequisite cycles',()=>{
 assert.equal(Object.keys(skills).length,22);
 for(const code of Object.keys(skills))assert.ok(concepts.some(n=>n.skills.includes(code)));
 for(const n of concepts){assert.ok(n.skills.every(s=>skills[s]));for(const id of n.prerequisites)assert.ok(conceptById[id].index<n.index,`${n.id}: prerequisite should precede it in the study path`);}
 for(const e of edges){assert.ok(conceptById[e.from]);assert.ok(conceptById[e.to]);assert.notEqual(e.from,e.to);assert.ok(e.reason.length>20);}
 const seen=new Set(),visiting=new Set();
 function visit(id){assert.ok(!visiting.has(id),`cycle at ${id}`);if(seen.has(id))return;visiting.add(id);for(const p of conceptById[id].prerequisites)visit(p);visiting.delete(id);seen.add(id);}
 concepts.forEach(n=>visit(n.id));
});

test('previously saved answer positions retain their meaning after the expansion',()=>{
 const legacyAnswers=[
  ['audience-values',3,'redefining equality in terms of access.'],
  ['source-conversation',1,'potentially compatible requirements for a more usable space.'],
  ['multimodal-composition',2,'makes relationships among inclusion, omission, and power inspectable.'],
 ];
 for(const [id,selected,text] of legacyAnswers){
  const question=conceptById[id].practice.read;
  assert.equal(question.options[selected],text);
  assert.equal(question.correct,selected);
 }
});

test('stimuli and rubric are complete and simulated evidence is disclosed',()=>{
 assert.equal(synthesisPacket.sources.length,6);
 assert.deepEqual(synthesisPacket.sources.map(s=>s.label),['A','B','C','D','E','F']);
 assert.match(synthesisPacket.context,/simulations/);
 assert.ok(synthesisPacket.sources.some(s=>s.table));assert.ok(synthesisPacket.sources.some(s=>s.visual));
 const rows=synthesisPacket.sources.find(s=>s.table).table.rows;
 assert.equal(Number(rows[1][3])/Number(rows[1][2]),.4);
 assert.ok(Math.abs(Number(rows[0][3])/Number(rows[0][2])-.233333)<.00001);
 for(const p of Object.values(passages)){assert.match(p.context,/fictional/);assert.ok(p.paragraphs.join(' ').split(/\s+/).length>380);}
 assert.equal(projectRubric.reduce((sum,r)=>sum+r.points,0),100);
 const counts=[0,0,0,0];concepts.forEach(n=>[n.practice.read,n.practice.write].forEach(q=>counts[q.correct]++));
 assert.ok(counts.every(c=>c>=25),`answer-position distribution: ${counts}`);
});

test('source URLs and visual constraints remain intact',()=>{
 assert.ok(sources.every(s=>new URL(s.url).protocol==='https:'));
 assert.ok(sources.some(s=>s.publisher==='College Board'));
 assert.ok(sources.some(s=>s.publisher==='Purdue OWL'));
 for(const file of ['style.css','period.css'])assert.ok(!fs.readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8').includes('gradient('));
});
