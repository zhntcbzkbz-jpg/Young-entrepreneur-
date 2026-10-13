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
  team: "Solo project",

  // Scene 2 — the idea in three cards
  why: [
    {
      title: "The problem",
      body: "Quick questions mean unlocking, opening apps and typing."
    },
    {
      title: "Who it's for",
      body: "Students, with a working student mode."
    },
    {
      title: "What's different",
      body: "One physical trigger. Ask aloud, hear the answer."
    }
  ],

  // Scene 3 — example shown on the animated laptop screen (illustrative)
  sampleQuestion: "How do plants make food?",
  sampleAnswer: "Plants use sunlight, water and carbon dioxide to make sugar. This is called photosynthesis.",

  // Scene 5 — cost & price. Fill "value" when confirmed (e.g. "AED 85").
  cost: [
    { label: "Prototype parts (est.)", value: "≈ AED 120" },
    { label: "Production cost / unit (est.)", value: "≈ AED 55" },
    { label: "Selling price (proposed)", value: "AED 149" },
    { label: "What's included", value: "Button · cable · app" }
  ],
  // Small note under the cost card. Leave "" to hide.
  costNote: "Unverified estimates and a proposed price for a USB trigger. The buyer uses their own laptop.",
  // Marketing plan — approved by Michel (confirmed: true hides the DRAFT tag).
  marketing: [
    { text: "Live demos at school events", confirmed: true },
    { text: "Short demo clips on social media", confirmed: true },
    { text: "A student feedback pilot", confirmed: true }
  ],

  // Overlay badges
  demoBadge: "Working laptop-connected prototype",
  demoBadgeSub: "Real footage · Arduino Uno R3 · the laptop runs the AI",
  shortenedBadge: "Wait shortened in editing",
  shortenedBadgeSub: "Real response took longer"
};
