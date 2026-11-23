// Pixel art, starfield and chiptune effects. All original, all drawn in code.

import { hashString, rng } from "./engine.js";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- sprites ----------
// Each sprite is rows of characters; each character is a palette key, "." is empty.

const PALETTE = {
  W: "#f1efff", // hull
  G: "#9aa0d6", // hull shade
  C: "#5ce1e6", // window
  R: "#ff5c8a", // fins
  O: "#ff9a3c", // flame
  Y: "#ffd84d", // flame core
  K: "#2a2f66", // outline
};

const ROCKET = [
  "....W....",
  "...WWG...",
  "...WWG...",
  "..WWWWG..",
  "..WCCWG..",
  "..WCCWG..",
  "..WWWWG..",
  "..WWWWG..",
  ".RWWWWGR.",
  "RRWWWWGRR",
  "RR.KKK.RR",
  "R..OYO..R",
  "...OYO...",
  "....O....",
];

const SHIP_SMALL = [
  "..W..",
  ".WCW.",
  ".WWW.",
  "RWWWR",
  "R.O.R",
];

function spriteSVG(rows, { cls = "", label = "", flameRows = [] } = {}) {
  const h = rows.length;
  const w = rows[0].length;
  let rects = "";
  let flame = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const r = `<rect x="${x}" y="${y}" width="1" height="1" fill="${PALETTE[ch]}"/>`;
      if (flameRows.includes(y) && (ch === "O" || ch === "Y")) flame += r;
      else rects += r;
    });
  });
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  return `<svg class="sprite ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges" ${a11y}>${rects}${flame ? `<g class="flame">${flame}</g>` : ""}</svg>`;
}

export const rocketSVG = (cls = "", label = "") => spriteSVG(ROCKET, { cls, label, flameRows: [11, 12, 13] });
export const shipSVG = (cls = "") => spriteSVG(SHIP_SMALL, { cls });

// ---------- planets ----------

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export const PLANETS = {
  Earth: { colors: ["#1b2a6b", "#2f5fd0", "#4fa3ff", "#7cf29a", "#2fae5a"], kind: "terran" },
  Food: { colors: ["#5a2410", "#b8501e", "#ff9a3c", "#ffd84d"], kind: "bands", ring: "#ffd84d" },
  Places: { colors: ["#123d4a", "#1f8a8a", "#5ce1e6", "#e8d48a", "#c7a24a"], kind: "terran" },
  Nature: { colors: ["#0f3b22", "#1f7a3a", "#5fd06a", "#c9ffd4"], kind: "clouds" },
  Culture: { colors: ["#3a1550", "#7a2a9e", "#c75cff", "#ffb3f0"], kind: "bands", ring: "#ff5c8a" },
  Science: { colors: ["#1d3557", "#4a7fb5", "#a8e6ff", "#ffffff"], kind: "ice" },
  Everyday: { colors: ["#3d1414", "#8a2e24", "#e0573c", "#ffb08a"], kind: "craters" },
};

const planetCache = new Map();

/** Draws a small dithered planet and returns a data URL. */
export function planetURL(name, size = 24) {
  const key = `${name}:${size}`;
  if (planetCache.has(key)) return planetCache.get(key);
  const spec = PLANETS[name] || PLANETS.Earth;
  const pad = spec.ring ? Math.round(size * 0.35) : 0;
  const W = size + pad * 2;
  const H = size + (spec.ring ? 4 : 0);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const random = rng(hashString(name));
  const cx = W / 2 - 0.5;
  const cy = H / 2 - 0.5;
  const r = size / 2;
  const [dark, mid, light, accent, extra] = spec.colors;

  // a coarse noise field for land and clouds
  const grid = 6;
  const noise = Array.from({ length: grid * grid }, () => random());
  const sample = (x, y) => {
    const gx = ((x / size) * (grid - 1) + grid) % grid;
    const gy = ((y / size) * (grid - 1) + grid) % grid;
    const x0 = Math.floor(gx), y0 = Math.floor(gy);
    const x1 = (x0 + 1) % grid, y1 = (y0 + 1) % grid;
    const fx = gx - x0, fy = gy - y0;
    const n = (a, b) => noise[b * grid + a];
    return n(x0, y0) * (1 - fx) * (1 - fy) + n(x1, y0) * fx * (1 - fy) + n(x0, y1) * (1 - fx) * fy + n(x1, y1) * fx * fy;
  };
  const craters = Array.from({ length: 5 }, () => ({ x: (random() - 0.5) * r * 1.3, y: (random() - 0.5) * r * 1.3, s: 1.2 + random() * 2.2 }));

  const ring = (front) => {
    if (!spec.ring) return;
    ctx.fillStyle = spec.ring;
    for (let x = 0; x < W; x++) {
      const t = (x - cx) / (W / 2);
      if (Math.abs(t) > 1) continue;
      const y = Math.round(cy + t * 2 + (front ? 1 : -1) * Math.sqrt(1 - t * t) * 2.2);
      const insidePlanet = Math.hypot(x - cx, y - cy) < r - 0.5;
      if (front ? true : !insidePlanet) ctx.fillRect(x, y, 1, 1);
    }
  };

  ring(false);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.hypot(dx, dy);
      if (d > r - 0.2) continue;
      // light from the top left
      const nz = Math.sqrt(Math.max(0, 1 - (d / r) ** 2));
      let lightness = (-dx / r) * 0.45 + (-dy / r) * 0.55 + nz * 0.6;
      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      let color;
      const lx = dx + r, ly = dy + r;
      if (spec.kind === "terran") {
        const land = sample(lx * 1.1, ly * 1.1) > 0.55;
        color = land ? (lightness + threshold * 0.4 > 0.9 ? accent : extra || accent) : lightness + threshold * 0.5 > 0.75 ? light : mid;
      } else if (spec.kind === "bands") {
        const band = Math.sin((dy / r) * 5.5 + sample(lx, ly) * 2.5);
        color = band > 0.35 ? light : band > -0.4 ? mid : accent;
      } else if (spec.kind === "clouds") {
        const cloud = sample(lx * 1.4, ly * 0.9) > 0.62;
        color = cloud ? accent : lightness + threshold * 0.5 > 0.8 ? light : mid;
      } else if (spec.kind === "ice") {
        color = Math.abs(dy) > r * 0.62 ? accent : lightness + threshold * 0.6 > 0.85 ? light : mid;
      } else {
        const hit = craters.some((c) => Math.hypot(dx - c.x, dy - c.y) < c.s);
        color = hit ? dark : lightness + threshold * 0.5 > 0.85 ? light : mid;
      }
      // shadow side, dithered
      if (lightness + threshold * 0.55 < 0.38) color = dark;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ring(true);

  const url = canvas.toDataURL();
  planetCache.set(key, url);
  return url;
}

export function planetImg(name, size, scale, cls = "", alt = "") {
  const url = planetURL(name, size);
  const spec = PLANETS[name] || PLANETS.Earth;
  const pad = spec.ring ? Math.round(size * 0.35) : 0;
  const w = (size + pad * 2) * scale;
  const h = (size + (spec.ring ? 4 : 0)) * scale;
  return `<img class="px ${cls}" src="${url}" width="${w}" height="${h}" alt="${alt}"${alt ? "" : ' aria-hidden="true"'}>`;
}

// ---------- starfield ----------

export function startStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  const random = rng(20261123);
  let stars = [];
  let w = 0, h = 0, scale = 1;
  const COLORS = ["#f1efff", "#9aa0d6", "#5ce1e6", "#ffd84d", "#ff9ec0"];

  function resize() {
    scale = Math.max(2, Math.round(Math.min(window.innerWidth, 900) / 300));
    w = Math.ceil(window.innerWidth / scale);
    h = Math.ceil(window.innerHeight / scale);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w * scale}px`;
    canvas.style.height = `${h * scale}px`;
    const count = Math.round((w * h) / 140);
    stars = Array.from({ length: count }, () => {
      const layer = random() < 0.65 ? 0 : random() < 0.75 ? 1 : 2;
      return {
        x: random() * w,
        y: random() * h,
        layer,
        color: layer === 2 ? COLORS[Math.floor(random() * COLORS.length)] : COLORS[layer],
        phase: random() * Math.PI * 2,
        size: layer === 2 && random() < 0.3 ? 2 : 1,
      };
    });
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(64, now - last) / 1000;
    last = now;
    ctx.clearRect(0, 0, w, h);
    const still = reducedMotion();
    for (const s of stars) {
      if (!still) {
        s.x -= (s.layer + 1) * 1.6 * dt;
        if (s.x < -2) { s.x = w + 1; s.y = random() * h; }
      }
      const twinkle = s.layer === 2 && !still ? Math.sin(now / 600 + s.phase) > -0.3 : true;
      if (!twinkle) continue;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.layer === 0 ? 0.45 : s.layer === 1 ? 0.7 : 1;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
      if (s.size === 2 && s.layer === 2) {
        // a small cross on the brightest stars
        ctx.globalAlpha = 0.5;
        ctx.fillRect(Math.round(s.x) - 1, Math.round(s.y), 4, 1);
        ctx.fillRect(Math.round(s.x), Math.round(s.y) - 1, 1, 4);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

// ---------- sound ----------

let audio = null;
let muted = false;
try { muted = localStorage.getItem("deep-cut:muted") === "1"; } catch { /* ignore */ }

export const isMuted = () => muted;
export function setMuted(value) {
  muted = value;
  try { localStorage.setItem("deep-cut:muted", value ? "1" : "0"); } catch { /* ignore */ }
}

function tone(freq, start, duration, { type = "square", volume = 0.06, slideTo = null } = {}) {
  if (muted) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    const t0 = audio.currentTime + start;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch { /* no audio available */ }
}

export const sfx = {
  select: () => tone(660, 0, 0.06),
  tick: () => tone(1320, 0, 0.03, { volume: 0.03 }),
  launch(points) {
    // a rising arpeggio: the rarer the answer, the higher it climbs
    const steps = 3 + Math.round((points / 100) * 6);
    const base = [262, 330, 392, 523, 659, 784, 1047, 1319, 1568];
    for (let i = 0; i < steps; i++) tone(base[i], i * 0.07, 0.09, { volume: 0.05 });
    if (points >= 95) tone(2093, steps * 0.07, 0.25, { volume: 0.04, type: "triangle" });
  },
  miss: () => {
    tone(330, 0, 0.12);
    tone(220, 0.12, 0.25, { slideTo: 110 });
  },
};
