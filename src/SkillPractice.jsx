import React,{useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {ArrowLeft,ArrowRight,Check,RotateCcw,Download} from 'lucide-react';
import {skills} from './data/framework.js';
import {skillSets,skillSetById,stimuli,bankNotice} from './data/mcq/index.js';
import {skillSetText} from './assignment-export.js';

function saveText(name,text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function Stimulus({source}) {
  let sentence=0;
  return <details className="mcq-passage" open>
    <summary>{source.type==='writing'?'Draft':'Reading passage'} · {source.title}</summary>
    <p className="passage-context">{source.context}</p>
    <div className="passage-prose">{source.paragraphs.map((p,i)=><p key={i}>
      {source.type==='reading'?<><span className="paragraph-number">{i+1}</span>{p}</>:p.map(s=>{const number=++sentence;return <React.Fragment key={number}><span className="sentence-number">({number})</span> {s}{' '}</React.Fragment>;})}
    </p>)}</div>
  </details>;
}
export function BankQuestion({question:q,index,response,save}) {
  const selected=response?.selected??null,submitted=!!response?.submitted;
  return <section className="question-card" id={`question-${q.id}`} aria-label={`Question ${index+1}`}>
    <div className="question-meta"><span>QUESTION {index+1} · {q.kind.toUpperCase()}</span><code>{q.skill}</code></div>
    <fieldset disabled={submitted}><legend>{q.stem}</legend>
      {q.options.map((option,i)=><label key={i} className={`answer-option${selected===i?' chosen':''}${submitted&&i===q.correct?' correct':''}${submitted&&selected===i&&i!==q.correct?' incorrect':''}`}>
        <input type="radio" name={q.id} checked={selected===i} onChange={()=>save({selected:i,submitted:false})}/><span className="option-letter">{'ABCD'[i]}</span><span>{option}</span>{submitted&&i===q.correct&&<Check size={17} aria-label="Correct answer"/>}
      </label>)}
    </fieldset>
    {submitted?<div className="answer-feedback" role="status"><strong>{selected===q.correct?'Correct.':`The best answer is ${'ABCD'[q.correct]}.`}</strong><p>{q.rationales[q.correct]}</p><details><summary>Explanation for every choice</summary>{q.rationales.map((r,i)=><p key={i}><strong>{'ABCD'[i]}.</strong> {r}</p>)}</details><button className="text-button" onClick={()=>save({selected:null,submitted:false})}><RotateCcw size={14}/>Try again</button></div>:<button className="button" disabled={selected===null} onClick={()=>save({selected,submitted:true})}>Check answer <ArrowRight size={15}/></button>}
  </section>;
}
export default function SkillPractice({codes,initial,work,patch}) {
  const available=codes||skillSets.map(s=>s.id);
  const [code,setCode]=useState(available.includes(initial)?initial:available[0]);
  const [position,setPosition]=useState(0),[all,setAll]=useState(false);
  const top=useRef(null),questionHeading=useRef(null),printState=useRef(false),allState=useRef(all),guidance=useRef(null),guidancePrintState=useRef(false);allState.current=all;
  useEffect(()=>{const before=()=>{printState.current=allState.current;if(guidance.current){guidancePrintState.current=guidance.current.open;guidance.current.open=true;}flushSync(()=>setAll(true));};const after=()=>{setAll(printState.current);if(guidance.current)guidance.current.open=guidancePrintState.current;};window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);return()=>{window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};},[]);
  useEffect(()=>{setCode(available.includes(initial)?initial:available[0]);setPosition(0);},[codes?.join(','),initial]);
  const set=skillSetById[code]||skillSetById[available[0]];
  const checked=set.questions.filter(q=>work.answers[q.id]?.submitted).length;
  const correct=set.questions.filter(q=>work.answers[q.id]?.submitted&&work.answers[q.id].selected===q.correct).length;
  const current=set.questions[position];
  const visible=all?set.questions:[current];
  const move=(i)=>{setPosition(i);requestAnimationFrame(()=>questionHeading.current?.focus({preventScroll:true}));};
  return <section className="skill-practice" ref={top} aria-label="Multiple-choice skill practice">
    <div className="section-heading"><h2>Reading & revision</h2></div>
    <details className="practice-guidance" ref={guidance}><summary>Instructions & practice notes</summary><p>Read the complete passage before answering. Evaluate each revision independently against the original draft; proposed changes do not carry into later questions.</p><p>{bankNotice}</p><p>Practice accuracy is feedback on this set, not an AP score prediction. Saved answers follow each question across concept pages.</p></details>
    <div className="skill-controls">
      <div className="skill-select"><label htmlFor="practice-skill">Practice skill</label><select id="practice-skill" value={set.id} onChange={e=>{if(!codes){location.hash=`/practice/${e.target.value}`;}else{setCode(e.target.value);setPosition(0);}}}>{available.map(id=><option key={id} value={id}>{id} · {skills[id]}</option>)}</select></div>
      <button className="button" onClick={()=>saveText(`skill-${set.id}-practice.txt`,skillSetText(set))}><Download size={16}/>Download this set</button>
    </div>
    <div className="skill-status"><p aria-live="polite">{checked} of 10 checked · {correct} correct</p><label><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)}/>Show complete set</label></div>
    <nav className="question-index" aria-label="Questions in this skill set">{set.questions.map((q,i)=><button key={q.id} className={`${i===position&&!all?'active ':''}${work.answers[q.id]?.submitted?'answered':''}`} aria-current={!all&&i===position?'step':undefined} aria-label={`Question ${i+1}${work.answers[q.id]?.submitted?', checked':''}`} onClick={()=>{if(all)document.getElementById(`question-${q.id}`)?.scrollIntoView({block:'start',behavior:'auto'});else move(i);}}>{i+1}{work.answers[q.id]?.submitted&&<span aria-hidden="true"> ✓</span>}</button>)}</nav>
    <h3 className="current-question-heading" ref={questionHeading} tabIndex={-1}>{all?'Complete skill set':`Question ${position+1} of 10`}</h3>
    <div className="set-questions">{visible.map((q,i)=><React.Fragment key={q.id}>
      {(!all||i===0||visible[i-1].stimulus!==q.stimulus)&&<Stimulus source={stimuli[q.stimulus]}/>}
      <BankQuestion question={q} index={all?i:position} response={work.answers[q.id]} save={v=>patch('answers',q.id,v)}/>
    </React.Fragment>)}</div>
    {!all&&<div className="question-pagination"><button className="button" disabled={position===0} onClick={()=>move(position-1)}><ArrowLeft size={16}/>Previous</button><span>{position+1} / 10</span><button className="button" disabled={position===9} onClick={()=>move(position+1)}>Next<ArrowRight size={16}/></button></div>}
  </section>;
}
export function SkillDirectory(){return <details className="skill-directory"><summary>Browse all 22 skill sets · 220 questions</summary><div>{skillSets.map(s=><a key={s.id} href={`#/practice/${s.id}`}><code>{s.id}</code><span>{skills[s.id]}</span><small>10 MCQs</small></a>)}</div></details>;}
