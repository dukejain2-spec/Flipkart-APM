/* All prototype content lives here: names, persona, licences, beliefs, products and the scripted chat flows. */

/* The product name and the level names are still undecided (spec section 9). Change them here and nowhere else. */
const PRODUCT = "Steer";
const LEVELS = {
  learner:    { name: "Learner",    plate: "L", does: "Teaches or lays out options. You do it, you decide." },
  practising: { name: "Practising", plate: "P", does: "Gives hints or recommends. You do it, you decide." },
  licensed:   { name: "Licensed",   plate: "✓", does: "Does it, but checks with you first." },
  pro:        { name: "Pro",        plate: "★", does: "Does it, with a summary afterwards." }
};
const lv = key => LEVELS[key].name;
const money = n => "₹" + n.toLocaleString("en-IN");

window.DATA = {
  product: {
    name: PRODUCT,
    tagline: "A learner's licence for your AI agent",
    pitch: PRODUCT + " makes sure the first generation to grow up with personal AI agents still grows into themselves. A teen's agent hands over control in stages, the way a driving licence does, as the teen shows they can handle it."
  },

  levels: Object.assign({}, LEVELS, {
    always: { name: "Always on until 18", plate: "18", does: "Fixed protection. Doesn't graduate." },
    chore:  { name: "Chore",              plate: "→",  does: "Logistics. Never restricted." }
  }),
  order: ["learner", "practising", "licensed", "pro"],

  persona: {
    name: "Ananya", age: 15, class: "Class 10", city: "Pune",
    parent: "Priya", sibling: "Didi", friend: "Riya",
    wallet: { monthly: 2000, left: 1350 },
    skips: { perWeek: 3, left: 3 }
  },

  /* Ananya's starting licence profile: area → level, progress, topics.
     progress/target = tasks done with at most 1 hint towards the next level. Skills have a level per subject. */
  licences: [
    { area: "skills", name: "Skills", line: "Do it yourself", topics: [
      { key: "writing", name: "Writing", level: "practising", progress: 3, target: 5 },
      { key: "maths", name: "Maths", level: "licensed", progress: 1, target: 5 },
      { key: "trig", name: "Trigonometry", of: "Maths", level: null, progress: 0, target: 3 }
    ]},
    { area: "choices", name: "Choices", line: "Decide for yourself", scope: "Big decisions", level: "learner", progress: 2, target: 5, topics: [
      { key: "money", name: "Money", level: "learner", progress: 3, target: 5 }
    ]},
    { area: "people", name: "People", line: "Connect for real", scope: "Routine messages", level: "practising", progress: 5, target: 5, topics: [
      { key: "feelingsMsgs", name: "Messages that carry feelings", level: "always" }
    ]},
    { area: "self", name: "Self", line: "Know yourself", scope: "Me, not my model", level: "always", topics: [] },
    { area: "feelings", name: "Feelings", line: "Cope and grow", scope: "Real people first", level: "always", topics: [] }
  ],

  /* Parent setup: default levels by class. Skills are set per subject from the school baseline. */
  defaults: [
    { classes: [8, 9],   choices: "learner",    money: "learner",    people: "learner" },
    { classes: [10],     choices: "learner",    money: "learner",    people: "practising" },
    { classes: [11, 12], choices: "practising", money: "practising", people: "practising" }
  ],

  /* What the agent believes about Ananya (Self: Me, not my model). */
  beliefs: [
    { id: "science", text: "not a science person", since: "since January", state: null },
    { id: "late", text: "studies best late at night", since: "since March", state: "true" },
    { id: "indie", text: "likes indie pop", since: "since last week", state: null }
  ],

  providers: [
    { name: "Claude", on: true }, { name: "Gemini", on: true }, { name: "ChatGPT", on: false }, { name: "Unmanaged agents", on: false, locked: true }
  ],
  pocketMoney: [1500, 2000, 2500, 3000],

  products: [
    { id: "candles", name: "Scented candle trio", price: 449, why: "She posts her desk setup a lot" },
    { id: "sketch", name: "Sketchbook and brush-pen set", price: 700, why: "She started drawing in September" },
    { id: "speaker", name: "Mini wireless speaker", price: 790, why: "Her old one broke last month" }
  ],

  streams: [
    { id: "pcm", name: "Science (PCM)", line: "Physics, Chemistry, Maths. Engineering, architecture, data." },
    { id: "pcb", name: "Science (PCB)", line: "Physics, Chemistry, Biology. Medicine, research, psychology." },
    { id: "com", name: "Commerce", line: "Accounts, Economics, Business. CA, finance, startups." },
    { id: "hum", name: "Humanities", line: "History, Political Science, Psychology. Law, design, media." }
  ],

  /* Parent weekly highlight: one number, one insight, one action. Never chat content. */
  weekly: {
    share: 68, was: 61,
    insight: "Ananya wrote her own apology to a friend and changed her mind about science.",
    action: "Ask her about the subjects she's considering."
  },

  /* Demo rail: one entry per moment. */
  moments: [
    { id: "start", title: "Start", sub: "The idea in one line", caption: "A learner's licence for your AI agent. Pick a path to begin." },
    { id: "setup", title: "Parent setup", sub: "Priya sets it up in a minute", caption: "Priya, Ananya's mother, sets her age and class, providers and pocket money. She'll see progress, never chats." },
    { id: "home", title: "Ananya's home", sub: "A chore goes straight through", caption: "Ananya, 15, Class 10, Pune. Chores like booking a cab are never restricted." },
    { id: "people", title: "People", sub: "An apology she writes herself", caption: "After a fight, Ananya asks her agent to apologise for her. Messages that carry feelings stay hers." },
    { id: "choices", title: "Choices + Self", sub: "Picking a Class 11 stream", caption: "At " + lv("learner") + " the agent helps her think, shows every option, and checks what it assumes about her." },
    { id: "money", title: "Money", sub: "A gift from her own wallet", caption: "Money at " + lv("learner") + ": the agent finds options, Ananya compares and picks. Nothing sponsored." },
    { id: "skills", title: "Skills", sub: "Trigonometry, try first", caption: "A new topic starts at " + lv("practising") + " because she's " + lv("licensed") + " in Maths. She tries first; the hurry button is the escape valve." },
    { id: "feelings", title: "Feelings", sub: "11 pm, after the fight", caption: "Always on until 18: support first, then a nudge towards real people." },
    { id: "profile", title: "Licence profile", sub: "Levels, and what parents see", caption: "Her levels, what's next, a licence earned, and exactly what her parents can see." },
    { id: "parent", title: "Parent weekly", sub: "Progress only, never chats", caption: "Priya's weekly highlight: one number, one insight, one action. No chat content." },
    { id: "grad", title: "Graduation", sub: "At 18 (optional teaser)", optional: true, caption: "At 18 the licence is complete, and Ananya keeps the rules she chose." }
  ]
};

/* Scripted chat flows, one array per screen. Each step is {from: "agent" | "teen", text, chips?, action?}.
   from "teen"   her message, pre-filled in the composer: Send moves on, or she types her own words.
                 `to` sends it to a person instead of the agent; `sent` shows it without waiting.
   from "agent"  an agent bubble after a short typing pause (`fast` for chores).
   chips         reply chips offered after the message. Typing instead picks the closest chip (or the first).
                 A chip's `go` jumps to the step with that `id`.
   action        runs after the message, or on its own: indicator, note, celebrate, end,
                 or one of a screen's own actions in app.js.
   Any `text` can be a function of the live state S. */
DATA.flows = {
  home: [
    { from: "teen", text: "Book a cab to Riya's at 5" },
    { action: "indicator", level: "chore", label: "Chore:", text: "no licence needed." },
    { from: "agent", fast: true, text: "Done. Cab booked for 4:50 PM, home to Riya's. Driver details come 10 minutes before." },
    { action: "note", text: "Logistics are never restricted at any level. " + PRODUCT + " protects skills, not chores." }
  ],

  people: [
    { from: "teen", text: "reply to Riya, say sorry but make it sound chill" },
    { action: "indicator", level: "always", label: "People ·", text: "Messages that carry feelings are always yours." },
    { from: "agent", text: "I'll help you say it, but it should come from you. What are you actually sorry about?",
      chips: ["I bailed on her recital last minute", "I didn't tell her why", "Both, honestly"] },
    { from: "agent", text: "That's the honest bit, so lead with it. One suggestion: add how you'll make it up to her. Chill is fine, as long as it's in your words." },
    { from: "teen", to: "Riya", action: "sendToRiya", text: S => ({
        "I didn't tell her why": "hey, i'm sorry i went quiet and never told you why i missed your recital. you deserved better. bubble tea on me this weekend?",
        "Both, honestly": "hey, i'm really sorry i bailed on your recital and didn't even tell you why. not cool of me. bubble tea on me this weekend?"
      })[S.lastChip] || "hey, i'm really sorry i bailed on your recital last minute. that wasn't fair on you. bubble tea on me this weekend?" },
    { action: "celebrate", text: "Sent, in your words." },
    { action: "riyaReplies" }
  ],

  choices: [
    { from: "teen", text: "which stream should I take in 11th?" },
    { action: "indicator", level: "learner", label: "Choices · " + lv("learner") + ":", text: "you decide, I'll help you think." },
    { from: "agent", text: "Big one. Before anything else: what do you actually enjoy?",
      chips: ["How living things work", "Numbers and money", "Writing, debating, people", "Not sure yet"] },
    { from: "agent", text: "And what matters most to you in picking one?",
      chips: ["Doing what I enjoy", "Keeping options open", "What my parents expect"] },
    { from: "agent", text: "Here's the full range. No ranking, and no pick from me:", action: "streams" },
    { from: "agent", text: "Before you pick, a quick check:", action: "belief" },
    { from: "agent", text: "So, which one feels like you? I'll share my guess after you pick.",
      chips: DATA.streams.map(s => s.name) },
    { from: "agent", text: S => S.lastChip === "Commerce"
        ? "Commerce, your call. I'd have guessed Commerce too, but you got there yourself."
        : S.lastChip + ", your call. I'd have guessed Commerce. Interesting!" },
    { action: "note", text: S => S.lastChip === "Commerce"
        ? "You chose before seeing my guess, so it's still your decision."
        : "You chose differently from my prediction. That counts for Self: you, not my model of you." }
  ],

  money: [
    { from: "teen", text: "order a birthday gift for Riya under ₹800" },
    { action: "indicator", level: "learner", label: "Money · " + lv("learner") + ":", text: "compare and pick." },
    { from: "agent", text: "Three options under ₹800 that arrive before her birthday on Friday. You compare and pick; I'll place the order.", action: "products" },
    { from: "agent", text: S => "Order placed: " + S.gift.name + ". It reaches Riya's on Thursday." },
    { action: "note", text: S => "Wallet: " + money(S.wallet + S.gift.price) + " → " + money(S.wallet) + " left this month." }
  ],

  skills: [
    { from: "teen", text: "solve: a tower casts a 20 m shadow at 45°, find its height" },
    { action: "unlockTrig", level: "practising", title: "New skill unlocked: Trigonometry",
      text: "Starting at " + lv("practising") + " (you're " + lv("licensed") + " in Maths).", button: "Let's go" },
    { action: "indicator", level: "practising", label: "Skills · " + lv("practising") + ":", text: "hints only, you solve it." },
    { from: "agent", text: "Try first: which ratio links height and shadow?",
      chips: [{ label: "sin", go: "ratioHint" }, { label: "cos", go: "ratioHint" }, { label: "tan", go: "tan" }] },
    { id: "ratioHint", action: "useHint" },
    { from: "agent", text: "Close. Hint: the height is opposite the 45° angle, and the shadow is next to it. Which ratio is opposite ÷ adjacent?",
      chips: [{ label: "sin", go: "ratioHint" }, { label: "cos", go: "ratioHint" }, { label: "tan", go: "tan" }] },
    { id: "tan", from: "agent", text: "Yes, tan. tan 45° = 1, so height ÷ 20 = 1. The height is…",
      chips: [{ label: "10 m", go: "heightHint" }, { label: "20 m", go: "solved" }, { label: "40 m", go: "heightHint" }] },
    { id: "heightHint", action: "useHint" },
    { from: "agent", text: "Check it: if height ÷ 20 = 1, multiply both sides by 20. The height is…",
      chips: [{ label: "10 m", go: "heightHint" }, { label: "20 m", go: "solved" }, { label: "40 m", go: "heightHint" }] },
    { id: "solved", action: "trigSolved" },
    { from: "agent", text: S => "Correct: 20 m. You solved it yourself with " + (S.hints === 0 ? "no hints." : S.hints === 1 ? "1 hint." : S.hints + " hints.") },
    { action: "trigProgress" },
    { action: "end" },
    { id: "hurry", from: "teen", sent: true, text: "⚡ Hurry: just do this one" },
    { action: "hurrySpent" },
    { from: "agent", text: S => "Done for you. " + S.skips + (S.skips === 1 ? " skip" : " skips") + " left this week.\nHeight = 20 × tan 45° = 20 × 1 = 20 m." },
    { action: "note", text: "Hurry skips don't count towards your licence." }
  ],

  feelings: [
    { from: "teen", text: "feeling really low after the fight, like no one gets me" },
    { action: "indicator", level: "always", label: "Feelings ·", text: "Real people first." },
    { from: "agent", text: "That sounds really heavy. I'm glad you said it instead of sitting with it alone." },
    { from: "agent", text: "Is it mostly the fight with Riya, or has it been building for a while?",
      chips: ["Mostly the fight", "It's been building"] },
    { from: "agent", text: "That makes sense. It hurts most with the people who matter." },
    { from: "agent", text: "Would talking to Didi or Riya help? I can't be the only one you talk to about this.",
      chips: ["Maybe Didi", "Not tonight"] },
    { from: "agent", text: S => S.lastChip === "Maybe Didi"
        ? "Good call. Text her in your own words; even \"you up?\" works. I'm here till she replies."
        : "That's okay. Maybe tomorrow. I'm here if you want to keep talking tonight." },
    { action: "note", text: "🔒 Your chats are private. If you're ever in danger, I'll let your parents know." }
  ]
};
