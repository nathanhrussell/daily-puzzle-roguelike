import {wordRounds,numberRounds,allocationRounds,rankingRounds,paths} from './content.js';
import {scoreWord,scoreEstimate,estimateLabel,scoreRanking,evaluateAllocation,normaliseWord,validWord,replaceAcceptedWord,scoreWordRound,goldenLetterCountLabel} from './logic.js';
import {utcDay,challengeIndex,freshDaily,loadDaily,saveDaily,remainingSeconds,markFinished,buildWordResult} from './daily.js';
import {practiceWordRound} from './content.js';
const app=document.querySelector('#app');
let dictionary=new Set(),blockedWords=new Set(),dictionaryManifest={},timer=null,session=null,dailyRecord=null;
const labels={words:'Golden Acrostic',numbers:'Precision Pursuit',trivia:'Answer Allocation',ranking:'Perfect Order'};
const subtitles={words:'Five letters. Five words. 90 seconds.',numbers:'Get close. Every digit counts.',trivia:'Every answer has a home.',ranking:'Five items. One perfect sequence.'};
const icons={words:'Aa',numbers:'≈',trivia:'↔',ranking:'↕'};
const escapeHtml=(x)=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const el=(id)=>document.getElementById(id);
const selectedPath=()=>location.hash.replace('#/','').split('/')[0];
function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
function currentItem(){return session.mode==='words'?(session.attemptMode==='practice'?practiceWordRound:wordRounds[session.fixture]):({numbers:numberRounds,trivia:allocationRounds,ranking:rankingRounds})[session.mode][session.fixture];}
function shell(content){const wordMode=session?.mode==='words'||selectedPath()==='words'||!selectedPath();app.innerHTML=`<div class="app-shell ${wordMode?'words-mode':''}"><header class="topbar"><a class="brand" href="#/words" aria-label="Golden Acrostic home"><span class="brand-mark">✳</span><span>${wordMode?'GOLDEN<span class="brand-muted">/ACROSTIC</span>':'PUZZLE<span class="brand-muted">/LAB</span>'}</span></a><span class="top-chip">${wordMode?'DAILY WORD GAME':'GAME COLLECTION'}</span></header><main>${content}</main><footer>Daily Puzzle Roguelike · Golden Acrostic · v1.0</footer></div>`;}
function home(){stopTimer();session=null;const cards=paths.map((id,i)=>`<a class="game-card" href="#/${id}"><div class="card-top"><span class="game-glyph glyph-${id}">${icons[id]}</span><span class="card-num">0${i+1} / 04</span></div><h2>${labels[id]}</h2><p>${subtitles[id]}</p><div class="card-cta">${id==='words'?'Play Golden Acrostic':'Explore game'} <span aria-hidden="true">↗</span></div></a>`).join('');shell(`<section class="hero"><div class="eyebrow"><span class="dot"></span> GAME DESIGN LABORATORY</div><h1>Four games.<br><em>One big idea.</em></h1><p>Play each puzzle independently. Test the mechanics before they become one daily run.</p></section><section class="card-grid" aria-label="Choose a prototype">${cards}</section><section class="info-panel"><span class="info-star">✦</span><div><strong>Designed for honest testing</strong><p>Every game has its own rules, sample puzzles and result screen. No power-ups or combined multiplier yet.</p></div></section>`);}
function getDailyRecord() {
 try {return {record:loadDaily(localStorage,utcDay(),wordRounds.length),available:true};}
 catch {return {record:null,available:false};}
}
function persistDaily() {
 if(session?.mode!=='words'||session.attemptMode!=='daily'||!dailyRecord)return true;
 dailyRecord.words=session.words.map(e=>e.word);
 try {saveDaily(localStorage,dailyRecord);return true;}
 catch {console.error('Daily attempt could not be saved');return false;}
}
function restoreDaily(record) {
 const item=wordRounds[record.fixture];
 const words=record.words.map((word,i)=>({word:word&&word[0]===item.seed[i].toLowerCase()&&dictionary.has(word)?word:'',points:word.length*10}));
 dailyRecord=record;
 const now=Date.now();
 session={mode:'words',attemptMode:'daily',fixture:record.fixture,duration:90,scoreModel:'global',left:remainingSeconds(record,now),started:record.startedAt,points:0,steps:[],done:false,words,index:0,selections:{},order:[],locked:false};
 session.points=wordScore().points;
 if(record.finishedAt || now>=record.endsAt){
   if(!record.finishedAt){dailyRecord=markFinished(record,"Time's up!",record.endsAt);persistDaily();}
   finish(dailyRecord.reason||'Round complete.',true);
 } else {renderRound(); startTicker();}
}
function startTicker() {
 stopTimer();
 timer=setInterval(()=>{
  if(!session||session.done)return;
  let left=session.mode==='words'&&session.attemptMode==='daily' ? remainingSeconds(dailyRecord) : Math.max(0,session.duration-Math.floor((Date.now()-session.started)/1000));
  session.left=left;
  const clock=el('clock');if(clock){clock.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;clock.classList.toggle('urgent',left<=15);}
  if(!left)finish("Time's up!");
 },200);
}
function beginDaily(){
 const state=getDailyRecord();
 if(!state.available){wordsStart();return;}
 if(state.record){restoreDaily(state.record);return;}
 const record=freshDaily(utcDay(),wordRounds.length);
 try {saveDaily(localStorage,record);}catch {wordsStart();return;}
 dailyRecord=record;restoreDaily(record);
}
function beginPractice(){dailyRecord=null;begin('words',0,90,'global','practice');}
function wordsStart(){
 stopTimer();session=null;
 const {record,available}=getDailyRecord();
 const day=utcDay();
 let stateHtml='';
 if(!available)stateHtml='<p role="alert">Daily play requires browser storage. Enable site storage to record an attempt. Practice is still available.</p>';
 else if(!record)stateHtml='<p class="daily-note">One scored attempt per UTC day. Starting begins your 90-second clock; leaving the page will not restart it.</p><button class="primary full" id="begin-daily">Start today’s challenge <span>→</span></button>';
 else if(record.finishedAt || Date.now()>=record.endsAt)stateHtml='<p class="daily-note">You have already used today’s scored attempt.</p><button class="primary full" id="view-daily">View today’s result <span>→</span></button>';
 else stateHtml=`<p class="daily-note">Your daily attempt is in progress. ${remainingSeconds(record)} seconds remain. The clock continues while you’re away.</p><button class="primary full" id="resume-daily">Resume daily challenge <span>→</span></button>`;
 shell(`<div class="back-row"><a href="#/" class="back-link">← All games</a><span class="back-note">DAILY · UTC</span></div><section class="intro"><h1>Golden Acrostic</h1><p>Five letters. Five words. 90 seconds.</p></section><section class="panel words-intro"><h2>How to play</h2><p>Find one word beginning with each of the five starting letters — the longer the better.</p><p>Each letter earns <strong>10 points</strong>. Every occurrence of the <strong>golden letter</strong> in your five words raises your final score multiplier by 1, starting at ×1.</p><p>You can change your answers until the 90 seconds are up. Only recognised words count.</p><div class="word-example"><strong>For example</strong><p>Starting letters: <b>C R A N E</b> · Golden letter: <b>R</b></p><p>40 letters = 400 base points; eight Rs = ×9 multiplier.</p><strong>400 × 9 = 3,600 points</strong></div><div class="daily-start"><h3>Today’s challenge</h3>${stateHtml}</div><div class="practice-start"><h3>Try a practice round</h3><p>Play an example using a different word from the daily catalogue. Practice doesn't count towards your daily score and can be replayed.</p><button class="secondary full" id="begin-practice">Play practice round <span>→</span></button></div></section>`);
 const b=el('begin-daily')||el('resume-daily')||el('view-daily');if(b)b.onclick=beginDaily;
 el('begin-practice').onclick=beginPractice;
 if(!dictionary.size){if(b)b.disabled=true;el('begin-practice').disabled=true;}
}

function startScreen(mode){
 if(mode==='words')return wordsStart();
 stopTimer();session=null;
 const descriptions={numbers:'Estimate three quantities. The closer you get, the more points you earn. You will see the correct answer and your error after each guess.',trivia:'Match three answers to three prompts. Each answer can be used only once. Correct matches earn points.',ranking:'Put five items in order. Move them up and down, then submit. Near misses earn partial credit.'};
 shell(`<div class="back-row"><a href="#/" class="back-link">← All games</a></div><section class="intro"><span class="game-glyph big glyph-${mode}">${icons[mode]}</span><div class="eyebrow">STANDALONE PROTOTYPE</div><h1>${labels[mode]}</h1><p>${subtitles[mode]}</p></section><section class="panel"><h2>How to play</h2><p>${descriptions[mode]}</p><div class="setting-row"><label for="fixture">Sample challenge</label><select id="fixture"><option value="0">Challenge 1</option><option value="1">Challenge 2</option><option value="2">Challenge 3</option></select></div><div class="setting-row"><label for="timing">Round timer</label><select id="timing"><option value="90">90 seconds (test baseline)</option><option value="0">Untimed (mechanics testing)</option><option value="120">120 seconds</option></select></div><button class="primary full" id="begin">Start game <span>→</span></button><div class="fineprint">Sample content and scores are experimental, not final daily-game rules.</div></section>`);
 el('begin').onclick=()=>begin(mode,Number(el('fixture').value),Number(el('timing').value));
}
function begin(mode,fixture,duration,scoreModel=null,attemptMode=null){
 stopTimer();
 session={mode,attemptMode,fixture,duration,scoreModel,left:duration,started:Date.now(),points:0,steps:[],done:false,words:[],index:0,selections:{},order:[],locked:false};
 renderRound();if(duration)startTicker();
}
function roundFrame(inner){let s=session;const progress=s.mode==='words'?`${s.words.filter(x=>x.word).length} / ${currentItem().seed.length} filled`:s.mode==='numbers'?`${s.index+1} / ${numberRounds.length}`:'1 / 1';const clock=s.duration?`<span id="clock" class="timer" aria-live="off">${Math.floor(s.left/60)}:${String(s.left%60).padStart(2,'0')}</span>`:`<span class="timer unlimited">UNTIMED</span>`;shell(`<div class="back-row"><a href="#/${s.mode}" class="back-link" id="leave">← Exit game</a><span class="back-note">${s.mode==='words'?(s.attemptMode==='practice'?'PRACTICE':'DAILY CHALLENGE'):`CHALLENGE ${s.fixture+1}`}</span></div><section class="play-header"><div><div class="eyebrow">${labels[s.mode].toUpperCase()}</div><h1>${subtitles[s.mode]}</h1></div>${clock}</section><div class="stats"><div><small>POINTS</small><strong id="live-score">${s.points.toLocaleString('en-GB')}</strong></div><div><small>PROGRESS</small><strong id="live-progress">${progress}</strong></div></div><section class="panel game-panel">${inner}</section>`);el('leave').onclick=(e)=>{if(s.mode==='words'&&s.attemptMode==='daily')return; if(!confirm('Leave this attempt? Your progress will be lost.'))e.preventDefault();};}
function renderRound(){if(!session||session.done)return;switch(session.mode){case 'words':return wordsUI();case 'numbers':return numbersUI();case 'trivia':return triviaUI();case 'ranking':return rankingUI();}}
function wordEntry(i){return session.words[i] || {word:'',points:0};}
function wordScore(){return scoreWordRound(session.words,currentItem().gold);}
function wordRuleText(gold){return `Each letter earns <strong>10 points</strong>. Golden letter: <strong>${escapeHtml(gold)}</strong>. Every ${escapeHtml(gold)} in your words increases your multiplier by 1 (starting from ×1).`;}
function wordsUI(){
 const item=currentItem();
 if(!session.words.length)session.words=[...item.seed].map(()=>({word:'',points:0}));
 const result=wordScore();
 const wordsCount=session.words.filter(x=>x.word).length;
 roundFrame(`<div class="word-instructions"><strong>Find the highest-scoring words you can.</strong><p>Write one word beginning with each letter — the longer the better.</p><p>${wordRuleText(item.gold)}</p><p>You can improve your words until the clock runs out.</p></div><div class="word-list" aria-label="Your five words">${[...item.seed].map((letter,i)=>{const entry=wordEntry(i),detail=result.details[i];return `<div class="word-row" data-word-row="${i}"><label for="word-${i}" class="word-letter">${escapeHtml(letter)}</label><div class="word-control"><input id="word-${i}" class="word-input" type="text" inputmode="text" minlength="3" maxlength="20" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="Word beginning with ${letter}…" value="${escapeHtml(entry.word)}" aria-describedby="word-status-${i}"><div id="word-status-${i}" class="word-status" role="status">${entry.word?`${detail.letters} letters · ${goldenLetterCountLabel(detail.gold,item.gold)}`:'No word saved yet'}</div></div><div class="word-points"><strong id="word-points-${i}">${detail.base}</strong><small>base</small></div></div>`;}).join('')}</div><div class="live-calculation" aria-live="off"><div><span>Base points</span><strong id="base-total">${result.base.toLocaleString('en-GB')}</strong></div><div><span>Golden letters</span><strong id="gold-count">${result.gold}</strong></div><div><span>Multiplier</span><strong id="gold-multiplier">×${result.multiplier}</strong></div><div class="score-total"><span>Total score</span><strong id="total-word-score">${result.points.toLocaleString('en-GB')}</strong></div></div><button class="secondary full" id="finish-words">Finish round</button><p class="hint">You can keep improving your words, or finish early. Previously accepted words still count if a replacement isn't recognised.</p>`);
 [...item.seed].forEach((letter,i)=>{
  const field=el(`word-${i}`);
  field.addEventListener('input',()=>updateWord(i,field));
  field.addEventListener('focus',()=>field.select());
  field.addEventListener('blur',()=>{if(session?.done)return;const entry=wordEntry(i);if(normaliseWord(field.value)!==entry.word){field.value=entry.word;updateWordStatus(i,entry.word?'Previous word retained':'No word saved yet',false);}});
  field.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();el(`word-${(i+1)%item.seed.length}`).focus();}});
 });
 el('finish-words').onclick=()=>finish('You chose to finish early.');
}
function updateWordStatus(i,message,invalid){const status=el(`word-status-${i}`);status.textContent=message;status.classList.toggle('invalid',invalid);el(`word-${i}`).setAttribute('aria-invalid',String(invalid));}
function updateWord(i,input){
 if(!session||session.done)return;
 if(session.attemptMode==='daily'&&remainingSeconds(dailyRecord)===0){finish("Time's up!");return;}
 const item=currentItem(),candidate=normaliseWord(input.value),previous=wordEntry(i);
 if(!candidate){updateWordStatus(i,previous.word?'Previous word still saved':'No word saved yet',false);return;}
 const {entries:nextEntries,issue}=replaceAcceptedWord(session.words,i,candidate,item.seed,item.gold,dictionary);
 if(issue){
  const blocked=blockedWords.has(candidate);
  const message=blocked?"This word isn't accepted in Golden Acrostic. Please try another.":issue;
  updateWordStatus(i,`${message}${previous.word?' Your previous word still counts.':''}`,true);
  return;
 }
 session.words=nextEntries;
 if(!persistDaily()){updateWordStatus(i,"Could not save your daily entry. Check browser storage.",true);return;}
 const result=wordScore();session.points=result.points;
 const detail=result.details[i];
 updateWordStatus(i,`Saved · ${detail.letters} letters = ${detail.base} base points · ${goldenLetterCountLabel(detail.gold,item.gold)}`,false);
 el(`word-points-${i}`).textContent=detail.base;
 el('live-score').textContent=session.points.toLocaleString('en-GB');
 el('base-total').textContent=result.base.toLocaleString('en-GB');
 el('gold-count').textContent=String(result.gold);
 el('gold-multiplier').textContent=`×${result.multiplier}`;
 el('total-word-score').textContent=result.points.toLocaleString('en-GB');
 el('live-progress').textContent=`${session.words.filter(x=>x.word).length} / ${item.seed.length} filled`;
}

function numbersUI(){const item=numberRounds[session.index];roundFrame(`<div class="eyebrow">ESTIMATE ${session.index+1} OF ${numberRounds.length}</div><h2 class="question">${item.question}</h2><form id="estimate-form"><label for="guess" class="field-label">Your estimate (${item.unit})</label><input type="number" inputmode="decimal" min="0" step="any" id="guess" placeholder="Enter a number" required><div id="estimate-error" class="validation" role="alert"></div><button class="primary full" type="submit">Lock in estimate <span>→</span></button></form><div class="hint">Exact answer = 1,000 points. Points fall as percentage error increases.</div>`);el('guess').focus();el('estimate-form').onsubmit=e=>{e.preventDefault();const guess=Number(el('guess').value);if(!Number.isFinite(guess)||guess<0){el('estimate-error').textContent='Enter a number of zero or more.';return;}const points=scoreEstimate(guess,item.answer);session.points+=points;session.steps.push({label:item.question,guess,actual:item.answer,points});showEstimate(points,item,guess);};}
function showEstimate(points,item,guess){roundFrame(`<div class="eyebrow">ESTIMATE ${session.index+1} — RESULT</div><div class="result-icon">${points>=800?'✦':'≈'}</div><h2 class="center">+${points.toLocaleString('en-GB')} points</h2><div class="reveal-grid"><div><small>YOUR GUESS</small><strong>${guess.toLocaleString('en-GB')}</strong></div><div><small>CORRECT ANSWER</small><strong>${item.answer.toLocaleString('en-GB')}</strong></div></div><p class="center muted">${estimateLabel(guess,item.answer)}</p><p>${item.explain}</p><button id="next" class="primary full">${session.index===numberRounds.length-1?'See results':'Next estimate'} <span>→</span></button>`);el('next').onclick=()=>{session.index++;if(session.index>=numberRounds.length)finish('All estimates completed');else renderRound();};}
function triviaUI(){const item=currentItem();roundFrame(`<div class="eyebrow">MATCH ALL THREE ANSWERS</div><h2 class="question">${item.prompt}</h2><form id="alloc-form"><div class="matching-list">${item.questions.map((q,i)=>`<div class="match-row"><label for="match-${i}">${escapeHtml(q)}</label><select id="match-${i}" required><option value="">Choose an answer…</option>${item.answers.map(a=>`<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('')}</select></div>`).join('')}</div><div id="alloc-error" class="validation" role="alert"></div><button class="primary full" type="submit">Check allocations <span>→</span></button></form><div class="hint">Each answer can be assigned only once. All three must be filled.</div>`);el('alloc-form').onsubmit=e=>{e.preventDefault();const answers=item.questions.map((_,i)=>el(`match-${i}`).value);if(new Set(answers).size!==answers.length){el('alloc-error').textContent='Use each answer only once.';return;}const result=evaluateAllocation(answers,item.correct);session.points=result.points;session.steps=item.questions.map((q,i)=>({label:q,answer:answers[i],correct:item.correct[i],points:answers[i]===item.correct[i]?1:0}));finish('All answers allocated');};}
function rankingUI(){const item=currentItem();if(!session.order.length)session.order=[...item.items];roundFrame(`<div class="eyebrow">MOVE ITEMS INTO ORDER</div><h2 class="question">${item.prompt}</h2><p class="muted">Top = first · Bottom = last</p><div class="rank-list" id="rank-list">${session.order.map((name,i)=>`<div class="rank-row"><span class="rank-num">${i+1}</span><strong>${escapeHtml(name)}</strong><div class="rank-actions"><button type="button" data-move="${i},-1" ${i===0?'disabled':''} aria-label="Move ${escapeHtml(name)} up">↑</button><button type="button" data-move="${i},1" ${i===session.order.length-1?'disabled':''} aria-label="Move ${escapeHtml(name)} down">↓</button></div></div>`).join('')}</div><button id="rank-submit" class="primary full">Submit order <span>→</span></button><div class="hint">Tap the arrow controls to reorder; no dragging required.</div>`);document.querySelectorAll('[data-move]').forEach(btn=>btn.onclick=()=>{const [i,delta]=btn.dataset.move.split(',').map(Number);const next=i+delta;[session.order[i],session.order[next]]=[session.order[next],session.order[i]];rankingUI();});el('rank-submit').onclick=()=>{const result=scoreRanking(session.order,item.correct);session.points=result.points;session.steps=[{label:'Ranking',...result,order:[...session.order],correct:item.correct}];finish('Order submitted');};}
function finish(reason,restored=false){if(!session||session.done)return;stopTimer();session.done=true;const s=session;
 if(s.mode==='words'&&s.attemptMode==='daily'&&dailyRecord){
  if(!dailyRecord.finishedAt)dailyRecord=markFinished(dailyRecord,reason,Math.min(Date.now(),dailyRecord.endsAt));
  if(!persistDaily())console.error('Could not save final daily result');
  reason=dailyRecord.reason||reason;
 }
if(s.mode==='words')s.points=wordScore().points;const bestKey=`puzzle-lab:${s.mode}:practice:best:v1`;let prior=0;if(s.mode!=='words'||s.attemptMode==='practice')try{prior=Number(localStorage.getItem(bestKey))||0;if(s.points>prior)localStorage.setItem(bestKey,String(s.points));}catch{}
 let breakdown=''; if(s.mode==='words'){
  const item=currentItem(), score=wordScore();
  s.structuredResult=buildWordResult({mode:s.attemptMode,day:dailyRecord?.day||utcDay(),seed:item.seed,gold:item.gold,
    words:s.words.map(e=>e.word),score,startedAt:s.started,finishedAt:dailyRecord?.finishedAt||Date.now(),reason,
    dictionaryVersion:dictionaryManifest.version});
  const result=wordScore();
  breakdown=result.details.map((x,i)=>`<div class="breakdown-row word-result-row"><span><strong>${escapeHtml(currentItem().seed[i])} — ${escapeHtml(x.word)||'No word'}</strong><small>${x.letters} letters × 10 = ${x.base} base points · ${goldenLetterCountLabel(x.gold,currentItem().gold)}</small></span><b>${x.base} base</b></div>`).join('');
  breakdown+=`<div class="round-calculation"><strong>Final calculation</strong><p>${result.base/10} letters × 10 = ${result.base} base points</p><p>Golden letter ${escapeHtml(currentItem().gold)} used ${result.gold} times → multiplier ×${result.multiplier}</p><strong>${result.base.toLocaleString('en-GB')} × ${result.multiplier} = ${result.points.toLocaleString('en-GB')} points</strong></div>`;
 }

 if(s.mode==='numbers')breakdown=s.steps.map((x,i)=>`<div class="breakdown-row"><span>Estimate ${i+1}: ${x.guess.toLocaleString('en-GB')} / ${x.actual.toLocaleString('en-GB')}</span><b>+${x.points}</b></div>`).join('');
 if(s.mode==='trivia')breakdown=s.steps.map(x=>`<div class="breakdown-row"><span>${escapeHtml(x.label)}<small>Answer: ${escapeHtml(x.correct)}</small></span><b>${x.points?'✓':'✕'}</b></div>`).join('');
 if(s.mode==='ranking'){const x=s.steps[0];breakdown=`<div class="breakdown-row"><span>Correct positions</span><b>${x.correctPlaces} / 5</b></div><div class="breakdown-row"><span>Total position error</span><b>${x.displacement}</b></div><div class="correct-order">Correct order: ${x.correct.map(escapeHtml).join(' → ')}</div>`;}
 shell(`<div class="back-row"><a href="#/words" class="back-link">← Golden Acrostic</a></div><section class="results"><div class="eyebrow">${labels[s.mode].toUpperCase()} · ${s.mode==='words'?(s.attemptMode==='daily'?'DAILY CHALLENGE':'PRACTICE'):`CHALLENGE ${s.fixture+1}`}</div><div class="result-icon">✦</div><h1>Round complete.</h1><p>${escapeHtml(reason)}</p><div class="score-card"><small>YOUR SCORE</small><strong>${s.points.toLocaleString('en-GB')}</strong><span>${s.mode==='words'?(s.attemptMode==='daily'?'TODAY’S FINAL SCORE':'PRACTICE · NOT SCORED DAILY'):(s.points>prior?'NEW CHALLENGE BEST':'CHALLENGE BEST '+prior.toLocaleString('en-GB'))}</span></div></section><section class="panel"><h2>Score breakdown</h2>${breakdown||'<p>No answers were submitted.</p>'}<div class="results-actions"><button class="primary full" id="again">${s.mode==='words'?(s.attemptMode==='daily'?'Back to Golden Acrostic':'Play practice again'):'Play another challenge'} <span>→</span></button><button class="secondary full" id="copy-result">Copy shareable result</button></div>${s.mode==='words'?'':'<div class="fineprint">Sample content and scores are experimental.</div>'}</section>`);
 el('again').onclick=()=>s.mode==='words'&&s.attemptMode==='practice'?beginPractice():startScreen(s.mode);el('copy-result').onclick=async()=>{const share=`Golden Acrostic · ${s.attemptMode==='daily'?'Daily '+(dailyRecord?.day||utcDay()):'Practice'}\n${s.points} points\nFive words · 90 seconds`;try{await navigator.clipboard.writeText(share);el('copy-result').textContent='Copied!';}catch{el('copy-result').textContent='Copy unavailable in this browser';}};
}
function route(){const id=selectedPath();if(id==='collection')home();else if(paths.includes(id))startScreen(id);else wordsStart();}
async function loadDictionary(){try{const [res,blocked,manifest]=await Promise.all([fetch('/data/dictionary.json'),fetch('/data/blocked_words.json'),fetch('/data/dictionary_manifest.json')]);if(!res.ok||!blocked.ok||!manifest.ok)throw Error('Could not load dictionary');dictionary=new Set(await res.json());blockedWords=new Set((await blocked.json()).blocked);blockedWords.forEach(word=>dictionary.delete(word));dictionaryManifest=await manifest.json();}catch(e){console.error('Golden Acrostic word list unavailable',e);dictionary=new Set();}}
window.addEventListener('hashchange',route);await loadDictionary();route();
