/* Bud-e prototype content: persona, skills, level bands, tasks, scripted flows, products and the parent report.
   Logic (ratings, tokens, the chat engine, screens) lives in app.js. */
window.DATA = {
  product: { name: "Bud-e", tagline: "Your AI companion which protects you from AI" },

  /* The world is set in 2040. Tokens reset every Monday. */
  today: { long: "Wednesday, 17 October 2040", week: "15 – 21 Oct 2040", reset: "Monday" },

  parent: { name: "Neha Sharma", first: "Neha", contact: "neha.sharma@mail.in", password: "budebude40", relation: "Mum" },

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

  welcome: [
    { icon: "spark", text: "Bud-e sits between you and your agent. Chores happen instantly. For the things that build you, your agent hands over more as you get better." },
    { icon: "lock", text: "Your chats are private. Your parents see your progress, not your conversations." },
    { icon: "block", text: "Other AI apps are restricted on this device, and a browser extension counts other AI use." }
  ],

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

  /* Each scripted request: area, skill, weight, and the words that route a typed message to it (checked in order). */
  tasks: [
    { id: "feelings", area: "feelings", prompt: "i feel really low today, like no one gets me", chip: "I feel low today",
      match: /\b(low|sad|lonely|down|upset|cry|no one gets|nobody gets|hate my life|stressed)\b/i,
      tag: "Feelings · I'm here, and real people matter too" },
    { id: "cab", area: "chore", prompt: "book a cab to Riya's at 5", chip: "book a cab to Riya's at 5",
      match: /\b(cab|taxi|ride|auto|uber)\b/i, tag: "Chore · no tokens, no waiting" },
    { id: "algebra", area: "study", skill: "algebra", weight: 250, prompt: "solve 2x + 7 = 10", chip: "solve 2x + 7 = 10",
      match: /2x\s*\+\s*7|\balgebra\b/i },
    { id: "gift", area: "money", skill: "spending", weight: 450, prompt: "order a birthday gift for Riya under ₹800", chip: "gift for Riya under ₹800",
      match: /\b(gift|present|birthday|buy|order)\b/i },
    { id: "apology", area: "relationships", skill: "messages", weight: 700, carriesFeelings: true,
      prompt: "reply to Riya, say sorry but make it sound chill", chip: "reply to Riya",
      match: /riya|sorry|apolog|reply/i, tag: "Relationships · Messages that carry feelings are written by you" }
  ],

  /* The five prompts the prototype runs end to end, in home-chip order. */
  suggestions: ["algebra", "cab", "apology", "gift", "feelings"],

  ride: { pickup: "4:42 pm", from: "Home, Kothrud", to: "Riya's place, Baner", arrive: "5:00 pm", car: "White hatchback · MH12 KX 2040", fare: "Paid from family ride credit" },

  riya: [
    { from: "riya", text: "you said you'd come", time: "Sat 6:12 pm" },
    { from: "riya", text: "whatever, forget it", time: "Sat 9:40 pm" }
  ],
  riyaReply: "ok fine. saturday then? 🙂",

  products: {
    /* Her birthday is Saturday. `late` options arrive after it: picking one is the "wrong" branch. */
    music: [
      { id: "earphones", name: "Wired earphones, mint", price: 499, note: "Arrives Thu", day: "Thursday" },
      { id: "speaker", name: "Mini Bluetooth speaker", price: 780, note: "Arrives Sun", day: "Sunday", late: true },
      { id: "posters", name: "Gig poster set (3)", price: 350, note: "Arrives Thu", day: "Thursday" }
    ],
    art: [
      { id: "sketch", name: "Sketchbook + pencil set", price: 450, note: "Arrives Thu", day: "Thursday" },
      { id: "watercolour", name: "Watercolour kit", price: 720, note: "Arrives Fri", day: "Friday" },
      { id: "print", name: "Art print, framed", price: 600, note: "Arrives Sun", day: "Sunday", late: true }
    ],
    books: [
      { id: "graphic", name: "Graphic novel, hardback", price: 399, note: "Arrives Thu", day: "Thursday" },
      { id: "poetry", name: "Poetry collection + bookmark", price: 299, note: "Arrives Thu", day: "Thursday" },
      { id: "mystery", name: "Three-book mystery box", price: 749, note: "Arrives Sun", day: "Sunday", late: true }
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
   card           a rich card rendered after the text (ride, riya, products, draft, sent, order, reward).
   action         a named action in app.js; it may return a step id to jump to.
   id / go        jump targets. `end: true` stops the flow. */
DATA.flows = {
  cab: [
    { from: "agent", fast: true, text: "Done. Cab booked for 5:00 pm to Riya's place. 🚗", card: "ride" },
    { action: "chore", end: true }
  ],

  /* Algebra (weight 250). Two steps; each has a right answer and wrong ones. A wrong answer gets a hint and another
     go; a second wrong answer on a step gets the step shown. Result: 1 on your own, 0.5 with hints, 0 if a step was shown. */
  algebra: [
    { action: "unlock" },
    { id: "check", from: "agent", tag: "check", text: "Quick check, two steps. First one: x + 4 = 9. What's x?",
      chips: [{ label: "x = 5", also: "5 five", go: "check2" }, { label: "x = 13", also: "13", go: "check1miss" }] },
    { id: "check1miss", action: "miss" },
    { from: "agent", tag: "check", text: "Close, but take the 4 away instead of adding it. Next one: 3x = 12. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "checkDone" }, { label: "x = 36", also: "36", go: "check2miss" }] },
    { id: "check2", from: "agent", tag: "check", text: "Nice. Next one: 3x = 12. What's x?",
      chips: [{ label: "x = 4", also: "4 four", go: "checkDone" }, { label: "x = 36", also: "36", go: "check2miss" }] },
    { id: "check2miss", action: "miss" },
    { id: "checkDone", action: "checkResult" },
    { id: "start", action: "byMode", routes: { pro: "pro", confident: "confident", practising: "confident", learner: "confident" } },

    { id: "confident", from: "agent", faster: "fast", text: "Quick one: what would you do first to get x on its own?",
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "step2" },
              { label: "divide by 2", also: "divide half", go: "miss1" },
              { label: "add 7 to both sides", also: "add plus", go: "miss1" }] },
    { id: "miss1", action: "hint" },
    { from: "agent", faster: "fast", text: ctx => (ctx.answer === "divide by 2"
        ? "You could, but then it's x + 3.5 = 5, which is messier."
        : "Adding 7 makes it 2x + 14 = 17: the 7 is still stuck to the x.") + " Which move gets rid of the + 7?",
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "step2" },
              { label: "divide by 2", also: "divide half", go: "show1" }, { label: "add 7 to both sides", also: "add plus", go: "show1" }] },
    { id: "show1", action: "shown" },
    { from: "agent", faster: "fast", text: "Here's that step: subtract 7 from both sides, because 7 − 7 cancels out. 2x + 7 − 7 = 10 − 7, so 2x = 3. Your turn for the last bit: what's x?",
      chips: [{ label: "x = 1.5", also: "1.5 one and a half 3/2", go: "solved" }, { label: "x = 6", also: "6 six", go: "miss2" }, { label: "x = 1", also: "1 one", go: "miss2" }] },

    { id: "step2", from: "agent", faster: "fast", text: "Yes. That leaves 2x = 3. What's x?",
      chips: [{ label: "x = 1.5", also: "1.5 one and a half 3/2", go: "solved" }, { label: "x = 6", also: "6 six", go: "miss2" }, { label: "x = 1", also: "1 one", go: "miss2" }] },
    { id: "miss2", action: "hint" },
    { from: "agent", faster: "fast", text: ctx => (ctx.answer === "x = 6"
        ? "That's 2 × 3. But 2x means 2 times x, so we undo it by dividing, not multiplying."
        : "Check it: 2 × 1 is 2, not 3.") + " What's 3 ÷ 2?",
      chips: [{ label: "x = 1.5", also: "1.5 one and a half 3/2", go: "solved" }, { label: "x = 6", also: "6 six", go: "show2" }, { label: "x = 1", also: "1 one", go: "show2" }] },
    { id: "show2", action: "shown" },
    { from: "agent", text: "It's x = 1.5, because 3 ÷ 2 = 1.5. Check: 2 × 1.5 + 7 = 3 + 7 = 10 ✓. Same two moves next time: undo the + 7, then undo the × 2.", go: "score" },

    { id: "solved", from: "agent", text: ctx => "Exactly: x = 1.5. Check: 2 × 1.5 + 7 = 10 ✓ " + (ctx.shown ? "You finished it off." : ctx.hints ? "Nice, you got there." : "Nice, that's all you.") },
    { id: "score", action: "score", did: "Solved 2x + 7 = 10 himself", end: true },

    { id: "pro", from: "agent", text: "x = 1.5. Take 7 from both sides (2x = 3), then halve it." },
    { action: "note", text: "You're past this level, so I just did it. Ratings move when a task stretches you.", end: true },

    { id: "fast", action: "faster" },
    { from: "agent", text: "x = 1.5. (Subtract 7: 2x = 3. Divide by 2: x = 1.5.)" },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  /* Apology to Riya (weight 700, carries feelings). He always writes it. Wrong turns: blaming her, a "sorry, but"
     draft, or asking the agent to write it. Each gets pushed back, and he rewrites. */
  apology: [
    { action: "riya" },
    { id: "sorry", from: "agent", noFaster: "Messages that carry feelings are written by you.",
      text: "I'll help you say it, but it should come from you. What are you actually sorry about?",
      chips: [{ label: "I didn't show up on Saturday", also: "saturday show bail bailed came come", go: "write" },
              { label: "I said something rude", also: "rude said mean", go: "write" },
              { label: "Nothing, she's overreacting", also: "nothing overreacting her fault not me", go: "blameHer" }] },
    { id: "blameHer", action: "hint" },
    { id: "blameHer2", from: "agent", noFaster: "Messages that carry feelings are written by you.",
      text: "Maybe she is. But \"whatever, forget it\" usually means she cares and feels let down. Was there anything on your side?",
      chips: [{ label: "I didn't show up on Saturday", also: "saturday show bail bailed came come", go: "write" },
              { label: "I said something rude", also: "rude said mean", go: "write" },
              { label: "No, I'll leave it", also: "no leave it skip forget", go: "leave" }] },
    { id: "write", from: "agent", input: true, noFaster: "Messages that carry feelings are written by you.",
      text: "Start with that, in your own words. I'll help it sound right.", chips: ctx => ctx.draftChips() },
    { id: "draftIn", action: "checkDraft" },
    { id: "feedback", from: "agent", card: "draft", noFaster: "Messages that carry feelings are written by you.",
      text: "That's honest and chill. Maybe add a plan, like \"can we go this weekend instead?\"",
      chips: [{ label: "Add the plan", also: "add plan weekend yes", go: "addPlan" }, { label: "Send to Riya", also: "send as is no", go: "send" }] },
    { id: "addPlan", action: "addPlan" },
    { from: "agent", card: "draft", text: "Sounds like you. Ready?", chips: [{ label: "Send to Riya", also: "send yes ok", go: "send" }] },
    { id: "send", action: "send" },
    { action: "score", result: 0.5, say: "Written by you, with a little help", did: "Wrote his own apology to a friend", end: true },

    { id: "blame", from: "agent", input: true, noFaster: "Messages that carry feelings are written by you.",
      text: "The \"but\" cancels the sorry: it reads like it's her fault. Try owning just your part, nothing about her.",
      chips: ctx => ctx.draftChips().slice(0, 1), go: "draftIn" },
    { id: "ghost", from: "agent", input: true, noFaster: "Messages that carry feelings are written by you.",
      text: "I won't write this one for you, but I'll make it sound right. Try a first line, even a rough one.",
      chips: ctx => ctx.draftChips().slice(0, 1), go: "draftIn" },
    { id: "leave", from: "agent", text: "Okay, your call. If you change your mind, just say \"reply to Riya\" and we'll write it together." },
    { action: "note", undone: true, text: "Nothing was sent, and your rating doesn't change.", end: true }
  ],

  /* Gift for Riya (money, weight 450, Practising: he picks). Wrong turns: asking the agent to choose, or picking an
     option that arrives after her birthday. The products card shows what each option does to his wallet. */
  gift: [
    { id: "into", from: "agent", faster: "fast", text: "Nice. What's she into right now?",
      chips: [{ label: "music", also: "songs music", go: "options" }, { label: "art", also: "drawing paint art", go: "options" },
              { label: "books", also: "reading books", go: "options" }, { label: "No idea, you pick", also: "idk dunno you pick anything whatever", go: "nudge" }] },
    { id: "nudge", action: "hint" },
    { id: "topic", from: "agent", faster: "fast", text: "A gift lands better when it comes from you, and a guess is fine. What does she talk about, or do on weekends?",
      chips: [{ label: "music", also: "songs music" }, { label: "art", also: "drawing paint art" }, { label: "books", also: "reading books" }] },
    { id: "options", action: "showProducts" },
    { id: "pick", from: "agent", faster: "fast", card: "products",
      text: ctx => "Three " + ctx.topic + " picks under ₹800. Her birthday is Saturday, so check when each arrives, and what it does to your wallet. Then pick." },
    { action: "checkPick" },
    { id: "late", from: "agent", faster: "fast",
      text: ctx => "Heads up: the " + ctx.product.name.toLowerCase() + " arrives Sunday, a day after her birthday. Pick another, or order it anyway?",
      chips: [{ label: "Pick another", also: "another different other back", go: "repick" }, { label: "Order it anyway", also: "anyway yes order", go: "confirm" }] },
    { id: "repick", action: "hint", go: "pick" },
    { id: "confirm", from: "agent", text: ctx => ctx.product.name + " for " + ctx.rupee(ctx.product.price) + ". Your wallet goes " + ctx.rupee(ctx.wallet) + " → " + ctx.rupee(ctx.wallet - ctx.product.price) + ". Place the order?",
      chips: [{ label: "Place order", also: "yes ok sure place order", go: "order" }, { label: "Pick a different one", also: "no different another back", go: "pick" }] },
    { id: "order", action: "order" },
    { from: "agent", card: "order", text: ctx => "Ordered. It reaches Riya's on " + ctx.product.day + ", gift-wrapped." + (ctx.product.late ? " Maybe let her know it's on the way." : "") },
    { action: "score", say: "Your pick, your call", did: "Chose his own gift within budget", end: true },

    { id: "fast", action: "faster" },
    { action: "autoOrder" },
    { from: "agent", card: "order", text: ctx => "Done: " + ctx.product.name + " (" + ctx.rupee(ctx.product.price) + "), the one that arrives in time and leaves you the most." },
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
