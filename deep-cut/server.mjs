// Static file server plus one API route for the answer judge. No framework.
//   npm start            -> http://localhost:5173
//   PORT=8080 npm start

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROMPTS } from "./public/prompts.js";
import { preparePrompt, normalize, matchAnswer } from "./public/engine.js";
import { judgeAnswer, judgeAvailable, describeError } from "./judge.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "public");
const PORT = Number(process.env.PORT) || 5173;

const prompts = new Map(PROMPTS.map((p) => [p.id, preparePrompt(p)]));
const verdicts = new Map(); // "promptId:normalized answer" -> verdict
const hits = new Map(); // ip -> timestamps in the last minute
const RATE_PER_MINUTE = 20;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_PER_MINUTE;
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2048) throw new Error("too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleJudge(req, res) {
  if (!judgeAvailable()) return send(res, 503, { error: "judge_off" });
  if (rateLimited(req.socket.remoteAddress || "?")) return send(res, 429, { error: "rate_limited" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "bad_request" });
  }
  const prompt = prompts.get(body?.promptId);
  const answer = String(body?.answer ?? "").replace(/[<>]/g, "").trim().slice(0, 60);
  if (!prompt || !normalize(answer)) return send(res, 400, { error: "bad_request" });

  // The client should have matched this already, but don't spend a call if it's listed.
  const listed = matchAnswer(prompt, answer);
  if (listed) return send(res, 200, { valid: true, canonical: listed.answer.name, share: listed.answer.share, note: "", listed: true });

  const cacheKey = `${prompt.id}:${normalize(answer)}`;
  if (verdicts.has(cacheKey)) return send(res, 200, verdicts.get(cacheKey));

  try {
    const examples = prompt.answers.filter((_, i) => i < 8 || i % 12 === 0).map((a) => a.name);
    const verdict = await judgeAnswer({ text: prompt.text, examples }, answer);
    if (!verdict) return send(res, 502, { error: "no_verdict" });
    verdicts.set(cacheKey, verdict);
    return send(res, 200, verdict);
  } catch (error) {
    const reason = describeError(error);
    console.error(`judge failed (${reason}):`, error.message);
    return send(res, 502, { error: reason });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root + path.sep)) return send(res, 404, "Not found", "text/plain");
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    send(res, 404, "Not found", "text/plain");
  }
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/status" && req.method === "GET") return send(res, 200, { judge: judgeAvailable() });
  if (req.url === "/api/judge" && req.method === "POST") return handleJudge(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  send(res, 405, { error: "method_not_allowed" });
});

server.listen(PORT, () => {
  console.log(`Deep Cut on http://localhost:${PORT}`);
  console.log(judgeAvailable()
    ? "Answer judge: on (unlisted answers are checked by Claude)"
    : "Answer judge: off (set ANTHROPIC_API_KEY to check unlisted answers)");
});
