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


## Precision Pursuit — exploratory standalone prototype (feature/precision-pursuit)

This branch adds a playable **Numbers** experiment at **http://localhost:5173/#/numbers**. It does **not** amend Golden Acrostic's rules, content, dictionary or daily-state code.

- Choose one of six fixed challenges, each containing three questions (18 provisional questions covering six editorial categories).
- Default 90-second shared thinking-time budget; optional 120-second or untimed comparison. The clock pauses during answer reveals and resumes for the next question. Exiting loses progress, and there is no scored daily Numbers attempt yet.
- Guidance is displayed automatically; the player enters a non-negative number using digits and a dot for decimals (no grouping commas or scientific notation). Units are indicated next to the answer field.
- Each question scores `Math.round(1000 * (min(guess, answer) / max(guess, answer)) ** 1.5)` for positive guesses, with zero scoring zero. Three questions total up to 3,000 points. This is **provisional**, not a certified balance model.
- After each submission the player sees a reference answer, points, an error label, a short explanation and the source link. End-of-round results summarise all submitted guesses.
- The independent functions in `src/precision-logic.js` include `buildPrecisionResult`, producing `precision-pursuit-result/v0.1` with answer snapshots, question identifiers, scores and timing. No roguelike scoring or power-ups are included.
- `src/precision-content.js` retains source URL and category metadata. These are **playtest editorial candidates**, not a verified commercial publishing catalogue. Approximate reference answers, variable quantities and individual source links require final editorial and licensing review. Rejected proposals such as a non-exact Minecraft sales milestone are not included.

Run `npm test` and `npm run dev` inside WSL (Node.js 20+). The new `tests/precision.test.js` covers scoring invariants, input parsing, content shape and result structure. Manual checks still needed: actual mobile touch/keyboard flow, 90-second timeout while typing, timer pause/resume, early exit, full six-round playthrough, answer-source links and subjective enjoyment. No GitHub Actions.

**Important:** This is a feature-branch experiment, not Precision Pursuit v1.0. No production daily lockout, reliable 21-day content queue, automatic source ingestion or content-feasibility certification has been implemented.
