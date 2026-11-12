export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const acrosticLetters=(seed)=>[...seed.toUpperCase()];
export function scoreWord(word, golden){
 const w=word.toUpperCase();
 if(!/^[A-Z]{3,20}$/.test(w))return 0;
 return w.length*10;
}
export function scoreEstimate(guess,actual){
 if(!Number.isFinite(guess)||guess<0||!Number.isFinite(actual)||actual<=0) return 0;
 const relative=Math.abs(guess-actual)/actual;
 return Math.round(1000*Math.exp(-2.8*relative));
}
export function estimateLabel(guess,actual){
 if(guess===actual)return 'Exact answer';
 const pct=Math.abs(guess-actual)/actual*100;
 return `${pct.toFixed(1)}% ${guess>actual?'above':'below'} the answer`;
}
export function scoreRanking(order,correct){
 if(order.length!==correct.length || new Set(order).size!==correct.length || order.some(x=>!correct.includes(x))) throw Error('Invalid ranking');
 const positions=new Map(correct.map((x,i)=>[x,i]));
 const displacement=order.reduce((sum,x,i)=>sum+Math.abs(i-positions.get(x)),0);
 const correctPlaces=order.filter((x,i)=>correct[i]===x).length;
 const maxDisplacement=Math.floor(correct.length*correct.length/2);
 const proximity=Math.round(700*(1-displacement/maxDisplacement));
 return {points:proximity+(displacement===0?300:0),correctPlaces,displacement,perfect:displacement===0};
}
export function evaluateAllocation(answers,correct){
 if(answers.length!==correct.length||new Set(answers).size!==correct.length)throw Error('Every answer must be assigned exactly once');
 const hits=answers.filter((answer,i)=>answer===correct[i]).length;
 return {hits,total:correct.length,points:Math.round(hits/correct.length*1000)};
}
export function normaliseWord(s){return s.trim().toLowerCase();}
export function validWord(s,letter,used,dictionary){
 const w=normaliseWord(s);
 if(!/^[a-z]{3,20}$/.test(w))return 'Use a word of 3–20 letters (A–Z only).';
 if(w[0]!==letter.toLowerCase())return `This word must start with ${letter}.`;
 if(used.has(w))return 'You have already used that word.';
 if(!dictionary.has(w))return "We couldn't find that word in our dictionary.";
 return '';
}

export function replaceAcceptedWord(entries,index,draft,seed,golden,dictionary){
 if(index<0||index>=seed.length)throw Error('Invalid word slot');
 const candidate=normaliseWord(draft);
 const used=new Set(entries.filter((_,i)=>i!==index).map(x=>x.word).filter(Boolean));
 const issue=validWord(candidate,seed[index],used,dictionary);
 if(issue)return {entries,issue};
 const next=entries.map((entry,i)=>i===index?{word:candidate,points:scoreWord(candidate,golden)}:entry);
 return {entries:next,issue:''};
}


// Golden Acrostic v0.4: the shared, deterministic round-wide multiplier.
export function scoreWordRound(entries, golden) {
 const words=entries.map(entry => typeof entry==='string'?entry:(entry?.word||''));
 const details=words.map(word=>{
  const w=word.toUpperCase();
  if(w && !/^[A-Z]{3,20}$/.test(w))throw Error('Invalid accepted word');
  const letters=w.length;
  const gold=[...w].filter(c=>c===golden.toUpperCase()).length;
  const base=letters*10;
  return {word,letters,gold,base,points:base};
 });
 const base=details.reduce((sum,w)=>sum+w.base,0);
 const gold=details.reduce((sum,w)=>sum+w.gold,0);
 const multiplier=1+gold;
 return {points:base*multiplier,base,gold,multiplier,details};
}
