# Daily Puzzle Lab — four standalone browser prototypes

Four independent, mobile-first puzzle experiments. **Prototype v0.1, not approved final rules**. No global scoring, daily lockout, leaderboards, account system or power-ups are implemented.

## Start on Windows 11 / WSL

1. Install Node.js 20+ in WSL (22 LTS recommended). Run `node -v`.
2. From WSL, navigate to this repository (prefer `~/projects/` rather than `/mnt/c/`):
   ```bash
   cd ~/projects/daily-puzzle-prototypes
   npm run dev
   ```
3. Open `http://localhost:5173` on Windows. For phone testing on the same Wi-Fi network, use your computer's reachable IP and port 5173 (Windows Firewall/WSL networking may need configuration). Browser device emulation is useful but not a substitute for phone testing.
4. Run `npm test` for built-in automated tests. No `npm install`, dependencies or GitHub Actions required.

## Repo

- `index.html`: browser entry
- `src/app.js`: standalone route/state/UI implementation
- `src/content.js`: deterministic sample challenge fixtures
- `src/logic.js`: testable scoring and validation functions
- `src/styles.css`: responsive mobile-first UI, accessible controls, reduced-motion handling
- `data/dictionary.json`: prototype-only CMU-derived dictionary (see caveats)
- `tests/logic.test.js`: Node's built-in test runner
- `server.mjs`: dependency-free local server

## Current mechanics (provisional)

- **Golden Acrostic:** five-letter seeds for two fixtures, a six-letter comparison fixture, one English word per starting letter, 10 points per letter plus 15 per golden-letter occurrence. Validated against a bundled CMU-derived word list. This list is **not a publication-ready word authority**: it may admit names and rare terms and reject legitimate inflections. No definition, proper-noun filtering or profanity screening is supplied. Test 5 vs 6 before locking rules.
- **Precision Pursuit:** three numerical estimates. 1,000 points per exact answer; exponentially decreasing credit for relative error. Not calibrated for difficulty or unequal numerical scales. Each estimate uses a reveal screen.
- **Answer Allocation:** match three prompts to three unique answers, 1,000 total points distributed equally. This is a provisional interpretation of the game name and must be reviewed against the governing documents.
- **Perfect Order:** order five items using accessible up/down buttons. 700 points based on total displacement and 300 additional points for perfection. Not calibrated against chance or task difficulty.

Time-based mode is 90 seconds by default; also offers 120 seconds and untimed mode. Scores are stored locally only as best-per-game values. The current numbers fixture uses three questions in a single timed session; the other games use a single fixture per session.

## Known validation gates before integration

1. Recover and reconcile the two approved project governance documents. The new project documents were not accessible while creating this package; do not claim that the rules here implement their exact decisions.
2. Assess fun, clarity, mobile friction, timing, 5 vs 6 letters, dictionary appropriateness, numeric difficulty/feedback, unique allocation, ranking partial credit.
3. Verify scoring fairness using simulated play and user testing; remove obvious optimal strategies.
4. Curate daily content, document provenance and unambiguous answers, build robust validation and consider server-issued daily content only after individual prototypes pass.
5. Only then design a unified daily run, multiplier, power-ups and sharing.

## GitHub setup (manual, no CI)

```bash
cd ~/projects/daily-puzzle-prototypes
git init
git add .
git commit -m "Add standalone puzzle prototypes v0.1"
# Create a blank GitHub repository in your browser, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/daily-puzzle-prototypes.git
git push -u origin main
```

GitHub does not need Actions enabled for this project. Tests are run on WSL before commits.

## Licensing / word-data note

The word list is extracted from the installed `cmudict` Python package as a prototype aid. Review and preserve the upstream CMU Pronouncing Dictionary licence and source attribution before any distribution beyond internal prototyping. Replace with a properly licensed, editorially appropriate dictionary before production.
