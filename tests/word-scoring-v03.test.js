// Compatibility migration test for users upgrading a v0.3 ZIP in place.
// v0.3 multiplier rules are superseded; this file deliberately asserts v0.4 rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreWordRound} from '../src/logic.js';
test('v0.3 installations are upgraded to the v0.4 minimum ×1 formula',()=>{
 const score=scoreWordRound(['crater','','','',''],'R');
 assert.equal(score.base,60);
 assert.equal(score.gold,2);
 assert.equal(score.multiplier,3);
 assert.equal(score.points,180);
});
