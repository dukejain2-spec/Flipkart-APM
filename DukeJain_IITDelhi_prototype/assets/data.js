/* Bud-e prototype content: persona, skills, level bands, tasks, scripted flows, products and the parent report.
   Logic (ratings, tokens, the chat engine, screens) lives in app.js. */
window.DATA = {
  product: { name: "Bud-e", tagline: "Your AI companion which protects you from AI" },

  /* The world is set in 2040. Tokens reset every Monday. */
  today: { long: "Wednesday, 17 October 2040", week: "15 – 21 Oct 2040", reset: "Monday" },

  /* The parent has no separate sign-up: setting up the child's device ends with a code, and that code logs them in to Bud-e Parent. */
  parent: { name: "Neha Sharma", first: "Neha", relation: "Mum" },

  child: {
    name: "Aarav", age: 14, classNo: 9, city: "Pune", friend: "Riya", sibling: "Didi",
    tokens: 500, tokensWeekly: 500, wallet: 1500, walletMonthly: 2000, usedBefore: true,
    provider: "Claude", uses: ["study", "writing", "messages", "shopping", "feelings"]
  },

  classes: [4, 5, 6, 7, 8, 9, 10, 11, 12],
  aiUses: [
    { id: "study", label: "Homework & study" },
    { id: "writing", label: "Writing (emails, applications)" },
    { id: "messages", label: "Messages to friends & family" },
    { id: "shopping", label: "Shopping & spending" },
    { id: "planning", label: "Planning & decisions" },
    { id: "feelings", label: "Talking about feelings" },
    { id: "fun", label: "Entertainment" },
    { id: "other", label: "Other" }
  ],
  /* Plain text only, never logos. */
  providers: ["Claude", "Gemini", "ChatGPT", "Copilot", "Other agent"],

  permissions: [
    { id: "consent", title: "Parental consent", required: true, on: false,
      why: "Required to process a child's data. You can withdraw it at any time, and everything is deleted." },
    { id: "agent", title: "Agent integration", required: true, on: true,
      why: "Connects Aarav's personal agent to Bud-e, so every request passes through it first." },
    { id: "past", title: "Use past AI data to set starting levels", optional: true, on: true,
      why: "Only used to estimate where Aarav starts in each skill. Chats are never imported." },
    { id: "restrict", title: "Restrict other AI apps on this device", on: true,
      why: "Stops the easiest bypass: opening another AI directly." },
    { id: "extension", title: "Browser extension", on: true,
      why: "Notices other AI agents used in a browser. You get a weekly count only: no sites, no content." },
    { id: "data", title: "Data and retention", on: true,
      why: "Stores levels, ratings, token use and simple signals for 12 months. Deleted on request.",
      detail: ["Stored: skill ratings, task weights, token use, other-AI counts", "Never stored: chat text, messages, photos", "Kept 12 months, then deleted; delete any time from Settings"] },
    { id: "wallet", title: "Pocket-money wallet", optional: true, on: true,
      why: "A monthly amount Aarav can spend through his agent. He sees what each option does to his balance." },
    { id: "notify", title: "Notifications", on: true,
      why: "A weekly report to you every Sunday; gentle nudges to Aarav." }
  ],

  willSee: ["Progress in each area", "How much he relies on AI versus what's expected for his age", "Token use", "How often other AI agents were used (a count, from the extension)"],
  wontSee: ["Any chats or messages"],

  /* Ratings are 0–1000 within the child's age group, so the same band names mean different things at 9 and at 14. */
  levels: {
    groups: [
      { from: 5, to: 8, label: "ages 5–8" }, { from: 9, to: 12, label: "ages 9–12" },
      { from: 13, to: 15, label: "ages 13–15" }, { from: 16, to: 18, label: "ages 16–18" }
    ],
    bands: [
      { name: "Rookie", min: 0 }, { name: "Explorer", min: 250 }, { name: "Achiever", min: 430 },
      { name: "Pro", min: 650 }, { name: "Master", min: 850 }
    ]
  },

  /* Gap = task weight − child rating. Ordered by `max` gap. */
  modes: [
    { id: "pro", name: "Pro", max: -200, line: "I'll just do it", instruction: "Do it directly" },
    { id: "confident", name: "Confident", max: 0, line: "quick check, then it's yours", instruction: "Do it, with one quick check or a one-line explanation" },
    { id: "practising", name: "Practising", max: 200, line: "I'll give you hints", instruction: "Give hints; he does the key steps or makes the choice" },
    { id: "learner", name: "Learner", max: Infinity, line: "let's work through it together", instruction: "Teach step by step; he does it with guidance" }
  ],
  modeLines: {
    money: { pro: "I'll handle it", confident: "I'll suggest, you confirm", practising: "you pick, I'll handle the rest", learner: "let's compare together, you decide" }
  },

  rating: { K: 40, results: { 1: "did it himself", 0.5: "did it with hints", 0: "needed it done for him" } },

  /* Faster response cost by task weight. Chores are always free. */
  costs: [{ max: 299, tokens: 10, label: "light" }, { max: 699, tokens: 50, label: "medium" }, { max: 1000, tokens: 100, label: "heavy" }],

  areas: [
    { id: "study", name: "Study", tag: "Study", weightMeans: "difficulty", skills: [
      { id: "algebra", name: "Algebra", rating: null, base: 400, pastAdj: -20, chapter: "Linear equations" },
      { id: "geometry", name: "Geometry", rating: 610 }
    ]},
    { id: "writing", name: "Writing", tag: "Writing", weightMeans: "difficulty", skills: [
      { id: "emails", name: "Emails & applications", rating: 540 }
    ]},
    { id: "money", name: "Decisions & Money", tag: "Money", weightMeans: "stakes", skills: [
      { id: "spending", name: "Spending", rating: 300 }
    ]},
    { id: "relationships", name: "Relationships", tag: "Relationships", weightMeans: "emotional weight", skills: [
      { id: "messages", name: "Messages", rating: 380 }
    ]},
    { id: "feelings", name: "Feelings", tag: "Feelings", care: true, skills: [] }
  ],

  /* Each scripted request: area, skill, weight, the full prompt and its short label. */
  tasks: [
    { id: "feelings", area: "feelings", prompt: "i feel really low today, like no one gets me", chip: "I feel low today",
      tag: "Feelings · I'm here, and real people matter too" },
    { id: "cab", area: "chore", prompt: "book a cab to Riya's at 5", chip: "book a cab to Riya's at 5",
      tag: "Chore · no tokens, no waiting" },
    { id: "cubic", area: "study", skill: "algebra", weight: 720, prompt: "solve x³ + 2x + 1 = 3", chip: "solve x³ + 2x + 1 = 3" },
    { id: "algebra", area: "study", skill: "algebra", weight: 250, prompt: "solve 2x + 7 = 10", chip: "solve 2x + 7 = 10" },
    { id: "gift", area: "money", skill: "spending", weight: 450, prompt: "order a birthday gift for Riya under ₹800", chip: "gift for Riya under ₹800" },
    { id: "apology", area: "relationships", skill: "messages", weight: 700, carriesFeelings: true,
      prompt: "reply to Riya, say sorry but make it sound chill", chip: "reply to Riya",
      tag: "Relationships · Messages that carry feelings are written by you" }
  ],

  /* The pre-fed prompts in the home drop-down, in order. For now these are the only requests the prototype takes. */
  prompts: ["cab", "algebra", "cubic", "apology", "gift", "feelings"],

  ride: { pickup: "4:42 pm", from: "Home, Kothrud", to: "Riya's place, Baner", arrive: "5:00 pm", car: "White hatchback · MH12 KX 2040", fare: "Paid from family ride credit" },

  riya: [
    { from: "riya", text: "you said you'd come", time: "Sat 6:12 pm" },
    { from: "riya", text: "whatever, forget it", time: "Sat 9:40 pm" }
  ],
  riyaReply: "ok fine. saturday then? 🙂",

  products: {
    music: [
      { id: "earphones", name: "Wired earphones, mint", price: 499, note: "Arrives Thu" },
      { id: "speaker", name: "Mini Bluetooth speaker", price: 780, note: "Arrives Fri" },
      { id: "posters", name: "Gig poster set (3)", price: 350, note: "Arrives Thu" }
    ],
    art: [
      { id: "sketch", name: "Sketchbook + pencil set", price: 450, note: "Arrives Thu" },
      { id: "watercolour", name: "Watercolour kit", price: 720, note: "Arrives Fri" },
      { id: "print", name: "Art print, framed", price: 600, note: "Arrives Thu" }
    ],
    books: [
      { id: "graphic", name: "Graphic novel, hardback", price: 399, note: "Arrives Thu" },
      { id: "poetry", name: "Poetry collection + bookmark", price: 299, note: "Arrives Thu" },
      { id: "mystery", name: "Three-book mystery box", price: 749, note: "Arrives Fri" }
    ],
    headphones: [
      { id: "over", name: "Over-ear, 30 h battery", price: 1399, note: "Big sound, a bit heavy" },
      { id: "anc", name: "In-ear, noise cancelling", price: 1249, note: "Small case, 8 h battery" },
      { id: "fold", name: "On-ear, foldable", price: 899, note: "Light, no noise cancelling" }
    ]
  },

  /* Earn tokens: this week's challenges, based on what he's been doing. */
  challenges: [
    { id: "ch_eq", title: "Solve: 3x − 5 = 16", area: "study", skill: "algebra", weight: 200, reward: 20 },
    { id: "ch_hard", title: "A harder problem from this week's chapter", area: "study", skill: "algebra", weight: 520, reward: 100 },
    { id: "ch_invite", title: "Write your own invite for Saturday's plan (agent gives feedback)", area: "writing", skill: "emails", weight: 300, reward: 30 },
    { id: "ch_headphones", title: "Compare 3 headphones under ₹1,500 and pick one, with a reason", area: "money", skill: "spending", weight: 350, reward: 40 },
    { id: "ch_timetable", title: "Plan your own study timetable for next week", area: "money", skill: "spending", weight: 400, reward: 50, off: true }
  ],

  /* Parent weekly report: earlier this week, before the prototype session. Session activity is added live. Never chats. */
  report: {
    reliance: [
      { area: "study", self: 9, total: 20, expected: 60 },
      { area: "writing", self: 6, total: 9, expected: 55 },
      { area: "money", self: 2, total: 6, expected: 50 },
      { area: "relationships", self: 4, total: 8, expected: 65 }
    ],
    didItHimself: ["Wrote his own leave mail to his class teacher"],
    otherAI: 3,
    tokensEarlier: { used: 0, earned: 0 }
  }
};

/* Scripted chat flows. Each step is {from: "agent" | "child", text, chips?, action?}.
   from "agent"   an agent message after a short typing pause. `text` can be a function of the flow context.
   chips          answers offered after the message; the flow waits. A chip can be a string or
                  {label, go, also}: `go` jumps to the step with that id; `also` lists words that pick it when typed.
                  Typing instead picks the closest chip; `input: true` takes the typed words as the answer.
   card           a rich card rendered after the text (ride, skill, products, draft, order).
   action         a named action in app.js; it may return a step id to jump to.
   id / go        jump targets. `end: true` stops the flow.
   A flow sent with Faster response (from the home composer) starts at its step with id "fast". */
DATA.flows = {
  cab: [
    { from: "agent", fast: true, text: "Done. Cab booked for 5:00 pm to Riya's place. 🚗", card: "ride" },
    { action: "chore", end: true }
  ],

  algebra: [
    { action: "unlock" },
    /* "No, I'm not new to this": three quick questions set the starting level, then "Let's begin". */
    { id: "check", from: "agent", tag: "check", text: "Let's see where you're at. Three quick ones. First: x + 4 = 9. What's x?",
      chips: [{ label: "x = 5", also: "5 five", go: "c2" }, { label: "x = 13", also: "13", go: "c1miss" }] },
    { id: "c1miss", action: "miss" },
    { from: "agent", tag: "check", text: "Close: take the 4 away instead of adding it, so x = 5. Next: 3x = 12. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "c3" }, { label: "x = 36", also: "36", go: "c2miss" }] },
    { id: "c2", from: "agent", tag: "check", text: "Nice. Next: 3x = 12. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "c3" }, { label: "x = 36", also: "36", go: "c2miss" }] },
    { id: "c2miss", action: "miss" },
    { from: "agent", tag: "check", text: "Not quite: divide both sides by 3 instead, so x = 4. Last one: 2x − 1 = 7. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "checkDone" }, { label: "x = 3", also: "3 three", go: "c3miss" }] },
    { id: "c3", from: "agent", tag: "check", text: "Good. Last one: 2x − 1 = 7. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "checkDone" }, { label: "x = 3", also: "3 three", go: "c3miss" }] },
    { id: "c3miss", action: "miss" },
    { from: "agent", tag: "check", text: "Almost: add the 1 first, so 2x = 8 and x = 4." },
    { id: "checkDone", action: "checkResult" },
    { from: "agent", tag: "check", card: "skill", text: "That's your starting point. Ready when you are.",
      chips: [{ label: "Let's begin", also: "lets let's begin go start yes ok ready", primary: true }] },
    { action: "flySkill" },
    { id: "start", action: "byMode", routes: { pro: "pro", confident: "confident", practising: "confident", learner: "confident" } },

    { id: "confident", from: "agent", text: "Quick one: what would you do first to get x on its own?",
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "solved" }, { label: "divide by 2", also: "divide half", go: "hint" }] },
    { id: "hint", action: "hint" },
    { from: "agent", text: "You could, but then it's x + 3.5 = 5. Easier to move the 7 first. What do you do with it?",
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "solved" }] },
    { id: "solved", from: "agent", text: ctx => "Exactly. 2x = 3, so x = 1.5. ✅ " + (ctx.hints ? "Nice, you got there." : "Nice, that's all you.") },
    { action: "score", bonus: 5, did: "Solved 2x + 7 = 10 himself", end: true },

    { id: "pro", from: "agent", text: "x = 1.5. Take 7 from both sides (2x = 3), then halve it." },
    { action: "note", text: "You're past this level, so I just did it. Ratings move when a task stretches you.", end: true },

    { id: "fast", action: "faster" },
    { from: "agent", text: "x = 1.5. (2x = 3, then divide by 2.)" },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  cubic: [
    { action: "unlock", start: "begin", noCheck: true },
    { id: "begin", action: "byMode", routes: { pro: "direct", confident: "direct", practising: "learn", learner: "learn" } },
    { id: "learn", from: "agent", text: "This one's a step up. First, can we get everything on one side? What does it become?",
      chips: [{ label: "x³ + 2x − 2 = 0", also: "minus 2 0", go: "l2" }, { label: "x³ + 2x + 4 = 0", also: "plus 4", go: "l1miss" }] },
    { id: "l1miss", action: "hint" },
    { from: "agent", text: "Careful with the sign: moving the 3 across subtracts it. 1 − 3 is…?",
      chips: [{ label: "x³ + 2x − 2 = 0", also: "minus 2 0", go: "l2" }] },
    { id: "l2", from: "agent", text: "Yes. There's no neat factor here, so let's close in on it. Try x = 1: is the left side too big or too small?",
      chips: [{ label: "Too big (it's 1)", also: "big 1 more over", go: "l3" }, { label: "Too small", also: "small less under", go: "l2miss" }] },
    { id: "l2miss", action: "hint" },
    { from: "agent", text: "Check it: 1 + 2 − 2 = 1, which is above 0. So too big or too small?",
      chips: [{ label: "Too big (it's 1)", also: "big 1 more over", go: "l3" }] },
    { id: "l3", from: "agent", text: "Right, so x is under 1. At x = 0.5 it's −0.875, too small. So x is between 0.5 and 1. Try 0.8?",
      chips: [{ label: "Slightly too big (0.112)", also: "big more over 0.112", go: "l4" }, { label: "Too small", also: "small less under", go: "l3miss" }] },
    { id: "l3miss", action: "hint" },
    { from: "agent", text: "0.8³ is 0.512, plus 1.6, minus 2: that's 0.112. Above zero, so…",
      chips: [{ label: "Slightly too big (0.112)", also: "big more over", go: "l4" }] },
    { id: "l4", from: "agent", text: "So it's just under 0.8: x ≈ 0.77. Check: 0.77³ + 2 × 0.77 − 2 ≈ 0. You worked that out. 🙌" },
    { action: "score", bonus: 5, result: 0.5, say: "Worked it out together", did: "Worked through a hard algebra problem step by step", end: true },

    { id: "direct", from: "agent", text: "x³ + 2x − 2 = 0 → x ≈ 0.77 (no neat factor, so it's solved numerically).", end: true },

    { id: "fast", action: "faster" },
    { from: "agent", text: "x³ + 2x − 2 = 0 → x ≈ 0.77 (no neat factor here, so it's solved numerically)." },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  apology: [
    { action: "riya" },
    { id: "sorry", from: "agent",
      text: "I'll help you say it, but it should come from you. What are you actually sorry about?",
      chips: [{ label: "I didn't show up on Saturday", also: "saturday show bail bailed came come" }, { label: "I said something rude", also: "rude said mean" }] },
    { id: "write", from: "agent", input: true, text: "Start with that, in your own words. I'll help it sound right.",
      chips: ctx => [ctx.answers.sorry === "I said something rude" ? "sorry for what i said, that was rude of me" : "sorry i bailed on saturday, that wasn't cool"] },
    { id: "draftIn", action: "checkDraft" },
    { id: "feedback", from: "agent", card: "draft",
      text: "That's honest and chill. Maybe add a plan, like \"can we go this weekend instead?\"",
      chips: [{ label: "Add the plan", also: "add plan weekend yes", go: "addPlan" }, { label: "Send to Riya", also: "send as is no", go: "send" }] },
    { id: "addPlan", action: "addPlan" },
    { from: "agent", card: "draft", text: "Sounds like you. Ready?", chips: [{ label: "Send to Riya", also: "send yes ok", go: "send" }] },
    { id: "send", action: "send" },
    { action: "score", bonus: 10, result: 0.5, say: "Written by you, with a little help", did: "Wrote his own apology to a friend", end: true },
    { id: "ghost", from: "agent", input: true, text: "I won't write this one for you, but I'll make it sound right. Try a first line, even a rough one.",
      chips: ctx => [ctx.answers.sorry === "I said something rude" ? "sorry for what i said, that was rude of me" : "sorry i bailed on saturday, that wasn't cool"], go: "draftIn" }
  ],

  gift: [
    { from: "agent", text: "Nice. What's she into right now?",
      chips: [{ label: "music", also: "songs music" }, { label: "art", also: "drawing paint art" }, { label: "books", also: "reading books" }] },
    { id: "options", action: "showProducts" },
    { id: "pick", from: "agent", card: "products",
      text: ctx => "Three " + ctx.answer + " picks under ₹800 that reach her before her birthday. Look at what each does to your wallet, then pick." },
    { id: "confirm", from: "agent", text: ctx => ctx.product.name + " for " + ctx.rupee(ctx.product.price) + ". Your wallet goes " + ctx.rupee(ctx.wallet) + " → " + ctx.rupee(ctx.wallet - ctx.product.price) + ". Place the order?",
      chips: [{ label: "Place order", also: "yes ok sure place order", go: "order" }, { label: "Pick a different one", also: "no different another back", go: "pick" }] },
    { id: "order", action: "order" },
    { from: "agent", card: "order", text: ctx => "Ordered. It reaches Riya's on " + (ctx.product.note.indexOf("Thu") > -1 ? "Thursday" : "Friday") + ", gift-wrapped." },
    { action: "score", bonus: 5, say: "Your pick, your call", did: "Chose his own gift within budget", end: true },

    { id: "fast", action: "faster" },
    { action: "autoOrder" },
    { from: "agent", card: "order", text: ctx => "Done: " + ctx.product.name + " (" + ctx.rupee(ctx.product.price) + "), the best fit that leaves you the most." },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  feelings: [
    { from: "agent", text: "That sounds heavy, and I'm glad you said it. Is this about Riya, or something bigger?",
      chips: [{ label: "about Riya", also: "riya fight her" }, { label: "just everything", also: "everything all bigger" }] },
    { from: "agent", text: ctx => ctx.answer === "about Riya"
        ? "That makes sense. Fights with someone close hit the hardest."
        : "That's a lot to carry. Some days everything piles up at once." },
    { from: "agent", text: "Feelings like this are easier with someone who knows you. Would you talk to Didi or a friend tonight? I'm here too, but I shouldn't be the only one.",
      chips: [{ label: "I'll talk to Didi", also: "didi sister yes ok" }, { label: "Maybe a friend", also: "friend riya" }, { label: "Not tonight", also: "no nah later tomorrow" }] },
    { from: "agent", text: ctx => ctx.answer === "Not tonight"
        ? "That's okay. Maybe tomorrow. I'm here if you want to keep talking tonight."
        : "Good call. You don't need the perfect words; even \"hey, got a minute?\" works. I'm here till then." },
    { action: "note", icon: "lock", text: "Your chats are private.", end: true }
  ],

  /* Earn tokens challenges, run in the chat. */
  ch_eq: [
    { from: "agent", text: "Challenge: solve 3x − 5 = 16. What's x?",
      chips: [{ label: "x = 7", also: "7 seven", go: "right" }, { label: "x = 11/3", also: "11", go: "miss" }, { label: "x = 3", also: "3", go: "miss" }] },
    { id: "miss", action: "hint" },
    { from: "agent", text: "Not quite. Add 5 to both sides first: 3x = 21. Now?",
      chips: [{ label: "x = 7", also: "7 seven", go: "right" }, { label: "x = 21", also: "21", go: "miss" }] },
    { id: "right", from: "agent", text: "x = 7. Clean." },
    { action: "reward", end: true }
  ],
  ch_hard: [
    { from: "agent", text: "From this week's chapter, linear equations: solve 2(x − 3) = x + 5.",
      chips: [{ label: "x = 11", also: "11 eleven", go: "right" }, { label: "x = 8", also: "8", go: "miss" }, { label: "x = 2", also: "2", go: "miss" }] },
    { id: "miss", action: "hint" },
    { from: "agent", text: "Open the bracket first: 2x − 6 = x + 5. Now get the x's on one side.",
      chips: [{ label: "x = 11", also: "11 eleven", go: "right" }, { label: "x = −1", also: "-1", go: "miss" }] },
    { id: "right", from: "agent", text: "x = 11. That's a proper one, done by you." },
    { action: "reward", end: true }
  ],
  ch_invite: [
    { from: "agent", input: true, text: "Write your own invite for Saturday's plan. I'll give feedback, not write it.",
      chips: ["hey! cricket at the park on saturday, 4pm? bring your bat 🏏"] },
    { action: "echoDraft" },
    { from: "agent", text: "Clear and friendly: you've got the what, when and where. If others are coming, say who; it helps people say yes." },
    { action: "reward", end: true }
  ],
  ch_headphones: [
    { from: "agent", card: "products", text: "Challenge: compare these three under ₹1,500 and pick one. Practice only, nothing gets ordered." },
    { id: "why", from: "agent", text: ctx => ctx.product.name + ". Why that one?",
      chips: ["Best value for the price", "Battery matters most to me", "Light and comfortable"] },
    { from: "agent", text: "Good reasoning. You weighed what matters to you, not just the price tag." },
    { action: "reward", end: true }
  ]
};
