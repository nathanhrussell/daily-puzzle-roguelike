import test from 'node:test';
import assert from 'node:assert/strict';
import {replaceAcceptedWord,scoreWord} from '../src/logic.js';
import {readFileSync} from 'node:fs';
const dictionary=new Set(JSON.parse(readFileSync(new URL('../data/dictionary.json',import.meta.url),'utf8')));
test('previous accepted word survives invalid edit',()=>{
 const original=[{word:'crane',points:scoreWord('crane','R')},{word:'',points:0}];
 const {entries,issue}=replaceAcceptedWord(original,0,'cranezz','CR','R',dictionary);
 assert.ok(issue);assert.equal(entries,original);assert.equal(entries[0].word,'crane');
});
test('valid replacement updates only chosen slot and its points',()=>{
 const original=[{word:'cat',points:30},{word:'rose',points:40}];
 const {entries,issue}=replaceAcceptedWord(original,0,'crater','CR','R',dictionary);
 assert.equal(issue,'');assert.equal(entries[0].points,60);assert.deepEqual(entries[1],original[1]);
});
test('another slot cannot reuse a saved word',()=>{
 const original=[{word:'crane',points:50},{word:'',points:0}];
 const r=replaceAcceptedWord(original,1,'crane','CR','R',dictionary);
 assert.ok(r.issue);assert.equal(r.entries,original);
});
test('common words and inflections are admitted by prototype lexicon',()=>{
 assert.ok(dictionary.has('ditzy'));assert.ok(dictionary.has('credences'));
});
