# Golden Acrostic v1.0 — candidate release notes

This is an initial standalone release candidate awaiting manual checklist sign-off, not a certified finished game.

## Locked decisions
- Five starting letters, five editable 3–20-letter English answers, 90 seconds.
- Accepted word replacement, duplicate prevention, invalid edit retains prior accepted word.
- Score = ten points per accepted letter times (one plus all golden-letter occurrences).
- ESDB Size 70 Level 4 with US and British spellings, documented supplements and exclusions.
- Thirty agreed seed/golden combinations. UTC-day rotation. One recorded scored attempt per browser-local UTC day.
- One separate repeatable practice combination: TRACE, golden R.
- No “Suggest a word” UI. Keyboard tab order must move from field to field.
- Result breakdown and structured output contract; no cross-game scores or power-ups yet.

## Manual release checks (do not mark complete without testing)
1. Start a daily attempt; check five fields, clock and scoring on phone and desktop.
2. Enter/edit/reject a word; confirm saved prior answer and correct score.
3. Use Tab and Enter across fields. Confirm no “Suggest a word” focus stop.
4. Refresh mid-attempt; verify original answers and deadline persist.
5. Finish early and revisit; confirm no new scored attempt the same UTC day.
6. Repeat practice; confirm daily result unaffected.
7. Check scoreboard, keyboard contrast, sizing and touch responsiveness.
8. Check dictionary acceptance of marvellous, ditzy, credences, characterisation, parsnip, karats, petrichor and bloggy.
9. Review dictionary source/permission notes; accept documented limitations.
10. Record player feedback and decide whether Golden Acrostic passes the standalone viability gate.

## Deferred
- Server-side attempt enforcement, clocks and accounts.
- Expanded daily seed catalogue, balancing and analytics.
- Full offensive-language moderation audit and ongoing word suggestions.
- Roguelike integration, power-ups, and fair cross-game scoring.
- Definitive selection/certification of the other three games.
