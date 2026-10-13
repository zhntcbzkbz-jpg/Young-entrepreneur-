/*
  POCKET TASK — FULL VIDEO TIMELINE (used by the animatic preview)
  type "anim" = finished animation scene from pocket-task.html
  type "slot" = YOUR real footage goes here (placeholder in the animatic)
  Durations are in seconds. Total ≈ 80 s (limit is 30–90 s).
*/
window.PT_TIMELINE = [
  { id: "title", type: "anim", dur: 5 },
  {
    id: "slot-a", type: "slot", dur: 11,
    label: "Presenter clip A — intro & problem",
    say: "Hi, I'm Michel Aylabouni from ICS Abu Dhabi. This is Pocket Task. When you have a quick question, you usually unlock your phone, open an app, type and scroll."
  },
  { id: "why", type: "anim", dur: 6 },
  { id: "pipeline", type: "anim", dur: 12 },
  {
    id: "slot-b", type: "slot", dur: 20,
    label: "Real demo clip — wires → question → answer",
    say: "Show the wires touching, ask the question out loud, review the transcript on screen, then let the laptop speak the answer."
  },
  { id: "future", type: "anim", dur: 6 },
  { id: "cost", type: "anim", dur: 7 },
  {
    id: "slot-c", type: "slot", dur: 8,
    label: "Presenter clip B — marketing & thanks",
    say: "We'd start with live demos at school and short clips online, then test with students. Thank you for watching."
  },
  { id: "closing", type: "anim", dur: 5 }
];
