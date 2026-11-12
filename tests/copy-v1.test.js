import test from 'node:test';
import assert from 'node:assert/strict';
import {goldenLetterCountLabel,validWord} from '../src/logic.js';
test('golden letter count uses natural singular and plural labels',()=>{
 assert.equal(goldenLetterCountLabel(0,'O'),'0 golden Os');
 assert.equal(goldenLetterCountLabel(1,'O'),'1 golden O');
 assert.equal(goldenLetterCountLabel(2,'O'),'2 golden Os');
 assert.equal(goldenLetterCountLabel(3,'A'),'3 golden As');
});
test('short-word validation requests an entry',()=>{
 assert.equal(validWord('ox','O',new Set(),new Set()),'Enter a word with 3–20 letters (A–Z only).');
});
