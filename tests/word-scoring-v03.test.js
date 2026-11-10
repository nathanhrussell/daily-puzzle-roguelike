import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreWordRound} from '../src/logic.js';
const example=['crater','refrigerator','argument','narrator','extraterrestrial'];
test('all variants count real accepted word lengths and golden letters',()=>{
 const direct=scoreWordRound(example,'R','global');
 assert.equal(direct.base,500);assert.equal(direct.gold,14);
 assert.equal(direct.multiplier,14);assert.equal(direct.points,7000);
 assert.equal(scoreWordRound(example,'R','moderated').points,4000);
 assert.equal(scoreWordRound(example,'R','fixed35').points,990);
});
test('global multiplier gives zero with no golden letter, moderated preserves base',()=>{
 const words=['cat','apple','nut','egg','dog'];
 assert.equal(scoreWordRound(words,'R','global').points,0);
 assert.equal(scoreWordRound(words,'R','moderated').points,words.join('').length*10);
});
test('empty slots contribute no letters, golden letters or points',()=>{
 const x=scoreWordRound([{word:'crater'},{word:''},'','',''],'R','global');
 assert.equal(x.base,60);assert.equal(x.gold,2);assert.equal(x.points,120);
});
test('round-wide bonus rewards switching to shorter golden-heavy word',()=>{
 const a=scoreWordRound(['crocodile','refrigerator','argument','narrator','extraterrestrial'],'R','global');
 const b=scoreWordRound(['cranberry','refrigerator','argument','narrator','extraterrestrial'],'R','global');
 assert.ok(b.points>a.points);
});
test('scoring rejects unknown models and malformed saved words',()=>{
 assert.throws(()=>scoreWordRound(['cat'],'R','typo'));
 assert.throws(()=>scoreWordRound(['ca t'],'R','global'));
});
