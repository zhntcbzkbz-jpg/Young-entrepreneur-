# Pocket Task: edit guide

**Target:** about 80 s · 1920×1080 · 16:9 · MP4 (H.264 + AAC) · **under 30 MB**
**Deadline:** 13 October 2026. The exact cutoff time is unconfirmed, so submit early.

Everything marked **[YOU]** has to come from you: real footage, confirmed numbers and your own voice.
Nothing in this package fakes the demo or the presenter.

---

## 1. Shot-by-shot timeline

| # | Time | Length | Type | File / source | What's on screen |
|---|------|--------|------|---------------|------------------|
| 1 | 0:00–0:05 | 5 s | Animation | `renders/scenes/01-title.mp4` | Pocket Task logo, name, tagline, Michel Aylabouni · Grade 10 · ICS Abu Dhabi |
| 2 | 0:05–0:16 | 11 s | **[YOU] Presenter A** | your clip + `renders/overlays/lower-third-alpha.mov` | You on camera: intro and the problem. Lower third from 0:06 to 0:11 |
| 3 | 0:16–0:22 | 6 s | Animation | `renders/scenes/02-why.mp4` | Three cards: the problem, who it's for, what's different |
| 4 | 0:22–0:34 | 12 s | Animation | `renders/scenes/03-pipeline.mp4` | Wires → Arduino → USB → laptop (Whisper → Qwen → speech). Laptop shown as the host |
| 5 | 0:34–0:54 | 20 s | **[YOU] Real demo** | your clip + `badge-real-demo` overlay | Real wires, real question, transcript on screen, spoken answer |
| 6 | 0:54–1:00 | 6 s | Animation | `renders/scenes/04-future.mp4` | Wristband concept, permanently labelled **FUTURE DESIGN · concept, not built yet** |
| 7 | 1:00–1:07 | 7 s | Animation | `renders/scenes/05-cost.mp4` | ≈ AED 120 parts · ≈ AED 55 per unit · AED 149 price · button, cable and app included, plus the marketing plan |
| 8 | 1:07–1:15 | 8 s | **[YOU] Presenter B** | your clip | Marketing in one sentence, then thanks |
| 9 | 1:15–1:20 | 5 s | Animation | `renders/scenes/06-closing.mp4` | Closing card on dark green |

**Total: 80 s.** You have 10 s of slack before the 90 s limit. If the demo needs more time, take it from shot 2 or 8 first.

`renders/pocket-task-animatic-preview.mp4` is this same timeline with grey **INSERT** slates where your clips go. Put it on a muted track as a guide, or edit straight over it.

---

## 2. Suggested narration (about 170 words, a calm pace)

Read it in your own words. The timings line up with the table above.

**Shot 1 (title, no voice, or a soft music sting)**

**Shot 2 (Presenter A, 11 s)**
> "Hi, I'm Michel Aylabouni, Grade 10 at ICS Abu Dhabi, and this is Pocket Task. When you have a quick question, you usually unlock your phone, open an app, type, and scroll."

**Shot 3 (why cards, 6 s, voice-over)**
> "Pocket Task is for students, with a built-in student mode for learning, and anyone who'd rather just ask. One physical trigger, speak, and hear the answer."

**Shot 4 (pipeline, 12 s, voice-over)**
> "Here's our working prototype. Touching two wires tells an Arduino to signal my laptop over USB. The laptop records my question, whisper.cpp turns it into text, an existing local model, Qwen 3.5, writes an answer, and the laptop speaks it out loud."

**Shot 5 (real demo, 20 s)** Let the real audio play: the question, then the spoken answer. Add at most one line, e.g.
> "I can check the transcript before sending it."

**Shot 6 (future, 6 s, voice-over)**
> "The goal is a smaller, wrist-worn version. That design is still a concept: it needs an enclosure, a proper switch, power and smaller hardware."

**Shot 7 (cost, 7 s, voice-over)**
> "The prototype parts cost about 120 dirhams. A production unit should cost about 55, and I plan to sell it for 149, with the button, cable and app included."

(Where these numbers come from: `docs/BUSINESS-ANSWERS.md`.)

**Shot 8 (Presenter B, 8 s)**
> "I'll start with live demos at school events and short clips online, then a feedback pilot with student testers. Thank you for watching."

**Shot 9 (closing, no voice, music fades out)**

**Things not to say:** don't say "we built an AI" or "I trained the model" (Qwen is an existing model). Avoid "it can do anything", "it searches the internet", "it does tasks for you", any battery life figure, and "WHOOP integration".

---

## 3. Filming your clips

**Presenter A and B**
- Landscape 1920×1080, 30 fps (match the animations). Use the phone's main back camera if possible, at eye level, on a stable surface or tripod.
- Face a window for soft light. Use a quiet room and keep the mic within about 1 m (wired earphones with a mic work well).
- Wear the required uniform or national dress.
- Leave space on the **lower-left** of the frame. The lower third sits at the bottom left.
- Record each line 2–3 times and keep the best take.

**Real demo (most important shot)**
- One continuous wide shot that shows the **laptop screen, the Arduino, the USB cable and your hands with the wires** all at once. Add close-ups (wires touching, screen) as cutaways if you like.
- If you can, show student mode being switched on or used for a few seconds. It's a real feature, so it's worth proving on camera.
- Ask a short, clear question, for example the same "How do plants make food?" used in the animation, or something else you've tested.
- Show the transcript appearing, press send, and let the spoken answer play with **real audio**.
- If the AI takes several seconds to answer, you may trim the wait. If you do, show `badge-wait-shortened` at the cut (see 4c). Never speed up or fake the answer itself.
- If you film the WHOOP strap for the future shot, show it only as a **form-factor prop**. Say or caption "shape reference only, no WHOOP integration", or leave it out.

---

## 4. How to insert your clips

Works the same in CapCut (desktop), DaVinci Resolve (free), Premiere Pro and Clipchamp. The steps below use CapCut and Resolve terms.

### a) Set up the project
1. New project: **1920×1080, 30 fps**.
2. Import everything in `renders/scenes/`, `renders/overlays/` and your clips.
3. Optional: drop `pocket-task-animatic-preview.mp4` onto the top track, mute it and lower its opacity to about 30 %. It shows exactly where each piece goes. Delete it before export.

### b) Main track (V1), in order
`01-title` → Presenter A → `02-why` → `03-pipeline` → Real demo → `04-future` → `05-cost` → Presenter B → `06-closing`

- Trim your clips to the slot lengths in the table (± a second is fine).
- The animations already ease in and out, so **plain cuts** look clean. If you want transitions, use a 6–10 frame cross-dissolve only between your footage and an animation.

### c) Overlays (V2, above your footage)
- **Lower third:** place `lower-third-alpha.mov` on V2 over Presenter A, starting about 1 s into the clip. It animates in and out by itself (5 s).
  If your editor shows a black box instead of a transparent background (some CapCut versions do), use `lower-third.png` instead, with a 0.3 s fade in and out.
- **Real demo badge:** `badge-real-demo-alpha.mov` (3 s, animates in and out) at the start of the demo. To keep it on screen for longer, use `badge-real-demo.png` for the whole demo.
- **Wait shortened badge (only if you cut out waiting time):** place `badge-wait-shortened-alpha.mov` or the `.png` right at the cut point, for about 3 s.

### d) Audio
- Your presenter audio and the real demo audio go on A1.
- Record voice-over for shots 3, 4, 6 and 7 on A2 (your phone's voice recorder is fine, or CapCut's record button).
- Optional music on A3 at about −28 dB (very quiet under the voice). Use only royalty-free music, e.g. CapCut's library or the YouTube Audio Library.
- Normalise voice to about −16 LUFS, or raise it until it peaks around −6 dB.

### e) Export (must be under 30 MB)
| Setting | Value |
|---|---|
| Format | MP4 (H.264) |
| Resolution | 1920×1080 (or 1280×720 if needed) |
| Frame rate | 30 fps |
| Bitrate | **2,500 kbps** video (≈ 19 MB for 80 s) · AAC 128 kbps audio |

CapCut: Export → Resolution 1080p → Bit rate "Lower" or custom ≈ 2.5 Mbps → check the size shown before saving.
Resolve: Deliver → MP4 → H.264 → Quality: restrict to **2500 Kb/s**.

**Check:** right-click the file → Properties. It must be **under 30 MB** and between **30 and 90 s**. If it's over: lower the bitrate to 2,000 kbps or export at 720p.

**Fallback with ffmpeg** (if you have it). This always lands near 20 MB for 80 s:
```
ffmpeg -i my-edit.mp4 -c:v libx264 -b:v 2500k -maxrate 3000k -bufsize 5000k -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart pocket-task-final.mp4
```

---

## 5. Final checklist before submitting
- [ ] Length 30–90 s, 16:9 landscape, MP4, < 30 MB
- [ ] Student name and project name visible (title, lower third, closing)
- [ ] Idea, problem, target users, differentiation (shots 2–3)
- [ ] Prototype demonstration with real footage (shot 5)
- [ ] Cost and price on screen match what you say (shot 7, see `BUSINESS-ANSWERS.md`)
- [ ] Future wristband clearly labelled as a concept (shot 6, already built in)
- [ ] "Wait shortened" badge used if any waiting was cut
- [ ] No claims of training Qwen, unlimited ability, web access, autonomous actions, battery life or WHOOP integration
- [ ] Uniform or national dress requirement followed
- [ ] Watched the full export once with sound
