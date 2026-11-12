import test from 'node:test';
import assert from 'node:assert/strict';
import {utcDay,challengeIndex,dailyKey,freshDaily,loadDaily,saveDaily,remainingSeconds,markFinished,buildWordResult} from '../src/daily.js';
import {wordRounds,practiceWordRound} from '../src/content.js';
import {scoreWordRound} from '../src/logic.js';
const makeStorage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};};
const day='2026-11-11',now=1_800_000_000_000;
test('UTC day boundary is deterministic for every player',()=>{
 assert.equal(utcDay(new Date('2026-11-11T23:59:59Z')),'2026-11-11');
 assert.equal(utcDay(new Date('2026-11-12T00:00:00Z')),'2026-11-12');
 assert.equal(challengeIndex(day,30),challengeIndex(day,30));
});
test('exactly 30 daily pairs and separate practice combo',()=>{
 assert.equal(wordRounds.length,30);
 assert.ok(!wordRounds.some(({seed,gold})=>seed===practiceWordRound.seed&&gold===practiceWordRound.gold));
 assert.equal(practiceWordRound.seed.length,5);
 assert.ok(practiceWordRound.seed.includes(practiceWordRound.gold));
});
test('daily record persists accepted words and retains the original deadline',()=>{
 const db=makeStorage(),r=freshDaily(day,30,now);
 saveDaily(db,r);
 const saved=loadDaily(db,day,30);assert.equal(saved.endsAt,now+90000);
 saved.words=['lemon','','','',''];saveDaily(db,saved);
 assert.equal(loadDaily(db,day,30).words[0],'lemon');
 assert.equal(remainingSeconds(loadDaily(db,day,30),now+30000),60);
 assert.equal(remainingSeconds(saved,now+91000),0);
});
test('finished record keeps the same attempt and does not become fresh on reload',()=>{
 const db=makeStorage(),r=freshDaily(day,30,now);
 saveDaily(db,markFinished(r,"Time's up!",now+90000));
 const restored=loadDaily(db,day,30);
 assert.equal(restored.reason,"Time's up!");
 assert.equal(restored.finishedAt,now+90000);
 assert.notEqual(dailyKey(day),dailyKey('2026-11-12'));
});
test('corrupt or incompatible records do not pass validation',()=>{
 const db=makeStorage();db.setItem(dailyKey(day),'{broken');assert.equal(loadDaily(db,day,30),null);
 const r=freshDaily(day,30,now);r.words=['<script>','','','',''];saveDaily(db,r);
 assert.equal(loadDaily(db,day,30),null);
});
test('integration result structure preserves original game score',()=>{
 const score=scoreWordRound(['trace','reach','','',''],'R');
 const result=buildWordResult({mode:'practice',day,seed:'TRACE',gold:'R',words:['trace','reach','','',''],score,startedAt:now,finishedAt:now+90000,reason:'Time expired',dictionaryVersion:'esdb-70-level4-ga-v1'});
 assert.equal(result.schema,'golden-acrostic-result/v1');
 assert.equal(result.finalScore,score.points);
 assert.equal(result.multiplier,score.multiplier);
 assert.equal(result.day,null);
 assert.equal(result.totalLetters,10);
});
