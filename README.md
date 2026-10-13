# Pocket Task: competition video animation package

Animation and editing assets for Michel Aylabouni's Young Entrepreneur 2026 entry (ICS Abu Dhabi). Solo project.
The style is cream and dark green, with clean type, restrained motion and large captions.

## Ready to use (`renders/`)
| File | Length | Use |
|---|---|---|
| `scenes/01-title.mp4` | 5 s | Title sequence |
| `scenes/02-why.mp4` | 6 s | Problem / target users / what's different |
| `scenes/03-pipeline.mp4` | 12 s | Wires → Arduino (USB) → laptop: whisper.cpp → Qwen3.5 0.8B (local) → speech |
| `scenes/04-future.mp4` | 6 s | Wristband concept, labelled **FUTURE DESIGN** |
| `scenes/05-cost.mp4` | 7 s | Cost (≈ AED 120 prototype, ≈ AED 55 per unit), price AED 149, what's included, marketing |
| `scenes/06-closing.mp4` | 5 s | Closing card |
| `overlays/lower-third-alpha.mov` (+ `.png`) | 5 s | Name lower third, transparent |
| `overlays/badge-real-demo-alpha.mov` (+ `.png`) | 3 s | "Real prototype demo" badge |
| `overlays/badge-wait-shortened-alpha.mov` (+ `.png`) | 3 s | Honest label if you cut out waiting time |
| `pocket-task-animatic-preview.mp4` | 80 s | Full video structure with INSERT slates where your footage goes |

All files are 1920×1080 at 30 fps. The MP4s are H.264. The MOVs are PNG-codec with alpha, which works in Premiere, DaVinci Resolve and Final Cut. Some CapCut versions show alpha MOVs on black; if yours does, use the PNGs.

## Guides (`docs/`)
- **`EDIT-GUIDE.md`**: shot-by-shot timeline, narration, filming tips, step-by-step clip insertion, export settings that keep the file under 30 MB, and a final checklist.
- **`BUSINESS-ANSWERS.md`**: cost breakdowns, price and margin, target users, differentiation, marketing, and answers to likely judge questions.
- **`PROJECT-DESCRIPTION.md`**: a 482-character description draft (limit 500) and a shorter alternative.

## Editing the animation (`animation/`)
- `content.js`: **all on-screen text**. This is where you fill in costs, prices and marketing lines, and set `confirmed: true`.
- `timeline.js`: order and lengths for the animatic.
- `pocket-task.html`: open it in Chrome or Edge for a live preview with play, pause and a scrubber. Each frame is calculated from time, so playback is always smooth.

### Re-rendering after you change the text (Windows, macOS or Linux)
1. Install [Node.js LTS](https://nodejs.org).
2. In a terminal inside the `animation` folder:
   ```
   npm install
   npx playwright install chromium
   node render.mjs cost            # re-render one scene, e.g. after filling in prices
   node render.mjs                 # or re-render everything (about 10 minutes)
   ```
   Output goes to `renders/`. Add `--fps 60` if your camera footage is 60 fps.

If you want different numbers but don't want to install anything, place your own text boxes over the values in `05-cost.mp4` in your editor.

## Honesty notes built into the assets
- The laptop is always shown as the host. The Arduino is labelled "controller only".
- Qwen3.5 0.8B and whisper.cpp are shown as existing tools that run locally, not something built or trained here.
- The screen content is labelled "Illustrative example". Your real demo footage is the evidence.
- The wristband is permanently labelled as a concept that isn't built yet. There is no WHOOP branding or integration claim.
- Costs are labelled as estimates. Empty cost fields in `content.js` render as "TO CONFIRM", and marketing lines with `confirmed: false` get a "DRAFT" tag.

Fonts: Inter (SIL Open Font License), bundled in `animation/assets/fonts/`.
