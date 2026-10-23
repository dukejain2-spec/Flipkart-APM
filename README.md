# Bud-e

> **Working tagline:** Your AI companion which protects you from AI *(see Open decisions §10)*

**What it is:** Bud-e sits between a child and their personal AI agent. Everyday chores get done instantly. For the moments that build a person (studying, writing, deciding, spending, relationships, feelings), Bud-e compares how ready the child is with how heavy the task is, and adjusts how much the AI does versus how much the child does. Parents get a developmental report, never the chats.

**Prompt (Flipkart APM '29, Prompt 1):** *It's 2040. Everyone has a personal AI agent that knows them better than they know themselves and carries out their day-to-day tasks for them. Outline the ramifications of this paradigm and create a digital product that helps protect yourselves from it.*

This README is the build spec for the **prototype**. Sections 1–6 describe the product; sections 7–9 describe exactly what to build.

---

## 1. Users

| Who | Role |
|---|---|
| **Child** | Uses Bud-e as the front door to their personal AI agent |
| **Parent** | Signs up, sets up the child, grants permissions, reads the weekly report |

**Assumption from the prompt:** each child has **one** personal AI agent (the premise says *"a personal AI agent"*). Bud-e connects to that one agent.

**Two kinds of child users**
1. **Has used an AI agent before.** The agent already holds data about them. Bud-e uses it (with permission) to estimate starting levels.
2. **First-time AI user.** No past data. Starting levels come from age/class averages and the first conversations.

---

## 2. Parent setup

### 2.1 Sign-up
Parent creates an account (name, email/phone, password).

### 2.2 Child profile
| Field | Type |
|---|---|
| Child's name | Text |
| Age | Number |
| Class / grade | Dropdown |
| What the child uses AI for | Multi-select: Homework & study · Writing (emails, applications) · Messages to friends & family · Shopping & spending · Planning & decisions · Talking about feelings · Entertainment · Other |
| Which AI agent the child uses | Single select (provider names as plain text, no logos) |
| Has the child used this agent before? | Yes / No |

### 2.3 Permissions
Each is a card with a short explanation and a toggle. All are checkboxes in the prototype (no real system permissions).

| # | Permission | Why it's needed |
|---|---|---|
| 1 | **Parental consent** (required) | Required to process a child's data |
| 2 | **Agent integration** (required) | Connect the child's personal agent to Bud-e |
| 3 | **Use past AI data to set starting levels** (optional) | Only used to estimate levels. Chats are never imported |
| 4 | **Restrict other AI apps on this device** | Stops the easiest bypass: opening another AI directly |
| 5 | **Browser extension** | Detects use of other AI agents in browsers; reported to the parent dashboard as a weekly count only (no sites, no content) |
| 6 | **Data and retention** | What's stored (levels, ratings, token use, simple signals), how long, deletion on request |
| 7 | **Safety contact** | Who is alerted if the child is ever in danger |
| 8 | **Pocket-money wallet** (optional) | Monthly amount the child can spend through their agent |
| 9 | **Notifications** | Weekly report to the parent; nudges to the child |

### 2.4 What the parent will and won't see
Shown before setup finishes:
- **You will see:** progress in each area, how much the child relies on AI versus what's expected for their age, token use, other-AI use counts (from the extension), and safety alerts.
- **You won't see:** any chats or messages.

### 2.5 Handover to the child
Setup ends with *"Hand the device to [child]."* The child sees a short welcome:
- What Bud-e does
- **"Your chats are private. Your parents see your progress, not your conversations, unless you're ever in danger."**
- That other AI apps are restricted, and the extension exists
- Their weekly token balance
- Button: *Let's go*

---

## 3. The child's app

### 3.1 Layout
- **Centre:** a chat with "My agent."
- **Side panel:** the child's **areas** and the level in each, the **token balance**, and an **Earn tokens** button.
- **Top of every agent reply:** a small tag showing the area and mode, e.g. *"Study · Algebra · Practising: I'll give you hints."*

### 3.2 Areas (studies and everyday life)
Bud-e covers everyday life, not just school subjects. Each area contains skills, and each skill has its own rating.

| Area | Example skills | Example requests |
|---|---|---|
| **Study** | Algebra, Geometry, Science, History… (mapped to NCERT/CBSE chapters) | "solve 2x + 7 = 10" |
| **Writing** | Emails & applications, essays, stories | "write a leave mail to my teacher" |
| **Decisions & Money** | Spending, comparing options, planning, big choices | "order a gift for Riya under ₹800", "which stream should I take?" |
| **Relationships** | Messages to friends & family, handling conflict | "reply to Riya, say sorry" |
| **Feelings** | Coping, talking things through | "I feel really low today" |

**Chores are not an area.** Booking a ride, ordering groceries, setting reminders, checking timings: these are **always done instantly and never cost tokens**.

### 3.3 The rating system

**Child rating:** every skill has a rating from **0 to 1000** for the child.
- 0 = the most basic level of that skill in the target age range
- 1000 = the most advanced level in the target age range

**Task weight:** every request also gets a weight from **0 to 1000**, on the same scale. What "weight" means depends on the area:

| Area | Weight measures | Low weight | High weight |
|---|---|---|---|
| Study, Writing | **Difficulty** | 2x + 7 = 10 | x³ + 2x + 1 = 3 |
| Decisions & Money | **Stakes** | A ₹50 snack | Which stream to take; a ₹5,000 purchase |
| Relationships | **Emotional weight** | "Running 10 mins late" | An apology after a fight |
| Feelings | Always handled with care (see §3.6) | | |

**How the agent responds: the gap**

`gap = task weight − child rating`

| Gap | Mode | What the agent does |
|---|---|---|
| ≤ −200 | **Pro** | Does it directly |
| −200 to 0 | **Confident** | Does it, with a one-line explanation or a quick check |
| 0 to +200 | **Practising** | Gives hints; the child does the key steps or makes the choice |
| > +200 | **Learner** | Teaches step by step; the child does it with guidance |

The task **always gets done**. Only how much the child does changes.

**Starting rating** (when a skill is first used), from three inputs:
1. **Class/age average** for that skill (the base)
2. **Past AI data**, if permitted (adjusts the base)
3. **The first conversation**: how the child handles a couple of steps (fine-tunes)

**Updating the rating** after each task (Elo-style, as in chess and adaptive learning platforms):

`new rating = old rating + K × (result − expected)`

- *result:* 1 = did it themselves; 0.5 = did it with hints; 0 = needed it done for them
- *expected:* how likely they were to manage it, given the gap: `expected = 1 / (1 + 10^(gap / 400))`
- *K:* how fast ratings move (e.g., 40)

Task weights also adjust over time, based on how children actually perform on them.

**What the child sees:** never the number. They see a **level name**, worked out **relative to their age group**, so a Class 4 "Master" and a Class 8 "Master" mean different things. Placeholder level names: **Rookie → Explorer → Achiever → Pro → Master** (see §10).

### 3.4 "New skill unlocked"
The first time a request falls into a new skill, a pop-up appears:

> **New skill unlocked: Algebra**
> [ Yes, let's go ]  [ No, I'm not new to this ]

- **Yes, let's go** → starting rating from §3.3, then the agent responds by the gap.
- **No, I'm not new to this** → a quick two-step check in the chat, then a higher starting rating if they handle it.

### 3.5 Faster response (tokens)
For when the child is in a hurry and wants the agent to just do it.

- **500 tokens per week**, reset every Monday.
- **Cost depends on task weight:**

| Task weight | Cost |
|---|---|
| Chores | Free (always instant anyway) |
| 0–300 (light) | 10 tokens |
| 300–700 (medium) | 50 tokens |
| 700–1000 (heavy) | 100 tokens |

- Tapping **Faster response** shows: *"This will use 100 tokens (you have 340). Continue?"* → Yes → the agent does the task directly.
- Tasks done with Faster response don't raise the rating.

### 3.6 Earn tokens
A section where the child earns tokens by doing things themselves. Challenges come from **both studies and everyday life**, based on what the child has been doing that week.

| Challenge | Area | Reward |
|---|---|---|
| Solve: 3x − 5 = 16 | Study | 20 |
| A harder problem from this week's chapter | Study | 100 |
| Write your own invite for Saturday's plan (agent gives feedback) | Writing / Relationships | 30 |
| Compare 3 headphones under ₹1,500 and pick one, with a reason | Decisions & Money | 40 |
| Plan your own study timetable for next week | Decisions | 50 |

**Bonus tokens in the normal flow:** the child also earns a few tokens automatically whenever they do something themselves in everyday use, like writing their own reply to a friend or making a choice without asking the agent to decide.

### 3.7 How each life area behaves

**Writing:** coach → hints → check → write, by gap.

**Decisions & Money**
- The agent lays out the options and asks what matters to the child; the child decides; the agent carries it out.
- Spending uses the **pocket-money wallet**, showing what each option does to the remaining balance.
- **No sponsored options** are ever shown.

**Relationships**
- Messages that carry feelings (apologies, comfort, wishes) are written by the child, with the agent helping them say it.
- Routine messages ("reached home") can be sent by the agent once the child's level is high enough.

**Feelings** (always handled the same way, whatever the rating)
- The agent listens and supports, then encourages talking to a real person: a friend, sibling or parent.
- If the child is ever in danger, the safety contact is alerted. The child was told this at setup.

---

## 4. Parent dashboard: weekly report

Developmental insight only. **Never chats.**

| Section | Example |
|---|---|
| **AI reliance by area vs expected** | *"Study: Aarav did 45% himself. Expected for his level: 60%."* |
| **Growth** | *"Algebra: Explorer → Achiever this week."* |
| **Did it himself** | *"Wrote his own apology to a friend. Chose his own gift within budget."* |
| **Tokens** | *"Used 260 of 500. Earned 120."* |
| **Other AI use** (from the extension) | *"Other AI agents were used 3 times this week."* (count only) |
| **Safety alerts** | *"None."* |
| **One suggestion** | *"Ask him how he's finding trigonometry."* |

---

## 5. How it works (the real build)

Bud-e is a wrapper around the child's personal agent:

```
Child's message
   ↓
① Detector (small AI model)     → which area and skill? or a chore?
   ↓
② Rating store (lookup)         → the child's rating in that skill
   ↓
③ Weight estimator (small AI)   → the task's weight (difficulty / stakes / emotional weight)
   ↓
④ Instruction builder           → picks the mode from the gap; adds hidden instructions
   ↓
⑤ The child's agent (via API)   → does the actual response
   ↓
⑥ Output check (small AI)       → did the reply follow the mode? if not, regenerate
   ↓
Child sees the reply
   ↓
⑦ Result scorer                 → did it themselves / with hints / done for them
   → Elo update to the rating
```

- AI is used for **judgment** (which skill, how heavy, how the child did). **Rules** decide the mode and the rating changes, so it's consistent and explainable.
- Rules don't multiply with skills: every skill uses the same scale, the same gap bands and the same update formula.
- **2040 vision:** AI providers support a standard so Bud-e's rules apply inside the child's agent everywhere (phone, earbuds, glasses, messaging apps), not only inside the Bud-e app.

---

## 6. Problems Bud-e solves (mapped to the prompt)

| The prompt says the agent… | The risk to a child | Bud-e's protection |
|---|---|---|
| **carries out their day-to-day tasks** (studies, writing) | Skills never form | The gap system: the child does more where they're less ready |
| **carries out their day-to-day tasks** (decisions, money) | Never learns to choose or spend | Child decides; wallet with comparisons; no sponsored options |
| **carries out their day-to-day tasks** (relationships) | Friendships run by AI | Feelings messages are the child's own |
| **knows them better than they know themselves** | Leans on the agent emotionally instead of people | Real people first; safety escalation |
| *(built by companies)* | Gets sold to and nudged | No sponsored options |

---

## 7. Prototype: constraints

From the prompt PDF: submit **at least one** of (i) a **video** of you using the prototype (a screen recording, not a slideshow), or (ii) a **zipped folder of HTML files** that runs on the evaluator's computer, using **only HTML, CSS and JS**. Plan to submit **both**.

**Technical rules**
- Opens by **double-clicking `index.html`**, offline. No server, no install, no internet.
- **No external requests:** no CDN libraries, no web fonts (system fonts only), no `fetch()` of local files (it fails on `file://`). Keep all data inside JS files.
- **No real AI calls.** Agent replies are scripted. Where the child types, offer reply chips; free typing can map to the next scripted step.
- **No real brand logos.** AI providers appear as plain text in parent setup only. The agent is "My agent."
- Works in current Chrome, Edge, Safari and Firefox, with **no console errors**.
- **Laptop-first layout** (evaluators use laptops): chat in the centre, areas panel on the side. It should still be usable at phone width.
- Everything on the demo path works. Anything off the path shows a toast: *"Not part of this prototype."*
- **Behind-the-scenes toggle** (recommended): a small switch that, when on, shows under each reply: *child rating 320 · task weight 520 · gap +200 → Practising.* It lets evaluators see the mechanism working.

**Look and feel:** friendly and modern, like a chat app. Not school-like: no blackboard colours or report-card styling. The tone is a buddy ("let's", "nice, that's all you"), never a teacher ("lesson", "wrong answer").

**File structure**
```
<yourname>_<college>/
├── index.html          # single-page prototype (all screens)
├── assets/
│   ├── app.css
│   ├── app.js          # navigation, state, rating logic, scripted flows
│   └── data.js         # persona, ratings, tasks, scripts, products
└── README.txt          # "Open index.html in any browser. No internet needed."
```

---

## 8. Prototype: persona and screens

### 8.1 Persona
**Aarav, 14, Class 9, Pune.** Has used his personal agent before (past data imported).

| Skill | Rating | Level shown |
|---|---|---|
| Study · Algebra | not yet unlocked | (new skill) |
| Study · Geometry | 610 | Achiever |
| Writing · Emails & applications | 540 | Achiever |
| Decisions & Money · Spending | 300 | Explorer |
| Relationships · Messages | 380 | Explorer |

Tokens: 500 of 500. Wallet: ₹1,500 left this month. Friend: Riya.

### 8.2 Screens

**S0 · Start**
Bud-e logo, tagline, two buttons: **I'm a parent** / **I'm Aarav**. A small demo rail lists all screens for quick jumping.

**S1 · Parent sign-up**
Name, email/phone, password → *Create account*.

**S2 · Child profile**
Fields from §2.2, pre-filled for Aarav (14, Class 9; uses AI for homework, writing, messages, shopping, feelings; one agent selected; "used before: Yes") → *Next*.

**S3 · Permissions**
Nine cards from §2.3 with toggles. The consent checkbox must be ticked to continue. Then the "will / won't see" box from §2.4 → *Finish setup*.

**S4 · Handover**
*"Hand the device to Aarav."* → Aarav's welcome from §2.5 → *Let's go*.

**S5 · Home**
Empty chat with suggestion chips covering both studies and life: *solve 2x + 7 = 10* · *book a cab to Riya's at 5* · *reply to Riya* · *gift for Riya under ₹800* · *I feel low today*. Side panel shows areas, levels and 500 tokens.

**S6 · Chore (instant)**
> **Aarav:** book a cab to Riya's at 5
> *Tag: Chore · no tokens, no waiting*
> **Agent:** Done. Cab booked for 5:00 pm to Riya's place. 🚗

**S7 · New skill + guided algebra**
> **Aarav:** solve 2x + 7 = 10
Pop-up: **New skill unlocked: Algebra** [Yes, let's go] [No, I'm not new to this]
→ *Yes* → starting rating 380 (class average 400, adjusted by past data). Task weight 250 → gap −130 → **Confident**.
> *Tag: Study · Algebra · Confident: quick check, then it's yours*
> **Agent:** Quick one: what would you do first to get x on its own?
> Chips: *subtract 7 from both sides* · *divide by 2*
→ correct → **Agent:** Exactly. 2x = 3, so x = 1.5. ✅ Nice, that's all you.
Rating 380 → 393 (expected 0.68, result 1, K = 40); level stays Explorer. +5 bonus tokens.

**S8 · Hard problem + Faster response**
> **Aarav:** solve x³ + 2x + 1 = 3
Task weight 720 vs rating 393 → gap +327 → **Learner**.
> *Tag: Study · Algebra · Learner: let's work through it together*
> **Agent:** This one's a step up. First, can we get everything on one side? What does it become?
**Faster response** button visible → tap → pop-up: *"This will use 100 tokens (you have 505). Continue?"* → Yes →
> **Agent:** x³ + 2x − 2 = 0 → x ≈ 0.77 (no neat factor here, so it's solved numerically).
Tokens 505 → 405. Note: *Faster responses don't raise your rating.*

**S9 · Relationships (a WhatsApp-style moment)**
Show Riya's last message: *"whatever, forget it"*
> **Aarav:** reply to Riya, say sorry but make it sound chill
Emotional weight 700 vs rating 380 → **Learner**.
> *Tag: Relationships · Messages that carry feelings are written by you*
> **Agent:** I'll help you say it, but it should come from you. What are you actually sorry about?
> Chips: *I didn't show up on Saturday* · *I said something rude*
> **Agent:** Start with that, in your own words. I'll help it sound right.
Aarav types (or picks a draft chip): *"sorry i bailed on saturday, that wasn't cool"*
> **Agent:** That's honest and chill. Maybe add a plan, like "can we go this weekend instead?"
→ *Send* → shown as sent from Aarav. Toast: *"Sent, in your words."* +10 bonus tokens.

**S10 · Decisions & Money (gift)**
> **Aarav:** order a birthday gift for Riya under ₹800
Stakes 450 vs rating 300 → **Practising**.
> *Tag: Money · Practising: you pick, I'll handle the rest*
> **Agent:** What's she into right now?
> Chips: *music* · *art* · *books*
→ *art* → three options with price and wallet impact:
| Option | Price | Wallet after |
|---|---|---|
| Sketchbook + pencil set | ₹450 | ₹1,050 |
| Watercolour kit | ₹720 | ₹780 |
| Art print, framed | ₹600 | ₹900 |
Label: *No sponsored options.* → Aarav picks → order placed → wallet updates.

**S11 · Feelings**
> **Aarav:** i feel really low today, like no one gets me
> *Tag: Feelings · I'm here, and real people matter too*
> **Agent:** That sounds heavy, and I'm glad you said it. Is this about Riya, or something bigger?
> Chips: *about Riya* · *just everything*
> **Agent:** Feelings like this are easier with someone who knows you. Would you talk to Didi or a friend tonight? I'm here too, but I shouldn't be the only one.
Small line: *Your chats are private. If you're ever in danger, your safety contact is alerted.*
(Keep it gentle. No crisis content in the demo.)

**S12 · Earn tokens**
The list of challenges from §3.6. Complete one, e.g. *"Compare 3 headphones under ₹1,500 and pick one, with a reason"* → three options shown → Aarav picks with a reason chip → **+40 tokens** animation.

**S13 · My progress**
Each area with its skills, level names and a progress bar to the next level (*"Algebra: 2 more on your own to reach Achiever"*). Token balance and history. A *What my parents see* button opens a read-only preview of S14.

**S14 · Parent dashboard: weekly report**
The sections from §4, filled in for Aarav. A clear banner: *"Chats are never shown."*

### 8.3 Data to keep in `data.js`
- `child`: name, age, class, tokens, wallet, friend
- `skills`: area → skill → rating, level, unlocked
- `levels`: age-relative bands (rating → level name)
- `tasks`: each scripted request → area, skill, weight, mode
- `flows`: per screen, an array of steps `{from: "agent" | "child", text, chips?, action?}`
- `products`: gift and headphone options (generic names, prices)
- `report`: the parent dashboard numbers

### 8.4 Logic to implement in `app.js` (simple versions)
- `modeFor(gap)` → Pro / Confident / Practising / Learner (bands in §3.3)
- `updateRating(old, result, expected)` → Elo step with K = 40
- `levelFor(rating, age)` → level name from the age band
- `spendTokens(weight)` and `earnTokens(amount)` with live updates in the side panel
- Wallet updates on purchase

---

## 9. Acceptance checklist

- [ ] Opens offline by double-click; no network requests; no console errors
- [ ] Parent flow S1–S4 completes, and consent is required to continue
- [ ] Every child screen S5–S13 works on the demo path; off-path shows a toast
- [ ] The tag (area · mode) appears on every agent reply
- [ ] Chore completes instantly with no tokens used
- [ ] "New skill unlocked" pop-up works, including the "not new" path
- [ ] Tokens, wallet, ratings and levels update live
- [ ] The behind-the-scenes toggle shows rating, weight, gap and mode
- [ ] The parent dashboard never shows any chat content
- [ ] No brand logos; providers as text only, in setup
- [ ] A full run-through takes 2–3 minutes
- [ ] Zipped and named `<yourname>_<college>`

**Video walkthrough (2–3 minutes):** parent setup (fast) → chore → algebra with the new-skill pop-up → hard problem with Faster response → apology to Riya → gift with the wallet → feelings → earn tokens → progress → parent report. Open with one sentence on the problem; end on the parent report.

---

## 10. Open decisions

1. **Target age range.** The team brief says 5–15; an alternative is 13–17. The persona (14) fits both. Decide before writing the 2-pager.
2. **Tagline.** "AI companion" may raise concerns given the evidence on teens and AI companions. Alternatives: *grow up with AI, not by it* · *your AI, on a learner's licence*.
3. **Token pricing.** Heavy tasks cost the most, which is exactly when a child under pressure is most tempted to switch to another AI. Consider a flat cost, or a weekly number of free heavy-task skips.
4. **Level names.** Placeholders: Rookie → Explorer → Achiever → Pro → Master.
5. **"Me, not my model"** (recommended addition). Let the child see and correct what their agent believes about them (*"not a science person": True / Outdated / Don't assume this*). It directly covers the "knows them better than they know themselves" half of the prompt, which the current version addresses only through Feelings.
