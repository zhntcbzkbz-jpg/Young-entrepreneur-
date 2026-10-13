# Wristy: business answers

Solo project by Michel Aylabouni (Grade 10, ICS Abu Dhabi).
All figures are **unverified estimates** in UAE dirhams, and the price is a **proposal**. None come from receipts or supplier quotes yet. Swap in real figures when you have them.

## Product being priced
The first product is the **Wristy trigger button**: a small, single-button USB device plus the free Wristy laptop app.
It is today's working prototype made neat and sellable. The laptop does the computing, as in the demo. The wristband is the later "future design" and is **not** priced here.

## 1. Prototype parts cost: ≈ AED 120
| Part | Est. cost |
|---|---|
| Arduino Uno R3 | AED 95 |
| Jumper wires | AED 10 |
| USB cable | AED 15 (unchecked: a boxed official Uno R3 usually comes without a cable, but starter kits and many clone boards include one. If yours did, this is AED 0 and the total is ≈ AED 105) |
| Software: whisper.cpp, Qwen3.5 0.8B, text-to-speech | AED 0 (free, existing open tools) |
| **Total** | **≈ AED 120** (my own laptop, not included) |

## 2. Estimated production cost per unit: ≈ AED 55
Assumes a first batch of about 200–500 units.
| Item | Est. per unit |
|---|---|
| Small USB microcontroller board | AED 15 |
| Large tactile button | AED 6 |
| Printed circuit board + assembly | AED 8 |
| Enclosure (3D-printed or moulded) | AED 12 |
| USB-C cable | AED 6 |
| Packaging + quick-start card | AED 8 |
| **Total** | **≈ AED 55** |

## 3. Proposed selling price: AED 149
- Estimated price minus unit cost: 149 − 55 = **AED 94 per unit, before any other expenses**. Delivery, payment fees, marketing and returns haven't been budgeted yet, so the real profit per unit will be lower.
- It's priced like a pair of mid-range earphones, aiming to feel affordable for students and parents.
- The app is included at no extra cost, with no subscription.

## 4. What's included
Wristy trigger button · USB-C cable · free Wristy laptop app (local speech recognition, local AI answers, spoken replies, student mode for learning, transcript review, typed-question fallback).

## 5. Target users
- **Main:** secondary and university students who want quick answers while studying, without opening apps or getting distracted. The app already has a working student mode for learning.
- **Also:** anyone who prefers to just ask aloud, e.g. people who find typing slow or awkward.

## 6. What makes it different
- **One physical trigger.** No unlocking a phone, finding an app, typing and scrolling.
- **Runs locally on the laptop** with existing open models, so questions don't have to leave the computer and no subscription is needed.
- **Transcript review** before sending, plus a typed-question fallback.

## 7. Marketing plan (approved by Michel)
1. **Live demos at school events** and fairs, so people can try it in 30 seconds.
2. **Short demo clips on social media**, e.g. Instagram, TikTok or YouTube Shorts, showing one question and one answer.
3. **A feedback pilot with student testers**: lend 10–20 units, collect feedback and improve before selling more.

## 8. Next steps (be upfront about these)
Proper enclosure and switch, then a smaller wristband version. That needs its own power system and smaller hardware, and is still at the concept stage.

## Possible judge questions
- **"Did you build the AI?"** No. I built the prototype around existing open tools: whisper.cpp for speech recognition and the Qwen3.5 0.8B model for answers. I connected them with an Arduino trigger and a laptop app.
- **"Does it work without the laptop?"** Not yet. The laptop does the computing. The wristband is a future design.
- **"Does it use the internet?"** It doesn't need to. The answers come from a local model on the laptop.
- **"How accurate is it?"** It's a small model, so it's good for quick, simple questions but can make mistakes. That's another reason the transcript review is there.
