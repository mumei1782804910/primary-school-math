# Maths Buddy 🐨

A maths practice app for primary school kids (Foundation to Year 6), guided by the
Australian Curriculum. Plain HTML, CSS and JavaScript: no build step, no server, no accounts.

## What's inside

- **Pick a year** (Foundation, Year 1–6) and the topics change to suit.
- **23 topics** across the five curriculum strands:
  - Number: counting, place value, compare & order, + − × ÷, fractions, decimals,
    percentages, money, number facts, word problems
  - Algebra: patterns, missing numbers
  - Measurement: time, measuring, perimeter & area
  - Space: shapes, angles, grids & coordinates
  - Statistics & Probability: graphs & data, chance
- **Mixed Quiz**: random questions from every topic in the chosen year.
- **Times Tables** challenge: Normal (single digits) or Advanced (one number 10–20),
  with a countdown per question (default 10 seconds) and 10 questions (both adjustable).
- Questions are randomly generated, so every quiz is different.
- Results show % correct, "X out of N", and each missed question with the right answer in red.
- Up to 3 stars per topic per year; every 3 stars unlocks a sticker. Progress is saved
  on the device (browser localStorage).
- Settings (⚙️): questions per quiz, optional timer for topic quizzes, reset progress.

## Files

```
index.html          page layout
style.css           styles
js/core.js          helpers and drawings (clocks, shapes, graphs, Kip the koala)
js/topics-*.js      question generators, one block per topic
js/app.js           home screen, settings, stars and stickers
js/quiz.js          quiz engine and results
tools/              developer test script (not needed on the website)
```

## Run it locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and
visit http://localhost:8000.

## Put it on GitHub Pages

The site needs `index.html`, `style.css` and the whole `js/` folder, kept in the same layout.

1. On GitHub, open your repository → **Add file → Upload files**.
2. Drag in `index.html`, `style.css` and the `js` folder (drag the folder itself so the
   files stay inside `js/`). Commit.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. After a minute the app is live at `https://<your-username>.github.io/<repository-name>/`.

On a phone, open that address and use "Add to Home Screen" to get an app-style icon.

## Add or change questions

Each topic is one `topic(id, name, icon, strand, minYear, maxYear, generator)` call in
`js/topics-*.js`. The generator receives the year (0 = Foundation) and returns
`num(question, answer)` for a typed answer or `mc(question, answer, wrongAnswers)` for
multiple choice. Run `node tools/test-questions.js` to check every generator.
