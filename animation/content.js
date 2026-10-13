/*
  POCKET TASK — EDITABLE TEXT
  ---------------------------------------------------------------
  Change any text here, save, then refresh pocket-task.html (preview)
  or re-run the render script. Keep the quotes and commas.

  Any cost/price value left as "" shows on screen as a dashed
  "TO CONFIRM" box, so unfinished numbers can never look final.
  Marketing lines with confirmed: false show a small "DRAFT" tag.
  Set confirmed: true only once you have checked the line.
*/
window.PT_CONTENT = {
  projectName: "Pocket Task",
  tagline: "Ask aloud. Hear the answer.",
  student: "Michel Aylabouni",
  details: "Grade 10 · ICS Abu Dhabi",
  event: "Young Entrepreneur 2026",
  // Optional extra line under the name, e.g. "Team: …". Leave "" to hide.
  team: "",

  // Scene 2 — the idea in three cards
  why: [
    {
      title: "The problem",
      body: "A quick question means unlocking a phone, opening apps, typing and scrolling."
    },
    {
      title: "Who it's for",
      body: "Students who want a fast answer while learning, and anyone who prefers to just ask."
    },
    {
      title: "What's different",
      body: "One simple physical trigger. Speak, then hear the answer. No app-hopping."
    }
  ],

  // Scene 3 — example shown on the animated laptop screen (illustrative)
  sampleQuestion: "How do plants make food?",
  sampleAnswer: "Plants use sunlight, water and carbon dioxide to make sugar. This is called photosynthesis.",

  // Scene 5 — cost & price. Fill "value" when confirmed (e.g. "AED 85").
  cost: [
    { label: "Prototype parts cost", value: "" },
    { label: "Estimated production cost / unit", value: "" },
    { label: "Proposed selling price", value: "" },
    { label: "What's included", value: "" }
  ],
  // Marketing ideas — these are SUGGESTIONS until you confirm them.
  marketing: [
    { text: "Live demos at school events", confirmed: false },
    { text: "Short demo clips on social media", confirmed: false },
    { text: "A feedback pilot with student testers", confirmed: false }
  ],

  // Overlay badges
  demoBadge: "Real prototype demo",
  demoBadgeSub: "Laptop + Arduino Uno R3",
  shortenedBadge: "Wait shortened in editing",
  shortenedBadgeSub: "Real response took longer"
};
