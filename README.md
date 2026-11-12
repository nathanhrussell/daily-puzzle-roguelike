# Golden Acrostic v1.0 — standalone playtest release

**Status:** Playtest candidate, awaiting the final user sign-off checklist. Golden Acrostic is fully playable standalone and prepared to return structured results for possible integration into the four-game Daily Puzzle Roguelike. The other three games are unchanged experimental previews under `#/numbers`, `#/trivia` and `#/ranking`; open `#/collection` for their index.

## Run locally

Requirements: Node.js 20+; no npm installation needed (no runtime dependencies).

```bash
npm test
npm run dev
```

Open **http://localhost:5173**. The landing page is Golden Acrostic. If the browser opens an old route, use `http://localhost:5173/#/words`.

Do not open `index.html` directly from the file system because browser `fetch` needs the local server.

## How to play

Find one valid English word beginning with each of the five starting letters, in 90 seconds. All five fields remain editable throughout; a failed edit leaves the previous valid word in place. Minimum 3, maximum 20 ASCII letters. Exact duplicates within a round are rejected. Each accepted letter earns ten points; every occurrence of the golden letter across the five accepted words increases a round-wide multiplier, starting from ×1.

Score = `10 × accepted letter count × (1 + golden-letter occurrences)`.

The **daily challenge** uses one of thirty approved seed and golden-letter pairs, deterministically selected by UTC date. Every player on the same UTC day receives the same pair. **Starting the daily round commits the day's one scored attempt** in browser local storage. Accepted words are saved immediately. Refreshing or closing the page does not reset the 90-second deadline; a resumed round uses the original deadline, and a completed/expired round shows its result. A new UTC day allows a new attempt. Early finishing ends the scored attempt. The **practice** round uses `TRACE` + golden letter `R` (outside the daily catalogue) and can be repeated without affecting daily attempts.

**Limitations of local-only daily enforcement:** The one-attempt restriction applies to the same browser profile with site storage enabled. It cannot prevent players from clearing storage, using a different browser/device, or changing their device clock. There are no accounts, server-side results or leaderboards. Daily attempts cannot be verified globally; this is intentionally deferred until a possible combined daily release. Day boundaries are **00:00 UTC**, not local midnight.

## Dictionary

`data/dictionary.json` is generated from the **user-provided English Speller Database (ESDB) Size 70 / Variant Level 4 / American and two British conventions / UTF-8, both diacritic forms** export, revision 24 June 2026. The rule set accepts only lowercase ASCII A–Z words 3–20 characters long, with three documented supplementary words and a limited exact-word exclusion list. The ESDB source archive and copyright/permission notices are included under `vendor/esdb-level4/`.

To rebuild and verify the SHA-256 checksum:

```bash
python3 scripts/build_esdb.py
npm test
```

The version and checksums are recorded in `data/dictionary_manifest.json`. The generator uses the standard Python library only. The ESDB README and notices must remain with redistributed derivatives.

**Not certified:** The list has passed targeted acceptance/rejection checks and the reported false-rejection regressions, but it is not exhaustive. Some legitimate words may still be missing, and inappropriate or unusual forms may still remain. The exclusion list is a limited reviewed set, not a comprehensive offensive-language audit. A new dictionary version may change how previously saved words are validated on resume; production-grade permanent results would require durable scoring snapshots and/or a backend. No “Suggest a word” control is present.

## Standalone integration boundary

`src/logic.js` contains deterministic scoring independent of the interface; `src/daily.js` contains local-only daily-state helpers and a `buildWordResult(...)` contract. The result object has schema `golden-acrostic-result/v1` with accepted words, seed, golden letter, base points, multiplier, total score, completion reason, timestamps and dictionary version. The existing UI computes this result upon finishing. No shared roguelike scoring, power-ups or cross-game multipliers are implemented; the single-game score is unchanged.

## Testing and v1.0 checklist

Run `npm test` before playtesting. The tests cover scoring, word validation, source-dictionary hashes, reported omissions, reviewed exclusions, the thirty challenges, practice isolation, persisted daily state and the integration result schema. A **manual** sign-off is still required for responsive layout, keyboard/tab flow, timer/early finish, refresh-and-resume, completed-result display, mobile touch controls and general enjoyability. Automated tests do not fully simulate browser interaction.

Other three games are preserved as experimental prototypes only. Their scoring rules are not certified or balanced against Golden Acrostic, and future combined daily content is out of scope.
