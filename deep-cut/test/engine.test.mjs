import { test } from "node:test";
import assert from "node:assert/strict";
import { PROMPTS, THEMES } from "../public/prompts.js";
import {
  preparePrompt, matchAnswer, keyOf, displayName, pointsFor, oneIn, tierFor,
  dailyPrompts, dailyNumber, sparkline, DAILY_ROUNDS,
} from "../public/engine.js";

const POOL = PROMPTS.map(preparePrompt);
const get = (id) => POOL.find((p) => p.id === id);
const said = (id, input) => matchAnswer(get(id), input)?.answer.name ?? null;

test("every prompt parses, has a sensible head, and no alias points at two answers", () => {
  const ids = new Set();
  for (const p of POOL) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    assert.ok(THEMES.includes(p.theme), `${p.id} has unknown theme`);
    assert.ok(p.answers.length >= 40, `${p.id} only has ${p.answers.length} answers`);
    assert.ok(p.top >= 8, `${p.id} top share is ${p.top}`);
    const owner = new Map();
    for (const a of p.answers) {
      for (const k of new Set(a.keys)) {
        assert.ok(!owner.has(k) || owner.get(k) === a.name, `${p.id}: "${k}" maps to ${owner.get(k)} and ${a.name}`);
        owner.set(k, a.name);
      }
    }
  }
});

test("each theme has at least five prompts", () => {
  for (const t of THEMES) assert.ok(POOL.filter((p) => p.theme === t).length >= 5, t);
});

test("normalisation ignores case, accents, articles, punctuation and plurals", () => {
  assert.equal(keyOf("The Apples"), keyOf("apple"));
  assert.equal(keyOf("Côte d'Ivoire"), keyOf("cote divoire"));
  assert.equal(keyOf("dragon-fruit"), keyOf("Dragon Fruit"));
  assert.equal(keyOf("cherries"), "cherry");
  assert.equal(keyOf("potatoes"), "potato");
  assert.notEqual(keyOf("C++"), keyOf("C"));
  assert.notEqual(keyOf("C#"), keyOf("C"));
});

test("listed answers and aliases match", () => {
  assert.equal(said("fruit", "Pitaya"), "dragon fruit");
  assert.equal(said("element", "aluminum"), "aluminium");
  assert.equal(said("africa", "Swaziland"), "eswatini");
  assert.equal(said("code-lang", "c++"), "C++");
  assert.equal(said("code-lang", "c#"), "C#");
  assert.equal(said("code-lang", "c"), "C");
  assert.equal(said("africa", "drc"), "DR Congo");
  assert.equal(said("dog", "Alsatian"), "german shepherd");
});

test("small typos match long words but not short ones", () => {
  assert.equal(said("fruit", "pomegranite"), "pomegranate");
  assert.equal(said("element", "molybdenom"), "molybdenum");
  assert.equal(said("eu-capital", "Reykjavík"), "reykjavik");
  assert.equal(said("fruit", "fog"), null); // 'fig' is too short to fuzz
  assert.equal(said("fruit", "carrot"), null);
  assert.equal(said("fruit", ""), null);
});

test("scoring rewards rarity and stays within 5 to 100", () => {
  const fruit = get("fruit");
  assert.equal(pointsFor(fruit.top, fruit.top), 5);
  assert.ok(pointsFor(0.2, fruit.top) >= 99);
  assert.ok(pointsFor(2, fruit.top) > pointsFor(9, fruit.top));
  assert.equal(pointsFor(999, fruit.top), 5);
  assert.equal(tierFor(0.2), "Deep cut");
  assert.equal(tierFor(20), "Common");
  assert.equal(oneIn(20), "1 in 5");
  assert.equal(oneIn(0.2), "1 in 500");
});

test("daily set is stable for a date, varied in theme, and changes day to day", () => {
  const a = dailyPrompts(POOL, "2026-11-23").map((p) => p.id);
  const b = dailyPrompts(POOL, "2026-11-23").map((p) => p.id);
  const c = dailyPrompts(POOL, "2026-11-24").map((p) => p.id);
  assert.deepEqual(a, b);
  assert.equal(a.length, DAILY_ROUNDS);
  assert.equal(new Set(a).size, DAILY_ROUNDS);
  assert.notDeepEqual(a, c);
  assert.equal(c.filter((id) => a.includes(id)).length, 0, "no repeats from yesterday");

  for (let d = 0; d < 60; d++) {
    const date = new Date(Date.UTC(2026, 10, 23 + d)).toISOString().slice(0, 10);
    const set = dailyPrompts(POOL, date);
    for (let i = 1; i < set.length; i++) assert.notEqual(set[i].theme, set[i - 1].theme, `${date} repeats a theme`);
  }
});

test("display names keep proper nouns readable", () => {
  assert.equal(displayName(get("river"), "rio de la plata"), "Rio de la Plata");
  assert.equal(displayName(get("africa"), "DR Congo"), "DR Congo");
  assert.equal(displayName(get("code-lang"), "JavaScript"), "JavaScript");
  assert.equal(displayName(get("fruit"), "dragon fruit"), "Dragon fruit");
  assert.equal(displayName(get("myth"), "loch ness monster"), "Loch Ness Monster");
});

test("daily numbering and sparkline", () => {
  assert.equal(dailyNumber("2026-11-23"), 1);
  assert.equal(dailyNumber("2026-12-01"), 9);
  assert.equal(sparkline([0, 5, 50, 100]), "·▁▄█");
});
