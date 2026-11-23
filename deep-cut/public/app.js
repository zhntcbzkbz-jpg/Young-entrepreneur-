import { PROMPTS, THEMES } from "./prompts.js";
import {
  ROUND_SECONDS, DAILY_ROUNDS, ENDLESS_LIVES,
  preparePrompt, matchAnswer, pointsFor, tierFor, oneIn,
  dailyPrompts, dailyNumber, localDateKey, shuffle, rng, hashString, sparkline, normalize, displayName,
} from "./engine.js";

const POOL = PROMPTS.map(preparePrompt);
const BY_ID = new Map(POOL.map((p) => [p.id, p]));
const app = document.getElementById("app");

// ---------- storage (best effort: the game works without it) ----------

const STORE_KEY = "deep-cut:v1";
const VERDICT_KEY = "deep-cut:verdicts";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode or full */ }
}

const store = Object.assign({ daily: {}, endlessBest: 0, packBest: {} }, readJSON(STORE_KEY, {}));
const save = () => writeJSON(STORE_KEY, store);
const verdictCache = readJSON(VERDICT_KEY, {});

// ---------- answer judge (optional, server-side) ----------

let judgeOn = false;

async function checkJudge() {
  try {
    const res = await fetch("api/status", { cache: "no-store" });
    judgeOn = res.ok && (await res.json()).judge === true;
  } catch {
    judgeOn = false;
  }
  document.getElementById("judge-note").textContent = judgeOn
    ? "Answers that aren't on our list are checked by Claude and marked as such."
    : "Answers that aren't on our list score 0.";
}

async function askJudge(prompt, input) {
  const cacheKey = `${prompt.id}:${normalize(input)}`;
  if (verdictCache[cacheKey]) return verdictCache[cacheKey];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch("api/judge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ promptId: prompt.id, answer: input }),
      signal: controller.signal,
    });
    if (res.status === 503) judgeOn = false;
    if (!res.ok) return null;
    const verdict = await res.json();
    verdictCache[cacheKey] = verdict;
    writeJSON(VERDICT_KEY, verdictCache);
    return verdict;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- helpers ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const today = () => localDateKey();

function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function untilMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const mins = Math.max(1, Math.round((next - now) / 60000));
  const h = Math.floor(mins / 60);
  return h ? `${h}h ${mins % 60}m` : `${mins}m`;
}

function streak() {
  let count = 0;
  const d = new Date();
  if (!store.daily[localDateKey(d)]?.done) d.setDate(d.getDate() - 1);
  while (store.daily[localDateKey(d)]?.done) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function bestDaily() {
  return Object.values(store.daily).filter((r) => r.done).reduce((m, r) => Math.max(m, total(r.rounds)), 0);
}

const total = (rounds) => rounds.reduce((s, r) => s + r.points, 0);

/** Small bar chart of round scores. The share text uses a Unicode sparkline instead. */
function bars(scores) {
  return `<div class="bars" role="img" aria-label="Round scores: ${scores.join(", ")}">${scores
    .map((s) => `<i class="${s >= 80 ? "hot" : s === 0 ? "zero" : ""}" style="height:${Math.max(6, s)}%"></i>`)
    .join("")}</div>`;
}

let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
}

function show(html) {
  stopTimer();
  app.innerHTML = `<div class="enter">${html}</div>`;
  window.scrollTo({ top: 0 });
}

// ---------- game state ----------

let game = null;
let timer = null;
let revealedAt = 0;

function newGame(mode, prompts, extra = {}) {
  game = { mode, prompts, index: 0, rounds: [], lives: ENDLESS_LIVES, dateKey: today(), ...extra };
}

function startDaily() {
  const key = today();
  const saved = store.daily[key];
  if (saved?.done) return renderResults({ mode: "daily", rounds: saved.rounds, dateKey: key });
  const prompts = dailyPrompts(POOL, key);
  newGame("daily", prompts);
  if (saved?.rounds?.length) {
    game.rounds = saved.rounds;
    game.index = saved.rounds.length;
  }
  renderRound();
}

function startEndless() {
  const order = shuffle(POOL, Math.random);
  newGame("endless", order);
  renderRound();
}

function startPack(theme) {
  const prompts = shuffle(POOL.filter((p) => p.theme === theme), Math.random);
  newGame("pack", prompts, { theme });
  renderRound();
}

function persistDaily() {
  if (game.mode !== "daily") return;
  store.daily[game.dateKey] = { rounds: game.rounds, done: game.rounds.length >= game.prompts.length };
  save();
}

// ---------- home ----------

function renderHome() {
  game = null;
  const key = today();
  const saved = store.daily[key];
  const no = dailyNumber(key);

  let daily;
  if (saved?.done) {
    const scores = saved.rounds.map((r) => r.points);
    daily = `
      <div class="done-card">
        <p class="kicker">Today's seven, done</p>
        <p class="total"><b>${total(saved.rounds)}</b><span>/ ${DAILY_ROUNDS * 100}</span></p>
        ${bars(scores)}
        <p class="sub" style="margin:0 0 16px">The next seven unlock in ${untilMidnight()}.</p>
        <div class="actions">
          <button class="btn" data-action="daily">See results</button>
          <button class="btn secondary" data-action="endless">Play endless</button>
        </div>
      </div>`;
  } else {
    const resume = saved?.rounds?.length;
    daily = `
      <div class="actions">
        <button class="btn" data-action="daily">${resume ? `Resume today's seven (round ${resume + 1})` : "Play today's seven"}</button>
        <button class="btn secondary" data-action="endless">Endless</button>
      </div>`;
  }

  show(`
    <p class="kicker">Daily No. ${no}</p>
    <h1 class="lede">Name the thing nobody else would.</h1>
    <p class="sub">Seven prompts, ${ROUND_SECONDS} seconds each. Common answers score a few points. Rare answers that are still correct score up to 100.</p>
    ${daily}

    <div class="stats">
      <div class="stat"><b>${streak()}</b><span>Day streak</span></div>
      <div class="stat"><b>${bestDaily() || "–"}</b><span>Best daily</span></div>
      <div class="stat"><b>${store.endlessBest || "–"}</b><span>Best endless</span></div>
    </div>

    <div class="section-head"><h2>Theme packs</h2><p>Five prompts each</p></div>
    <div class="packs">
      ${THEMES.map((t) => `
        <button class="pack" data-action="pack" data-theme="${esc(t)}">
          <strong>${esc(t)}</strong>
          <span>${store.packBest[t] ? `Best ${store.packBest[t]}` : "Not played"}</span>
        </button>`).join("")}
    </div>

    <div class="section-head"><h2>How it works</h2></div>
    <ol class="rules">
      <li><span><b>Answer the prompt.</b> Any correct answer counts, and small spelling slips are fine.</span></li>
      <li><span><b>Rarer scores higher.</b> The most common answer gets 5 points. One almost nobody gives gets close to 100.</span></li>
      <li><span><b>Wrong, blank or out of time scores 0.</b> In Endless, three of those end the run.</span></li>
    </ol>
  `);
}

// ---------- round ----------

function renderRound() {
  const prompt = game.prompts[game.index];
  const meta = game.mode === "endless"
    ? `<span>Round ${game.index + 1}</span><span class="lives" aria-label="${game.lives} lives left">${"●".repeat(game.lives)}<span class="lost">${"○".repeat(ENDLESS_LIVES - game.lives)}</span></span><span>${total(game.rounds)} pts</span>`
    : `<span>${game.index + 1} / ${game.prompts.length} · ${esc(prompt.theme)}</span><span>${total(game.rounds)} pts</span>`;

  show(`
    <div class="round-meta">${meta}</div>
    <div class="timer" id="timer" role="progressbar" aria-label="Time left" aria-valuemin="0" aria-valuemax="${ROUND_SECONDS}"><i></i></div>
    <h1 class="prompt">${esc(prompt.text)}</h1>
    <form class="answer-form" id="answer-form" autocomplete="off">
      <input class="answer-input" id="answer" name="answer" maxlength="60" placeholder="Your answer"
        autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Your answer">
      <div class="form-foot">
        <div class="actions">
          <button class="btn" type="submit">Answer</button>
          <button class="btn link" type="button" data-action="pass">Pass</button>
        </div>
        <span class="hint" id="hint">Press Enter to answer</span>
      </div>
    </form>
  `);

  const input = document.getElementById("answer");
  input.focus();
  document.getElementById("answer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submit(input.value, "answer");
  });
  startTimer(() => submit(input.value, "timeout"));
}

function startTimer(onExpire) {
  const bar = document.querySelector("#timer i");
  const wrap = document.getElementById("timer");
  const start = performance.now();
  const totalMs = ROUND_SECONDS * 1000;
  let lastSecond = ROUND_SECONDS;
  const tick = (now) => {
    const left = Math.max(0, totalMs - (now - start));
    bar.style.transform = `scaleX(${left / totalMs})`;
    const secs = Math.ceil(left / 1000);
    if (secs !== lastSecond) {
      lastSecond = secs;
      wrap.setAttribute("aria-valuenow", String(secs));
      wrap.classList.toggle("low", secs <= 5);
    }
    if (left <= 0) {
      timer = null;
      onExpire();
      return;
    }
    timer = requestAnimationFrame(tick);
  };
  timer = requestAnimationFrame(tick);
}

function stopTimer() {
  if (timer) cancelAnimationFrame(timer);
  timer = null;
}

let submitting = false;

async function submit(raw, reason) {
  if (!game || submitting) return;
  submitting = true;
  stopTimer();
  const prompt = game.prompts[game.index];
  const input = raw.trim().slice(0, 60);
  let round;

  try {
    if (!input) {
      round = { status: reason === "timeout" ? "timeout" : "pass" };
    } else {
      const hit = matchAnswer(prompt, input);
      if (hit) {
        round = { status: "listed", name: hit.answer.name, share: hit.answer.share, exact: hit.exact };
      } else if (judgeOn) {
        setChecking();
        const verdict = await askJudge(prompt, input);
        if (!verdict) round = { status: "unreachable" };
        else if (verdict.valid) {
          const relisted = matchAnswer(prompt, verdict.canonical);
          round = relisted
            ? { status: "listed", name: relisted.answer.name, share: relisted.answer.share, exact: false }
            : { status: "judged", name: verdict.canonical, share: verdict.share, note: verdict.note };
        } else round = { status: "invalid", note: verdict.note };
      } else {
        round = { status: "unlisted" };
      }
    }
  } finally {
    submitting = false;
  }

  round.promptId = prompt.id;
  round.input = input;
  if (input) round.display = displayName(prompt, round.name || input);
  round.points = round.share != null ? pointsFor(round.share, prompt.top) : 0;
  game.rounds.push(round);
  if (game.mode === "endless" && round.points === 0) game.lives--;
  persistDaily();
  renderReveal(prompt, round);
}

function setChecking() {
  const input = document.getElementById("answer");
  if (input) input.disabled = true;
  document.querySelectorAll("#answer-form button").forEach((b) => { b.disabled = true; });
  const hint = document.getElementById("hint");
  if (hint) {
    hint.className = "checking";
    hint.textContent = "Not on our list. Checking with Claude";
  }
}

// ---------- reveal ----------

function describe(round) {
  switch (round.status) {
    case "listed":
      return round.exact
        ? `About ${oneIn(round.share)} people would say this.`
        : `Read as <b>${esc(round.display)}</b>. About ${oneIn(round.share)} people would say this.`;
    case "judged":
      return `Estimated ${oneIn(round.share)} people.`;
    case "invalid": return "Doesn't count.";
    case "unlisted": return "Not on our list.";
    case "unreachable": return "Not on our list, and the judge couldn't be reached.";
    case "timeout": return "Out of time.";
    default: return "Passed.";
  }
}

function distribution(prompt, round) {
  const top = prompt.answers.slice(0, 5);
  const youIndex = round.name ? prompt.answers.findIndex((a) => a.name === round.name) : -1;
  const row = (name, share, you) => `
    <li class="${you ? "you" : ""}">
      <span class="name">${esc(name)}</span>
      <span class="bar"><i style="width:${Math.max(1, (share / prompt.top) * 100).toFixed(1)}%"></i></span>
      <span class="pct">${share >= 1 ? Math.round(share) : share.toFixed(1)}%</span>
    </li>`;
  let html = top.map((a, i) => row(displayName(prompt, a.name), a.share, i === youIndex)).join("");
  const outsideTop = round.share != null && (youIndex === -1 || youIndex >= 5);
  if (outsideTop) {
    html += `<li class="gap" aria-hidden="true">⋮</li>`;
    html += row(round.display, round.share, true);
  }
  return `<ul class="dist" aria-label="Most common answers">${html}</ul>`;
}

function deepCuts(prompt, round) {
  const tail = prompt.answers.filter((a) => a.share <= 0.3 && a.name !== round.name);
  const seed = hashString(`${prompt.id}:${game.dateKey}:${game.index}`);
  return shuffle(tail, rng(seed)).slice(0, 3).map((a) => displayName(prompt, a.name));
}

function renderReveal(prompt, round) {
  const last = game.mode === "endless" ? game.lives <= 0 : game.index + 1 >= game.prompts.length;
  const tier = round.share != null ? tierFor(round.share) : null;
  const tierClass = tier === "Deep cut" ? "deep" : tier === "Uncommon" ? "uncommon" : "";
  const said = round.input ? round.display : "No answer";
  const cuts = deepCuts(prompt, round);

  let judged = "";
  if (round.status === "judged") judged = `<p class="judged">Not on our list, so Claude checked it and accepted it. ${esc(round.note)}</p>`;
  if (round.status === "invalid" && round.note) judged = `<p class="judged">Not on our list, so Claude checked it. ${esc(round.note)}</p>`;

  show(`
    <div class="round-meta"><span>${esc(prompt.text)}</span><span>${total(game.rounds)} pts</span></div>
    <div class="verdict">
      <div>
        ${tier ? `<span class="tier ${tierClass}">${tier}</span>` : ""}
        <p class="said ${round.points ? "" : "miss"}">${esc(said)}</p>
        <p class="detail">${describe(round)}</p>
      </div>
      <div class="points"><b>${round.points}</b><span>points</span></div>
    </div>
    ${judged}
    <p class="kicker">What most people say</p>
    ${distribution(prompt, round)}
    ${cuts.length ? `<p class="cuts">Deep cuts on our list: <b>${cuts.map(esc).join("</b>, <b>")}</b>.</p>` : ""}
    <div class="actions">
      <button class="btn" data-action="next" id="next">${last ? "See results" : "Next prompt"}</button>
      ${game.mode === "endless" && !last ? `<span class="hint lives" aria-label="${game.lives} lives left">${"●".repeat(game.lives)}<span class="lost">${"○".repeat(ENDLESS_LIVES - game.lives)}</span></span>` : ""}
    </div>
  `);
  revealedAt = performance.now();
  document.getElementById("next").focus({ preventScroll: true });
}

function next() {
  if (!game || performance.now() - revealedAt < 300) return; // the Enter that submitted shouldn't also skip
  const over = game.mode === "endless" ? game.lives <= 0 : game.index + 1 >= game.prompts.length;
  if (over) return renderResults(game);
  game.index++;
  if (game.mode === "endless" && game.index >= game.prompts.length) {
    // The whole pool is used up. Reshuffle and keep going.
    game.prompts = game.prompts.concat(shuffle(POOL, Math.random));
  }
  renderRound();
}

// ---------- results ----------

function shareText(result) {
  const scores = result.rounds.map((r) => r.points);
  const sum = total(result.rounds);
  const head = result.mode === "daily"
    ? `Deep Cut No. ${dailyNumber(result.dateKey)}  ${sum}/${DAILY_ROUNDS * 100}`
    : result.mode === "pack"
      ? `Deep Cut · ${result.theme}  ${sum}/${result.rounds.length * 100}`
      : `Deep Cut · Endless  ${sum} pts in ${result.rounds.length} rounds`;
  const best = result.rounds.reduce((b, r) => (r.points > (b?.points ?? -1) ? r : b), null);
  const bestLine = best && best.points >= 80 ? `\nDeepest: ${best.points} on “${BY_ID.get(best.promptId)?.text}”` : "";
  const url = location.protocol.startsWith("http") ? `\n${location.origin}${location.pathname}` : "";
  return `${head}\n${sparkline(scores)}${bestLine}${url}`;
}

function renderResults(result) {
  const sum = total(result.rounds);
  const max = result.mode === "endless" ? null : result.rounds.length * 100;
  if (result.mode === "endless" && sum > (store.endlessBest || 0)) { store.endlessBest = sum; save(); }
  if (result.mode === "pack" && sum > (store.packBest[result.theme] || 0)) { store.packBest[result.theme] = sum; save(); }
  const scores = result.rounds.map((r) => r.points);

  const title = result.mode === "daily"
    ? `Daily No. ${dailyNumber(result.dateKey)}`
    : result.mode === "pack" ? `${result.theme} pack` : `Endless · ${result.rounds.length} rounds`;

  const rows = result.rounds.map((r) => {
    const p = BY_ID.get(r.promptId);
    const ans = r.input ? r.display || r.input : "–";
    const mark = r.status === "judged" ? ' <span class="hint" title="Checked by Claude">*</span>' : "";
    return `<tr>
      <td><span class="q">${esc(p?.text ?? "")}</span><span class="a ${r.points ? "" : "miss"}">${esc(ans)}</span>${mark}</td>
      <td class="p">${r.points}</td>
    </tr>`;
  }).join("");
  const anyJudged = result.rounds.some((r) => r.status === "judged");

  show(`
    <p class="kicker">${esc(title)}</p>
    <p class="total"><b>${sum}</b>${max ? `<span>/ ${max}</span>` : "<span>pts</span>"}</p>
    ${bars(scores)}
    <table class="ledger">
      <thead><tr><th>Prompt and answer</th><th>Pts</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${anyJudged ? `<p class="hint" style="margin:-16px 0 24px">* Not on our list. Checked by Claude.</p>` : ""}
    <div class="actions">
      <button class="btn" data-action="share">Share score</button>
      ${result.mode === "daily"
        ? `<button class="btn secondary" data-action="endless">Play endless</button>`
        : `<button class="btn secondary" data-action="${result.mode === "pack" ? "pack" : "endless"}" data-theme="${esc(result.theme ?? "")}">Play again</button>`}
      <button class="btn link" data-action="home">Home</button>
    </div>
    ${result.mode === "daily" ? `<p class="sub" style="margin-top:20px">The next seven unlock in ${untilMidnight()}.</p>` : ""}
  `);
  lastResult = result;
}

let lastResult = null;

async function share() {
  if (!lastResult) return;
  const text = shareText(lastResult);
  try {
    if (navigator.share && matchMedia("(hover: none)").matches) {
      await navigator.share({ text });
      return;
    }
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  } catch (err) {
    if (err?.name !== "AbortError") toast("Couldn't copy. Select the score and copy it yourself.");
  }
}

// ---------- wiring ----------

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (action === "home") { e.preventDefault(); renderHome(); }
  else if (action === "daily") startDaily();
  else if (action === "endless") startEndless();
  else if (action === "pack") startPack(el.dataset.theme);
  else if (action === "pass") submit("", "pass");
  else if (action === "next") next();
  else if (action === "share") share();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && game && document.getElementById("answer") && !submitting) {
    submit("", "pass");
  }
});

document.getElementById("dateline").textContent = `${formatDate()} · No. ${dailyNumber(today())}`;
renderHome();
checkJudge();
