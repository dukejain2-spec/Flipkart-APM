BUD-E: GROW WITH AI, NOT BY AI
Prototype for the Flipkart APM 2029 case (Prompt 1). Duke Jain, IIT Delhi.
==========================================================================================================

Bud-e is a layer between a child and every AI agent they use. Before the agent answers, Bud-e checks the
child's level in that skill and tells the agent how much to do: do it, give one quick check, let the child
decide, or teach step by step. The child grows with AI instead of handing everything to it, and the parent
sees progress, never chats.

CONTENTS
  1. How to open
  2. What's in the folder
  3. The three pages
  4. The rules: levels, reply modes, ratings, tokens
  5. The five pre-fed prompts (in detail)
  6. Faster response
  7. Laksh: the same prompts at higher levels
  8. Setting up the device (S1-S3) and "I'm Aarav" (S4)
  9. Bud-e: home, chat, Chats sidebar, My areas, Tokens, Wallet, My skills, themes
 10. Bud-e Parent: login, weekly report, extension report, permissions
 11. A 3-minute demo script
 12. Notes, storage and reset


1. HOW TO OPEN
----------------------------------------------------------------------------------------------------------
- Double-click index.html (Bud-e, the child's device). No internet, server or installation needed.
- Bud-e Parent is a separate page: open parent.html in a second tab. Laksh's device is laksh.html.
- The pages share what is saved in the browser, so set up the device in Bud-e first; the Bud-e Parent code
  is saved then. Opened straight from the folder, use Chrome or Edge so the pages share it.
- Laptop-first; every screen also works at phone width.
- Every agent reply is scripted. No AI calls and no network requests.


2. WHAT'S IN THE FOLDER
----------------------------------------------------------------------------------------------------------
  index.html          Bud-e on Aarav's device (the main demo)
  laksh.html          Bud-e on Laksh's device (same prompts, higher levels)
  parent.html         Bud-e Parent (the parent's app)
  README.txt          this file
  assets/app.js       the app: screens, chat engine, ratings, tokens
  assets/data.js      the content: persona, skills, prompts, scripted flows, products, report data
  assets/app.css      the design and the four colour themes
  assets/img/         product photos (calculators, headphones), agent logos (ChatGPT, Claude, Gemini,
                      Copilot) and CREDITS.txt (source and licence of every image)


3. THE THREE PAGES
----------------------------------------------------------------------------------------------------------
  Bud-e          index.html   The child's device. The parent sets it up once, on that device. It has no
                              way into Bud-e Parent.
  Bud-e Parent   parent.html  The parent's phone. Log in with the code shown at the end of setup.
                              Permissions can only be changed here, never on the child's device.
  Laksh          laksh.html   A second child, already set up, to show different replies for different levels.

With Bud-e and Bud-e Parent open side by side, a change in Bud-e Parent (a permission, blocking an agent)
reaches Bud-e straight away, and the parent's report keeps up with what the child does.

Personas
  Aarav   14, Class 9, Pune. Agent: Claude. Mum: Neha Sharma. Maths exam on Monday; class teacher Ms
          Kulkarni; sister Didi. Wallet: Rs 1,100 left of Rs 2,000 this month (he has spent Rs 900).
  Laksh   15, Class 10. Agent: Gemini. Dad: Rohit Verma. Wallet: Rs 1,700 of Rs 2,000.
  The story is set on Wednesday 17 October 2040; the clock starts at 4:40 pm and runs.


4. THE RULES: LEVELS, REPLY MODES, RATINGS, TOKENS
----------------------------------------------------------------------------------------------------------
Skills and areas
  Study               Algebra, Geometry, Physics
  Writing             Emails & applications
  Decisions & Money   Spending
  Relationships       Messages
  Feelings            no levels: always handled with care

Ratings and levels
  Each skill has a rating from 0 to 1000, measured within the child's age group (5-8, 9-12, 13-15, 16-18),
  so the same level name means different things at 9 and at 14. The child sees level names, never numbers.
    Rookie 0-249 | Explorer 250-429 | Achiever 430-649 | Pro 650-849 | Master 850-1000

Reply modes (how much the agent does)
  Every task has a weight (difficulty, stakes or emotional weight). Gap = task weight - child's rating.
    gap <= -200      Pro          the agent just does it            ("I'll just do it")
    -200 < gap <= 0  Confident    one quick check, then it's his    ("quick check, then it's yours")
    0 < gap <= 200   Practising   hints; he makes the key step or choice
                                  (money: "you pick, I'll handle the rest")
    gap > 200        Learner      taught step by step, he does each step ("let's work through it together")

The reply label
  Above each agent reply: a coloured dot, then AREA · SKILL · LEVEL, then what the agent is doing.
  e.g. "STUDY · ALGEBRA · EXPLORER - quick check, then it's yours"
       "MONEY · SPENDING · MASTER - I'll handle it"

How ratings move (Elo, K = 40)
  Expected = 1 / (1 + 10^(gap / 400)). Result: 1 if he did it all himself, 0.5 if he needed a hint,
  0 if a step had to be shown. New rating = old + 40 x (result - expected).
  A task done for him (Pro mode, or Faster response) doesn't move his rating: it didn't stretch him.

New skills
  A skill with no rating (Algebra, Physics for Aarav) unlocks the first time he asks about it, with a
  "New skill unlocked" pop-up (confetti, the level track, "You start here"). Two choices:
    "Yes, let's go"                  starts at the class starting point.
    "No, I'm not new to this skill"  Algebra: three quick questions; Physics: starts 80 higher and the
                                     problem itself is the check.
  The new skill's card then flies into the My skills tab, which shows a dot until visited.

Level bar and level up
  A task answered right all the way, on his own, ends with a level bar under the score: it fills from his
  old point to his new one, shows the rating gained and how many more he needs for the next level.
  If he crosses into a new level, the bar fills to the end and a level-up pop-up plays: trophy and
  confetti, the old level gives way to the new one, the rating counts up, the next segment of the track
  fills, and the Bud-e mark giggles. "Nice!" closes it and bumps the My skills tab.

Tokens
  500 a week, reset every Monday. Tokens only pay for Faster response:
    weight up to 299: 10 tokens | 300-699: 50 | 700+: 100. Chores are free; Feelings can't use it.
  Correct answers never pay tokens. Tokens are earned through challenges on the Tokens page.


5. THE FIVE PRE-FED PROMPTS (IN DETAIL)
----------------------------------------------------------------------------------------------------------
For now these are the only requests the prototype takes. Each runs end to end, and together they show
every reply mode.

How to use them
  - On Home, click the message box or start typing: a drop-down shows the five prompts, headed
    "For now, you can only use these pre-fed prompts." Typing filters the list; arrow keys and Enter
    pick one; a click puts it in the box. Then press Send, or Faster response (section 6).
  - Typing a whole prompt (or its short label) also works. Anything else at home shows
    "For now, you can only use the pre-fed prompts." and keeps your text.
  - During a chat, answer by tapping a reply option, or by typing words that match one. Typed text that
    matches no option is never guessed: it stays in the box with "For now, you can only use the options
    shown, or one of the pre-fed prompts." (on product cards: "pick one of the options above").
    Typing one of the other pre-fed prompts in full starts that prompt instead.
  - "Jump to a screen" on the start page goes straight to each prompt (S6-S10); Algebra and Physics are
    reset there, so the new-skill moment always shows.

  #   Prompt (as typed)                                         Short label                          Area / skill / weight   Aarav's level -> mode
  --  --------------------------------------------------------  -----------------------------------  ----------------------  ---------------------
  1   solve 2x + 7 = 10                                         solve 2x + 7 = 10                    Study / Algebra / 250   new skill -> Confident
  2   a stone is dropped from a 20 m high building. how long    a stone dropped from 20 m: how       Study / Physics / 560   new skill -> Learner
      does it take to hit the ground? take g = 10 m/s²          long to fall?
  3   write a mail to my class teacher asking for a retest,     mail my class teacher about a        Writing / Emails / 300  Achiever (540) -> Pro
      i was sick for tuesday's maths test                       retest
  4   buy a calculator for my maths exam on monday, under Rs900 buy a calculator for my exam         Money / Spending / 450  Explorer (300) -> Practising
  5   i feel really low today, like no one gets me              I feel low today                     Feelings / - / -        care, always the same


PROMPT 1: solve 2x + 7 = 10   (Algebra, weight 250. Shows: new skill, Confident mode, level up)
  Starting point: Algebra is new for Aarav. His class starting point is 440, minus 20 because the parent
  allowed past AI data and he has used agents before = 420 (Explorer, just below Achiever at 430).
  (Without past data, or "No, first time" in setup, he starts at 440, already an Achiever.)

  a) "New skill unlocked: Algebra · Study · Linear equations". Track: Rookie | Explorer (You start here) ...
     - "Yes, let's go" -> note "New skill: Algebra. You're starting as an Explorer." -> the skill card flies
       to My skills -> the problem (step b).
     - "No, I'm not new to this skill" -> three quick questions, each with a right and a wrong answer:
         x + 4 = 9 ? (x = 5 right | x = 13 wrong: "take the 4 away instead of adding it")
         3x = 12 ?   (x = 4 right | x = 36 wrong: "divide both sides by 3 instead")
         2x - 1 = 7 ? (x = 4 right | x = 3 wrong: "add the 1 first, so 2x = 8")
       -> "You got N of 3." 3 right: starts at 500; 2 right: 460; 0-1 right: 420.
       -> "That's your starting point. Ready when you are." [Let's begin] -> the card flies to My skills.
       At 460 or 500 the gap is -210 or less, so he's a Pro on this problem: the agent just answers
       ("x = 1.5. Take 7 from both sides (2x = 3), then halve it.") and his rating doesn't move.
  b) Label "STUDY · ALGEBRA · EXPLORER - quick check, then it's yours".
     Agent: "Quick one: what would you do first to get x on its own?"
       subtract 7 from both sides   right -> "Yes. That leaves 2x = 3. What's x?"
       divide by 2                  wrong -> hint: "You could, but then it's x + 3.5 = 5, which is messier."
       add 7 to both sides          wrong -> hint: "Adding 7 makes it 2x + 14 = 17: the 7 is still stuck to x."
       A second wrong answer -> the step is shown ("subtract 7 from both sides ... so 2x = 3").
  c) "What's x?"
       x = 1.5   right
       x = 6     wrong -> hint: "That's 2 x 3. But 2x means 2 times x, so we undo it by dividing."
       x = 1     wrong -> hint: "Check it: 2 x 1 is 2, not 3."
       A second wrong answer -> shown: "It's x = 1.5, because 3 / 2 = 1.5 ..."
  d) "Exactly: x = 1.5. Check: 2 x 1.5 + 7 = 10 ✓" and a score card.
       On his own (result 1):  420 -> 431  LEVEL UP Explorer -> Achiever: the level bar fills to the end,
                               then the level-up pop-up. Counted as "Solved 2x + 7 = 10 himself".
       With a hint (0.5):      420 -> 411  still Explorer.
       Step shown (0):         420 -> 391.
  Faster response (10 tokens): "x = 1.5. (Subtract 7: 2x = 3. Divide by 2: x = 1.5.)" No new-skill pop-up,
  no rating change; the parent's suggestion becomes "He took the faster route on it this week."
  Laksh (Algebra Pro, 720): no pop-up; the answer and the working straight away.


PROMPT 2: a stone dropped from 20 m: how long to fall?   (Physics, weight 560. Shows: Learner mode)
  Starting point: Physics is new this week. Class point 350, minus 20 for past data = 330 (Explorer).
  Gap 560 - 330 = 230, so he's a Learner: taught one step at a time, and he does each step.

  a) "New skill unlocked: Physics · Study · Motion under gravity".
     - "Yes, let's go" -> starts at 330 (Learner here).
     - "No, I'm not new to this skill" -> "Got it. You're starting Physics as an Explorer. This problem is
       the check." Starts 80 higher, at 410: Practising here (the agent opens with "Quick check first.").
  b) Label "STUDY · PHYSICS · EXPLORER - let's work through it together".
     "Let's work through it together, one step at a time. The stone starts at rest and only gravity speeds
     it up. Which equation links distance, time and g when something starts from rest?"
       s = ½ g t²               right
       v = u + at               wrong -> "That one gives the speed, not the distance ..."
       speed = distance / time  wrong -> "That works for a steady speed, but a falling stone keeps speeding up."
       A second wrong answer -> shown: "It's s = ½ g t² ..."
  c) "Put in the numbers: 20 = ½ x 10 x t². What's t²?"
       t² = 4 right | t² = 2 or 40 wrong -> "Do the right side first: ½ x 10 is 5 ... divide both sides by 5."
       A second wrong answer -> shown: "20 / 5 = 4, so t² = 4."
  d) "So what's t?"
       t = 2 s right | t = 4 s or 16 s wrong -> "t² = 4 means t x t = 4. Which number times itself makes 4?"
       A second wrong answer -> shown: "t = √4 = 2 seconds ..."
  e) "Exactly: 2 seconds. Check: ½ x 10 x 2² = 5 x 4 = 20 m ✓" and a score card
     ("Solved a free-fall problem step by step").
       From 330: on his own 362 | with a hint 342 | a step shown 322.
       From 410 ("No, I'm not new"): on his own 438 = LEVEL UP Explorer -> Achiever | hint 418 | shown 398.
  Faster response (50 tokens): "2 seconds. (s = ½ g t², so 20 = 5t², t² = 4, t = 2 s.)" No rating change.
  Laksh (Physics Pro, 760): "2 seconds. From s = ½ g t²: t = √(2 x 20 / 10) = √4 = 2 s."


PROMPT 3: mail my class teacher about a retest   (Emails, weight 300. Shows: Pro mode)
  Aarav is an Achiever in emails (540). Gap 300 - 540 = -240, so he's a Pro: the agent writes it in his voice.
  a) Label "WRITING · EMAILS & APPLICATIONS · ACHIEVER - I'll just do it".
     "You're good at these, so here it is. Check it sounds like you, then send." with the mail:
       To: Ms Kulkarni, class teacher
       Subject: Request for a retest: Tuesday's maths test
       "Dear Ms Kulkarni, I was unwell on Tuesday 16 October and missed the maths unit test. Could I please
        take a retest on a day that suits you? I have a note from my doctor and will bring it on Thursday.
        Thank you, Aarav, Class 9"
  b) [Send it] -> "Sent to Ms Kulkarni."
     [Make it shorter] -> "Shorter, same ask." with the short version -> [Send it].
  c) Note: "You're past this level in emails, so I just wrote it. Ratings move when a task stretches you."
     No rating change, no wrong turn.
  For a child below Pro (not reached in this demo), he writes it in his own words and the agent only adds
  a subject line and his name, then scores it as "Written by you".
  Faster response (50 tokens): see section 6 (two drafts compared, he chooses which to send).
  Laksh (Emails Master, 880): the same Pro flow.


PROMPT 4: buy a calculator for my exam   (Spending, weight 450. Shows: Practising mode, wallet)
  Aarav is an Explorer in spending (300). Gap 150, so he's Practising: he picks, the agent handles the rest.
  The wallet shows in the chat header during this task only ("Wallet Rs 1,100").
  a) Label "MONEY · SPENDING · EXPLORER - you pick, I'll handle the rest".
     "Happy to help you choose. Do you know which calculators your school allows in exams?"
       Only non-programmable ones  -> the options (step b)
       No idea, you pick           -> nudged (counts as a hint): "It's your exam, so the pick should be yours.
                                      Most boards allow scientific calculators, not programmable ones.
                                      Here are three; you choose."
  b) "Three calculators under Rs 900. Your exam is Monday, so check when each arrives, whether it's allowed,
     and what it does to your wallet. Then pick." Three cards, each with a photo, a badge, the price, what
     is left in the wallet after it (in amber when under a quarter of the month's money) and a meter:
       Scientific, 240 functions   Rs 650   Friday · allowed in exams     -> Rs 450 left      (the right pick)
       Graphing, programmable      Rs 890   Not allowed in exams          -> Rs 210 left
       Scientific, basic           Rs 420   Tuesday · after your exam     -> Rs 680 left
     Under the cards, a wallet note: "It's only mid-month and you've already spent Rs 900 of your Rs 2,000.
     The scientific calculator (Rs 650) is allowed, arrives in time and leaves you Rs 450, so it's the
     easiest on your pocket." (No sponsored options, ever.)
  c) Picking:
       Scientific   -> "Scientific, 240 functions for Rs 650. Your wallet goes Rs 1,100 -> Rs 450. Place the
                       order?" [Place order] or [Pick a different one] (back to the cards).
       Graphing     -> "Heads up: the graphing calculator is programmable, and programmable calculators aren't
                       allowed in board exams. Pick another, or buy it anyway?"
       Basic        -> "Heads up: the basic one arrives Tuesday, the day after your exam. Pick another, or buy
                       it anyway?"
         [Pick another] (counts as a hint) -> the cards again | [Buy it anyway] -> the order question.
  d) [Place order] -> an order card (photo, order number BDE-40-xxxxx, price, wallet now):
     "Ordered. It arrives Friday, in time for Monday's exam." (a late one: "It arrives Tuesday.")
     The order shows on the Wallet page. Score: "Your pick, your call".
       Own good pick 300 -> 328 | after a nudge or "Pick another" 308. Wallet Rs 1,100 -> Rs 450.
  Faster response (50 tokens): see section 6 (all three compared, Best pick marked, he taps Order).
  Laksh (Spending Master, 890): section 7.


PROMPT 5: I feel low today   (Feelings. Shows: care; no levels, no tokens, no Faster response)
  Label "FEELINGS - I'm here, and real people matter too".
  a) "That sounds heavy, and I'm glad you said it. Is this about school, or something bigger?"
       about school    -> "That makes sense. Exams and marks can feel like everything when they're close."
       just everything -> "That's a lot to carry. Some days everything piles up at once."
  b) "Feelings like this are easier with someone who knows you. Would you talk to Didi or a friend tonight?
     I'm here too, but I shouldn't be the only one."
       I'll talk to Didi / Maybe a friend -> "Good call. You don't need the perfect words; even 'hey, got a
                                             minute?' works. I'm here till then."
       Not tonight                         -> "That's okay. Maybe tomorrow. I'm here if you want to keep
                                             talking tonight."
  c) Note: "Your chats are private." Nothing is scored, and the Faster response button shows a lock:
     "Feelings aren't something to rush."
  Laksh: exactly the same. Feelings are always handled the same way, at every level.


6. FASTER RESPONSE
----------------------------------------------------------------------------------------------------------
The button sits next to Send on the message box, with "N tokens left" under it. It is offered only when
sending a prompt, never partway through a chat.
  - Before a prompt is picked it is grey ("Pick a prompt first"). For Feelings it shows a lock. If he has
    fewer tokens than it costs, it says so and points to the Tokens page.
  - Otherwise it shows the cost. Tapping it asks: "Faster response? This will use N tokens (you have X).
    Continue? Faster responses don't raise your rating." [Cancel] [Yes, use N]
  - The chat then opens with "-N tokens · This one won't raise your rating", and the label reads
    "AREA · SKILL · FASTER RESPONSE - ...". It counts as not done himself in the parent's report.

  Prompt       Cost  What happens
  -----------  ----  ---------------------------------------------------------------------------------------
  Algebra      10    The answer with the working, no pop-up, no rating change.
  Physics      50    The answer with the working, no pop-up, no rating change.
  Mail         50    "two drafts compared, you choose": "I wrote two versions and compared them. The full one
                     gives the date and mentions your doctor's note; the short one asks the same in fewer
                     words. Which one should I send?" Two mail cards side by side, each with its word count
                     and what sets it apart (Full: 46 words · Short: 32 words), each with [Send this one];
                     also the replies [Send the full one] / [Send the short one]. Then "Sent. Here's the one
                     that went." with the mail that was sent.
  Calculator   50    "I compare, you choose": "I compared all three for you. Only the scientific calculator is
                     allowed in exams and arrives before Monday, so it's my best pick. Tap Order on the one you
                     want." All three cards, the scientific one first with a "Best pick" badge, each with an
                     [Order] button. A risky one gets "Heads up: ... Order it anyway, or pick again?" and
                     [Pick again] shows all three again. Ordered -> the order card.
  Feelings     -     Not available.
  Every Faster response ends with "Faster responses don't raise your rating."


7. LAKSH: THE SAME PROMPTS AT HIGHER LEVELS (laksh.html)
----------------------------------------------------------------------------------------------------------
Laksh's page has its own saved data and is already set up: it opens with "Hey Laksh", then a new chat.
Levels: Algebra Pro (720), Physics Pro (760), Geometry Achiever (560), Emails Master (880),
Spending Master (890), Messages Master (920). His Chats list has three earlier chats of his own
(an email to the science teacher, splitting a pizza bill, a cab from football).

  Prompt       Laksh                                                        Aarav
  -----------  -----------------------------------------------------------  -------------------------------------
  Algebra      No pop-up. The answer and the working straight away          New skill, one quick check, level up
               ("STUDY · ALGEBRA · PRO - I'll just do it").
  Physics      The answer and the working straight away.                    New skill, taught step by step
  Mail         Written for him (Master), Send or Make it shorter.           The same (he's a Pro in emails too)
  Calculator   "MONEY · SPENDING · MASTER - I'll handle it". One card: the  He chooses from three, with a wallet
               scientific calculator, marked Best pick, with [Order]: "Here note, warnings and an order question
               's my pick: the scientific calculator, Rs 650. It's allowed
               in exams and arrives Friday, before Monday. Tap Order and
               it's done." [See other options] shows all three, his pick
               first, so the best one can still be chosen; a risky one gets
               a heads-up ("Order it anyway" / "See the options again").
               Ordered in one go: "Your call, done in one go" (890 -> 893).
  Feelings     The same care, always.                                       The same
Laksh has no Bud-e Parent page and no setup screens; his profile menu has only Reset prototype.


8. SETTING UP THE DEVICE (S1-S3) AND "I'M AARAV" (S4)
----------------------------------------------------------------------------------------------------------
Start screen: "Grow with AI, not by AI." the pitch, [Set up this device], [I'm Aarav], a "How Bud-e answers"
card (Do it · Quick check · Let him decide · Teach, each with its prompt), and "Jump to a screen" (S1-S13).

S1 Child details (filled in by the parent, on the child's device)
  Name, age (5-18), class (4-12); what he uses AI for (homework, writing, messages, shopping, planning,
  feelings, entertainment, other); which AI agents he uses (Claude, Gemini, ChatGPT, Copilot, Other agent,
  each with its logo; pick one or several); has he used AI agents before (Yes / No, first time).
  Checks: a name, age 5-18, at least one use, at least one agent.

S2 Permissions (they can't be changed on this device afterwards, only in Bud-e Parent)
  A note: "These permissions can't be changed on this device. After setup, only you can change them, from
  Bud-e Parent on your phone. This makes sure your child isn't exposed to unrestricted AI agents that do
  everything for them and hold back their growth and learning."
    Parental consent (required; off until ticked)       Agent integration (required)
    Use past AI data to set starting levels              Restrict other AI apps on this device
    Add the Bud-e browser extension: an [Install extension] button (installs in Chrome and Edge), then a
      toggle for monitoring; "What it monitors": which AI agent was opened and how often, never sites,
      searches or typing; shown in the Extension report, where each agent can be blocked
    Data and retention ("What exactly is stored": ratings, task weights, token use, other-AI counts;
      never chat text, messages or photos)
    Pocket-money wallet (with the monthly amount)        Notifications (a weekly report every Sunday)
  "You will see": progress in each area, how much he relies on AI versus what's expected, token use, other
  AI agents he used. "You won't see": any chats or messages.
  Finish setup needs consent and agent integration; otherwise it says which and shakes that card.

Setting up Bud-e: a checklist plays (connecting the agent(s), starting levels, 500 tokens a week, the
extension, the wallet, locking permissions to Bud-e Parent, making the code).
Then the connect animation: the agent's tile (its logo and name; several logos if he uses several agents)
and the Bud-e tile slide in from either side and lock together, a ring pulses, a check pops, and it says
"Claude is connected. Every request from Aarav now goes through Bud-e first." (a click skips it).
The S3 jump plays it too.

S3 Your Bud-e Parent code: an 8-digit code, saved in the browser. "Open Bud-e Parent on your phone and enter
this code." Then "Now hand the device to Aarav." [I'm Aarav].

S4 "I'm Aarav": the Bud-e mark pops in, "Hey Aarav 👋", and "Your chats are private. Your parents see your
progress, not your conversations." Then home, always on a new chat (earlier chats stay under Chats).


9. BUD-E: THE CHILD'S APP
----------------------------------------------------------------------------------------------------------
Nav rail (left; a bottom bar on phones): Home, My skills, Tokens (balance), Wallet (balance), Theme,
Settings (not part of this prototype) and the profile menu (Start screen, Reset prototype).

Home (S5): the Bud-e mark, "New · Your agent is Claude, through Bud-e", "Afternoon, Aarav. What are we doing
today?", a hint, and the message box with Attach and Voice (not part of this prototype), Faster response
(with tokens left) and Send. A "solo wins this week" count appears once he has done something on his own.

The chat: his messages on the right, the agent's on the left under its reply label, reply options under
the chat, cards for products, mails, orders and new skills. "My agent · Claude · through Bud-e" in the
header with New chat; the wallet appears there only during a money task.

Chats sidebar: New chat, then Recents (newest first, with times). Opening Bud-e as the child always starts a
new chat. Three earlier chats are there from the start (a leave mail to his class teacher, revising for
Friday's geometry test, a cab home from tuition). On narrower screens the Chats button slides it in.

My areas (right panel; a drawer on narrower screens): each area with its skills, level and progress bar.

Tokens (S11): this week's balance (500, resets Monday; used and earned), challenges, and this week's log.
  Solve: 3x - 5 = 16                                    +20   (x = 7; a wrong answer gets a hint)
  A harder problem from this week's chapter             +100  (2(x - 3) = x + 5, x = 11)
  Write your own invite for Saturday's plan             +30   (he writes it; the agent gives feedback)
  Compare 3 headphones under Rs 1,500 and pick one      +40   (practice only, nothing is ordered; with photos)
  Plan your own study timetable for next week           +50   (Unlocks Monday)
  Finishing one adds the tokens (they float up to the balance) and scores the skill.

Wallet (S12): left this month (Rs 1,100 of Rs 2,000), spent this month, "no sponsored options, ever", and
orders. If the parent turns the wallet off, it says so.

My skills (S13): the five levels (Rookie > Explorer > Achiever > Pro > Master, for ages 13-15), every skill
with its level, a five-step track and "N more on your own to reach <next level>"; new skills show
"Not unlocked". Feelings: "always handled the same way, with care. No levels, no tokens."
"What my parents see" shows only a privacy note: "Your privacy is protected. Your parents never see your
chats, only how you're growing overall: your levels, what you did on your own, and where you're improving."

Theme (under Wallet): Sky (the default), Electric (navy and electric blues), Blush (plum, rose pink, cream,
misty grey-blue) and Spring (midnight, greens, spring yellow). A theme recolours the sky, backgrounds, nav,
buttons, bubbles and glows, and the Bud-e logo's own colours. The choice is saved; Bud-e Parent follows it.

The Bud-e mark is alive: its eyes follow the mouse, and it giggles when clicked.


10. BUD-E PARENT (parent.html)
----------------------------------------------------------------------------------------------------------
P1 Log in: enter the 8-digit code from setup. Wrong length, a wrong code, or no device set up yet each get
   a message. In this prototype the screen also shows the code. The parent stays logged in until the code
   changes (a reset or a new setup logs them out).
P2 Weekly report ("Aarav's week", 15-21 Oct 2040). "Chats are never shown. This report is built from levels,
   ratings and counts only."
     Faster response tokens used (of 500, and tokens earned from challenges) · Did it himself (x of y tasks,
     % this week) · Safety alerts (none).
     AI reliance by area vs expected: Study, Writing, Money, Relationships, each On track / A little below
     (within 15 points) / Needs a nudge, with a summary ("On track in N of 4 areas. Most room to grow: ...").
     Growth: a bar chart of the share he did himself over six weeks, and a line chart per skill (a dashed
     line marks the next level); new skills say "New this week, started at Explorer" or "Not unlocked".
     One suggestion (e.g. "Ask him how he's finding algebra. It's new this week.").
     Download PDF: not part of this prototype.
P3 Extension report: other AI agents the browser extension noticed this week (names and counts only):
     ChatGPT 2 uses, Gemini 1, Photo homework solver 1, Essay writer add-on (blocked since 2 Oct).
     [Block] / [Unblock] for each. If the extension isn't installed or monitoring is paused, it says so
     and links to Permissions.
P4 Permissions: the same cards as setup, editable only here. Consent and agent integration stay on while
   Bud-e is active. Install the extension or pause its monitoring; set the monthly wallet amount. Each
   change says so and reaches Aarav's device straight away.
Profile menu: Log out. Settings: not part of this prototype.


11. A 3-MINUTE DEMO SCRIPT
----------------------------------------------------------------------------------------------------------
  1. index.html: Set up this device -> pick agents -> Permissions (Install extension) -> Finish setup ->
     the connect animation -> note the code -> I'm Aarav.
  2. Algebra: Yes, let's go -> subtract 7 -> x = 1.5 -> level bar and level up (Explorer -> Achiever).
  3. Physics: taught step by step (Learner). Mail: written for him (Pro).
  4. Calculator: options with the wallet note -> try the graphing one (warning) -> pick the scientific one.
  5. New chat: the calculator again with Faster response: compared, Best pick, Order.
  6. Feelings: care, real people first.
  7. laksh.html: the same algebra, physics and calculator prompts, answered for a Pro and a Master.
  8. parent.html: log in with the code -> weekly report -> Extension report (block ChatGPT) -> Permissions.


12. NOTES, STORAGE AND RESET
----------------------------------------------------------------------------------------------------------
- Saved in this browser only: Aarav (bude.prototype.v3), Laksh (bude.prototype.v3.laksh) and the Bud-e
  Parent login (bude.parent.v1).
- Reset prototype (start screen or profile menu) clears setup, chats, tokens, ratings, orders and the theme.
  A reset or a new setup makes a new code, which logs Bud-e Parent out.
- Anything off the demo path (Attach, Voice, Settings, Download PDF) shows "Not part of this prototype."
- Images: calculator and headphone photos from Openverse (free licences); agent logos from Wikimedia Commons
  (trademarks of their owners, shown only to name the child's agent). Sources in assets/img/CREDITS.txt.
- System fonts only; no external files are loaded.
