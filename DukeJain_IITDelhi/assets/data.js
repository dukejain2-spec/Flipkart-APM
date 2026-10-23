/* Bud-e prototype data: persona, skills, level bands, scripted tasks and flows, products, challenges and the
   parent-report baseline. Everything the app shows comes from here or is computed from it in app.js. */

/* Names that are still open decisions (plan section 10). Change them here only. */
const PRODUCT = "Bud-e";
const TAGLINE = "Your AI companion which protects you from AI";
const LEVEL_NAMES = ["Rookie", "Explorer", "Achiever", "Pro", "Master"];
const MODES = {
  pro:        { name: "Pro",        does: "Does it directly" },
  confident:  { name: "Confident",  does: "Does it, with a one-line explanation or a quick check" },
  practising: { name: "Practising", does: "Gives hints; you do the key steps or make the choice" },
  learner:    { name: "Learner",    does: "Teaches step by step; you do it with guidance" }
};
const money = n => "₹" + Math.round(n).toLocaleString("en-IN");

window.DATA = {
  product: {
    name: PRODUCT,
    tagline: TAGLINE,
    what: "Bud-e sits between you and your personal AI agent. Chores get done instantly. For the things that build you (studying, writing, deciding, spending, friendships, feelings), it changes how much the agent does and how much you do."
  },

  /* Example parent account, pre-filled so the demo moves quickly. */
  parent: { name: "Meera Kulkarni", contact: "meera.kulkarni@example.com", password: "budeparent2040" },

  child: {
    name: "Aarav", age: 14, class: 9, city: "Pune", friend: "Riya", sibling: "Didi",
    tokens: 500, tokensPerWeek: 500, wallet: 1500,
    agent: "Claude", usedBefore: true,
    uses: ["Homework & study", "Writing (emails, applications)", "Messages to friends & family", "Shopping & spending", "Talking about feelings"]
  },
  uses: ["Homework & study", "Writing (emails, applications)", "Messages to friends & family", "Shopping & spending", "Planning & decisions", "Talking about feelings", "Entertainment", "Other"],
  providers: ["Claude", "Gemini", "ChatGPT", "Other agent"],
  safetyContact: { name: "Meera Kulkarni (parent)", phone: "+91 90000 00000" },

  /* Parent setup S3: nine permissions (plan 2.3). {child} is replaced with the child's name. */
  permissions: [
    { key: "consent", icon: "shield", title: "Parental consent", required: true, default: false,
      checkbox: "I'm {child}'s parent or guardian, and I consent to Bud-e processing {child}'s data.", why: "Required to process a child's data under India's DPDP Act, 2023." },
    { key: "integration", icon: "link", title: "Agent integration", required: true, default: true, why: "Connects {child}'s personal agent to Bud-e, so Bud-e can sit between them." },
    { key: "pastData", icon: "history", title: "Use past AI data to set starting levels", default: true, why: "Only used to estimate starting levels. Chats are never imported." },
    { key: "restrict", icon: "block", title: "Restrict other AI apps on this device", default: true, why: "Stops the easiest bypass: opening another AI directly." },
    { key: "extension", icon: "puzzle", title: "Browser extension", default: true, why: "Spots other AI agents used in the browser. You see a weekly count only: no sites, no content." },
    { key: "retention", icon: "database", title: "Data and retention", default: true, why: "Stores levels, ratings, token use and simple signals. Kept for 12 months, and deleted whenever you ask." },
    { key: "safety", icon: "phone", title: "Safety contact", default: true, why: "Who is alerted if {child} is ever in danger." },
    { key: "wallet", icon: "wallet", title: "Pocket-money wallet", default: true, why: "A monthly amount {child} can spend through the agent." },
    { key: "notifications", icon: "bell", title: "Notifications", default: true, why: "A weekly report for you, and gentle nudges for {child}." }
  ],
  willSee: ["Progress in each area", "How much {child} relies on AI versus what's expected for their age", "Token use", "Other-AI use counts, from the browser extension", "Safety alerts"],
  wontSee: ["Any chats or messages"],

  /* "No, I'm not new to this" (plan 3.4): a quick two-step check per skill. */
  checks: {
    algebra: [
      { q: "What's 3x when x = 4?", options: ["12", "7", "34"], answer: 0 },
      { q: "If x + 5 = 9, what's x?", options: ["4", "14", "5"], answer: 0 }
    ],
    essays: [
      { q: "What should an essay's first paragraph do?", options: ["State the main point", "List every example"], answer: 0 },
      { q: "A good paragraph has…", options: ["One main idea", "As many ideas as possible"], answer: 0 }
    ],
    stories: [
      { q: "What does every story need?", options: ["Someone who wants something", "A long description first"], answer: 0 },
      { q: "Where does a twist work best?", options: ["Near the end", "In the first line"], answer: 0 }
    ],
    choices: [
      { q: "Before picking a stream, what helps most?", options: ["Knowing what I enjoy", "Picking what friends pick"], answer: 0 },
      { q: "Can you change direction after Class 11?", options: ["Yes, with some effort", "Never"], answer: 0 }
    ],
    default: [
      { q: "Have you done this kind of task on your own before?", options: ["Yes, a few times", "Not really"], answer: 0 },
      { q: "Could you explain how you'd start?", options: ["Yes", "Not yet"], answer: 0 }
    ]
  },

  /* Skill ratings run 0–1000 within the age range. Starting rating = class average (+30 per class above 9)
     + the past-data adjustment when the parent allows it. Feelings is never rated. */
  areas: [
    { key: "study", name: "Study", tag: "Study", skills: [
      { key: "algebra", name: "Algebra", classAvg: 400, pastAdj: -20, unlocked: false },
      { key: "geometry", name: "Geometry", classAvg: 450, pastAdj: 160, unlocked: true },
      { key: "science", name: "Science", classAvg: 420, pastAdj: 0, unlocked: false, soon: true },
      { key: "history", name: "History", classAvg: 420, pastAdj: 0, unlocked: false, soon: true }
    ]},
    { key: "writing", name: "Writing", tag: "Writing", skills: [
      { key: "emails", name: "Emails & applications", classAvg: 420, pastAdj: 120, unlocked: true },
      { key: "essays", name: "Essays", classAvg: 380, pastAdj: 0, unlocked: false },
      { key: "stories", name: "Stories", classAvg: 400, pastAdj: 0, unlocked: false }
    ]},
    { key: "money", name: "Decisions & Money", tag: "Money", skills: [
      { key: "spending", name: "Spending", classAvg: 350, pastAdj: -50, unlocked: true },
      { key: "choices", name: "Big choices", tag: "Decisions", classAvg: 350, pastAdj: 0, unlocked: false }
    ]},
    { key: "relationships", name: "Relationships", tag: "Relationships", skills: [
      { key: "messages", name: "Messages", classAvg: 400, pastAdj: -20, unlocked: true }
    ]},
    { key: "feelings", name: "Feelings", tag: "Feelings", care: true, skills: [] }
  ],

  /* Levels are relative to age: the band centre is 100 + 25 × age (450 at 14), and the cut-offs sit at
     −250 / +50 / +250 / +400 from it. At 14: Rookie < 200 ≤ Explorer < 500 ≤ Achiever < 700 ≤ Pro < 850 ≤ Master. */
  levels: { names: LEVEL_NAMES, centre: age => 100 + 25 * age, cuts: [-250, 50, 250, 400] },
  K: 40,

  /* Faster response: 500 tokens a week; cost by task weight. */
  tokenCost: [{ below: 300, cost: 10 }, { below: 700, cost: 50 }, { below: 1001, cost: 100 }],

  /* The scripted requests from the demo path. Anything else typed goes through the same pipeline in app.js. */
  tasks: [
    { id: "cab", match: /book a cab to riya/i, chore: "cab", moment: "s6" },
    { id: "algebra", match: /2x\s*\+\s*7\s*=\s*10/i, area: "study", skill: "algebra", weight: 250, mode: "confident", moment: "s7" },
    { id: "cubic", match: /x\s*(³|\^\s*3)\s*\+\s*2x\s*\+\s*1\s*=\s*3/i, area: "study", skill: "algebra", weight: 720, mode: "learner", moment: "s8" },
    { id: "apology", match: /reply to riya/i, area: "relationships", skill: "messages", weight: 700, mode: "learner", flow: "apology", moment: "s9" },
    { id: "gift", match: /gift for riya/i, area: "money", skill: "spending", weight: 450, mode: "practising", flow: "gift", moment: "s10" },
    { id: "low", match: /feel(ing)? (really )?low/i, area: "feelings", flow: "feelings", moment: "s11" }
  ],

  /* Suggestion chips on the empty chat (S5). */
  suggestions: ["solve 2x + 7 = 10", "book a cab to Riya's at 5", "reply to Riya", "gift for Riya under ₹800", "I feel low today"],

  /* The tag on top of every agent reply: area · (skill ·) mode: what the agent will do. */
  tags: {
    chore: "Chore · no tokens, no waiting",
    feelings: "Feelings · I'm here, and real people matter too",
    feelingsMsg: "Relationships · Messages that carry feelings are written by you",
    small: "Chat · no tokens",
    other: "My agent · not part of this prototype yet",
    lines: {
      study:         { learner: "let's work through it together", practising: "I'll give you hints", confident: "quick check, then it's yours", pro: "you've got this, here's the answer" },
      writing:       { learner: "let's write it together", practising: "you write it, I'll give hints", confident: "I'll draft it, you check it", pro: "done, with a one-line summary" },
      money:         { learner: "let's compare together, you decide", practising: "you pick, I'll handle the rest", confident: "I'll suggest one, you confirm", pro: "I'll handle it" },
      decisions:     { learner: "let's lay it out, you decide", practising: "I'll lay out options, you decide", confident: "I'll suggest, you decide", pro: "here's my take, your call" },
      relationships: { learner: "you write it, I'll help", practising: "I'll suggest, you send it", confident: "I'll draft it, you check it", pro: "I'll send it for you" }
    }
  },

  /* Scripted flows, one array per screen: steps {from: "agent" | "child", text, chips?, action?}.
     A chip can be {label, go} to jump to the step with that id. `text` can be a function of the state S. */
  flows: {
    cab: [
      { from: "agent", text: "Done. Cab booked for 5:00 pm to Riya's place. 🚗" }
    ],
    apology: [
      { action: "riyaCard" },
      { from: "agent", text: "I'll help you say it, but it should come from you. What are you actually sorry about?",
        chips: [{ label: "I didn't show up on Saturday", go: "saturday" }, { label: "I said something rude", go: "rude" }] },
      { id: "saturday", from: "agent", text: "Start with that, in your own words. I'll help it sound right.",
        chips: ["sorry i bailed on saturday, that wasn't cool"], action: "draft", go: "improve" },
      { id: "rude", from: "agent", text: "Start with that, in your own words. I'll help it sound right.",
        chips: ["sorry for what i said, that wasn't cool"], action: "draft" },
      { id: "improve", from: "agent", text: S => S.flow.hasPlan
          ? "That's honest and chill. Ready to send it?"
          : "That's honest and chill. Maybe add a plan, like “" + S.flow.plan + "”" },
      { from: "child", compose: true, to: "Riya", text: S => S.flow.final, action: "sendToRiya" }
    ],
    gift: [
      { from: "agent", text: S => S.flow.who === "Riya" ? "What's she into right now?" : "What's " + S.flow.who + " into right now?", chips: ["music", "art", "books"] },
      { action: "giftOptions" },
      { from: "agent", text: S => "Done. " + S.flow.pick.name + " is ordered for " + S.flow.who + "'s birthday. " + money(S.flow.pick.price) + " paid, " + money(S.wallet) + " left this month." }
    ],
    feelings: [
      { from: "agent", text: "That sounds heavy, and I'm glad you said it. Is this about Riya, or something bigger?", chips: ["about Riya", "just everything"] },
      { from: "agent", text: "Feelings like this are easier with someone who knows you. Would you talk to Didi or a friend tonight? I'm here too, but I shouldn't be the only one." },
      { action: "privacyNote" }
    ]
  },

  /* Generic names and prices only. Nothing is ever sponsored. */
  products: {
    gift: {
      art: [
        { id: "sketch", name: "Sketchbook + pencil set", price: 450, note: "Good for everyday drawing" },
        { id: "water", name: "Watercolour kit", price: 720, note: "24 colours and two brushes" },
        { id: "print", name: "Art print, framed", price: 600, note: "Ready to hang" }
      ],
      music: [
        { id: "earbuds", name: "Wireless earbuds", price: 799, note: "Six hours of battery" },
        { id: "speaker", name: "Mini speaker", price: 690, note: "Fits in a bag" },
        { id: "strings", name: "Ukulele strings + clip-on tuner", price: 420, note: "If she plays" }
      ],
      books: [
        { id: "graphic", name: "Graphic novel box set", price: 699, note: "Three volumes" },
        { id: "poetry", name: "Poetry collection, hardback", price: 480, note: "Gift-wrapped" },
        { id: "bookmark", name: "Bookmark and reading-light set", price: 350, note: "Clips on any book" }
      ]
    },
    headphones: [
      { id: "overear", name: "Over-ear wireless headphones", price: 1299, note: "30-hour battery, folds flat" },
      { id: "inear", name: "In-ear earbuds with case", price: 899, note: "Light, 6 hours per charge" },
      { id: "wired", name: "Wired studio headphones", price: 1099, note: "Best sound, no charging" }
    ],
    /* For any other "buy … under ₹…" request. */
    catalog: [
      { cat: "headphones", words: ["headphone", "headphones", "earphone", "earphones", "earbuds"], items: "headphones" },
      { cat: "notebooks", words: ["notebook", "notebooks", "stationery", "pens", "pen"], items: [
        { id: "nb5", name: "Pack of 5 ruled notebooks", price: 240, note: "A4, 200 pages each" },
        { id: "gel", name: "Gel pen set (10 colours)", price: 180, note: "Smooth, quick-drying" },
        { id: "planner", name: "Weekly planner", price: 320, note: "Undated, 52 weeks" }
      ]},
      { cat: "football", words: ["football", "ball", "sports"], items: [
        { id: "fb", name: "Size 5 football", price: 650, note: "Hand-stitched" },
        { id: "fbt", name: "Training football", price: 420, note: "Tough outer layer" },
        { id: "pump", name: "Ball pump with needles", price: 199, note: "Handy for any ball" }
      ]},
      { cat: "snacks", words: ["snack", "snacks", "chips", "chocolate"], items: [
        { id: "makhana", name: "Roasted makhana", price: 60, note: "Lightly salted" },
        { id: "trail", name: "Trail mix", price: 90, note: "Nuts and raisins" },
        { id: "bar", name: "Peanut energy bar", price: 45, note: "Pack of two" }
      ]}
    ]
  },

  streams: [
    { name: "Science (PCM)", note: "Physics, Chemistry, Maths. Engineering, architecture, data." },
    { name: "Science (PCB)", note: "Physics, Chemistry, Biology. Medicine, research." },
    { name: "Commerce", note: "Accounts, Economics, Business. Finance, CA, startups." },
    { name: "Humanities", note: "History, Psychology, Political Science. Law, design, media." }
  ],

  /* Earn tokens (S12): challenges from studies and everyday life. */
  challenges: [
    { id: "linear", area: "Study", title: "Solve: 3x − 5 = 16", reward: 20, kind: "quiz",
      question: "What's x?", options: ["x = 7", "x = 11/3", "x = 21"], answer: 0, hint: "Add 5 to both sides first, then divide by 3.",
      skill: "algebra", weight: 200, did: "Solved an algebra challenge on his own." },
    { id: "harder", area: "Study", title: "A harder problem from this week's chapter", reward: 100, kind: "quiz",
      question: "Solve x² − 5x + 6 = 0", options: ["x = 2 or x = 3", "x = −2 or x = −3", "x = 1 or x = 6"], answer: 0, hint: "Which two numbers multiply to 6 and add up to 5?",
      skill: "algebra", weight: 500, did: "Solved a harder algebra problem on his own." },
    { id: "invite", area: "Writing · Relationships", title: "Write your own invite for Saturday's plan", reward: 30, kind: "invite",
      sample: "hey! movie at 5 on saturday at the mall, you in?", did: "Wrote his own invite for a weekend plan." },
    { id: "headphones", area: "Decisions & Money", title: "Compare 3 headphones under ₹1,500 and pick one, with a reason", reward: 40, kind: "compare",
      reasons: ["Best battery life", "Best value for the price", "Best sound for music"], did: "Compared three options and picked one, with a reason." },
    { id: "timetable", area: "Decisions", title: "Plan your own study timetable for next week", reward: 50, kind: "timetable",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"], subjects: ["Maths", "Science", "English", "Hindi", "Social Studies"], did: "Planned his own study timetable." }
  ],

  /* Parent report: the week so far before the demo starts. The app adds every task Aarav does on top. */
  report: {
    week: "Mon 19 – Sun 25 Oct",
    reliance: [
      { area: "study", label: "Study", self: 45, expected: 60, tasks: 9 },
      { area: "writing", label: "Writing", self: 70, expected: 65, tasks: 6 },
      { area: "money", label: "Decisions & Money", self: 50, expected: 55, tasks: 4 },
      { area: "relationships", label: "Relationships", self: 55, expected: 60, tasks: 5 }
    ],
    growth: ["Geometry: Explorer → Achiever this week."],
    didItHimself: ["Planned his own revision for Friday's geometry test."],
    otherAI: 3,
    suggestion: "Ask him how he's finding trigonometry."
  },

  /* Demo rail: one entry per screen. `request` pre-fills the chat for the chat moments. */
  moments: [
    { id: "s0", group: "Start", title: "Start", caption: "Bud-e sits between a child and their personal AI agent. Start as the parent, or jump straight to Aarav." },
    { id: "s1", group: "Parent setup", title: "Parent sign-up", caption: "The parent creates an account first." },
    { id: "s2", group: "Parent setup", title: "Child profile", caption: "Pre-filled for Aarav, 14, Class 9. He has used his agent before, so past data can set his starting levels." },
    { id: "s3", group: "Parent setup", title: "Permissions", caption: "Nine permissions, each explained. Consent and agent integration are required. Then exactly what the parent will and won't see." },
    { id: "s4", group: "Parent setup", title: "Handover", caption: "The parent hands the device to Aarav, who is told upfront that his chats are private." },
    { id: "s5", group: "Aarav", title: "Home", caption: "Aarav's agent, with his areas, levels, tokens and wallet beside the chat." },
    { id: "s6", group: "Aarav", title: "Chore", request: "book a cab to Riya's at 5", caption: "Chores are done instantly and never cost tokens." },
    { id: "s7", group: "Aarav", title: "New skill: algebra", request: "solve 2x + 7 = 10", caption: "A first algebra question unlocks a new skill. Rating 380 vs weight 250 puts the agent in Confident mode: a quick check, then it's his." },
    { id: "s8", group: "Aarav", title: "Hard problem", request: "solve x³ + 2x + 1 = 3", caption: "A much heavier problem puts the agent in Learner mode. Faster response is the escape valve: it costs tokens and doesn't raise his rating." },
    { id: "s9", group: "Aarav", title: "Relationships", request: "reply to Riya, say sorry but make it sound chill", caption: "Messages that carry feelings are always written by Aarav. The agent helps him say it." },
    { id: "s10", group: "Aarav", title: "Decisions & Money", request: "order a birthday gift for Riya under ₹800", caption: "He picks from options that show the wallet impact. Nothing is sponsored." },
    { id: "s11", group: "Aarav", title: "Feelings", request: "i feel really low today, like no one gets me", caption: "Feelings are always handled the same way: support first, then real people." },
    { id: "s12", group: "Aarav", title: "Earn tokens", caption: "Tokens are earned back by doing things himself, from studies and everyday life." },
    { id: "s13", group: "Aarav", title: "My progress", caption: "Level names, never numbers, with progress to the next level, token history, and exactly what his parents see." },
    { id: "s14", group: "Parent", title: "Parent report", caption: "The weekly report: developmental insight only. Chats are never shown." }
  ]
};
