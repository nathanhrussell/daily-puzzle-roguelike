import test from 'node:test';
import assert from 'node:assert/strict';
import {scorePrecisionEstimate,parsePrecisionGuess,buildPrecisionResult} from '../src/precision-logic.js';
import {precisionRounds,precisionQuestionCount,validatePrecisionRounds} from '../src/precision-content.js';
test('fixed pilot bank has six complete distinct rounds',()=>{
 assert.equal(validatePrecisionRounds(),true);assert.equal(precisionQuestionCount,18);
 assert.equal(new Set(precisionRounds.flat().map(q=>q.id)).size,18);
});
test('proportional curve is symmetric for multiplicative errors',()=>{
 assert.equal(scorePrecisionEstimate(100,100),1000);
 assert.equal(scorePrecisionEstimate(50,100),scorePrecisionEstimate(200,100));
 assert.equal(scorePrecisionEstimate(54,60),scorePrecisionEstimate(5.4e6,6e6));
 assert.equal(scorePrecisionEstimate(0,100),0);
 assert.ok(scorePrecisionEstimate(90,100)>scorePrecisionEstimate(50,100));
 assert.throws(()=>scorePrecisionEstimate(-1,100));
 assert.throws(()=>scorePrecisionEstimate(1,0));
});
test('numeric input has explicit decimal and empty rejection rules',()=>{
 for(const raw of ['',' ','1,5','1e9','-1','Infinity'])assert.equal(parsePrecisionGuess(raw),null);
 assert.equal(parsePrecisionGuess('0'),0);assert.equal(parsePrecisionGuess('1.62'),1.62);
 assert.equal(parsePrecisionGuess('10000'),10000);
});
test('result snapshot sums all submitted estimates',()=>{
 const result=buildPrecisionResult({fixture:2,steps:[{id:'PP-01',guess:110,actual:100,points:867}],startedAt:0,finishedAt:1000,completionReason:'Time expired',durationSeconds:90});
 assert.equal(result.schema,'precision-pursuit-result/v0.1');assert.equal(result.finalScore,867);
 assert.equal(result.estimates[0].questionId,'PP-01');
});

test('reviewed playtest questions preserve sourced targets and a varied category mix',()=>{
 const byId=new Map(precisionRounds.flat().map(q=>[q.id,q]));
 assert.equal(byId.get('PP-02').answer,142984);
 assert.equal(byId.get('PP-08').answer,115);
 assert.equal(byId.get('PP-16').answer,7.32);
 assert.ok(!/three or four minutes/i.test(byId.get('PP-15').guidance));
 assert.match(byId.get('PP-02').guidance,/12,750/);
 assert.equal(byId.get('PP-09').answer,32);
 assert.equal(byId.get('PP-11').answer,21.6);
 assert.equal(byId.get('PP-15').answer,355);
 assert.equal(byId.get('PP-17').answer,35);
 assert.equal(new Set(precisionRounds.flat().map(q=>q.category)).size,6);
 for(const q of precisionRounds.flat())assert.ok(q.sourceUrl.startsWith('https://'));
});
