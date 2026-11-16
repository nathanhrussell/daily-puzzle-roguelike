// Standalone numerical scoring and result contract. No combined-game adjustments.
export const PRECISION_SCORING_VERSION='precision-proportional-v0.1';
export function scorePrecisionEstimate(guess,answer,exponent=1.5){
 if(!Number.isFinite(guess)||guess<0||!Number.isFinite(answer)||answer<=0)throw Error('Invalid estimate or answer');
 if(!Number.isFinite(exponent)||exponent<=0)throw Error('Invalid curve exponent');
 if(guess===0)return 0;
 return Math.round(1000*Math.pow(Math.min(guess,answer)/Math.max(guess,answer),exponent));
}
export function parsePrecisionGuess(raw){
 if(typeof raw!=='string'||!raw.trim()||!/^(?:\d+\.?\d*|\.\d+)$/.test(raw.trim()))return null;
 const value=Number(raw.trim());
 return Number.isFinite(value)&&value>=0?value:null;
}
export function buildPrecisionResult({fixture,steps,startedAt,finishedAt,completionReason,durationSeconds}){
 if(!Number.isInteger(fixture)||fixture<0||!Array.isArray(steps))throw Error('Invalid result');
 return {
  schema:'precision-pursuit-result/v0.1',mode:'practice',challengeIndex:fixture,
  scoringVersion:PRECISION_SCORING_VERSION,durationSeconds,
  estimates:steps.map(({id,guess,actual,points})=>({questionId:id,guess,answer:actual,points})),
  finalScore:steps.reduce((sum,step)=>sum+step.points,0),
  startedAt:new Date(startedAt).toISOString(),finishedAt:new Date(finishedAt).toISOString(),
  completionReason
 };
}
