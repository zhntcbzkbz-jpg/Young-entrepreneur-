/*
  WRISTY — FULL VIDEO TIMELINE (used by the animatic preview)
  type "anim" = finished animation scene from pocket-task.html
  type "slot" = YOUR real footage goes here (placeholder in the animatic)
  Durations are in seconds. Total ≈ 80 s (limit is 30–90 s).
*/
window.PT_TIMELINE = [
  { id: "title", type: "anim", dur: 5 },
  {
    id: "slot-a", type: "slot", dur: 11,
    label: "Presenter clip A — intro",
    say: "Hi, I'm Michel from Grade 10 at ICS Abu Dhabi. This is Wristy: a physical trigger for asking my laptop questions aloud."
  },
  { id: "why", type: "anim", dur: 6 },
  { id: "pipeline", type: "anim", dur: 12 },
  { id: "future", type: "anim", dur: 6 },
  {
    id: "slot-b", type: "slot", dur: 20,
    label: "Real demo clip — Working laptop-connected prototype",
    say: "Real footage only: wires touch, ask your genuine question, review the transcript, hear the spoken answer. Label any shortened wait."
  },
  { id: "cost", type: "anim", dur: 7 },
  {
    id: "slot-c", type: "slot", dur: 8,
    label: "Presenter clip B — marketing & thanks",
    say: "My marketing plan is school demos, short online clips, and a student feedback pilot. Thank you for watching."
  },
  { id: "closing", type: "anim", dur: 5 }
];
