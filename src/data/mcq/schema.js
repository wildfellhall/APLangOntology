// The authored best answer is first; a stable ID-based permutation removes key-position cues.
export function item(stimulus,stem,choices,reasons,anchor) {
  const options=choices.split('|'),rationales=reasons.split('|');
  if(options.length!==4||rationales.length!==4)throw new Error('Four choices and rationales required: '+stem);
  return {stimulus,stem,options,rationales,anchor};
}
export function set(skill,questions) {
  return {id:skill,skill,questions:questions.map((q,i)=>{
    const id=`ap-v2-${skill}-${i+1}`;
    const hash=[...id].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0);
    const orders=[[0,2,3,1],[2,0,1,3],[3,1,0,2],[1,3,2,0]];
    const order=orders[hash%4];
    return {...q,id,skill,kind:Number(skill[0])%2?'Reading':'Writing & revision',options:order.map(j=>q.options[j]),rationales:order.map(j=>q.rationales[j]),correct:order.indexOf(0)};
  })};
}
