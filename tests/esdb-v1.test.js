import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const raw=readFileSync(new URL('../data/dictionary.json',import.meta.url));
const words=JSON.parse(raw),dictionary=new Set(words);
const manifest=JSON.parse(readFileSync(new URL('../data/dictionary_manifest.json',import.meta.url)));
test('ESDB manifest count and reproducible hash match',()=>{
 assert.equal(words.length,manifest.word_count);
 assert.equal(createHash('sha256').update(raw).digest('hex'),manifest.dictionary_sha256);
 assert.equal(manifest.version,'esdb-70-level4-ga-v1');
 assert.ok(words.every(w=>/^[a-z]{3,20}$/.test(w)));
});
test('all previously rejected legitimate words are now accepted',()=>{
 for(const word of ['ditzy','credences','characterisation','parsnip','karats','marvellous','petrichor','bloggy'])assert.ok(dictionary.has(word),word);
});
test('reviewed exclusions are not in the shipped dictionary',()=>{
 for(const word of readFileSync(new URL('../data/dictionary_exclusions.txt',import.meta.url),'utf8').split(/\r?\n/).filter(Boolean))assert.ok(!dictionary.has(word),word);
});
