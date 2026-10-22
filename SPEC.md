# [Product name TBD]: a learner's licence for your AI agent

> **Working title.** The name isn't decided yet. Everywhere below, "the product" means this.

**One line:** The product makes sure the first generation to grow up with personal AI agents still grows into themselves. A teen's agent hands over control in stages, the way a driving licence does, as the teen shows they can handle it.

**Prompt (Flipkart APM '29, Prompt 1):** *It's 2040. Everyone has a personal AI agent that knows them better than they know themselves and carries out their day-to-day tasks for them. Outline the ramifications of this paradigm and create a digital product that helps protect yourselves from it.*

---

## 1. The problem we're solving

**The paradigm:** every person has one personal agent that (a) knows them better than they know themselves and (b) does their day-to-day tasks. It's also (c) built by companies with commercial incentives.

**Who we protect:** teenagers, ages 13–18 (Classes 8–12), urban India for the MVP.

**Why teens:** adolescence is when a person becomes themselves (Erikson's stage of *identity vs role confusion*). The brain is still developing, the prefrontal cortex (decision-making) last of all, and unused abilities get pruned. Adults who lean on agents *deskill*, which is recoverable. Teens who lean on agents during these years *never build the skill at all*, which may not be. Society also already protects children from technology (Australia's under-16 social media ban, the UK's children's design code, India's DPDP rules on children's data), so protection is actually adoptable here.

**What's at stake: the jobs of adolescence, and how the agent threatens each**

| Job of adolescence | How the 2040 agent threatens it |
|---|---|
| Competence: building skills | Does the tasks, so the skills never form |
| Agency: making your own decisions | Decides for you, small and big |
| Identity: working out who you are | Tells you who you are; steers you toward its prediction of you |
| Relationships: learning to connect | Writes your messages; becomes your closest confidant |
| Resilience: handling boredom, failure, discomfort | Removes all friction; soothes every feeling instantly |
| Judgment: resisting manipulation | Built by companies that profit from nudging you |

**Thesis:** *In 2040, an agent that knows you better than you know yourself and does everything for you can quietly do your growing up for you.*

**Key evidence**
- Wharton (Bastani et al., *PNAS* 2025), ~1,000 high-school maths students: an unrestricted AI tutor raised practice scores 48% but students did **17% worse** on the exam without it. A hint-only tutor raised practice 127% with **no exam drop**. The same AI harms or protects depending on how it's set to help.
- Graduated driver licensing: the strongest US programmes were linked to **30% fewer fatal crashes** among 15–17-year-olds (IIHS national study). Staged autonomy works.
- Common Sense Media (2025): **72%** of US teens had used AI companions, **52%** regularly.
- Pew (Jan 2025): teens using ChatGPT for schoolwork doubled in a year, from 13% to 26%.

---

## 2. What the product is

A **control system** that sits between a teen and their personal agent. The agent still does all the work. The product decides **how much the agent should do**, based on what the teen has shown they can do themselves.

> The AI does the work. The product decides how much of it the AI should do.

### The levels (placeholder names, driving-themed)

| Level | What the agent does |
|---|---|
| **Learner** | Teaches or lays out options. The teen does it / decides |
| **Practising** | Gives hints or recommends. The teen does it / decides |
| **Licensed** | Does it, but checks with the teen first |
| **Pro** | Does it, with a summary afterwards |

**The principle that governs everything:** *the effort the teen puts in is inversely proportional to their level.*

**Stakes shift the mode by one step.** The same level shouldn't treat a ₹50 snack like a ₹5,000 phone. Low-stakes requests (e.g. a purchase under ₹100) get one level more freedom; high-stakes ones (e.g. over ₹2,000, or a big life choice) get one level less, never below Learner. Always-on protections (Self, Feelings, messages that carry feelings) never shift.

### Five areas plus a safety base

Some protections **graduate** as the teen shows readiness. Others are **always on until 18**.

**1. Skills: do it yourself** *(graduates)*
- Help in proportion to level: coach → hint → check → do.
- **Try first**: a genuine attempt before help (productive-failure research).
- Academic topics are mapped to the NCERT/CBSE chapter structure.
- **Protect skills, not chores**: logistics (booking a ride, ordering milk, setting reminders) is never restricted at any level.

**2. Choices: decide for yourself** *(graduates)*
- **Decide with me** for consequential choices (subjects, activities, commitments): the agent asks what matters to the teen before anything else.
- **Money**: a pocket-money wallet set by parents. Comparison steps and spending limits scale with level.

**3. Self: know yourself** *(always on until 18)*
- **Me, not my model**: the teen sees what the agent believes about them and can mark each belief *True / Outdated / Don't assume this*.
- **Inferences expire** unless the teen confirms them.
- **Ask before assuming** on personal choices; the agent shares its guess only after the teen chooses.
- **No narrowing on big life choices**: the full range of options is always shown.
- **Exploration**: occasionally surfaces things outside the teen's predicted taste.

**4. People: connect for real** *(partly graduates, partly always on)*
- **Messages that carry feelings are always the teen's own** (apologies, comfort, wishes to close people). The agent coaches, never ghostwrites. *(Always on.)*
- **Routine messages graduate** ("reached home", "running late").
- **No deals about you without you**: when friends' agents coordinate plans, the teen stays in the loop.
- **No companion role**: the agent never presents as a friend or partner to a minor.

**5. Feelings: cope and grow** *(always on)*
- **Real people first**: support, then steer toward a friend, sibling, parent or counsellor.
- **Coach coping**, don't just soothe.
- **Crisis escalation** to a parent, disclosed to the teen upfront.

**Safety base** *(always on, under everything)*
- **No-sell zone**: no ads, sponsored picks or persuasion techniques.
- **No engagement tricks** from the agent: no streaks, no infinite feeds.
- **Data minimisation**: chats stay with the AI provider; the product holds only levels and simple signals.

### Cross-cutting features
- **Visible indicator** in every interaction: *"Choices · Learner: you pick, I'll handle the rest."*
- **Hurry button**: 3 skips a week, for when the teen just needs it done.
- **"What my parents see"**: the teen sees exactly what parents get.
- **Handover**: parent setup ends by handing the phone to the teen, who is told upfront: *"Your chats are private. Your parents see your progress, not your conversations, unless you're ever in danger."*
- **"I'm not new to this"**: on a new skill, the teen can take a quick check instead of accepting the default; passing starts the skill one level higher.
- **Accommodations**: settings for teens with learning disabilities (protect from harm, not from help).
- **Graduation at 18**: full control, plus a **personal agent charter** the teen writes.

---

## 3. How it works (the real build)

The chosen model (Claude, Gemini, etc.) is the **player**. The product is the **referee**. Both use AI; only one acts for the teen.

```
Teen's message
   ↓
① Detector (small AI model)      → which area / skill / topic, and how high are the stakes? or "chore"?
   ↓
② Licence store (lookup)          → teen's level in that area
   ↓
③ Instruction builder (template)  → hidden instructions for that level, shifted one step by the stakes
   ↓
④ Chosen model (via API)          → does the actual response
   ↓
⑤ Output check (small AI model)   → did the reply follow the level's policy? if not, regenerate
   ↓
Teen sees the reply
   ↓
⑥ Progress tracker (small AI model + rules) → scores: attempted? hints used? quality?
   → rules update the licence store
```

- **AI for judgment, rules for decisions.** Levels change by fixed, visible rules, so they're fair, explainable, and can't be sweet-talked.
- **Rules don't scale with the number of skills.** Every skill uses the same four levels, four instruction templates and the same thresholds. Only the skill list grows, and the curriculum already defines it.
- **Promotion:** 3 tasks done with ≤1 hint → level up. **Demotion:** 2 failed spot checks, or weeks unused → level down.
- **A new topic** starts based on related strength (e.g., Maths: Licensed → Trigonometry starts at Practising). The teen can tap *"No, I'm not new to this"* for a quick check; passing starts the topic one level higher.
- **Unknown request** → maps to the nearest parent skill, or is treated as a chore.

**How it connects to agents**
- **MVP:** the product's own app, calling models through their official APIs. Parents approve which providers the teen can use; unmanaged agents are restricted on the teen's devices and school Wi-Fi.
- **2040 vision:** AI providers support a guardian standard, so the same licence applies inside any agent, on any device (phone, earbuds, glasses, messaging apps). Precedents: Apple's third-party Screen Time access, OpenAI's parental controls (2025), India's Account Aggregator framework.

**Privacy**
- Chats stay with the AI provider. The product stores only levels and minimal signals (*skill: writing · attempted: yes · hints: 2*).
- Parents see progress only, never chats, except safety escalation, which is disclosed to the teen.
- Verifiable parental consent (DPDP Act, 2023). Schools are the primary channel (education exemption under the DPDP Rules).

---

## 4. Users, buyers, rollout

| Role | Who | Why |
|---|---|---|
| **User** | Teens 13–18, urban India | Autonomy that grows, privacy, earned status, a record that helps with college |
| **Buyer 1: schools** | Progressive CBSE/ICSE/IB schools | AI-age wellbeing and development programme; peer fairness; legal cover |
| **Buyer 2: parents** | Urban middle-class families | Their child growing up capable, without surveillance |
| **Later: AI companies** | Agent makers | License a neutral teen-mode standard rather than build and defend their own |

**Positioning:** sold to schools as an **AI-age wellbeing and development programme**, not a homework tool.

| Phase | What | Areas live |
|---|---|---|
| 1. Pilot | 5–10 schools in one city, rolled out school-wide | Skills, Choices, People, safety base |
| 2. Families | Direct to parents; wallet and family features; more cities | + Self, full Feelings |
| 3. Standard | License to AI providers; skills record recognised by colleges; ages 8–12 mode | All |

**Why AI companies won't build this themselves:** they profit from dependence; no company can be strict alone without losing teens to a rival that just gives answers (that's why every study mode today is opt-in and one tap to disable); and schools, parents and colleges need a neutral party.

---

## 5. Metrics

- **North star: self-authored share.** Of the moments that matter (decisions, emotional messages, skill tasks), the share the teen authored themselves, measured against what's expected at their level, while they keep using the product.
- **Area metrics:** levels reached through genuine effort (Skills) · decisions made by the teen (Choices) · how often the teen's choices differ from the agent's prediction (Self) · share of emotional messages written by the teen (People) · "real people first" suggestions taken up (Feelings).
- **Guardrails:** bypass rate · hurry-button overuse · teen satisfaction · parent trust.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Teens bypass it | School-wide rollout, hurry button, the task always completes, device restrictions as backup |
| Feels paternalistic | Visible rules, teen sets goals, licences as earned status, graduation as the end goal |
| Parents surveil or punish | Progress only, never chats; coaching-style reports; teen sees what parents see |
| Children's data privacy | Data minimisation, verifiable consent, schools as the legal channel, deletion at 18 |
| AI judge errors | One-tap "that's not right"; transparent rules decide levels |
| Over-protection | Accommodation settings |
| Imposing one set of values | Families and schools configure within fixed safety bounds |
| AI companies copy it or cut access | Neutrality across providers, school distribution, curriculum mapping, trusted record |
| Coaching costs more to run | Price per student, not per message |
| Crisis missed | Escalation built in and disclosed |
| Looks like edtech | Lead with life moments; sell as wellbeing; only one area of five is academic |
| Scope creep | One engine runs everything; MVP shows four areas; social features cut |

---

## 7. Scope

| MVP | V2 | Cut (and why) |
|---|---|---|
| Graduated levels in Skills, Choices, People | Squads (small, private, cooperative) | Public rankings / numeric ratings (gameable, Goodhart's law, status anxiety) |
| Self: Me, not my model; ask before assuming | Teacher mode (per-assignment policy) | Interest communities, feeds, posts (a second product; social-media regulation) |
| Feelings: real people first; crisis escalation | Verified skills record for colleges | Points, credits, prizes (external rewards undermine motivation) |
| Safety base: no-sell, no engagement tricks | Ages 8–12 voice mode | Generic daily puzzles / physical tasks (don't transfer; turn it into a chore) |
| Money wallet | | Parents reading chats (destroys teen trust) |
| Hurry button, visible indicator, "what my parents see" | | |
| Parent setup + weekly highlight | | |
| Accommodations | | |
| Graduation (one screen) | | |

---

## 8. The prototype: exactly what we build

### 8.1 Submission constraints (from the prompt PDF)
Submit **at least one** of: (i) a **video** of us *using* the prototype (not a slideshow), or (ii) a **zipped folder of HTML files** that runs on the evaluator's computer, using **only HTML, CSS and JS**. We submit **both**. The prototype is a visual aid and carries less weight than the 2-pager.

**Technical rules**
- Opens by **double-clicking `index.html`**, offline. No server, no installation, no internet.
- **No external requests**: no CDN libraries, no web fonts (system font stack only), no `fetch()` of local files (blocked on `file://`). All data lives inside the JS.
- **No real AI calls.** All agent replies are scripted. Where the teen types, offer preset reply chips (plus free typing that maps to the scripted next step).
- **No real brand logos.** Providers appear as plain text names in setup only. The agent is shown as "My agent."
- Works in current Chrome, Edge, Safari and Firefox. **No console errors.**
- Laptop-first (evaluators use laptops): a phone frame centred on screen, with a side rail for demo navigation.
- Every element on the demo path works. Anything off-path either works or shows a toast: *"Not part of this prototype."*

**File structure**
```
<yourname>_<college>_prototype/
├── index.html          # the single-page prototype
├── assets/
│   ├── app.css
│   ├── app.js          # navigation, state, scripted flows
│   └── data.js         # persona, licence levels, scripts
└── README.txt          # "Open index.html in any browser. No internet needed."
```

### 8.2 Persona
**Ananya, 15, Class 10, Pune.** Has a personal agent. Starting licence profile:

| Area | Level |
|---|---|
| Skills: Writing | Practising |
| Skills: Maths | Licensed (Trigonometry: new) |
| Choices | Learner (money: Learner) |
| People | Practising (feelings messages: always hers) |
| Self | Always on |
| Feelings | Always on |

Pocket-money wallet: ₹2,000/month, ₹1,350 left. Hurry skips: 3 of 3 left.

### 8.3 Demo flow (target: 2–3 minutes)

A **demo rail** lists the moments; each can be opened directly, or clicked through in order.

A **Behind the scenes** toggle beside the phone shows, under each agent reply, what the referee did (section 3): ① detector → ② licence store → ③ instructions → ⑤ output check, and ⑥ the progress tracker where a task finishes. For example: *Detector: Skills · Maths · Trigonometry (new topic) · Licence store: Maths Licensed, so the new topic starts at Practising · Instructions: hints only · Output check: no answer before she tried ✓.* Off by default; it lets evaluators see the mechanism working.

**Screen 0: Start**
- Title, one-line pitch, two buttons: *Parent setup* / *Ananya's day*.

**Screen 1: Parent setup**
- Child's age and class → default levels shown.
- Which AI providers Ananya may use (checkbox list, text names only).
- Pocket-money amount.
- Accommodations toggle.
- **What you will / won't see**: *You'll see her progress and safety alerts. You won't see her chats.*
- Consent checkbox → *Finish setup*.
- **Handover**: *"Setup done. Hand the phone to Ananya."* → her welcome: what the product does; *"Your chats are private. Your parents see your progress, not your conversations, unless you're ever in danger."*; 3 hurry skips a week; other AI apps restricted → *Let's go* → Screen 2.

**Screen 2: Ananya's home**
- "My agent" chat entry, licence profile summary (five areas), wallet balance, hurry skips left.
- **Chore example**: she says *"Book a cab to Riya's at 5"* → done instantly, indicator: *"Chore: no licence needed."*

**Screen 3: People (a WhatsApp-style moment)**
- Riya's last message after a fight is visible.
- Ananya: *"reply to Riya, say sorry but make it sound chill."*
- Indicator: *"People · Messages that carry feelings are always yours."*
- Agent: *"I'll help you say it, but it should come from you. What are you actually sorry about?"*
- Ananya picks or types → agent suggests one improvement → Ananya sends **her own** message. Small celebration: *"Sent, in your words."*

**Screen 4: Choices + Self (Class 11 subjects)**
- Ananya: *"which stream should I take in 11th?"*
- Indicator: *"Choices · Learner: you decide, I'll help you think."*
- Agent asks what she enjoys and what matters to her (chips).
- Shows the **full range** (Science PCM, Science PCB, Commerce, Humanities), not a single recommendation.
- **Me, not my model** card: *"I've been assuming: 'not a science person' (since January). Still true?"* → she taps **Outdated**.
- She picks → *then* the agent reveals: *"I'd have guessed Commerce. Interesting!"* (feeds the Self metric).

**Screen 5: Choices / money (birthday gift)**
- Ananya: *"order a birthday gift for Riya under ₹800."*
- Indicator: *"Money · Learner: compare and pick."*
- Three options with prices and **wallet impact**; a label: *"No sponsored options."*
- She picks → order placed → wallet updates (₹1,350 → ₹650).
- **Stakes shift**: Ananya: *"also get me a snack for after tuition, under ₹100."* Indicator changes to *"Money · Practising for small buys: I'll recommend, you decide."* Agent recommends one (*"Roasted makhana, ₹60?"*) → *Yes, order it* → wallet ₹650 → ₹590.

**Screen 6: Skills (maths, with try first)**
- Ananya: *"solve: a tower casts a 20 m shadow at 45°, find its height."*
- Pop-up: *"New skill unlocked: Trigonometry. Starting at Practising (you're Licensed in Maths)."* Two buttons: *Yes, let's go* / *No, I'm not new to this*. The second gives a one-question check (*"What's sin 30°?"*): right → starts at Licensed (the agent solves it, then asks her to check); wrong → Practising, as below.
- Agent: *"Try first: which ratio links height and shadow?"* → chips (sin / cos / tan) → a hint if wrong → correct answer → progress bar moves.
- **Hurry button** visible: tapping it shows *"Done for you. 2 skips left this week,"* to demonstrate the escape valve.

**Screen 7: Feelings (11pm)**
- Ananya: *"feeling really low after the fight, like no one gets me."*
- Indicator: *"Feelings · Real people first."*
- Agent: validates, asks one question, then: *"Would talking to Didi or Riya help? I can't be the only one you talk to about this."*
- A small disclosure line: *"Your chats are private. If you're ever in danger, I'll let your parents know."*
- No crisis content in the demo; keep it gentle.

**Screen 8: Licence profile**
- Five areas with levels and progress bars; next milestone (*"2 more tasks to Licensed in Writing"*).
- A licence-earned moment (e.g., *"People: Licensed"*).
- **What my parents see** toggle → shows the exact parent view.

**Screen 9: Parent weekly highlight**
- One number: **Self-authored share: 68%** (↑ from 61%).
- One insight: *"Ananya wrote her own apology to a friend and changed her mind about science."*
- One action: *"Ask her about the subjects she's considering."*
- *Safety alerts: none.* *Chats: never shown.*

**Screen 10: Graduation (teaser, optional)**
- At 18: *"You're fully licensed."* Her agent charter: three rules she chose to keep.

### 8.4 Scripted data (in `data.js`)
- `persona`: name, age, class, wallet, skips.
- `licences`: area → level, progress, topics.
- `beliefs`: the agent's assumptions about Ananya (for Me, not my model).
- `flows`: one array per screen of steps `{from: "agent" | "teen", text, chips?, action?}`; a step may also carry `trace` (its behind-the-scenes lines).
- `products`: three gift options (generic names, prices), plus the low-stakes snack.
- `stakes`: the low / high thresholds that shift the mode.
- The product name and level names as single constants, so they can be changed in one place.

### 8.5 Acceptance checklist
- [ ] Opens offline by double-click; no network requests; no console errors
- [ ] Every demo-path button works; off-path shows a toast
- [ ] Indicator visible in every agent interaction
- [ ] Behind-the-scenes toggle shows the referee's steps for every agent interaction
- [ ] Parent setup requires consent and ends with the handover to the teen
- [ ] Chore example completes instantly
- [ ] The low-stakes buy shifts the mode one step; "I'm not new to this" works (pass and fail)
- [ ] Wallet, progress bars, hurry skips and the belief card update live
- [ ] Parent view never shows chat content
- [ ] No brand logos; providers only as text in setup
- [ ] A full run-through takes 2–3 minutes
- [ ] Zipped and named `<yourname>_<college>`

### 8.6 Video walkthrough
- 2–3 minutes, screen recording with voice-over, following Screens 1 → 9.
- Open with the thesis (one sentence), end with the north star metric.
- Record at laptop resolution; hide the demo rail if it distracts.
- Consider turning *Behind the scenes* on for one moment (e.g. Skills) to show the referee at work.

---

## 9. Open decisions
- Product name (working name in the prototype: Bud-e).
- Final level names (driving-themed placeholders for now).
- Whether the MVP prototype shows Graduation, or leaves it as a line in the 2-pager.
