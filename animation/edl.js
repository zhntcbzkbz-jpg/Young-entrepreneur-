/*
  WRISTY — EDIT DECISION LIST for the final video.
  Times are in seconds. "in"/"out" are positions in the original phone clip.
  Used by pocket-task.html (to time the frames/captions around the footage)
  and by edit/build_final.py (to cut the footage and assemble the video).
  Window rectangles are where the footage appears inside the 1920×1080 frame.
*/
window.PT_EDL = {
  winPresenter: { x: 150, y: 60, w: 540, h: 960, r: 30 },
  winDemo: { x: 1060, y: 60, w: 780, h: 960, r: 30 },
  winPresenterB: { x: 690, y: 60, w: 540, h: 960, r: 30 },   // centred so points can sit where Michel points

  presenterA: {
    src: "IMG_0622", in: 0.35, out: 8.95,
    subtitles: [
      [0.0, "Hi, my name is Michel Aylabouni"],
      [2.45, "and I'm in Grade 10, ICS Abu Dhabi."],
      [5.9, "This is my project called Wristy."]
    ]
  },

  presenterB: {
    src: "IMG_0634", in: 1.75, out: 9.65,
    // [time in clip, text, where he points: "up" | "left" | "right", y-centre on screen]
    items: [[2.1, "Student feedback pilot", "up", 190], [3.95, "Short online clips", "left", 690], [5.25, "School demos", "right", 722]],
    thanks: 6.9
  },

  // Real demo: two real takes of the same prototype, labelled on screen.
  demo: [
    { src: "IMG_0638", in: 4.0, out: 8.75, step: 0 },                     // laptop + board with wires
    { src: "IMG_0638", in: 50.1, out: 58.15, step: 1 },                   // wires touch → "recording"
    { src: "IMG_0637", in: 52.7, out: 54.6, step: 2, badge: "take2" },    // "What is a prototype?"
    { src: "IMG_0637", in: 63.0, out: 70.2, step: 3 },                    // transcript checked → send
    { src: "IMG_0637", in: 90.7, out: 98.7, step: 4, badge: "wait" }      // spoken answer (wait cut)
  ],
  demoCropY: 591,   // crop the lower part of the upright phone frame (laptop + hands)
  demoSteps: [
    "The hardware: laptop, Arduino and two wires",
    "Wires touch → the app starts recording",
    "Ask aloud: “What is a prototype?”",
    "Check the transcript, then send",
    "The laptop speaks the answer"
  ],
  answer: "“A prototype is an early version of a product or idea that allows you to test its functionality before it becomes the final version.”",

  // Voice-overs placed under the animation scenes: [file, in, out, startInScene] (+ optional second piece)
  vo: {
    why: [["Euljiro1-ga", 2.25, 6.5, 0.8]],
    pipeline: [["Euljiro1-ga_3", 1.05, 12.25, 0.45]],
    future: [["Euljiro1-ga_6", 0.0, 5.25, 0.3]],
    cost: [["Euljiro1-ga_8", 0.0, 4.5, 0.45], ["Euljiro1-ga_8", 5.2, 6.55, 5.25]]
  }
};
