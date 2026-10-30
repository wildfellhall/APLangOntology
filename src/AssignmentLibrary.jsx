import React,{useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {ArrowLeft,ArrowRight,Download} from 'lucide-react';
import {assignments,assignmentById,packets,essayDirections,libraryNotice} from './data/assignments/index.js';
import {essayRubric,sources} from './data/framework.js';
import {BankQuestion} from './SkillPractice.jsx';
import ProjectAssignment from './ProjectAssignment.jsx';
import {libraryAssignmentText} from './library-export.js';
import './assignment-library.css';

export default function AssignmentLibrary({parts,work,patch,Draft,Timer,download,concepts}){
 const a=assignmentById[parts[1]];
 if(!parts[1])return <Directory/>;
 if(!a)return <div className="page"><h1>Assignment not found</h1><a href="#/assignments">Return to the Assignment Library</a></div>;
 const section=['reading','essays','questions','project'].includes(parts[2])?parts[2]:'reading';
 const draft=(kind,label,large=true)=><Draft id={`library-${a.id}-${kind}`} label={label} large={large} value={work.drafts[`library-${a.id}-${kind}`]||''} onChange={value=>patch('drafts',`library-${a.id}-${kind}`,value)} placeholder={kind==='notes'?'Record a question, a textual observation, or a connection…':'Develop your response here…'}/>;
 return <article className="page library-study">
  <div className="library-toolbar"><a className="back-link" href="#/assignments"><ArrowLeft size={15}/>Assignment Library</a><button className="button" onClick={()=>download(`${a.id}-assignment.txt`,libraryAssignmentText(a))}><Download size={15}/>Download assignment</button></div>
  <header className="study-heading"><p className="eyebrow">{a.category} · {a.year}</p><h1>{a.title}</h1><p>{a.author}</p></header>
  <nav className="study-tabs" aria-label="Assignment sections">{[['reading','Reading'],['essays','Essays'],['questions','Questions'],['project','Project']].map(([id,label])=><a key={id} href={`#/assignments/${a.id}/${id}`} aria-current={section===id?'page':undefined}>{label}</a>)}</nav>
  <div className="study-content" key={`${a.id}-${section}`}>
   {section==='reading'?<><PrimaryText a={a}/><details className="study-related"><summary>Related concepts</summary><div>{a.concepts.map(id=><a key={id} href={`#/concept/${id}/learn`}>{concepts[id].title}</a>)}</div></details>{draft('notes','Reading notes',false)}</>:section==='essays'?<Essays a={a} selected={parts[3]} draft={draft} Timer={Timer}/>:section==='questions'?<Questions a={a} work={work} patch={patch}/>:<ProjectAssignment node={a}>{draft('project','Project plan & reflection')}</ProjectAssignment>}
  </div>
 </article>;
}
function Directory(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('all'),[theme,setTheme]=useState('all'),[sort,setSort]=useState('oldest');
 const found=assignments.filter(a=>(category==='all'||category===a.category)&&(theme==='all'||theme===a.theme)&&`${a.title} ${a.author} ${a.year} ${a.focus} ${a.project.title} ${a.project.topics.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):sort==='author'?a.author.localeCompare(b.author):sort==='newest'?b.year-a.year:a.year-b.year);
 return <div className="page assignment-directory"><div className="page-title"><h1>Assignment Library</h1></div><p className="intro-note">Historical texts with three essay prompts, ten reading questions, and a project with a rubric for each study.</p>
  <form className="library-filters" onSubmit={e=>e.preventDefault()} aria-label="Filter assignments"><label className="library-query">Search<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title, author, or topic"/></label><label>Text type<select aria-label="Text type" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All types</option>{['Speech','Legal document','Philosophy'].map(c=><option key={c}>{c}</option>)}</select></label><label>Theme<select aria-label="Theme" value={theme} onChange={e=>setTheme(e.target.value)}><option value="all">All themes</option>{[...new Set(assignments.map(a=>a.theme))].map(t=><option key={t}>{t}</option>)}</select></label><label>Sort by<select aria-label="Sort by" value={sort} onChange={e=>setSort(e.target.value)}><option value="oldest">Oldest first</option><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="author">Author A–Z</option></select></label></form>
  <div className="library-results"><p role="status">{found.length} {found.length===1?'study':'studies'}</p>{(query||category!=='all'||theme!=='all'||sort!=='oldest')&&<button className="text-button" onClick={()=>{setQuery('');setCategory('all');setTheme('all');setSort('oldest');}}>Reset filters</button>}</div>
  <div className="study-index">{found.map(a=><article className="study-entry" key={a.id}><p className="eyebrow">{a.category} · {a.year}</p><h2><a href={`#/assignments/${a.id}/reading`}>{a.title}</a></h2><p className="study-author">{a.author}</p><p>{a.focus}</p><a className="study-open" href={`#/assignments/${a.id}/reading`} aria-label={`Read ${a.title}`}>Open study <ArrowRight size={15}/></a></article>)}</div>
  {!found.length&&<div className="empty-state"><h2>No matching texts</h2><p>Try a broader search or reset the filters.</p></div>}
  <details className="library-method"><summary>About these assignments</summary><p>{libraryNotice}</p><p>The nine synthesis prompts use three shared six-source packets. Historical passages are reproduced with source and selection notes; invented memos and data are labeled. Essay timings are optional, and projects are alternatives.</p><p>Question design follows the reading tasks in the <a href={sources.find(s=>s.id==='ced').url} target="_blank" rel="noreferrer">College Board Course and Exam Description</a>. Original project rubrics are separate from the AP essay scoring guides.</p></details>
 </div>;
}
function PrimaryText({a,compact=false}){return <section className={`primary-text${compact?' compact-reading':''}`} aria-label={`Primary text: ${a.title}`}><h2>{compact?'Primary text':'Read the text'}</h2><p className="passage-context">{a.text.context}</p><details className="edition-note"><summary>Source & selection notes</summary><p>{a.text.edition}</p><p><a href={a.text.url} target="_blank" rel="noreferrer">Read the source at {a.text.publisher}</a> · Checked {a.text.checked}</p><p>Paragraph numbers are editorial reading aids. Historical wording belongs to the source; introductory context and omission notes are supplied by Commonplace.</p></details><div className="passage-prose">{a.text.paragraphs.map((p,i)=><React.Fragment key={i}>{a.text.omissions[i+1]&&<p className="omission-note">[{a.text.omissions[i+1]}]</p>}<p><span className="paragraph-number">{i+1}</span>{a.text.labels[i]&&<strong className="amendment-label">{a.text.labels[i]} </strong>}{p}</p></React.Fragment>)}</div></section>;}
function Essays({a,selected,draft,Timer}){
 const type=['analysis','argument','synthesis'].includes(selected)?selected:'analysis',e=a.essays[type];
 return <section className="study-essays"><label className="essay-choice">Essay type<select aria-label="Essay type" value={type} onChange={event=>{location.hash=`/assignments/${a.id}/essays/${event.target.value}`;}}><option value="analysis">Rhetorical analysis</option><option value="argument">Argument</option><option value="synthesis">Synthesis</option></select></label>
  <section className="library-prompt"><h2>{e.title}</h2><p>{e.prompt}</p><details><summary>Response directions</summary><ul>{essayDirections[type].map(d=><li key={d}>{d}</li>)}</ul><p>No prescribed word count or paragraph count. Develop the reasoning the task requires.</p></details></section>
  {type==='analysis'&&<details className="study-reading-disclosure"><summary>Read the primary text</summary><PrimaryText a={a} compact/></details>}
  {type==='synthesis'&&<Packet packet={packets[e.packet]}/>}
  <Timer key={`${a.id}-${type}`} minutes={e.minutes}/>{draft(type,`Your ${e.title.toLowerCase()} draft`)}
  <details className="library-essay-rubric"><summary>Essay self-review · AP rubric dimensions</summary><p>This condensed guide supports revision; it does not award a score. Consult the <a href={sources.find(s=>s.id==='rubric26').url} target="_blank" rel="noreferrer">official task-specific scoring guidelines</a> for full decision rules.</p>{essayRubric.map(r=><section key={r.title}><h3>{r.title} <span>{r.range}</span></h3><p>{r.text}</p></section>)}</details>
 </section>;
}
function Packet({packet}){
 const root=useRef(null);
 useEffect(()=>{let states=[];const before=()=>{states=[...root.current.querySelectorAll('details')].map(d=>[d,d.open]);states.forEach(([d])=>{d.open=true;});};const after=()=>states.forEach(([d,open])=>{d.open=open;});window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);return()=>{window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};},[]);
 return <section className="library-packet" ref={root}><h3>{packet.title}</h3><p>{packet.context}</p><button className="text-button" onClick={()=>root.current.querySelectorAll('details').forEach(d=>{d.open=true;})}>Open all six sources</button>{packet.sources.map(s=><details className="packet-source" key={s.label}><summary><span className="source-letter">{s.label}</span><span>{s.title}<small>{s.kind}</small></span></summary><p className="source-attribution">{s.attribution} {s.url&&<a href={s.url} target="_blank" rel="noreferrer">Primary source</a>}</p>{s.text.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}{s.table&&<div className="table-scroll" tabIndex={0} role="region" aria-label={s.table.caption}><table><caption>{s.table.caption}</caption><thead><tr>{s.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{s.table.rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th key={j} scope="row">{c}</th>:<td key={j}>{c}</td>)}</tr>)}</tbody></table></div>}{s.diagram&&<figure className="packet-diagram"><h4>{s.diagram.title}</h4><ol>{s.diagram.nodes.map(n=><li key={n}>{n}</li>)}</ol><figcaption>{s.diagram.caption}</figcaption></figure>}{s.note&&<p className="source-limit"><strong>Source note:</strong> {s.note}</p>}</details>)}</section>;
}
function Questions({a,work,patch}){
 const [position,setPosition]=useState(0),[all,setAll]=useState(false);const heading=useRef(null),currentAll=useRef(all),reader=useRef(null);currentAll.current=all;
 useEffect(()=>{let previous=false,readingOpen=true;const before=()=>{previous=currentAll.current;readingOpen=reader.current.open;reader.current.open=true;flushSync(()=>setAll(true));};const after=()=>{setAll(previous);reader.current.open=readingOpen;};window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);return()=>{window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};},[]);
 const checked=a.questions.filter(q=>work.answers[q.id]?.submitted).length,correct=a.questions.filter(q=>work.answers[q.id]?.submitted&&work.answers[q.id].selected===q.correct).length;
 const move=i=>{setPosition(i);requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));};
 return <section className="study-questions"><h2>Reading questions</h2><details className="practice-guidance"><summary>Instructions & practice notes</summary><p>Read the complete selection, then choose the best answer to each question. Use the displayed paragraph numbers. You do not need outside historical or legal knowledge to answer.</p><p>{libraryNotice}</p></details>
  <div className="skill-status"><p role="status">{checked} of 10 checked · {correct} correct</p><label><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)}/>Show all questions</label></div>
  <nav className="question-index" aria-label="Questions in this study">{a.questions.map((q,i)=><button key={q.id} aria-label={`Question ${i+1}${work.answers[q.id]?.submitted?', checked':''}`} aria-current={!all&&position===i?'step':undefined} className={position===i&&!all?'active':''} onClick={()=>{if(all)document.getElementById(`question-${q.id}`).scrollIntoView({block:'start'});else move(i);}}>{i+1}{work.answers[q.id]?.submitted&&<span aria-hidden="true"> ✓</span>}</button>)}</nav>
  <details className="study-reading-disclosure" ref={reader} open><summary>Read the primary text</summary><PrimaryText a={a} compact/></details>
  <h3 className="current-question-heading" tabIndex={-1} ref={heading}>{all?'All 10 questions':`Question ${position+1} of 10`}</h3>
  {(all?a.questions:[a.questions[position]]).map((q,i)=><BankQuestion key={q.id} question={q} index={all?i:position} response={work.answers[q.id]} save={value=>patch('answers',q.id,value)}/>)}
  {!all&&<div className="question-pagination"><button className="button" disabled={position===0} onClick={()=>move(position-1)}><ArrowLeft size={15}/>Previous</button><span>{position+1} / 10</span><button className="button" disabled={position===9} onClick={()=>move(position+1)}>Next<ArrowRight size={15}/></button></div>}
 </section>;
}
