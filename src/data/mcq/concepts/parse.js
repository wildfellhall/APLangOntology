// New canonical items; existing ap-v2 IDs and their saved option order remain unchanged.
export function parseConceptBank(raw){
 const counts={};const out=[];let concept,stimulus,skill,anchor;
 for(const line of raw.trim().split('\n').map(s=>s.trim()).filter(Boolean)){
  if(line.startsWith('@')){const parts=line.slice(1).split('|');[concept,stimulus,skill]=parts;anchor=(parts[3]||'').split(',').filter(Boolean).map(Number);continue;}
  const [stem,...cells]=line.split('|');if(cells.length!==4)throw Error(`Four options required: ${concept}: ${stem}`);
  const ordinal=counts[concept]=(counts[concept]||0)+1;const id=`lang-v3-${concept}-${ordinal}`;
  const authored=cells.map(cell=>{const [option,rationale]=cell.split('~');if(!option||!rationale)throw Error(id);return {option,rationale};});
  const seed=[...id].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,11);
  const orders=[[0,2,3,1],[2,0,1,3],[3,1,0,2],[1,3,2,0]];const order=orders[seed%4];
  out.push({id,concept,stimulus,skill,anchor,kind:Number(skill[0])%2?'Reading':'Writing & revision',stem,options:order.map(i=>authored[i].option),rationales:order.map(i=>authored[i].rationale),correct:order.indexOf(0)});
 }
 return out;
}
