# Wristy: competition video animation package

Animation and editing assets for Michel Aylabouni's Young Entrepreneur 2026 entry (ICS Abu Dhabi). Solo project.
The style is cream and dark green, with clean type, restrained motion and large captions.

## Ready to use (`renders/`)
| File | Length | Use |
|---|---|---|
| `scenes/01-title.mp4` | 5 s | Title sequence |
| `scenes/02-why.mp4` | 6 s | Problem / target users / what's different |
| `scenes/03-pipeline.mp4` | 12 s | Wires → Arduino (USB) → laptop: whisper.cpp → Qwen3.5 0.8B (local) → speech |
| `scenes/04-future.mp4` | 6 s | Future wristband reveal (navy fabric strap, compact module, one button, no screen): close-up, slow turn, full band, then a green wipe into the prototype label. Labelled **FUTURE WRISTBAND CONCEPT** throughout |
| `scenes/05-cost.mp4` | 7 s | Unverified estimates (≈ AED 120 prototype, ≈ AED 55 per unit), proposed price AED 149, approved marketing plan |
| `scenes/06-closing.mp4` | 5 s | Closing card |
| `overlays/lower-third-alpha.mov` (+ `.png`) | 5 s | Name lower third, transparent |
| `overlays/badge-working-prototype-alpha.mov` (+ `.png`) | 4 s | "Working laptop-connected prototype" label for the real demo, starting on screen to continue the wristband hand-off |
| `stills/wristband-concept-closeup.png`, `stills/wristband-concept-full.png` | still | The same wristband design as still images, with the concept label |
| `overlays/badge-wait-shortened-alpha.mov` (+ `.png`) | 3 s | Honest label if you cut out waiting time |
| `pocket-task-animatic-preview.mp4` | 80 s | Full video structure with INSERT slates (older render: it still has the previous wristband scene order, so follow `docs/EDIT-GUIDE.md` for the current order) |

All files are 1920×1080 at 30 fps. The MP4s are H.264. The MOVs are PNG-codec with alpha, which works in Premiere, DaVinci Resolve and Final Cut. Some CapCut versions show alpha MOVs on black; if yours does, use the PNGs.

## Guides (`docs/`)
- **`FILMING-CHECKLIST.md`**: what to film and record, in order, with exact words, clothing, phone orientation and target lengths.
- **`EDIT-GUIDE.md`**: shot-by-shot timeline, narration, filming tips, step-by-step clip insertion, export settings that keep the file strictly under 30,000,000 bytes, and a final checklist.
- **`BUSINESS-ANSWERS.md`**: cost breakdowns, price and margin, target users, differentiation, marketing, and answers to likely judge questions.
- **`PROJECT-DESCRIPTION.md`**: a 457-character description draft (limit 500) and a shorter alternative.

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
- The wristband is one consistent design (navy fabric strap, compact module, one button, no screen). It's labelled "Future wristband concept" and says "Not built yet. Today, the laptop runs the AI." The real footage after it is labelled "Working laptop-connected prototype". There is no WHOOP branding or integration claim.
- Costs are labelled as unverified estimates and the price as a proposal. Empty cost fields in `content.js` render as "TO CONFIRM", and marketing lines with `confirmed: false` get a "DRAFT" tag.

Fonts: Inter (SIL Open Font License), bundled in `animation/assets/fonts/`.
