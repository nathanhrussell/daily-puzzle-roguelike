import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreWord,scoreEstimate,scoreRanking,evaluateAllocation,validWord} from '../src/logic.js';
test('each letter earns 10 base points',()=>{assert.equal(scoreWord('CRATER','R'),60);assert.equal(scoreWord('CAT','R'),30)});
test('estimate: exact earns maximum and error lowers score',()=>{assert.equal(scoreEstimate(100,100),1000);assert.ok(scoreEstimate(95,100)>scoreEstimate(50,100));assert.equal(scoreEstimate(-1,100),0)});
test('ranking: correct yields maximum',()=>{const expected=['a','b','c','d','e'];assert.deepEqual(scoreRanking(expected,expected),{points:1000,correctPlaces:5,displacement:0,perfect:true});assert.ok(scoreRanking(['b','a','c','d','e'],expected).points<1000)});
test('allocation matches without reusing choices',()=>{assert.equal(evaluateAllocation(['a','b','c'],['a','b','c']).points,1000);assert.throws(()=>evaluateAllocation(['a','a','c'],['a','b','c']))});
test('word validation rejects incorrect initial / duplicate / missing',()=>{const dict=new Set(['crane']);assert.ok(validWord('drane','C',new Set(),dict));assert.ok(validWord('crane','C',new Set(['crane']),dict));assert.equal(validWord('Crane','C',new Set(),dict),'')});
