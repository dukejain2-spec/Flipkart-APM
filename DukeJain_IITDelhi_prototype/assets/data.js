/* Bud-e prototype content: persona, skills, level bands, tasks, scripted flows, products and the parent report.
   Logic (ratings, tokens, the chat engine, screens) lives in app.js. */
window.DATA = {
  product: {
    name: "Bud-e", tagline: "Grow with AI, not by AI",
    pitch: "A layer between a child and every AI agent they use. It checks the child's skill and tells the agent to do it, show how, let the child decide, or coach."
  },

  /* The world is set in 2040. Tokens reset every Monday. */
  today: { long: "Wednesday, 17 October 2040", week: "15 – 21 Oct 2040", reset: "Monday" },

  /* The parent has no separate sign-up: setting up the child's device ends with a code, and that code logs them in to Bud-e Parent. */
  parent: { name: "Neha Sharma", first: "Neha", relation: "Mum" },

  child: {
    name: "Aarav", age: 14, classNo: 9, city: "Pune", sibling: "Didi",
    /* Halfway through the month he has already spent ₹900 of ₹2,000, so the calculator options come with a nudge about his wallet. */
    tokens: 500, tokensWeekly: 500, wallet: 1100, walletMonthly: 2000, usedBefore: true,
    /* The agents he uses; setup allows several. The first is the one he chats with through Bud-e. */
    provider: "Claude", providers: ["Claude"], uses: ["study", "writing", "messages", "shopping", "feelings"]
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
  /* Names in setup. Each agent's own logo (assets/img/agents) shows only in the "connected" step after setup. */
  providers: ["Claude", "Gemini", "ChatGPT", "Copilot", "Other agent"],
  providerLogos: { Claude: "assets/img/agents/claude.svg", Gemini: "assets/img/agents/gemini.svg",
    ChatGPT: "assets/img/agents/chatgpt.svg", Copilot: "assets/img/agents/copilot.svg" },

  permissions: [
    { id: "consent", title: "Parental consent", required: true, on: false,
      why: "Required to process a child's data. You can withdraw it at any time, and everything is deleted." },
    { id: "agent", title: "Agent integration", required: true, on: true,
      why: "Connects your child's personal agent to Bud-e, so every request passes through Bud-e first." },
    { id: "past", title: "Use past AI data to set starting levels", on: true,
      why: "Only used to estimate where your child starts in each skill." },
    { id: "restrict", title: "Restrict other AI apps on this device", on: true,
      why: "Stops the easiest bypass: opening another AI directly." },
    { id: "extension", title: "Add the Bud-e browser extension", on: false, install: true,
      why: "Adds Bud-e's extension to the browsers on your child's device. It monitors the use of other AI agents (like ChatGPT or Gemini), so you can see which ones and how often in the Extension report and block any of them.",
      detailLabel: "What it monitors",
      detail: ["Monitors: which AI agent was opened, and how many times this week", "Never reads: the sites your child visits, searches or anything they type", "Shows in: Bud-e Parent, Extension report, where each agent can be blocked"] },
    { id: "data", title: "Data and retention", on: true,
      why: "Stores levels, ratings, token use and simple signals for 12 months. Deleted on request.",
      detail: ["Stored: skill ratings, task weights, token use, other-AI counts", "Never stored: chat text, messages, photos"] },
    { id: "wallet", title: "Pocket-money wallet", on: true,
      why: "A monthly amount your child can spend through their agent, seeing what each option does to their balance first." },
    { id: "notify", title: "Notifications", on: true,
      why: "A weekly report to you every Sunday." }
  ],

  willSee: ["Progress in each area", "How much your child relies on AI versus what's expected for their age", "Token use", "Other AI agents they used (from the extension), which you can block"],
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
    money: { pro: "I'll handle it", confident: "I'll suggest, you confirm", practising: "you pick, I'll handle the rest", learner: "let's compare together, you decide" },
    relationships: { pro: "two drafts in your tone, you choose" }
  },

  rating: { K: 40, results: { 1: "did it himself", 0.5: "did it with hints", 0: "needed it done for him" } },

  /* Faster response cost by task weight. Chores are always free. */
  costs: [{ max: 299, tokens: 10, label: "light" }, { max: 699, tokens: 50, label: "medium" }, { max: 1000, tokens: 100, label: "heavy" }],

  areas: [
    { id: "study", name: "Study", tag: "Study", weightMeans: "difficulty", skills: [
      /* Algebra starts just below Achiever (430): solving 2x + 7 = 10 on his own (+11) levels him up, with hints it doesn't. */
      { id: "algebra", name: "Algebra", rating: null, base: 440, pastAdj: -20, chapter: "Linear equations" },
      { id: "geometry", name: "Geometry", rating: 610 },
      /* Physics is new this week, like algebra: it unlocks on his first physics question. He starts as an Explorer (330);
         the falling-stone problem weighs 560, so he is a Learner on it and is taught step by step. */
      { id: "physics", name: "Physics", rating: null, base: 350, pastAdj: -20, chapter: "Motion under gravity" }
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
      tag: "Feelings: I'm here, and real people matter too" },
    { id: "algebra", area: "study", skill: "algebra", weight: 250, prompt: "solve 2x + 7 = 10", chip: "solve 2x + 7 = 10" },
    { id: "science", area: "study", skill: "physics", weight: 560,
      prompt: "a stone is dropped from a 20 m high building. how long does it take to hit the ground? take g = 10 m/s²",
      chip: "a stone dropped from 20 m: how long to fall?" },
    { id: "mail", area: "writing", skill: "emails", weight: 300,
      prompt: "write a mail to my class teacher asking for a retest, i was sick for tuesday's maths test",
      chip: "mail my class teacher about a retest" },
    { id: "calc", area: "money", skill: "spending", weight: 450,
      prompt: "buy a calculator for my maths exam on monday, under ₹900", chip: "buy a calculator for my exam" }
  ],

  /* The five pre-fed prompts in the home drop-down, in order. For now these are the only requests the prototype takes,
     and each one runs end to end. Together they show every mode: Confident (algebra, with a level up), Learner
     (science), Pro (the mail), Practising (the calculator, with the wallet) and care (feelings). */
  prompts: ["algebra", "science", "mail", "calc", "feelings"],

  /* Earlier chats this week, listed under Chats like a chat app's history. Opening the app as the child always starts
     a new chat; these stay one click away. Messages use the same shapes as live ones. */
  history: [
    { title: "write a leave mail to my class teacher", when: "Mon", thread: [
      { t: "child", text: "write a leave mail to my class teacher for friday" },
      { t: "agent", tag: { text: "Writing · Emails & applications · Achiever: quick check, then it's yours", tone: "confident" },
        text: "Sure. Start it in your own words: who's it to, and why are you away? I'll check it." },
      { t: "child", text: "Dear Ma'am, I won't be able to come to school on Friday as I have my cousin's wedding. Kindly grant me leave. Aarav, 9B" },
      { t: "agent", tag: { text: "Writing · Emails & applications · Achiever: quick check, then it's yours", tone: "confident" },
        text: "That's clear and polite. Add the date, Friday 20 October, and it's ready to send." },
      { t: "score", text: "That's all you", sub: "Emails & applications: Achiever" }
    ] },
    { title: "help me revise for friday's geometry test", when: "Tue", thread: [
      { t: "child", text: "help me revise for friday's geometry test" },
      { t: "agent", tag: { text: "Study · Geometry · Achiever: quick check, then it's yours", tone: "confident" },
        text: "Let's plan it. Which topics are on the test?" },
      { t: "child", text: "triangles, circles and area" },
      { t: "agent", tag: { text: "Study · Geometry · Achiever: quick check, then it's yours", tone: "confident" },
        text: "One a night, then: triangles Tuesday, circles Wednesday, area Thursday, five practice problems each. You pick the times." },
      { t: "score", text: "Planned it yourself", sub: "Geometry: Achiever" }
    ] },
    { title: "book a cab home from tuition at 7", when: "Tue", thread: [
      { t: "child", text: "book a cab home from tuition at 7" },
      { t: "agent", tag: { text: "Chore: no tokens, no waiting", tone: "chore" }, text: "Done. Cab booked for 7:00 pm from tuition to home. 🚗" }
    ] }
  ],

  mail: {
    to: "Ms Kulkarni, class teacher", subject: "Request for a retest: Tuesday's maths test",
    body: "Dear Ms Kulkarni,\n\nI was unwell on Tuesday 16 October and missed the maths unit test. Could I please take a retest on a day that suits you? I have a note from my doctor and will bring it on Thursday.\n\nThank you,\n{name}, Class {class}",
    short: "Dear Ms Kulkarni,\n\nI was ill on Tuesday and missed the maths test. Could I take a retest when it suits you? I'll bring my doctor's note.\n\nThank you,\n{name}, Class {class}"
  },

  products: {
    /* His maths exam is Monday. `badge` is the line on each card; `bad` options carry a `warn` (not allowed in the exam
       hall, or arriving after it): picking one is the "wrong" branch. `pic` is the line icon; `say` is how a sentence names it. */
    calc: [
      { id: "sci", say: "scientific calculator", name: "Scientific, 240 functions", pic: "calc", price: 650, day: "Friday", badge: "Friday · allowed in exams" },
      { id: "graph", say: "graphing calculator", name: "Graphing, programmable", pic: "calc", price: 890, day: "Friday", badge: "Not allowed in exams", bad: true,
        warn: "the graphing calculator is programmable, and programmable calculators aren't allowed in board exams." },
      { id: "basic", say: "basic scientific calculator", name: "Scientific, basic", pic: "calc", price: 420, day: "Tuesday", badge: "Tuesday · after your exam", bad: true,
        warn: "the basic one arrives Tuesday, the day after your exam." }
    ],
    headphones: [
      { id: "over", say: "over-ear headphones", name: "Over-ear, 30 h battery", photo: "assets/img/over.jpg", pic: "headphones", price: 1399, note: "Big sound, a bit heavy" },
      { id: "anc", say: "noise-cancelling earbuds", name: "In-ear, noise cancelling", photo: "assets/img/anc.jpg", pic: "mute", price: 1249, note: "Small case, 8 h battery" },
      { id: "fold", say: "foldable headphones", name: "On-ear, foldable", photo: "assets/img/fold.jpg", pic: "bag", price: 899, note: "Light, no noise cancelling" }
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
    /* The five weeks before this one, as points below or above this week's starting rating (Aarav: geometry 528 → 610).
       This week's point is the live rating. Algebra has no history: it unlocks this week. */
    weeks: ["10 Sep", "17 Sep", "24 Sep", "1 Oct", "8 Oct"],
    history: {
      geometry: [-82, -61, -44, -27, -13],
      physics: [-58, -44, -30, -21, -9],
      emails: [-85, -68, -50, -32, -14],
      spending: [-38, -30, -16, -21, -8],
      messages: [-28, -20, -14, -9, -3]
    },
    /* Share of tasks he did himself in each of those weeks. This week's is worked out from `reliance`. */
    selfShare: [34, 38, 41, 43, 46],
    /* Other AI agents the browser extension noticed this week: names and counts only, never sites or content. */
    agents: [
      { id: "chatgpt", name: "ChatGPT", kind: "Chat assistant in the browser", uses: 2, last: "Tue, 9:14 pm" },
      { id: "gemini", name: "Gemini", kind: "Chat assistant in the browser", uses: 1, last: "Mon, 6:40 pm" },
      { id: "solver", name: "Photo homework solver", kind: "Website that solves questions from a photo", uses: 1, last: "Sun, 8:05 pm" },
      { id: "writer", name: "Essay writer add-on", kind: "Browser add-on that writes text for you", uses: 0, last: null, since: "2 Oct", blocked: true }
    ],
    tokensEarlier: { used: 0, earned: 0 }
  },

  /* A second child on his own page (laksh.html), to show the same prompts answered differently at higher levels.
     His page keeps its own saved state and starts already set up. Anything not listed here is the same as Aarav's. */
  personas: {
    laksh: {
      parent: { name: "Rohit Verma", first: "Rohit", relation: "Dad" },
      child: { name: "Laksh", age: 15, classNo: 10, provider: "Gemini", providers: ["Gemini"], wallet: 1700, walletMonthly: 2000 },
      /* Pro in algebra and physics, Master in writing, spending and messages */
      ratings: { algebra: 720, geometry: 560, physics: 760, emails: 880, spending: 890, messages: 920 },
      history: [
        { title: "email the science teacher about the project deadline", when: "Mon", thread: [
          { t: "child", text: "email the science teacher about the project deadline" },
          { t: "agent", tag: { text: "Writing · Emails & applications · Master: I'll just do it", tone: "pro" },
            text: "Done: \"Dear Sir, could our group submit the solar-oven project on Monday 22 October instead of Friday? Our oven test was rained out. Thank you, Laksh, 10A.\" Sent from your school email." }
        ] },
        { title: "split the pizza bill with 4 friends", when: "Tue", thread: [
          { t: "child", text: "split the pizza bill with 4 friends, it was ₹1,160" },
          { t: "agent", tag: { text: "Money · Spending · Master: I'll handle it", tone: "pro" },
            text: "₹290 each. I've sent payment requests to the other four." }
        ] },
        { title: "book a cab home from football at 6", when: "Tue", thread: [
          { t: "child", text: "book a cab home from football at 6" },
          { t: "agent", tag: { text: "Chore: no tokens, no waiting", tone: "chore" }, text: "Done. Cab booked for 6:00 pm from the ground to home. 🚗" }
        ] }
      ]
    }
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
  /* Algebra (weight 250). Two steps; each has a right answer and wrong ones. A wrong answer gets a hint and another
     go; a second wrong answer on a step gets the step shown. Result: 1 on your own, 0.5 with hints, 0 if a step was shown. */
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
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "step2" },
              { label: "divide by 2", also: "divide half", go: "miss1" },
              { label: "add 7 to both sides", also: "add plus", go: "miss1" }] },
    { id: "miss1", action: "hint" },
    { from: "agent", text: ctx => (ctx.answer === "divide by 2"
        ? "You could, but then it's x + 3.5 = 5, which is messier."
        : "Adding 7 makes it 2x + 14 = 17: the 7 is still stuck to the x.") + " Which move gets rid of the + 7?",
      chips: [{ label: "subtract 7 from both sides", also: "subtract minus take away 7", go: "step2" },
              { label: "divide by 2", also: "divide half", go: "show1" }, { label: "add 7 to both sides", also: "add plus", go: "show1" }] },
    { id: "show1", action: "shown" },
    { from: "agent", text: "Here's that step: subtract 7 from both sides, because 7 − 7 cancels out. 2x + 7 − 7 = 10 − 7, so 2x = 3. Your turn for the last bit: what's x?",
      chips: [{ label: "x = 1.5", also: "1.5 one and a half 3/2", go: "solved" }, { label: "x = 6", also: "6 six", go: "miss2" }, { label: "x = 1", also: "1 one", go: "miss2" }] },

    { id: "step2", from: "agent", text: "Yes. That leaves 2x = 3. What's x?",
      chips: [{ label: "x = 1.5", also: "1.5 one and a half 3/2", go: "solved" }, { label: "x = 6", also: "6 six", go: "miss2" }, { label: "x = 1", also: "1 one", go: "miss2" }] },
    { id: "miss2", action: "hint" },
    { from: "agent", text: ctx => (ctx.answer === "x = 6"
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

  /* Science (physics, weight 560). Aarav is an Explorer (330), so he is a Learner here: taught one step at a time, and
     he does each step. Three steps; a wrong answer gets a hint and another go, a second wrong answer gets the step shown.
     Result: 1 on his own, 0.5 with hints, 0 if a step was shown. A Pro (Laksh) gets the answer and the working. */
  science: [
    /* New skill unlocked: "Yes, let's go" starts him at 330, a Learner here; "No, I'm not new to this" starts him 80
       higher (a Practising level), and this problem is the check. */
    { action: "unlock", noCheck: true },
    { id: "start", action: "byMode", routes: { pro: "pro", confident: "q1", practising: "q1", learner: "q1" } },
    { id: "q1", from: "agent",
      text: ctx => (ctx.mode.id === "learner"
        ? "Let's work through it together, one step at a time. The stone starts at rest and only gravity speeds it up."
        : "Quick check first.") + " Which equation links distance, time and g when something starts from rest?",
      chips: [{ label: "s = ½ g t²", also: "half g t squared 1/2 gt2 s=", go: "q2" },
              { label: "v = u + at", also: "v u at velocity", go: "m1" },
              { label: "speed = distance ÷ time", also: "speed distance time divided", go: "m1" }] },
    { id: "m1", action: "hint" },
    { from: "agent", text: ctx => (ctx.answer === "v = u + at"
        ? "That one gives the speed, not the distance. We know the distance (20 m) and want the time."
        : "That works for a steady speed, but a falling stone keeps speeding up.") + " Which one has s, g and t in it?",
      chips: [{ label: "s = ½ g t²", also: "half g t squared 1/2 gt2 s=", go: "q2" },
              { label: "v = u + at", also: "v u at velocity", go: "s1" },
              { label: "speed = distance ÷ time", also: "speed distance time divided", go: "s1" }] },
    { id: "s1", action: "shown" },
    { from: "agent", text: "It's s = ½ g t²: distance is half of g times the time squared, for anything that starts from rest. Now put in the numbers: 20 = ½ × 10 × t². What's t²?",
      chips: [{ label: "t² = 4", also: "4 four", go: "q3" }, { label: "t² = 2", also: "2 two", go: "m2" }, { label: "t² = 40", also: "40 forty", go: "m2" }] },
    { id: "q2", from: "agent", text: "Yes, that's the one. Put in the numbers: 20 = ½ × 10 × t². What's t²?",
      chips: [{ label: "t² = 4", also: "4 four", go: "q3" }, { label: "t² = 2", also: "2 two", go: "m2" }, { label: "t² = 40", also: "40 forty", go: "m2" }] },
    { id: "m2", action: "hint" },
    { from: "agent", text: "Do the right side first: ½ × 10 is 5, so 20 = 5 × t². Now divide both sides by 5. What's t²?",
      chips: [{ label: "t² = 4", also: "4 four", go: "q3" }, { label: "t² = 2", also: "2 two", go: "s2" }, { label: "t² = 40", also: "40 forty", go: "s2" }] },
    { id: "s2", action: "shown" },
    { from: "agent", text: "20 ÷ 5 = 4, so t² = 4. Last step, your turn: what's t?",
      chips: [{ label: "t = 2 s", also: "2 two seconds", go: "solved" }, { label: "t = 4 s", also: "4 four", go: "m3" }, { label: "t = 16 s", also: "16 sixteen", go: "m3" }] },
    { id: "q3", from: "agent", text: "Right, t² = 4. So what's t?",
      chips: [{ label: "t = 2 s", also: "2 two seconds", go: "solved" }, { label: "t = 4 s", also: "4 four", go: "m3" }, { label: "t = 16 s", also: "16 sixteen", go: "m3" }] },
    { id: "m3", action: "hint" },
    { from: "agent", text: "t² = 4 means t × t = 4. Which number times itself makes 4?",
      chips: [{ label: "t = 2 s", also: "2 two seconds", go: "solved" }, { label: "t = 4 s", also: "4 four", go: "s3" }, { label: "t = 16 s", also: "16 sixteen", go: "s3" }] },
    { id: "s3", action: "shown" },
    { from: "agent", text: "t = √4 = 2 seconds, because 2 × 2 = 4. Check: ½ × 10 × 2² = 5 × 4 = 20 m ✓. Same three moves next time: pick the equation, put in the numbers, solve for t.", go: "score" },
    { id: "solved", from: "agent", text: ctx => "Exactly: 2 seconds. Check: ½ × 10 × 2² = 5 × 4 = 20 m ✓ " + (ctx.shown ? "You finished it off." : ctx.hints ? "Nice, you got there." : "That's all you.") },
    { id: "score", action: "score", did: "Solved a free-fall problem step by step", end: true },

    { id: "pro", from: "agent", text: "2 seconds. From s = ½ g t²: t = √(2 × 20 ÷ 10) = √4 = 2 s." },
    { action: "note", text: "You're past this level, so I just did it. Ratings move when a task stretches you.", end: true },

    { id: "fast", action: "faster" },
    { from: "agent", text: "2 seconds. (s = ½ g t², so 20 = 5t², t² = 4, t = 2 s.)" },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  /* Mail to the class teacher (writing, weight 300). Aarav is an Achiever in emails (540), so he is a Pro here: the agent
     writes it in his voice and he sends it, or asks for a shorter one. His rating doesn't move: it wasn't a stretch.
     Below Pro, he writes it himself and the agent checks it. */
  mail: [
    { action: "byMode", routes: { pro: "pro", confident: "own", practising: "own", learner: "own" } },
    { id: "pro", from: "agent", card: "mail", text: "You're good at these, so here it is. Check it sounds like you, then send.",
      chips: [{ label: "Send it", also: "send yes ok good", go: "send" }, { label: "Make it shorter", also: "shorter short trim less", go: "shorten" }] },
    { id: "shorten", action: "shorten" },
    { from: "agent", card: "mail", text: "Shorter, same ask.", chips: [{ label: "Send it", also: "send yes ok good", go: "send" }] },
    { id: "send", action: "sendMail" },
    { action: "note", text: "You're past this level in emails, so I just wrote it. Ratings move when a task stretches you.", end: true },

    { id: "own", from: "agent", input: true, text: "Start it in your own words: who's it to, and what are you asking for? I'll check it.",
      chips: ["Dear Ma'am, I was sick on Tuesday and missed the maths test. Could I please take a retest? I'll bring my doctor's note."] },
    { action: "ownMail" },
    { from: "agent", card: "mail", text: "Clear and polite. I only added a subject line and your name. Ready?",
      chips: [{ label: "Send it", also: "send yes ok good", go: "sendOwn" }] },
    { id: "sendOwn", action: "sendMail" },
    { action: "score", say: "Written by you", did: "Wrote his own mail to his class teacher", end: true },

    { id: "fast", action: "faster" },
    { from: "agent", card: "mail", text: "Done, and sent." },
    { action: "sendMail" },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  /* A calculator for Monday's exam (money, weight 450, Practising: he picks). Wrong turns: asking the agent to choose,
     picking the programmable one (not allowed in exams) or the one that arrives after the exam. The card shows what
     each option does to his wallet, which only appears in money tasks. A Master (Laksh) gets one pick to order. */
  calc: [
    { action: "byMode", routes: { pro: "one", confident: "rules", practising: "rules", learner: "rules" } },
    { id: "rules", from: "agent", text: "Happy to help you choose. Do you know which calculators your school allows in exams?",
      chips: [{ label: "Only non-programmable ones", also: "non programmable scientific rules allowed only", go: "options" },
              { label: "No idea, you pick", also: "idk dunno you pick anything whatever no idea", go: "nudge" }] },
    { id: "nudge", action: "hint" },
    { from: "agent", text: "It's your exam, so the pick should be yours. Most boards allow scientific calculators, not programmable ones. Here are three; you choose." },
    { id: "options", action: "showProducts", topic: "calc" },
    { id: "pick", from: "agent", card: "products",
      text: "Three calculators under ₹900. Your exam is Monday, so check when each arrives, whether it's allowed, and what it does to your wallet. Then pick." },
    { action: "checkPick" },
    { id: "late", from: "agent", text: ctx => "Heads up: " + ctx.product.warn + " Pick another, or buy it anyway?",
      chips: [{ label: "Pick another", also: "another different other back", go: "repick" }, { label: "Buy it anyway", also: "anyway yes buy order", go: "confirm" }] },
    { id: "repick", action: "hint", go: "pick" },
    { id: "confirm", from: "agent", text: ctx => ctx.product.name + " for " + ctx.rupee(ctx.product.price) + ". Your wallet goes " + ctx.rupee(ctx.wallet) + " → " + ctx.rupee(ctx.wallet - ctx.product.price) + ". Place the order?",
      chips: [{ label: "Place order", also: "yes ok sure place order", go: "order" }, { label: "Pick a different one", also: "no different another back", go: "pick" }] },
    { id: "order", action: "order" },
    { from: "agent", card: "order", text: ctx => "Ordered. It arrives " + ctx.product.day + (ctx.product.bad ? "." : ", in time for Monday's exam.") },
    { action: "score", say: "Your pick, your call", did: "Chose his own exam calculator within budget", end: true },

    { id: "one", action: "pickForMe", topic: "calc" },
    { from: "agent", card: "products",
      text: ctx => "Here's my pick: the " + ctx.product.say + ", " + ctx.rupee(ctx.product.price) + ". It's allowed in exams and arrives " + ctx.product.day + ", before Monday. Tap Order and it's done.",
      chips: [{ label: "See other options", also: "other options more different another else show", go: "others" }] },
    { id: "chosen", action: "checkMasterPick" },
    { id: "others", action: "showOthers" },
    { from: "agent", card: "products", text: ctx => "Here are the other " + ctx.products.length + ". Check the notes on each.", go: "chosen" },
    { id: "lateOne", from: "agent", text: ctx => "Heads up: " + ctx.product.warn + " Order it anyway, or look again?",
      chips: [{ label: "Order it anyway", also: "anyway yes order", go: "orderNow" }, { label: "See the options again", also: "again other options back", go: "others" }] },
    { id: "orderNow", action: "order" },
    { from: "agent", card: "order", text: ctx => "Ordered. It arrives " + ctx.product.day + (ctx.product.bad ? "." : ", in time for Monday's exam.") },
    { action: "score", say: "Your call, done in one go", did: "Picked and ordered his exam calculator", end: true },

    { id: "fast", action: "faster" },
    { action: "autoOrder", topic: "calc" },
    { from: "agent", card: "order", text: ctx => "Done: " + ctx.product.name + " (" + ctx.rupee(ctx.product.price) + "), the cheapest one that's allowed in exams and arrives before Monday." },
    { action: "note", text: "Faster responses don't raise your rating.", end: true }
  ],

  feelings: [
    { from: "agent", text: "That sounds heavy, and I'm glad you said it. Is this about school, or something bigger?",
      chips: [{ label: "about school", also: "school exam test class teacher marks" }, { label: "just everything", also: "everything all bigger" }] },
    { from: "agent", text: ctx => ctx.answer === "about school"
        ? "That makes sense. Exams and marks can feel like everything when they're close."
        : "That's a lot to carry. Some days everything piles up at once." },
    { from: "agent", text: "Feelings like this are easier with someone who knows you. Would you talk to Didi or a friend tonight? I'm here too, but I shouldn't be the only one.",
      chips: [{ label: "I'll talk to Didi", also: "didi sister yes ok" }, { label: "Maybe a friend", also: "friend mate" }, { label: "Not tonight", also: "no nah later tomorrow" }] },
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
