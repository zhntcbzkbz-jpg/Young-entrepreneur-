// Game rules with no DOM access, so the browser, the server and the tests all use the same code.

export const ROUND_SECONDS = 20;
export const DAILY_ROUNDS = 7;
export const ENDLESS_LIVES = 3;
export const LAUNCH_DATE = "2026-11-23"; // Daily No. 1
const TAIL_SHARE = 0.2; // share given to listed answers with no explicit estimate

// ---------- text normalisation ----------

const ARTICLES = /^(the|a|an)\s+/;

export function normalize(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+\+/g, " plus plus ")
    .replace(/#/g, " sharp ")
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(ARTICLES, "");
}

/** Compact comparison key: spaces removed and a simple plural stripped. */
export function keyOf(text) {
  let k = normalize(text).replace(/ /g, "");
  if (k.length > 4 && k.endsWith("ies")) k = k.slice(0, -3) + "y";
  else if (k.length > 4 && /(ches|shes|xes|sses|oes)$/.test(k)) k = k.slice(0, -2);
  else if (k.length > 3 && k.endsWith("s") && !k.endsWith("ss") && !k.endsWith("us")) k = k.slice(0, -1);
  return k;
}

export function levenshtein(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function typoAllowance(len) {
  if (len >= 9) return 2;
  if (len >= 5) return 1;
  return 0;
}

// ---------- prompt data ----------

/**
 * Parses the compact answer format used in prompts.js:
 *   "apple=20|apples; dragon fruit=0.4|pitaya; jabuticaba"
 * The first name is the display name, "=n" is the estimated share (percent of
 * 100 people), and "|" separates accepted alternative spellings.
 */
export function parseAnswers(spec, tail = TAIL_SHARE) {
  const seen = new Set();
  const answers = [];
  for (const raw of spec.split(";")) {
    const entry = raw.trim();
    if (!entry) continue;
    const [head, ...aliases] = entry.split("|").map((s) => s.trim());
    const [name, shareText] = head.split("=").map((s) => s.trim());
    const share = shareText ? Number(shareText) : tail;
    if (!name || !Number.isFinite(share)) throw new Error(`Bad answer entry: "${entry}"`);
    const key = keyOf(name);
    if (seen.has(key)) throw new Error(`Duplicate answer: "${name}"`);
    seen.add(key);
    answers.push({ name, share, keys: [key, ...aliases.map(keyOf)] });
  }
  answers.sort((a, b) => b.share - a.share);
  return answers;
}

export function preparePrompt(p) {
  const answers = parseAnswers(p.answers, p.tail);
  return { ...p, answers, top: answers[0].share };
}

// ---------- matching ----------

/** Returns { answer, exact } for the best listed match, or null. */
export function matchAnswer(prompt, input) {
  const key = keyOf(input);
  if (!key) return null;
  for (const a of prompt.answers) if (a.keys.includes(key)) return { answer: a, exact: true };

  const allowance = typoAllowance(key.length);
  if (allowance === 0) return null;
  let best = null;
  let bestDist = Infinity;
  let tie = false;
  for (const a of prompt.answers) {
    for (const k of a.keys) {
      if (k.length < 5) continue; // short words are too easy to mistype into another word
      const d = levenshtein(key, k, allowance);
      if (d > allowance) continue;
      if (d < bestDist) { best = a; bestDist = d; tie = false; }
      else if (d === bestDist && best !== a) tie = true;
    }
  }
  if (!best || tie) return null;
  return { answer: best, exact: false };
}

// ---------- display ----------

const SMALL_WORDS = new Set(["and", "of", "the", "de", "da", "del", "du", "la", "le", "in", "on", "to", "a", "o"]);

/**
 * Names are stored mostly lowercase. Prompts made of proper nouns (places,
 * languages, breeds) set titleCase. Capitals already in the data are kept,
 * so "DR Congo" and "JavaScript" come out right.
 */
export function displayName(prompt, name) {
  const upper = (w) => w.replace(/^\p{L}/u, (c) => c.toUpperCase());
  if (!prompt?.titleCase) return upper(name);
  return name.split(" ").map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : upper(w))).join(" ");
}

// ---------- scoring ----------

/** 100 for an answer almost nobody gives, down to 5 for the most common one. */
export function pointsFor(share, top) {
  const relative = Math.min(1, Math.max(0, share / top));
  return Math.max(5, Math.round(100 - 95 * relative));
}

const TIERS = [
  { min: 8, label: "Common" },
  { min: 2, label: "Familiar" },
  { min: 0.5, label: "Uncommon" },
  { min: 0, label: "Deep cut" },
];

export function tierFor(share) {
  return TIERS.find((t) => share >= t.min).label;
}

/** "1 in 5", "1 in 40", "1 in 500": rounded, because the shares are estimates. */
export function oneIn(share) {
  const n = 100 / Math.max(share, 0.01);
  if (n < 1.5) return "most people";
  const mag = n < 10 ? 1 : n < 100 ? 5 : n < 1000 ? 50 : 500;
  return `1 in ${Math.round(n / mag) * mag || mag}`;
}

// ---------- seeding ----------

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(list, random) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dailyNumber(dateKey) {
  const ms = Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${LAUNCH_DATE}T00:00:00Z`);
  return Math.floor(ms / 86400000) + 1;
}

/**
 * The same seven prompts for everyone on a given date.
 * The pool is split once into two halves with every theme in both, and days
 * alternate between the halves, so nothing repeats from the day before.
 * Within a day, no two prompts in a row share a theme.
 */
export function dailyPrompts(prompts, dateKey, rounds = DAILY_ROUNDS) {
  const fixed = rng(hashString("deep-cut:halves"));
  const byTheme = new Map();
  for (const p of prompts) byTheme.set(p.theme, [...(byTheme.get(p.theme) || []), p]);
  const sequence = [...byTheme.keys()].sort().flatMap((t) => shuffle(byTheme.get(t), fixed));
  const day = dailyNumber(dateKey);
  const half = sequence.filter((_, i) => i % 2 === (((day % 2) + 2) % 2));
  const source = half.length >= rounds ? half : prompts;

  const chosen = shuffle(source, rng(hashString(`deep-cut:${dateKey}`))).slice(0, rounds);
  return arrangeThemes(chosen);
}

/** Reorders so neighbouring prompts differ in theme whenever that's possible. */
function arrangeThemes(list) {
  const left = list.slice();
  const out = [];
  while (left.length) {
    const prev = out.length ? out[out.length - 1].theme : null;
    const counts = new Map();
    for (const p of left) counts.set(p.theme, (counts.get(p.theme) || 0) + 1);
    let pickIndex = -1;
    let bestCount = -1;
    left.forEach((p, i) => {
      if (p.theme === prev) return;
      const c = counts.get(p.theme);
      if (c > bestCount) { bestCount = c; pickIndex = i; }
    });
    if (pickIndex === -1) pickIndex = 0;
    out.push(left.splice(pickIndex, 1)[0]);
  }
  return out;
}

// ---------- sharing ----------

const BARS = "▁▂▃▄▅▆▇█";

export function sparkline(scores) {
  return scores.map((s) => (s <= 0 ? "·" : BARS[Math.min(7, Math.floor((s / 100) * 7.99))])).join("");
}
