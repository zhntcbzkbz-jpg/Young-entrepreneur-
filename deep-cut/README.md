# Deep Cut

A daily trivia game where the rarest correct answer wins.

You get a prompt such as *Name a fruit* and 20 seconds. "Apple" is right, but it's what everyone says, so it scores 5. "Jabuticaba" is also right, and almost nobody says it, so it scores close to 100.

## Look and feel

Deep space in 8-bit. Common answers barely leave orbit, and rare answers that are still right fly out to deep space. After each answer, a pixel rocket flies from Earth along a track split into four zones (low orbit, moon range, outer planets, deep space), and the score counts up as it goes. The timer is a fuel gauge that drains one cell per second. Each theme is its own planet, and Endless gives you three ships.

All the art is original and drawn in code (`public/pixel.js`): the rocket and ship sprites, dithered planets generated from a seed, a drifting starfield, faint CRT scanlines, and square-wave sound effects through Web Audio (the rarer the answer, the higher the launch arpeggio climbs, and the SFX button mutes them). The fonts are Press Start 2P and VT323, bundled locally under the SIL Open Font License. With "reduce motion" turned on, the stars stay still and the rocket jumps straight to where it lands.

## Run it

```
cd deep-cut
npm install
npm start          # http://localhost:5173
npm test
```

Node 20 or later. There's no build step. `public/` is plain HTML, CSS and ES modules, so it also works from any static host. The judge described below just stays off there.

## Modes

- **Daily**: the same seven prompts for everyone on a given date, with no two in a row from the same theme and nothing repeated from the day before. Progress is saved after every answer, so a refresh doesn't reset the day.
- **Endless**: random prompts until you score 0 three times.
- **Theme packs**: the five prompts from one theme (Food, Places, Nature, Culture, Science, Everyday).

Streaks and best scores are kept in the browser's `localStorage`.

## How answers are scored

Each of the 30 prompts has a list of accepted answers, about 3,500 in total. Each answer has an estimated **share**, meaning how many of 100 people would give it.

- Points = `100 − 95 × share ÷ top share`, so the most common answer scores 5 and a long-tail answer scores 99 or 100.
- Matching ignores case, accents, articles, punctuation, spaces and simple plurals, and accepts listed alternative names (*pitaya* for dragon fruit, *Swaziland* for Eswatini). Words of five letters or more also tolerate one typo, and words of nine or more tolerate two.
- After each answer, the reveal shows the five most common answers on a bar chart, where your answer sits, and three deep cuts from the list.

**The shares are editorial estimates, not survey data.** The game says so on every page. They only need to be right relative to each other.

## Where the AI is used

Claude is used in one narrow place: an answer that isn't on the list. Without it, every unlisted answer scores 0, which is unfair to someone who knows a real breed of dog that the list missed.

When `ANTHROPIC_API_KEY` is set, the server sends only unlisted answers to Claude (`judge.mjs`). It returns a structured verdict: whether the answer is valid, its correct name, an estimated share, and a one-line note. The game then:

- labels the answer **"Not on our list, so Claude checked it"** with the note, and marks it with an asterisk on the results screen;
- caches verdicts on the server and in the browser, so each answer is only checked once;
- treats the player's text as untrusted data inside tags, limits it to 60 characters, rate-limits the route (20 checks a minute per address), and clamps the estimated share to between 0.1 and 50;
- falls back to "Not on our list" if the judge is off or can't be reached.

Claude doesn't write the prompts, generate the copy, or add commentary to your answers.

| Variable | Default | |
|---|---|---|
| `ANTHROPIC_API_KEY` | (unset) | Turns the judge on |
| `DEEP_CUT_MODEL` | `claude-opus-5-5` | Model used for verdicts (low effort, server-side refusal fallback on) |
| `PORT` | `5173` | |

## Adding prompts

Edit `public/prompts.js`. Each prompt's answers use a compact format:

```
apple=20|apples; dragon fruit=0.4|pitaya|pitahaya; jabuticaba
```

`=n` is the share (leave it off for long-tail answers, which default to 0.2) and `|` adds alternative names. Set `titleCase: true` on prompts made of proper nouns. `npm test` checks every prompt for duplicates, aliases that point at two answers, and a sensible top answer.

## Files

```
public/index.html    page shell
public/styles.css    the 8-bit space design (pixel frames and buttons, fuel gauge, flight track)
public/pixel.js      sprites, generated planets, starfield, sound effects
public/fonts/        Press Start 2P and VT323 (OFL)
public/app.js        screens, timer, storage, sharing
public/engine.js     matching, scoring and daily selection (no DOM; shared with tests and server)
public/prompts.js    the 30 prompts
server.mjs           static server, /api/status, /api/judge
judge.mjs            the Claude call
test/                node:test suite
```
