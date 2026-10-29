import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import NSpell from 'nspell';
import {analyzeText,wordsIn,sentencesIn,readingScores,articleFor,spellingIssues,applyReplacement,highlightSegments,MAX_ANALYSIS_CHARS} from '../src/tools/analyze.js';
import {normalizeEntry,lemmaCandidates,shardKey} from '../src/tools/lexicon-key.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const rules=text=>analyzeText(text).issues.map(i=>i.rule);

test('readability matches the published Flesch–Kincaid example and handles empty input',()=>{
 assert.ok(Math.abs(readingScores({words:13,sentences:1,syllables:26}).grade-13.08)<1e-9);
 assert.deepEqual(readingScores({words:0,sentences:0,syllables:0}),{grade:null,ease:null});
 assert.equal(readingScores({words:10,sentences:2,syllables:10}).ease,117.16000000000003);
 for(const text of ['', '  \n', '!!!']){const a=analyzeText(text);assert.equal(a.stats.words,0);assert.equal(a.stats.grade,null);assert.equal(a.stats.enoughForEstimate,false);}
 assert.equal(analyzeText('A little text.').stats.enoughForEstimate,false);
 assert.equal(analyzeText(('We can see the trees and the birds by the lake. ').repeat(3)).stats.enoughForEstimate,true);
});
test('word and sentence ranges preserve Unicode, quotes, abbreviations, decimals, and paragraphs',()=>{
 const text='  Dr. Smith said, “Wait.”\nA café costs 3.50 dollars!\n\nWe don’t know—yet.  ';
 const sentences=sentencesIn(text);assert.equal(sentences.length,3);
 for(const s of sentences)assert.equal(text.slice(s.start,s.end),s.text);
 for(const w of wordsIn('🙂 café don’t re-enter 19th'))assert.equal('🙂 café don’t re-enter 19th'.slice(w.start,w.end),w.text);
 assert.equal(sentencesIn('The U.S. delegation arrived. It left.').length,2);
 assert.equal(analyzeText(text).stats.paragraphs,2);
});
test('grammar checks find correctable patterns without penalizing common exceptions',()=>{
 const text='i could of seen the the notice. They has a opportunity,however it was a honest effort.';
 for(const rule of ['pronoun-i','modal-have','repeated-word','agreement','article','space-after-punctuation'])assert.ok(rules(text).includes(rule),rule);
 assert.ok(!rules('They had had enough evidence that that claim was false. If she were here, she could help.').includes('repeated-word'));
 assert.ok(!rules('If she were here, she would help.').includes('agreement'));
 assert.ok(!rules('Does she have time? What did he do? I recommend that he have another chance.').includes('agreement'));
 assert.ok(!rules('We would of course agree.').includes('modal-have'));
 for(const word of ['hour','honest','MBA','MRI','x-ray'])assert.equal(articleFor(word),'an',word);
 for(const word of ['university','union','unique','unit','user','one','European','utility','ubiquitous','utensil','euphemism'])assert.equal(articleFor(word),'a',word);
 for(const word of ['NASA','herb','historic'])assert.equal(articleFor(word),null,word);
 for(const text of ['an hour','a university','a union','a unique opportunity','an MBA','an honest person'])assert.ok(!rules(text).includes('article'),text);
});
test('complexity and style distinguish tentative review prompts from mechanics',()=>{
 const text='The report was written quickly. The lovely family was early. '+('The editor examined each claim, considered its context, and requested several revisions before the column could appear in the newspaper alongside the other arguments submitted by residents.');
 const a=analyzeText(text);assert.equal(a.stats.passives,1);assert.equal(a.stats.adverbs,1);assert.equal(a.stats.long,1);
 assert.equal(a.issues.find(i=>i.rule==='possible-passive').category,'style');
 assert.ok(a.issues.find(i=>i.rule==='long-sentence').message.includes('deliberate'));
 assert.ok(!rules('She is a writer. They are ready.').includes('possible-passive'));
});
test('large drafts are preserved and stale replacements cannot edit the wrong text',()=>{
 const text='a'.repeat(MAX_ANALYSIS_CHARS+1);assert.equal(analyzeText(text).tooLong,true);assert.equal(text.length,MAX_ANALYSIS_CHARS+1);
 const original='🙂 The the claim.',issue=analyzeText(original).issues.find(i=>i.rule==='repeated-word');
 assert.equal(applyReplacement(original,issue,'The'),'🙂 The claim.');
 assert.equal(applyReplacement('A new beginning. '+original,issue,'The'),null);
});
test('overlapping annotations retain every original character and prioritize mechanics',()=>{
 const text='The the proposal was written quickly in order to help the many people who had sent the newspaper letters about the issue that mattered most to them.';
 const a=analyzeText(text),segments=highlightSegments(text,a.issues);
 assert.equal(segments.map(s=>s.text).join(''),text);assert.equal(segments[0].issue.category,'grammar');
 assert.equal(highlightSegments('',[]).length,0);
});
test('real spelling dictionary suggests a correction and accepts names, valid words, and personal terms',()=>{
 const spell=NSpell(read('public/lexicon/en.aff'),read('public/lexicon/en.dic'));
 const notes=spellingIssues('We recieve evidence from Ada and NASA about rhetoric and codexword.',spell,['codexword']);
 assert.equal(notes.length,1);assert.equal(notes[0].excerpt,'recieve');assert.ok(notes[0].replacements.includes('receive'));
});
test('lexicon preserves WordNet senses, parts of speech, examples, and licensing',()=>{
 const manifest=JSON.parse(read('public/lexicon/manifest.json'));assert.ok(manifest.entries>110000);assert.ok(manifest.shards.length>500);
 for(const word of ['good','run','deliberate','clear']){const data=JSON.parse(read(`public/lexicon/${shardKey(word)}.json`));assert.ok(data.license.includes('Copyright 2011'));assert.ok(data.license.includes('Permission to use'));assert.ok(data.entries[word].length>1);for(const s of data.entries[word]){assert.ok(s.definition.length>3);assert.ok(['noun','verb','adjective','adverb'].includes(s.pos));assert.ok(s.synonyms.length);assert.ok(s.synonyms.every(x=>normalizeEntry(x)!==word));}}
 const clear=JSON.parse(read('public/lexicon/cl.json')).entries.clear;assert.ok(new Set(clear.map(s=>s.pos)).size>1);
 assert.equal(normalizeEntry('  CAFÉ_au_lait '),'cafe au lait');
 assert.equal(lemmaCandidates('written')[1],'write');assert.ok(lemmaCandidates('running').includes('run'));assert.ok(lemmaCandidates('studies').includes('study'));assert.equal(lemmaCandidates('better')[0],'better');
});
test('thesaurus lookup validates input, uses exact senses before inflections, and retries a failed shard',async()=>{
 const originalFetch=globalThis.fetch;let fail=true,requests=[];
 globalThis.fetch=async url=>{const parsed=new URL(url);assert.equal(parsed.origin,'https://local.example');requests.push(parsed.pathname);if(parsed.pathname.endsWith('/de.json')&&fail){fail=false;return {ok:false};}return {ok:true,json:async()=>JSON.parse(read('public'+parsed.pathname.replace('/app','')))};};
 try{const {lookupWord}=await import('../src/tools/thesaurus.js?test');const base='https://local.example/app/';
  assert.equal((await lookupWord('<script>',base)).invalid,true);assert.equal(requests.length,0);
  const exact=await lookupWord('running',base);assert.equal(exact.word,'running');
  const inflected=await lookupWord('written',base);assert.ok(['written','write'].includes(inflected.word));assert.ok(inflected.senses.length);
  assert.deepEqual((await lookupWord('zznotawordzz',base)).senses,[]);
  await assert.rejects(()=>lookupWord('deliberate',base));assert.ok((await lookupWord('deliberate',base)).senses.length);
  const count=requests.length;await lookupWord('deliberate',base);assert.equal(requests.length,count);
 }finally{globalThis.fetch=originalFetch;}
});
test('palette uses only low-chroma ink and paper without gradients',()=>{
 for(const file of ['src/style.css','src/period.css','src/assignments.css','src/newspaper.css','src/clarity.css','src/writing-tools.css','src/data/framework.js']){
  const source=read(file);assert.ok(!/(?:linear|radial|conic)-gradient\s*\(/i.test(source));
  for(const [,hex] of source.matchAll(/#([a-f0-9]{6})(?:[a-f0-9]{2})?\b/gi)){const c=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));assert.ok(Math.max(...c)-Math.min(...c)<=25,`${file}: #${hex}`);}
 }
});
