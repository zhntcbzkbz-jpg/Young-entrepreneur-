# Pocket Task: filming checklist

Do these in order. Tick each box as you go. Everything is filmed by you, with your real prototype.

---

## 0. Before you start (5 minutes)
- [ ] **Clothing:** the competition's required school uniform or national dress, exactly as the rules sheet says. Wear the same outfit for clips 1 and 2.
- [ ] **Phone settings:** Camera → Video → **1080p at 30 fps**. Turn off Cinematic/Action mode and slow-motion.
- [ ] **Phone held sideways (landscape)** for every video clip. Lock rotation off so the video is saved landscape.
- [ ] Phone on a stand, a pile of books or a tripod, at eye level, about 1–1.5 m away. Use the **back camera** if you can.
- [ ] Face a window or lamp so your face is lit. Nothing bright behind you.
- [ ] Quiet room: close the door, and turn off fans and AC if you can. Put the phone on silent / Do Not Disturb.
- [ ] Laptop charged, Pocket Task app open, Arduino plugged in, wires ready. Test once before filming.

**Tip:** for every clip, start recording, **wait 2 seconds in silence**, say the line, then **wait 2 seconds** before stopping. That gives clean cut points.

---

## 1. Presenter A (intro): on camera
- **Target length in the video:** 11 s (record about 15 s with the pauses)
- **Framing:** head and shoulders, slightly left of centre. Leave empty space in the **lower-left** corner for your name banner.
- **Say exactly:**
  > "Hi, I'm Michel from Grade 10 at ICS Abu Dhabi. This is Pocket Task: a physical trigger for asking my laptop questions aloud."
- [ ] Recorded 3 takes · best take noted

## 2. Presenter B (marketing and thanks): on camera
Film this straight after clip 1, in the same place and outfit.
- **Target length:** 8 s (record about 12 s)
- **Say exactly:**
  > "My marketing plan is school demos, short online clips, and a student feedback pilot. Thank you for watching."
- [ ] Recorded 3 takes · best take noted

## 3. Real hardware demo: on camera, real audio
- **Target length in the video:** 20 s. **Record the whole thing uncut** (it may be 40–90 s). I'll trim it and label any wait I shorten.
- **Framing:** one wide shot from the side or slightly above that shows **the laptop screen, the Arduino, the USB cable and your hands with the two wires**, all at once. Make sure the screen is readable, and lower the laptop brightness a little if it glares.
- **Laptop volume up** so the spoken answer is clearly heard by the phone's microphone.
- **Steps, all in one take:**
  1. Show the app ready on screen (1–2 s).
  2. Touch the two wire ends together.
  3. Ask clearly: **"How do plants make food?"** (or another short question you've tested).
  4. Show the transcript on screen, check it, then send.
  5. Wait for the answer. **Don't speed anything up or fake it.**
  6. Let the laptop **speak the full answer**.
  7. Optional: switch on or use **student mode** for a few seconds.
- [ ] Recorded 2–3 full takes · best take noted
- [ ] Optional close-ups, about 3 s each: the wires touching, and the laptop screen. Useful as cutaways.

## 4. Voice-overs: audio only
Use the phone's voice recorder (Voice Memos on iPhone). Orientation doesn't matter for audio. Record in the same quiet room, holding the phone about 20 cm from your mouth, slightly to one side. Read slowly. **Record each line as a separate file**, 2–3 takes each.

| File | Plays over | Target length | Say exactly |
|---|---|---|---|
| `vo-3` | idea cards | 6 s | "It's for students, with a working student mode and a simple way to ask." |
| `vo-4` | how it works | 12 s | "Touching two wires tells my Arduino to signal my laptop. Whisper transcribes my question. I check it, then local Qwen answers and the laptop speaks." |
| `vo-6` | future design | 6 s | "Next is a wrist-worn version. It's a concept that still needs development." |
| `vo-7` | costs | 7 s | "These are draft costs and pricing for a USB trigger. The buyer uses their own laptop." |

- [ ] vo-3 · [ ] vo-4 · [ ] vo-6 · [ ] vo-7, each timed. If a line runs long, cut words; don't rush.

---

## 5. Sending the files to Claude
Rename your best takes so it's clear which is which:

| Name | What |
|---|---|
| `A.mov` (or .mp4) | Presenter A |
| `B.mov` | Presenter B |
| `demo.mov` | Full uncut demo |
| `close-wires.mov`, `close-screen.mov` | Optional close-ups |
| `vo-3.m4a`, `vo-4.m4a`, `vo-6.m4a`, `vo-7.m4a` | Voice-overs |

- If an upload says **"too large"**, trim the extra seconds off the start and end on your phone first, or send the files one at a time.
- Once I have them, I'll put them into the existing timeline, add the name banner and demo labels, remove every INSERT screen, and check that the final video is **30–90 s, landscape, has audible sound and is strictly under 30,000,000 bytes**.

**Don't say on camera:** that you built or trained the AI, that it can do anything, that it uses the internet, how long a battery lasts, or anything about WHOOP.
