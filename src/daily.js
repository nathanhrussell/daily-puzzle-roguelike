// Local-only daily attempt state, deliberately separate from game/scoring logic.
export const DAILY_VERSION = 'golden-acrostic:v1';
export const DAILY_DURATION_MS = 90_000;
export const utcDay = (date = new Date()) => date.toISOString().slice(0, 10);
export function challengeIndex(day, count) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isInteger(count) || count < 1) throw Error('Invalid daily challenge');
  const ordinal = Date.parse(`${day}T00:00:00Z`) / 86_400_000;
  return ((ordinal % count) + count) % count;
}
export const dailyKey = day => `${DAILY_VERSION}:daily:${day}`;
export function freshDaily(day, count, now = Date.now()) {
  return {version:1,day,fixture:challengeIndex(day,count),startedAt:now,endsAt:now+DAILY_DURATION_MS,words:['','','','',''],finishedAt:null,reason:null};
}
export function safeDaily(raw, day, count) {
  if (!raw || raw.version !== 1 || raw.day !== day || raw.fixture !== challengeIndex(day,count) ||
      !Number.isSafeInteger(raw.startedAt) || !Number.isSafeInteger(raw.endsAt) ||
      raw.endsAt - raw.startedAt !== DAILY_DURATION_MS ||
      !Array.isArray(raw.words) || raw.words.length !== 5 ||
      !raw.words.every(w => typeof w === 'string' && (w === '' || /^[a-z]{3,20}$/.test(w))) ||
      !(raw.finishedAt === null || Number.isSafeInteger(raw.finishedAt))) return null;
  return raw;
}
export function loadDaily(storage, day, count) {
  const raw=storage.getItem(dailyKey(day));
  if (!raw) return null;
  try { return safeDaily(JSON.parse(raw),day,count); } catch { return null; }
}
export function saveDaily(storage, record) { storage.setItem(dailyKey(record.day),JSON.stringify(record)); }
export function remainingSeconds(record, now=Date.now()) { return Math.max(0,Math.ceil((record.endsAt-now)/1000)); }
export function markFinished(record, reason, now=Date.now()) {
  return {...record,finishedAt: now,reason};
}
export function buildWordResult({mode,day,seed,gold,words,score,startedAt,finishedAt,reason,dictionaryVersion}) {
  return {schema:'golden-acrostic-result/v1',mode,day:mode==='daily'?day:null,
    challenge:{seed,goldenLetter:gold},acceptedWords:[...words],
    totalLetters:score.base/10,basePoints:score.base,goldenOccurrences:score.gold,
    multiplier:score.multiplier,finalScore:score.points,
    startedAt:new Date(startedAt).toISOString(),finishedAt:new Date(finishedAt).toISOString(),
    completionReason:reason,dictionaryVersion};
}
