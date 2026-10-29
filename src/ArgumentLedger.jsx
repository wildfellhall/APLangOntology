import React, {useEffect,useRef} from 'react';

export const ledgerLabels = {claim:'Claim',grounds:'Evidence & reasoning',objection:'Alternative or objection',qualification:'Qualified claim'};

export default function ArgumentLedger({node,drafts,save,reveal=false}) {
  const ledgerRef=useRef(null);
  useEffect(()=>{if(reveal&&ledgerRef.current){ledgerRef.current.open=true;ledgerRef.current.scrollIntoView({block:'start',behavior:'auto'});}},[reveal,node.id]);
  const analysis=node.frq.type==='analysis';
  const fields=[
    {key:'claim',label:analysis?'Interpretive claim':'Claim',prompt:analysis?'What do the writer’s choices accomplish for this audience?':'What position will your essay defend?'},
    {key:'grounds',label:analysis?'Textual evidence & reasoning':'Evidence & reasoning',prompt:analysis?'Record a precise detail, then explain how it supports your interpretation.':node.frq.type==='synthesis'?'Identify source evidence and explain the connection to your own claim.':'Record a specific example and explain why it supports your claim.'},
    {key:'objection',label:analysis?'Alternative reading':'Counterargument',prompt:analysis?'What other interpretation could the text support? Which detail tests it?':'What is the strongest reasonable objection? What evidence makes it worth considering?'},
    {key:'qualification',label:'Qualified claim',prompt:analysis?'Refine your interpretation to account for a tension or limit in the passage.':'Revise your claim so its limits and conditions respond to the objection.'},
  ];
  const filled=fields.filter(f=>drafts[`${node.id}-ledger-${f.key}`]?.trim()).length;
  function exportLedger(){
    const text=`${node.title}\nARGUMENT LEDGER\n\n${fields.map(f=>`${f.label}\n${drafts[`${node.id}-ledger-${f.key}`]||'—'}`).join('\n\n')}`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));
    const a=document.createElement('a');a.href=url;a.download=`${node.id}-argument-ledger.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <details ref={ledgerRef} className="argument-ledger">
    <summary><span className="ledger-summary-title">Argument ledger</span><span className="ledger-summary-note">{filled?`${filled} of 4 entries saved`:'Plan & examine your reasoning'}</span></summary>
    <div className="ledger-body">
      <p className="ledger-intro">Use these notes to test a line of reasoning. Return to any entry as your interpretation changes; they are not a required essay structure.</p>
      <div className="ledger-grid">{fields.map((field,i)=>{
        const id=`${node.id}-ledger-${field.key}`;
        return <section className="ledger-entry" key={field.key}>
          <div className="ledger-label"><span aria-hidden="true">{['I','II','III','IV'][i]}.</span><label htmlFor={id}>{field.label}</label></div>
          <p id={`${id}-hint`}>{field.prompt}</p>
          <textarea id={id} aria-describedby={`${id}-hint`} value={drafts[id]||''} onChange={e=>save(id,e.target.value)} rows={5}/>
        </section>;
      })}</div>
      <div className="ledger-footer"><span>Saved in My workspace · Drafts & notes</span><button className="text-button" onClick={exportLedger} disabled={!filled}>Export ledger</button></div>
    </div>
  </details>;
}
