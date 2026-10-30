// Authors supply the intended answer first; publication assigns stable option order.
export function question(skill,paragraph,stem,choices,reasons){return {skill,paragraph,stem,options:choices.split('|'),rationales:reasons.split('|'),kind:'reading'};}
export function finalizeQuestions(id,items){
 let seed=2166136261;for(const c of `library-v1-${id}`)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const random=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
 const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const slots=shuffle([0,1,2,3,0,1,2,3,...shuffle([0,1,2,3]).slice(0,2)]);
 return items.map((q,i)=>{const order=shuffle([1,2,3]);order.splice(slots[i],0,0);return {...q,id:`library-v1-${id}-${i+1}`,options:order.map(j=>q.options[j]),rationales:order.map(j=>q.rationales[j]),correct:slots[i]};});
}
