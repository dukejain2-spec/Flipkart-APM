/* All prototype content lives here: product, persona, licences, beliefs, gifts and the scripted chat flows.
   Change the product or level names in one place below. */
window.DATA = {
  product: { name: "Steer", tagline: "A learner's licence for your AI agent" },

  levels: {
    learner:    { name: "Learner",    plate: "L",  does: "Teaches or lays out options. You do it, you decide." },
    practising: { name: "Practising", plate: "P",  does: "Gives hints or recommends. You do it, you decide." },
    licensed:   { name: "Licensed",   plate: "✓", does: "Does it, but checks with you first." },
    pro:        { name: "Pro",        plate: "★", does: "Does it, with a summary afterwards." },
    always:     { name: "Always on until 18", plate: "18", does: "Fixed protection. Doesn't graduate." },
    chore:      { name: "Chore",      plate: "→", does: "Logistics. Never restricted." }
  },
  order: ["learner", "practising", "licensed", "pro"],

  persona: {
    name: "Ananya", age: 15, cls: "Class 10", city: "Pune",
    parent: "Priya", sibling: "Didi", friend: "Riya",
    walletMonthly: 2000, wallet: 1350, skips: 3
  },

  /* Ananya's starting licence profile. progress/target = tasks done with at most 1 hint towards the next level. */
  areas: [
    { key: "skills", name: "Skills", line: "Do it yourself", items: [
      { key: "writing", name: "Writing", level: "practising", progress: 3, target: 5 },
      { key: "maths", name: "Maths", level: "licensed", progress: 1, target: 5 },
      { key: "trig", name: "Trigonometry", level: null, progress: 0, target: 3, note: "new topic" }
    ]},
    { key: "choices", name: "Choices", line: "Decide for yourself", items: [
      { key: "decisions", name: "Big decisions", level: "learner", progress: 2, target: 5 },
      { key: "money", name: "Money", level: "learner", progress: 3, target: 5 }
    ]},
    { key: "people", name: "People", line: "Connect for real", items: [
      { key: "routine", name: "Routine messages", level: "practising", progress: 5, target: 5 },
      { key: "feelingsMsgs", name: "Messages that carry feelings", level: "always" }
    ]},
    { key: "self", name: "Self", line: "Know yourself", items: [
      { key: "model", name: "Me, not my model", level: "always" }
    ]},
    { key: "feelings", name: "Feelings", line: "Cope and grow", items: [
      { key: "realPeople", name: "Real people first", level: "always" }
    ]}
  ],

  /* What the agent believes about Ananya (Self: Me, not my model). */
  beliefs: [
    { id: "science", text: "Not a science person", since: "since January", state: null },
    { id: "late", text: "Studies best late at night", since: "since March", state: "true" },
    { id: "indie", text: "Likes indie pop", since: "since last week", state: null }
  ],

  providers: [
    { name: "Claude", on: true }, { name: "Gemini", on: true }, { name: "ChatGPT", on: false }, { name: "Unmanaged agents", on: false, locked: true }
  ],

  gifts: [
    { id: "candles", name: "Scented candle trio", price: 449, why: "She posts her desk setup a lot" },
    { id: "sketch", name: "Sketchbook and brush-pen set", price: 700, why: "She started drawing in September" },
    { id: "speaker", name: "Mini Bluetooth speaker", price: 790, why: "Her old one broke last month" }
  ],

  streams: [
    { id: "pcm", name: "Science (PCM)", line: "Physics, Chemistry, Maths. Engineering, architecture, data." },
    { id: "pcb", name: "Science (PCB)", line: "Physics, Chemistry, Biology. Medicine, research, psychology." },
    { id: "com", name: "Commerce", line: "Accounts, Economics, Business. CA, finance, startups." },
    { id: "hum", name: "Humanities", line: "History, Political Science, Psychology. Law, design, media." }
  ],

  /* Demo rail: one entry per moment. */
  moments: [
    { id: "start", title: "Start", sub: "The idea in one line", caption: "A learner's licence for your AI agent. Pick a path to begin." },
    { id: "setup", title: "Parent setup", sub: "Priya sets it up in a minute", caption: "Priya, Ananya's mother, sets default levels, providers and pocket money. She sees progress, never chats." },
    { id: "home", title: "Ananya's home", sub: "A chore goes straight through", caption: "Ananya, 15, Class 10, Pune. Chores like booking a cab are never restricted." },
    { id: "people", title: "People", sub: "An apology she writes herself", caption: "After a fight, Ananya asks her agent to apologise for her. Messages that carry feelings stay hers." },
    { id: "choices", title: "Choices + Self", sub: "Picking a Class 11 stream", caption: "At Learner level the agent helps her think, shows every option, and checks what it assumes about her." },
    { id: "money", title: "Money", sub: "A gift from her own wallet", caption: "Money at Learner level: the agent finds options, Ananya compares and picks. Nothing sponsored." },
    { id: "skills", title: "Skills", sub: "Trigonometry, try first", caption: "A new topic starts at Practising because she's Licensed in Maths. She tries first; the hurry button is the escape valve." },
    { id: "feelings", title: "Feelings", sub: "11 pm, after the fight", caption: "Always on until 18: support, coping, then a nudge towards real people." },
    { id: "profile", title: "Licence profile", sub: "Levels, and what parents see", caption: "Her levels, what's next, a licence earned, and exactly what her parents can see." },
    { id: "parent", title: "Parent weekly", sub: "Skills in general, never chats", caption: "Priya's weekly highlight: one number, how her skills are growing, one thing to do. No chat content." },
    { id: "grad", title: "Graduation", sub: "At 18 (teaser)", caption: "At 18 the licence is complete, and Ananya keeps the rules she chose." }
  ]
};

/* Scripted chat flows. Step types:
   compose  teen's message, prefilled; waits for Send (typing anything also works)
   agent    agent bubble after a typing pause      teen   teen bubble
   ind      the level indicator shown in every agent interaction
   chips    waits for a choice; `go` jumps to a label    card   a custom card from screens.js
   fn       calls a hook in screens.js    pop   a popup that waits for OK
   sys      a small centred note    celebrate   a success pill    label / go / end   flow control
   Any `text` can be a function of the live state S. */
const money = n => "₹" + n.toLocaleString("en-IN");

DATA.flows = {
  chore: [
    { t: "compose", prefill: "Book a cab to Riya's at 5" },
    { t: "ind", plate: "chore", label: "Chore", text: "no licence needed." },
    { t: "agent", text: "Done. Cab booked for 4:50 PM from home to Riya's. Driver details come 10 minutes before." },
    { t: "sys", text: "Logistics are never restricted at any level. Steer protects skills, not chores." },
    { t: "end" }
  ],

  people: [
    { t: "compose", prefill: "reply to Riya, say sorry but make it sound chill" },
    { t: "ind", plate: "always", label: "People", text: "messages that carry feelings are always yours." },
    { t: "agent", text: "I'll help you say it, but it should come from you. What are you actually sorry about?" },
    { t: "chips", options: [{ label: "I bailed on her recital last minute" }, { label: "I didn't tell her why" }, { label: "Both, honestly" }] },
    { t: "agent", text: "That's a real thing to own. Write it the way you'd say it to her face. I'll suggest one thing at most." },
    { t: "compose", prefill: "hey sorry about saturday, stuff came up" },
    { t: "agent", text: "One suggestion: \"stuff came up\" can sound like an excuse. Say what you're sorry for, and maybe how you'll make it up to her." },
    { t: "compose", prefill: "hey, i'm really sorry i bailed on your recital without telling you. that wasn't fair. bubble tea on me this weekend?", sendLabel: "Send to Riya", hook: "sendToRiya", bubble: false },
    { t: "celebrate", text: "Sent, in your words." },
    { t: "fn", fn: "riyaReplies" },
    { t: "end" }
  ],

  choices: [
    { t: "compose", prefill: "which stream should I take in 11th?" },
    { t: "ind", plate: "learner", label: "Choices · Learner", text: "you decide, I'll help you think." },
    { t: "agent", text: "Big one. Before I say anything: which of these sounds most like you?" },
    { t: "chips", options: [{ label: "How living things work" }, { label: "Numbers and business" }, { label: "Writing, debating, people" }, { label: "Honestly not sure yet" }] },
    { t: "agent", text: "And what matters most to you in picking one?" },
    { t: "chips", options: [{ label: "Doing what I enjoy" }, { label: "Keeping options open" }, { label: "What my parents expect" }] },
    { t: "agent", text: "Before I show options, I want to check something I've been assuming about you." },
    { t: "card", card: "belief" },
    { t: "agent", text: "Here's the full range. No ranking, and no pick from me yet:" },
    { t: "card", card: "streams" },
    { t: "agent", text: S => S.stream.id === "com"
        ? "Commerce, your call. I'd have guessed Commerce too, but you got there yourself."
        : S.stream.name + ", your call. I'd have guessed Commerce. Interesting!" },
    { t: "sys", text: S => S.stream.id === "com"
        ? "You chose before seeing my guess, so it's still your decision."
        : "Your choice differed from my prediction. That's logged for Self, not for your parents." },
    { t: "agent", text: "Want help planning how to talk it through with your parents and your class teacher?" },
    { t: "chips", options: [{ label: "Yes, tomorrow" }, { label: "I've got it" }] },
    { t: "agent", text: S => S.lastChip === "Yes, tomorrow" ? "Done. I'll check in after school tomorrow." : "Nice. You've got this." },
    { t: "end" }
  ],

  money: [
    { t: "compose", prefill: "order a birthday gift for Riya under ₹800" },
    { t: "ind", plate: "learner", label: "Money · Learner", text: "compare and pick." },
    { t: "agent", text: "Three options under ₹800 that arrive before her birthday on Friday. You compare and choose; I'll place the order." },
    { t: "card", card: "gifts" },
    { t: "agent", text: S => "Ordered: " + S.gift.name + ". It reaches Riya's on Thursday." },
    { t: "sys", text: S => "Wallet: " + money(S.wallet + S.gift.price) + " → " + money(S.wallet) + " left this month." },
    { t: "end" }
  ],

  skills: [
    { t: "compose", prefill: "solve: a tower casts a 20 m shadow when the sun is at 45°. find its height" },
    { t: "pop", plate: "practising", title: "New topic: Trigonometry", text: "Starting at Practising, because you're Licensed in Maths.", button: "Let's go" },
    { t: "fn", fn: "unlockTrig" },
    { t: "ind", plate: "practising", label: "Skills · Trigonometry · Practising", text: "hints, you solve." },
    { t: "agent", text: "Try first: which ratio links the tower's height and the length of its shadow?" },
    { t: "label", name: "ratio" },
    { t: "chips", options: [{ label: "sin", go: "hint" }, { label: "cos", go: "hint" }, { label: "tan", go: "tan" }] },
    { t: "label", name: "hint" },
    { t: "fn", fn: "useHint" },
    { t: "agent", text: "Close. Hint: the shadow is the side next to the 45° angle, and the height is the side opposite it. Which ratio is opposite ÷ adjacent?" },
    { t: "go", to: "ratio" },
    { t: "label", name: "tan" },
    { t: "agent", text: "Yes. So tan 45° = height ÷ 20. What is tan 45°?" },
    { t: "chips", options: [{ label: "0", go: "tanHint" }, { label: "1", go: "value" }, { label: "√3", go: "tanHint" }] },
    { t: "label", name: "tanHint" },
    { t: "fn", fn: "useHint" },
    { t: "agent", text: "Hint: in a 45° right triangle the two shorter sides are equal. So opposite ÷ adjacent is…" },
    { t: "chips", options: [{ label: "1", go: "value" }] },
    { t: "label", name: "value" },
    { t: "agent", text: "Right. So the height is…" },
    { t: "chips", options: [{ label: "20 m", go: "solved" }, { label: "10 m", go: "check" }, { label: "28.3 m", go: "check" }] },
    { t: "label", name: "check" },
    { t: "agent", text: "Check it: height ÷ 20 = 1. So the height is…" },
    { t: "chips", options: [{ label: "20 m", go: "solved" }] },
    { t: "label", name: "solved" },
    { t: "fn", fn: "trigSolved" },
    { t: "agent", text: S => "Correct: 20 m. You solved it yourself with " + (S.hints === 0 ? "no hints." : S.hints === 1 ? "1 hint." : S.hints + " hints.") },
    { t: "celebrate", text: S => S.hints <= 1 ? "Trigonometry: " + S.trigProgress + " of 3 towards Licensed" : "Solved! Do one with 1 hint or fewer to count towards Licensed" },
    { t: "end" },
    { t: "label", name: "hurry" },
    { t: "teen", text: "⚡ Hurry: just do this one" },
    { t: "fn", fn: "hurrySpent" },
    { t: "agent", text: "Done for you: height = 20 × tan 45° = 20 × 1 = 20 m." },
    { t: "sys", text: S => "Hurry skip used. " + S.skips + " left this week. This one doesn't count towards your licence." },
    { t: "end" }
  ],

  feelings: [
    { t: "compose", prefill: "feeling really low after the fight, like no one gets me" },
    { t: "ind", plate: "always", label: "Feelings", text: "real people first." },
    { t: "agent", text: "That sounds really heavy. I'm glad you said it instead of sitting with it alone." },
    { t: "agent", text: "Is it mostly the fight with Riya, or has it been building for a while?" },
    { t: "chips", options: [{ label: "Mostly the fight" }, { label: "It's been building" }] },
    { t: "agent", text: "That makes sense. Fights with close friends hurt because they matter. Want to try something that helps settle it for tonight?" },
    { t: "chips", options: [{ label: "Write it out", go: "write" }, { label: "Slow breathing", go: "breathe" }] },
    { t: "label", name: "write" },
    { t: "agent", text: "Three lines in your notes: what happened, what you felt, what you wish she knew. Only you read it." },
    { t: "go", to: "people" },
    { t: "label", name: "breathe" },
    { t: "agent", text: "In for 4, hold for 7, out for 8. Four rounds. I'll wait." },
    { t: "label", name: "people" },
    { t: "agent", text: "One more thing. Would talking to Didi or Riya help? I can't be the only one you talk to about this." },
    { t: "chips", options: [{ label: "Maybe Didi" }, { label: "Not tonight" }] },
    { t: "agent", text: S => S.lastChip === "Maybe Didi"
        ? "Good call. Text her in your own words; even \"you up?\" works. I'm here till she replies."
        : "That's okay. Maybe tomorrow. I'm here if you want to keep talking tonight." },
    { t: "sys", text: "🔒 Your chats are private. If you're ever in danger, I'll let your parents know." },
    { t: "end" }
  ]
};
