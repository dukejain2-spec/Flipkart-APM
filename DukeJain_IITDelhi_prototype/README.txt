Bud-e: grow with AI, not by AI (prototype)

Open index.html for Bud-e (the child's device) and parent.html for Bud-e Parent. No internet needed.

HOW TO OPEN
Double-click index.html. It works in current Chrome, Edge, Safari and Firefox.
No server, installation or internet. Laptop-first; it also works at phone width.
Bud-e Parent is a separate page: open parent.html in a second tab. The two pages share what is
saved in this browser, so set up the device in Bud-e first; its Bud-e Parent code is saved then.
Opened straight from the folder, use Chrome or Edge for the two pages to share it.

WHAT IT IS
Bud-e sits between a child and their personal AI agent. Chores happen instantly.
For everything else it compares the child's rating in that skill (0-1000) with the
task's weight, and the gap decides how much the agent does:
  gap <= -200 Pro (does it) | -200..0 Confident (quick check) |
  0..+200 Practising (hints) | > +200 Learner (step by step).
Ratings update after each task (Elo, K = 40). The child sees level names, never numbers.

TWO APPS, TWO PAGES
 Bud-e         index.html, the child's device. The parent sets it up once, on that device.
               It has no way into Bud-e Parent.
 Bud-e Parent  parent.html, the parent's phone. Log in with the code shown at the end of setup.
               Permissions can only be changed here, never on the child's device.
 With both open, a change in Bud-e Parent (a permission, blocking other AI agents) reaches Bud-e straight
 away, and the report keeps up with what the child does.

THE DEMO PATH (2-3 minutes)
Start: "Set up Aarav's device". The "Jump to a screen" list on the start screen goes to any screen.
 S1-S3  Child details (pick every AI agent he uses: one or several), permissions (consent is required;
        locked to Bud-e Parent; "Install extension" adds the Bud-e browser extension that monitors other AI
        agents), the Bud-e Parent code.
 S4     "I'm Aarav": the logo animation, then home.
 S5     Home: start typing and pick one of the five pre-fed prompts from the drop-down
        (for now only those work). Then press Send, or Faster response, which shows
        the tokens left underneath. Faster response is offered only here, when sending.
 S6     solve 2x + 7 = 10                 Confident: New skill unlocked, one quick check, then his. Solved on
                                          his own, he levels up Explorer -> Achiever with an animation.
 S7     a stone dropped from 20 m         Learner (Physics, Explorer): taught step by step, he does each step
 S8     mail my class teacher             Pro (Emails, Achiever): written for him; "Make it shorter", "Send it";
                                          his rating doesn't move
 S9     buy a calculator for my exam      Practising (Spending): he picks from three; the wallet shows only here
 S10    I feel low today                  support, then real people first
 S11    Tokens (nav)                      balance, challenges to earn (e.g. headphones -> +40), history
 S12    Wallet (nav)                      pocket money left, orders
 S13    My skills                         levels, next steps, "What my parents see"

LAKSH (laksh.html): the same prompts at higher levels
 A second child with his own page and saved data, already set up (Laksh, 15, Class 10; agent: Gemini).
 Algebra and Physics Pro, Writing / Spending / Messages Master. Chats sit in the left sidebar, as on Aarav's page.
 solve 2x + 7 = 10        no new-skill pop-up: the answer straight away
 stone dropped from 20 m  the answer and the working, straight away
 buy a calculator         one pick (scientific, Rs 650) with Order; "See other options" shows the rest
 Compare with Aarav: his calculator options end with a wallet note (he has spent Rs 900 of Rs 2,000 this
 month), and he is taught the physics problem step by step.

BUD-E PARENT (parent.html)
 P1     Code login                        the code from S3 (the login screen shows it in this prototype)
 P2     Weekly report                     faster-response tokens, did it himself (x of y), AI reliance
                                          vs expected, six-week growth charts, one suggestion. Never chats.
 P3     Extension report                  other AI agents the extension noticed, with uses; block or
                                          unblock each one
 P4     Permissions                       turn permissions on or off for Aarav's device; install the
                                          extension, or pause its monitoring

RIGHT AND WRONG ANSWERS
 Algebra   Level up: he starts just below Achiever (420). Solving it on his own (+11 -> 431) plays the
           level-up animation: Explorer -> Achiever. With a hint it's 411, still Explorer.
 Algebra   Wrong first move (divide by 2 / add 7) -> hint, try again; wrong twice -> the step
           is shown. Same for 2x = 3 (x = 6 / x = 1). Rating result: 1 on your own,
           0.5 with hints, 0 if a step was shown.
 Science   Wrong equation (v = u + at / speed = distance / time) -> hint, try again; wrong twice -> the
           step is shown. Same for t² = 4 and t = 2 s. Physics 330: 362 on his own, 342 with a hint,
           322 if a step was shown.
 Mail      Pro: no wrong turn; "Make it shorter" gives a shorter mail. Below Pro he writes it himself
           and the agent adds a subject line.
 Calculator "No idea, you pick" -> nudged to choose; the programmable one (not allowed in exams) or
           the one arriving Tuesday (after Monday's exam) -> warned, pick another or buy anyway.
           Spending 300: 328 for his own good pick, 308 after a warning or a nudge. Wallet Rs 1,100 -> 450.
 Correct answers never pay tokens. Tokens come from the weekly 500 and from challenges.
 Faster response (next to Send, when sending) works for algebra (10), science, the mail and the
 calculator (50 each). The feelings prompt can't use it.

NOTES
- Every agent reply is scripted. No AI calls, no network requests.
- Everything is saved in this browser. Reset from Bud-e's profile menu or start screen; a reset or a
  new setup makes a new code, which logs Bud-e Parent out.
- Anything off the demo path shows "Not part of this prototype."
- The Bud-e mark is alive: its eyes follow the mouse, and it giggles when clicked.
- Product photos are bundled in assets/img (freely licensed, from Openverse); credits in assets/img/CREDITS.txt.
- Persona: Aarav, 14, Class 9, Pune. Maths exam on Monday; class teacher Ms Kulkarni.
