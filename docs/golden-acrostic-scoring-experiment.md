# Golden Acrostic — exploratory scoring study (v0.3)

Status: **exploratory comparison, not approved scoring**. Source: the 117,250-entry bundled v0.2 English word list and the three prototype seeds (CRANE/R, SPARK/A, BRIDGE/I). Dictionary contents have **not** been editorially approved; they include proper names, obscure words and nonstandard items. The results below are mathematical possibilities in that list, **not** observed player performances or fair challenge maxima.

## Candidate scoring approaches

Let L = total letters across all accepted words and G = total occurrences of the named golden letter (including its appearance as a word's initial letter). Base = 10L.

- Larger fixed bonus: `10L + 35G`.
- Per-word ×1.25: sum over words of `10 × length × (1 + 0.25 × gold count)`.
- Per-word ×1.5: sum over words of `10 × length × (1 + 0.5 × gold count)`.
- Round-wide direct (user proposal): `10L × G`. This gives zero when G=0.
- Round-wide moderated (control): `10L × (1 + 0.5G)`.

The playable experiment exposes fixed +35, direct round-wide, and moderated round-wide, not the per-word alternatives. All share the same input and dictionary to isolate the scoring effect.

## Dictionary-derived theoretical optima

These are computed independently for each candidate model. Entries limited to 3–12 letters were used for a more realistic comparison, but unusual proper names still dominate some results. Six-letter BRIDGE includes a sixth slot and is not directly comparable with five-letter scores.

| Seed/golden | Fixed +35 | Per-word ×1.25 | Per-word ×1.5 | Round-wide direct | Round-wide moderated |
|---|---:|---:|---:|---:|---:|
| CRANE/R | 1,210 | 1,110 | 1,620 | 10,440 | 5,800 |
| SPARK/A | 1,295 | 1,158 | 1,735 | 11,760 | 6,440 |
| BRIDGE/I (6 slots) | 1,495 | 1,360 | 2,010 | 15,870 | 8,625 |

## Grounded example

All five of these CRANE/R words occur in the bundled dictionary: `crater`, `refrigerator`, `argument`, `narrator`, `extraterrestrial`.

These contain 50 letters and 14 R's. They score 990 with fixed +35, 7,000 with the direct round-wide multiplier, or 4,000 with the moderated round-wide multiplier. The large difference in displayed magnitude is not itself evidence of a better incentive.

Replacing a word that removes 3 letters while adding 2 golden letters in a 40-letter, 7-golden-letter round changes the direct multiplier score from `400 × 7 = 2,800` to `370 × 9 = 3,330`. This demonstrates why shortening one word can improve the whole result.

## Primary concerns and validation tasks

1. **Dictionary suitability:** The list includes many names and unusual entries, undermining maxima and fairness. Audit and version accepted terms before any competitive comparison.
2. **Difficulty/cross-seed equity:** Some seed/golden combinations offer more high-frequency-letter opportunities. Use several curated five-slot seeds in playtests.
3. **Zero-golden penalty:** Direct multiplication yields zero if no golden letter is submitted. Is that acceptable for partial rounds or a timed novice?
4. **Scoring comprehension:** Ensure players understand that per-row numbers are **base points** in multiplier models, not the final word contributions.
5. **Behavioural effect:** Record whether players consciously choose shorter golden-heavy words, whether they enjoy revisions, and whether the total remains legible under a 90-second clock.
6. **Scale:** Direct multiplier creates much larger scores; it may need future calibration against other rounds, but this is deliberately deferred.

### Proposed next playtest

Use the same five-letter seed with the **fixed +35** model, then **direct round-wide**, then **moderated round-wide**, counterbalancing model order across additional seeds. The first comparison is exploratory because familiarity with the seed carries over; do not infer final preference from a single repeated run.
