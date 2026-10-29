import React,{useEffect,useRef} from 'react';
import {Clock3,ArrowUpRight} from 'lucide-react';
import {rubricScoring} from './data/projects/index.js';
import {sources} from './data/framework.js';
export default function ProjectAssignment({node:n,children}) {
  const p=n.project,rubric=useRef(null);
  useEffect(()=>{let wasOpen=false;const before=()=>{if(rubric.current){wasOpen=rubric.current.open;rubric.current.open=true;}};const after=()=>{if(rubric.current)rubric.current.open=wasOpen;};window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);return()=>{window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};},[]);
  return <>
    <div className="project-hero"><span className="eyebrow">{p.theme}</span><h2>{p.title}</h2><p>{p.question}</p><div className="project-meta"><span><Clock3 size={16}/>{p.workload}</span><span>Individual or pair</span></div></div>
    <section className="project-brief"><h3>The situation</h3><p><strong>Audience:</strong> {p.audience}.</p><p><strong>Focus:</strong> {p.focus}.</p></section>
    <section className="topic-suggestions"><h3>Possible topics</h3><p>Choose one of these subjects or propose a comparable topic. You will decide the position, evidence, and form within the assignment’s requirements.</p><ul>{p.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></section>
    <details className="project-preparation" open><summary>Research, materials & access</summary><p>{p.evidence}</p><p>{p.access}</p><p>Complete one project as an extended inquiry. The library’s projects are alternatives, not a sequence of 81 required submissions.</p></details>
    <div className="project-stages">{p.stages.map((stage,i)=><section className="project-stage" key={stage.title}><span className="stage-number">{i+1}</span><div><h3>{stage.title}</h3><p>{stage.text}</p></div></section>)}</div>
    <details className="assessment-details" ref={rubric}><summary>Project assessment · 100 points</summary><p>{rubricScoring}</p><p>Each partner is assessed on the shared artifact and their own commentary, defense, and reflection. A score assesses the work, not the position taken.</p>{p.rubric.map(r=><section className="project-rubric-row" key={r.criterion}><h4>{r.criterion}<span>{r.points} pts</span></h4><dl>{[['Accomplished',r.strong,1],['Proficient',r.proficient,.8],['Developing',r.developing,.6],['Beginning',r.beginning,.4]].map(([label,text,ratio])=><React.Fragment key={label}><dt>{label} · {r.points*ratio} pts</dt><dd>{text}</dd></React.Fragment>)}<dt className="missing-level">Missing or unassessable · 0 pts</dt></dl></section>)}</details>
    {children}
    <details className="source-mini project-references"><summary>Design references</summary>{['bloom','visual','rubric-design'].map(id=>{const s=sources.find(x=>x.id===id);return s&&<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.publisher} · {s.title}<ArrowUpRight size={14}/></a>;})}</details>
  </>;
}
