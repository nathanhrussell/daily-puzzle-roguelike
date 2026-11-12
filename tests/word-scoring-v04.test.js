import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreWordRound,validWord,replaceAcceptedWord} from '../src/logic.js';
import {wordRounds} from '../src/content.js';
import {readFileSync} from 'node:fs';
const dict=new Set(JSON.parse(readFileSync(new URL('../data/dictionary.json',import.meta.url),'utf8')));
const blocked=new Set(JSON.parse(readFileSync(new URL('../data/blocked_words.json',import.meta.url),'utf8')).blocked);
test('round-wide multiplier starts at one and grows per occurrence',()=>{
 const x=scoreWordRound(['crater','rose','apple','',''],'R');
 assert.equal(x.base,(6+4+5)*10);assert.equal(x.gold,3);assert.equal(x.multiplier,4);assert.equal(x.points,600);
});
test('zero golden occurrences still scores base points',()=>{
 const x=scoreWordRound(['cat','apple','','',''],'R');
 assert.equal(x.gold,0);assert.equal(x.multiplier,1);assert.equal(x.points,80);
});
test('adding another golden letter increases entire round multiplier',()=>{
 const a=scoreWordRound(['crane','rose','','',''],'R');
 const b=scoreWordRound(['crater','rose','','',''],'R');
 assert.ok(b.multiplier>a.multiplier);assert.ok(b.points>a.points);
});
test('all reported ordinary words and inflections are accepted',()=>{
 for(const word of ['ditzy','credences','characterisation','parsnip','karats'])assert.ok(dict.has(word), word);
});
test('reviewed exclusions not accepted',()=>{for(const word of blocked)assert.ok(!dict.has(word),word);});
test('exactly 30 curated five-letter challenges, each golden letter three times',()=>{
 assert.equal(wordRounds.length,30);assert.equal(new Set(wordRounds.map(x=>x.seed)).size,30);
 const eligible='ETAOINSHRD';
 for(const r of wordRounds){assert.match(r.seed,/^[A-Z]{5}$/);assert.ok(dict.has(r.seed.toLowerCase()),r.seed);assert.ok(r.seed.includes(r.gold));assert.ok(eligible.includes(r.gold));}
 for(const c of eligible)assert.equal(wordRounds.filter(x=>x.gold===c).length,3,c);
});
test('saved word persists when candidate is rejected',()=>{
 const prev=[{word:'crane',points:65},{word:'',points:0}];
 const next=replaceAcceptedWord(prev,0,'notaword','CR','R',dict);
 assert.equal(next.entries,prev);assert.ok(next.issue);
});
