import test from 'node:test';
import assert from 'node:assert/strict';
import {assignments,assignmentById,packets,essayDirections} from '../src/data/assignments/index.js';
import {assignmentDrafts} from '../src/data/assignments/catalog.js';
import {conceptById,skills} from '../src/data/index.js';
import {libraryAssignmentText} from '../src/library-export.js';
test('nine sourced studies cover three categories with complete, distinct learning tasks',()=>{
 assert.equal(assignments.length,9);assert.equal(new Set(assignments.map(a=>a.id)).size,9);
 for(const category of ['Speech','Legal document','Philosophy'])assert.equal(assignments.filter(a=>a.category===category).length,3);
 const questions=assignments.flatMap(a=>a.questions);assert.equal(questions.length,90);assert.equal(new Set(questions.map(q=>q.id)).size,90);assert.equal(new Set(questions.map(q=>q.stem)).size,90);
 const prompts=assignments.flatMap(a=>Object.values(a.essays).map(e=>e.prompt));assert.equal(new Set(prompts).size,27);
 for(const a of assignments){
  assert.ok(a.text.url.startsWith('https://'));assert.ok(a.text.publisher);assert.ok(a.text.edition.length>100);assert.equal(a.text.publicDomain,true);
  assert.ok(a.text.paragraphs.join(' ').split(/\s+/).length>=450);assert.ok(a.text.paragraphs.join(' ').split(/\s+/).length<=1000);
  for(const id of a.concepts)assert.ok(conceptById[id],id);
  for(const n of Object.keys(a.text.omissions))assert.ok(Number(n)>0&&Number(n)<=a.text.paragraphs.length);
  assert.deepEqual(Object.keys(a.essays),['analysis','argument','synthesis']);
  assert.ok(packets[a.essays.synthesis.packet]);assert.match(a.essays.synthesis.prompt,/at least three sources/);
  for(const type of Object.keys(a.essays)){assert.equal(essayDirections[type].length,4);assert.ok(a.essays[type].prompt.length>170);}
  assert.equal(a.questions.length,10);
  for(const q of a.questions){assert.ok(skills[q.skill]);assert.equal(q.kind,'reading');assert.ok(q.paragraph>0&&q.paragraph<=a.text.paragraphs.length);assert.equal(q.options.length,4);assert.equal(q.rationales.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);assert.ok(q.rationales.every(r=>r.trim().length>0));assert.ok(q.options.every(o=>o.length>20));}
  const keys=a.questions.map(q=>q.correct);assert.equal(new Set(keys).size,4);
  assert.equal(a.project.stages.length,6);assert.equal(a.project.topics.length,3);assert.equal(a.project.rubric.reduce((sum,r)=>sum+r.points,0),100);
  assert.ok(a.project.stages.every(s=>s.text.length>180));for(const r of a.project.rubric)for(const level of ['strong','proficient','developing','beginning'])assert.ok(r[level]?.length>50);
 }
 assert.equal(new Set(assignments.map(a=>a.project.title)).size,9);assert.equal(new Set(assignments.map(a=>a.project.rubric[0].strong)).size,9);
});
test('three shared synthesis packets supply all six sources with contrasting texts, quantitative evidence and a described visual',()=>{
 assert.equal(Object.keys(packets).length,3);
 for(const p of Object.values(packets)){
  assert.equal(p.sources.length,6);assert.deepEqual(p.sources.map(s=>s.label),['A','B','C','D','E','F']);
  assert.ok(p.sources.every(s=>s.text.length>120&&s.attribution));assert.ok(p.sources.slice(0,3).every(s=>s.url?.startsWith('https://')));
  assert.ok(p.sources.slice(3).every(s=>s.attribution.includes('fictional')));
  const f=p.sources[5];assert.ok(f.table);assert.ok(f.diagram);assert.equal(f.diagram.nodes.length,4);assert.ok(f.diagram.caption);assert.ok(f.note.length>100);
  assert.ok(f.table.rows.every(row=>row.length===f.table.headers.length));assert.equal(assignments.filter(a=>a.essays.synthesis.packet===p.id).length,3);
 }
 // Explicit scenario totals: use counts, not percentages or a misleading randomized claim.
 assert.equal(packets.rights.sources[5].table.rows.reduce((s,r)=>s+r[2],0),60);
 assert.equal(packets.memory.sources[5].table.rows.reduce((s,r)=>s+r[1],0),40);
});
test('every export contains the full source material, all tasks, rubric levels and separated answer key',()=>{
 for(const a of assignments){const out=libraryAssignmentText(a);for(const p of a.text.paragraphs)assert.ok(out.includes(p));for(const e of Object.values(a.essays))assert.ok(out.includes(e.prompt));for(const s of packets[a.essays.synthesis.packet].sources){assert.ok(out.includes(s.text));if(s.diagram)assert.ok(out.includes(s.diagram.nodes[3]));}for(const q of a.questions){assert.ok(out.includes(q.id));for(const r of q.rationales)assert.ok(out.includes(r));}assert.match(out,/PROJECT RUBRIC · 100 POINTS/);assert.match(out,/Missing or unassessable: 0/);assert.ok(out.indexOf('ANSWER KEY')>out.indexOf('PROJECT RUBRIC'));}
});
test('separate stable draft identifiers resolve to the correct essay and study',()=>{
 assert.equal(assignmentDrafts.length,45);assert.equal(new Set(assignmentDrafts.map(d=>d.id)).size,45);
 for(const d of assignmentDrafts){const id=d.href.split('/')[2];assert.ok(assignmentById[id]);assert.ok(d.id.startsWith(`library-${id}-`));}
 const bill=assignmentDrafts.find(d=>d.id==='library-bill-rights-synthesis');assert.equal(bill.href,'#/assignments/bill-rights/essays/synthesis');
});
