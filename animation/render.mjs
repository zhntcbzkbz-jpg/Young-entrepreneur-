// Wristy — frame-accurate renderer
// Renders pocket-task.html frame by frame in headless Chromium and encodes with ffmpeg.
//
//   node render.mjs                 -> everything (scenes, overlays, stills, animatic)
//   node render.mjs scenes          -> one MP4 per animation scene
//   node render.mjs overlays        -> transparent MOV overlays + PNG badges + wristband stills
//   node render.mjs stills          -> wristband concept stills only
//   node render.mjs animatic        -> full 80 s preview with placeholder slots
//   node render.mjs title pipeline  -> only the named scenes
//   add  --fps 60  for 60 fps (default 30)
//
// Needs: Node 18+, `npm install` in this folder (playwright + ffmpeg-static),
// then `npx playwright install chromium` once.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "..", "renders");
mkdirSync(path.join(outDir, "scenes"), { recursive: true });
mkdirSync(path.join(outDir, "overlays"), { recursive: true });

const args = process.argv.slice(2);
const fpsIdx = args.indexOf("--fps");
const FPS = fpsIdx >= 0 ? Number(args[fpsIdx + 1]) : 30;
const targets = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--fps");

let ffmpegPath = "ffmpeg";
try { ffmpegPath = require("ffmpeg-static") || "ffmpeg"; } catch { /* use ffmpeg on PATH */ }

let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = await import("playwright")); }

const ANIM_SCENES = ["title", "why", "pipeline", "future", "cost", "closing"];
const OVERLAY_SCENES = ["lowerthird", "badge-demo", "badge-shortened"];

const browser = await chromium.launch(process.env.PT_CHROMIUM ? { executablePath: process.env.PT_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "pocket-task.html")).href + "?render=1");
await page.evaluate(() => window.PT.ready);
const info = await page.evaluate(() => ({ scenes: window.PT.scenes, totalDur: window.PT.totalDur }));

function encoder(file, { alpha = false } = {}) {
  const common = ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-"];
  const out = alpha
    ? ["-c:v", "png", "-pix_fmt", "rgba", file]                                  // MOV with alpha (Premiere/Resolve/FCP)
    : ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
       "-tune", "animation", "-movflags", "+faststart", file];
  const ff = spawn(ffmpegPath, [...common, ...out], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", c => c === 0 ? res() : rej(new Error(`ffmpeg exited ${c} for ${file}`))));
  return {
    async write(buf) { if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r)); },
    async end() { ff.stdin.end(); await done; },
  };
}

async function frame(fn, arg, alpha) {
  await page.evaluate(fn, arg);
  return page.screenshot({ type: "png", omitBackground: alpha });
}

async function renderScene(id, file, alpha = false) {
  const dur = info.scenes[id].dur, n = Math.round(dur * FPS);
  const enc = encoder(file, { alpha });
  for (let i = 0; i < n; i++) {
    await enc.write(await frame(([id, t]) => window.PT.render(id, t), [id, i / FPS], alpha));
    if (i % FPS === 0) process.stdout.write(`\r${id}: ${(i / FPS).toFixed(0)}/${dur}s   `);
  }
  await enc.end();
  console.log(`\r${id}: done -> ${path.relative(process.cwd(), file)}`);
}

async function still(id, t, file) {
  await page.evaluate(([id, t]) => window.PT.render(id, t), [id, t]);
  await page.screenshot({ path: file, type: "png", omitBackground: true });
  console.log(`still -> ${path.relative(process.cwd(), file)}`);
}

async function renderAnimatic(file) {
  const n = Math.round(info.totalDur * FPS);
  const enc = encoder(file);
  for (let i = 0; i < n; i++) {
    await enc.write(await frame(T => window.PT.renderTimeline(T), i / FPS, false));
    if (i % FPS === 0) process.stdout.write(`\ranimatic: ${(i / FPS).toFixed(0)}/${info.totalDur}s   `);
  }
  await enc.end();
  console.log(`\ranimatic: done -> ${path.relative(process.cwd(), file)}`);
}

const want = new Set(targets.length ? targets : ["scenes", "overlays", "animatic"]);
const order = ANIM_SCENES.map((id, i) => [id, `${String(i + 1).padStart(2, "0")}-${id}.mp4`]);

for (const [id, name] of order)
  if (want.has("scenes") || want.has(id)) await renderScene(id, path.join(outDir, "scenes", name));

if (want.has("overlays") || want.has("lowerthird"))
  await renderScene("lowerthird", path.join(outDir, "overlays", "lower-third-alpha.mov"), true);
if (want.has("overlays")) {
  await renderScene("badge-demo", path.join(outDir, "overlays", "badge-working-prototype-alpha.mov"), true);
  await renderScene("badge-shortened", path.join(outDir, "overlays", "badge-wait-shortened-alpha.mov"), true);
  await still("lowerthird", 2.5, path.join(outDir, "overlays", "lower-third.png"));
  await still("badge-demo", 1.5, path.join(outDir, "overlays", "badge-working-prototype.png"));
  await still("badge-shortened", 1.5, path.join(outDir, "overlays", "badge-wait-shortened.png"));
}
if (want.has("overlays") || want.has("stills")) {
  // wristband concept stills — same shared band design as the video
  mkdirSync(path.join(outDir, "stills"), { recursive: true });
  for (const [t, name] of [[1.6, "wristband-concept-closeup.png"], [5.0, "wristband-concept-full.png"]]) {
    await page.evaluate(([id, t]) => window.PT.render(id, t), ["future", t]);
    await page.screenshot({ path: path.join(outDir, "stills", name), type: "png" });
    console.log(`still -> renders/stills/${name}`);
  }
}
// footage frames (transparent window) for the final edit — large, kept out of git
for (const id of ["frame-a", "frame-b", "frame-demo"])
  if (want.has("frames") || want.has(id)) {
    mkdirSync(path.join(outDir, "frames"), { recursive: true });
    await renderScene(id, path.join(outDir, "frames", `${id}.mov`), true);
  }
if (want.has("animatic")) await renderAnimatic(path.join(outDir, "pocket-task-animatic-preview.mp4"));

await browser.close();
