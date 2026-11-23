import { PROMPTS, THEMES } from "./prompts.js";
import {
  ROUND_SECONDS, DAILY_ROUNDS, ENDLESS_LIVES,
  preparePrompt, matchAnswer, pointsFor, oneIn,
  dailyPrompts, dailyNumber, localDateKey, shuffle, rng, hashString, sparkline, normalize, displayName,
} from "./engine.js";
import { rocketSVG, shipSVG, planetImg, startStarfield, sfx, isMuted, setMuted } from "./pixel.js";

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
    .map((s) => `<i class="${s >= 80 ? "hot" : s === 0 ? "zero" : ""}" style="height:${Math.max(8, s)}%"></i>`)
    .join("")}</div>`;
}

// How far an answer flies. The track gives each zone a quarter of its length,
// so the rare end isn't squashed into the last few pixels.
const ZONES = [
  { key: "orbit", label: "Low orbit", from: 5, to: 40 },
  { key: "moon", label: "Moon range", from: 40, to: 75 },
  { key: "outer", label: "Outer planets", from: 75, to: 95 },
  { key: "deep", label: "Deep space", from: 95, to: 100 },
];

function zoneFor(points) {
  if (points <= 0) return { key: "pad", label: "Still on the pad" };
  return ZONES.find((z) => points < z.to) || ZONES[ZONES.length - 1];
}

function trackPercent(points) {
  if (points <= 0) return 0;
  const i = ZONES.findIndex((z) => points < z.to);
  const z = ZONES[i === -1 ? ZONES.length - 1 : i];
  const idx = i === -1 ? ZONES.length - 1 : i;
  const within = (Math.min(points, z.to) - z.from) / (z.to - z.from);
  return Math.max(2, (idx + within) * 25);
}

function ships(lives) {
  return `<span class="ships" aria-label="${lives} ships left">${Array.from({ length: ENDLESS_LIVES }, (_, i) =>
    shipSVG(i < lives ? "" : "lost")).join("")}</span>`;
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
      <div class="frame done-card">
        <p class="kicker">Daily No. ${no} · mission complete</p>
        <p class="total"><b>${total(saved.rounds)}</b><span>/ ${DAILY_ROUNDS * 100}</span></p>
        ${bars(scores)}
        <p class="sub">Next launch window opens in ${untilMidnight()}.</p>
        <div class="actions">
          <button class="btn" data-action="daily">Flight log</button>
          <button class="btn secondary" data-action="endless">Endless</button>
        </div>
      </div>`;
  } else {
    const resume = saved?.rounds?.length;
    daily = `
      <div class="actions">
        <button class="btn" data-action="daily"><span class="arrow">▶</span>${resume ? `Resume daily (${resume + 1}/${DAILY_ROUNDS})` : `Launch daily No. ${no}`}</button>
        <button class="btn secondary" data-action="endless">Endless</button>
      </div>`;
  }

  show(`
    <div class="hero">
      <div>
        <p class="kicker">Daily No. ${no} · ${DAILY_ROUNDS} prompts · ${ROUND_SECONDS}s each</p>
        <h1 class="lede">How far out can you <em>get?</em></h1>
        <p class="sub">Common answers barely leave orbit. Rare answers that are still right fly into deep space, for up to 100 points.</p>
      </div>
      <div class="hero-art">${rocketSVG("rocket")}${planetImg("Earth", 24, 3, "planet")}</div>
    </div>
    ${daily}

    <div class="stats">
      <div class="frame stat"><b>${streak()}</b><span>Day streak</span></div>
      <div class="frame stat"><b>${bestDaily() || "--"}</b><span>Best daily</span></div>
      <div class="frame stat"><b>${store.endlessBest || "--"}</b><span>Best endless</span></div>
    </div>

    <div class="section-head"><h2>Theme planets</h2><p>Five prompts each</p></div>
    <div class="packs">
      ${THEMES.map((t) => `
        <button class="frame pack" data-action="pack" data-theme="${esc(t)}">
          ${planetImg(t, 16, 3)}
          <span><strong>${esc(t)}</strong><span>${store.packBest[t] ? `Best ${store.packBest[t]}` : "Unexplored"}</span></span>
        </button>`).join("")}
    </div>

    <div class="section-head"><h2>How it works</h2></div>
    <ol class="rules">
      <li><span><b>Answer the prompt.</b> Any correct answer counts, and small spelling slips are fine.</span></li>
      <li><span><b>Rarer flies further.</b> The most common answer scores 5. One almost nobody gives scores close to 100.</span></li>
      <li><span><b>Wrong, blank or out of fuel scores 0.</b> In Endless you have three ships, and each zero costs one.</span></li>
    </ol>
    <div class="zones">
      ${ZONES.map((z) => `<div class="frame z-${z.key}"><b>${z.label}</b>${z.from}${z.to === 100 ? "+" : `–${z.to - 1}`}</div>`).join("")}
    </div>
  `);
}

// ---------- round ----------

function renderRound() {
  const prompt = game.prompts[game.index];
  const left = game.mode === "endless"
    ? `<span>Round ${game.index + 1}</span>${ships(game.lives)}`
    : `<span>${game.index + 1}/${game.prompts.length} · ${esc(prompt.theme)}</span>`;

  show(`
    <div class="round-meta">${left}<span class="score">${total(game.rounds)} pts</span></div>
    <div class="fuel" id="fuel" role="timer" aria-label="Seconds left">
      <label>FUEL</label>
      <div class="frame cells">${"<i></i>".repeat(ROUND_SECONDS)}</div>
      <span class="secs" id="secs">${ROUND_SECONDS}</span>
    </div>
    <h1 class="prompt">${esc(prompt.text)}</h1>
    <form class="answer-form" id="answer-form" autocomplete="off">
      <div class="frame answer-box">
        <input class="answer-input" id="answer" name="answer" maxlength="60" placeholder="your answer"
          autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="Your answer">
      </div>
      <div class="form-foot">
        <div class="actions">
          <button class="btn" type="submit"><span class="arrow">▶</span>Launch</button>
          <button class="btn ghost" type="button" data-action="pass">Pass</button>
        </div>
        <span class="hint" id="hint">Enter to launch · Esc to pass</span>
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
  const cells = [...document.querySelectorAll("#fuel .cells i")];
  const fuel = document.getElementById("fuel");
  const secsEl = document.getElementById("secs");
  const start = performance.now();
  const totalMs = ROUND_SECONDS * 1000;
  let lastSecond = ROUND_SECONDS;
  const tick = (now) => {
    const left = Math.max(0, totalMs - (now - start));
    const secs = Math.ceil(left / 1000);
    if (secs !== lastSecond) {
      lastSecond = secs;
      secsEl.textContent = String(secs);
      cells.forEach((c, i) => c.classList.toggle("out", i >= secs));
      fuel.classList.toggle("low", secs <= 5);
      if (secs <= 5 && secs > 0) sfx.tick();
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
    hint.textContent = "Not on our list. Asking Claude to check it";
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

function distribution(prompt, round, zoneClass) {
  const top = prompt.answers.slice(0, 5);
  const youIndex = round.name ? prompt.answers.findIndex((a) => a.name === round.name) : -1;
  const row = (name, share, you) => `
    <li class="${you ? `you ${zoneClass}` : ""}">
      <span class="name">${esc(name)}</span>
      <span class="bar"><i style="width:${Math.max(1, (share / prompt.top) * 100).toFixed(1)}%"></i></span>
      <span class="pct">${share >= 1 ? Math.round(share) : share.toFixed(1)}%</span>
    </li>`;
  let html = top.map((a, i) => row(displayName(prompt, a.name), a.share, i === youIndex)).join("");
  const outsideTop = round.share != null && (youIndex === -1 || youIndex >= 5);
  if (outsideTop) {
    html += `<li class="gap" aria-hidden="true">· · ·</li>`;
    html += row(round.display, round.share, true);
  }
  return `<ul class="dist" aria-label="Most common answers">${html}</ul>`;
}

function flightPath(points, zone) {
  return `
    <div class="frame flight z-${zone.key}">
      <div class="track" id="track" style="--to:0%" role="img" aria-label="Flew to ${zone.label}">
        ${planetImg("Earth", 16, 2.5, "earth")}
        <span class="line"></span>
        <span class="tick" style="left:25%"></span><span class="tick" style="left:50%"></span><span class="tick" style="left:75%"></span>
        <span class="deep"></span>
        <span class="trail"></span>
        ${rocketSVG("ship")}
      </div>
      <div class="legend">${ZONES.map((z) => `<span class="${z.key === zone.key ? `on z-${z.key}` : ""}">${z.label}</span>`).join("")}</div>
    </div>`;
}

function deepCuts(prompt, round) {
  const tail = prompt.answers.filter((a) => a.share <= 0.3 && a.name !== round.name);
  const seed = hashString(`${prompt.id}:${game.dateKey}:${game.index}`);
  return shuffle(tail, rng(seed)).slice(0, 3).map((a) => displayName(prompt, a.name));
}

function renderReveal(prompt, round) {
  const last = game.mode === "endless" ? game.lives <= 0 : game.index + 1 >= game.prompts.length;
  const zone = zoneFor(round.points);
  const said = round.input ? round.display : "No answer";
  const cuts = deepCuts(prompt, round);

  let judged = "";
  if (round.status === "judged") judged = `<p class="judged"><b>Checked by Claude.</b> Not on our list, but accepted. ${esc(round.note)}</p>`;
  if (round.status === "invalid" && round.note) judged = `<p class="judged"><b>Checked by Claude.</b> ${esc(round.note)}</p>`;

  show(`
    <div class="round-meta"><span>${esc(prompt.text)}</span><span class="score">${total(game.rounds)} pts</span></div>
    <div class="verdict">
      <div>
        <span class="zone z-${zone.key}">${zone.label}</span>
        <p class="said ${round.points ? "" : "miss"}">${esc(said)}</p>
        <p class="detail">${describe(round)}</p>
      </div>
      <div class="points"><b id="pts">0</b><span>points</span></div>
    </div>
    ${flightPath(round.points, zone)}
    ${judged}
    <p class="kicker">What most people say</p>
    ${distribution(prompt, round, `z-${zone.key}`)}
    ${cuts.length ? `<p class="cuts">Deep space answers on our list: <b>${cuts.map(esc).join("</b>, <b>")}</b>.</p>` : ""}
    <div class="actions">
      <button class="btn" data-action="next" id="next"><span class="arrow">▶</span>${last ? "Flight log" : "Next prompt"}</button>
      ${game.mode === "endless" ? ships(game.lives) : ""}
    </div>
  `);
  revealedAt = performance.now();
  document.getElementById("next").focus({ preventScroll: true });
  animateFlight(round.points);
}

function animateFlight(points) {
  const track = document.getElementById("track");
  const pts = document.getElementById("pts");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (points > 0) sfx.launch(points); else sfx.miss();
  if (reduce || points === 0) {
    track.style.setProperty("--to", `${trackPercent(points)}%`);
    pts.textContent = String(points);
    return;
  }
  // two frames so the transition starts from zero
  requestAnimationFrame(() => requestAnimationFrame(() => track.style.setProperty("--to", `${trackPercent(points)}%`)));
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 1100);
    pts.textContent = String(Math.round(points * (Math.floor(t * 22) / 22)));
    if (t < 1 && document.body.contains(pts)) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
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
    : result.mode === "pack" ? `Planet ${result.theme}` : `Endless · ${result.rounds.length} rounds`;

  const rows = result.rounds.map((r) => {
    const p = BY_ID.get(r.promptId);
    const ans = r.input ? r.display || r.input : "–";
    const mark = r.status === "judged" ? ' <span class="hint" title="Checked by Claude">*</span>' : "";
    const z = zoneFor(r.points);
    return `<tr class="z-${z.key}">
      <td><span class="q">${esc(p?.text ?? "")}</span><span class="a ${r.points ? "" : "miss"}">${esc(ans)}</span>${mark}<span class="z">${z.label}</span></td>
      <td class="p">${r.points}</td>
    </tr>`;
  }).join("");
  const anyJudged = result.rounds.some((r) => r.status === "judged");

  show(`
    <p class="kicker">Flight log · ${esc(title)}</p>
    <p class="total"><b>${sum}</b>${max ? `<span>/ ${max}</span>` : "<span>pts</span>"}</p>
    ${bars(scores)}
    <table class="ledger">
      <thead><tr><th>Prompt and answer</th><th>Points</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${anyJudged ? `<p class="hint" style="margin:-14px 0 24px">* Not on our list. Checked by Claude.</p>` : ""}
    <div class="actions">
      <button class="btn" data-action="share">Share score</button>
      ${result.mode === "daily"
        ? `<button class="btn secondary" data-action="endless">Play endless</button>`
        : `<button class="btn secondary" data-action="${result.mode === "pack" ? "pack" : "endless"}" data-theme="${esc(result.theme ?? "")}">Play again</button>`}
      <button class="btn ghost" data-action="home">Home</button>
    </div>
    ${result.mode === "daily" ? `<p class="sub" style="margin-top:20px">Next launch window opens in ${untilMidnight()}.</p>` : ""}
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
    sfx.select();
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
  else if (action === "sound") toggleSound();
});

function syncSoundButton() {
  const btn = document.getElementById("sound");
  btn.setAttribute("aria-pressed", String(!isMuted()));
  btn.textContent = isMuted() ? "SFX OFF" : "SFX ON";
}

function toggleSound() {
  setMuted(!isMuted());
  syncSoundButton();
  sfx.select();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && game && document.getElementById("answer") && !submitting) {
    submit("", "pass");
  }
});

document.getElementById("dateline").textContent = `${formatDate().toUpperCase()}`;
document.getElementById("logo").innerHTML = rocketSVG();
syncSoundButton();
startStarfield(document.getElementById("stars"));
renderHome();
checkJudge();
