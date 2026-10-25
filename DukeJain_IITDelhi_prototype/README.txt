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
 S1-S3  Child details, permissions (consent is required; locked to Bud-e Parent), the Bud-e Parent code.
 S4     "I'm Aarav": the logo animation, then home.
 S5     Home: start typing and pick one of the five pre-fed prompts from the drop-down
        (for now only those work). Then press Send, or Faster response, which shows
        the tokens left underneath. Faster response is offered only here, when sending.
 S6     book a cab to Riya's at 5         chore: instant, no tokens
 S7     solve 2x + 7 = 10                 New skill unlocked: "Yes, let's go", or "No, I'm not new to this skill"
                                          for three quick questions, then "Let's begin": the skill flies into
                                          My skills. Then two steps.
 S8     reply to Riya                     he writes the apology; "Sent, in your words"
 S9     gift for Riya under Rs 800        options with wallet impact; the wallet shows in the chat only here
 S10    I feel low today                  support, then real people first
 S11    Tokens (nav)                      balance, challenges to earn (e.g. headphones -> +40), history
 S12    Wallet (nav)                      pocket money left, orders
 S13    My skills                         levels, next steps, "What my parents see"

LAKSH (laksh.html): the same prompts at higher levels
 A second child with his own page and saved data, already set up (Laksh, 15, Class 10; agent: Gemini).
 Algebra Pro, Writing / Spending / Messages Master. Chats sit in the left sidebar, as on Aarav's page.
 solve 2x + 7 = 10        no new-skill pop-up: the answer straight away
 gift for Riya            one pick (sketchbook and pencil set, Rs 450) with Order; "See other options" shows the rest
 reply to Riya            one question on tone, then two ready replies to choose from; it's sent, Riya replies
 Compare with Aarav: his gift options end with a wallet note (he has spent Rs 900 of Rs 2,000 this month),
 and he writes his own apology.

BUD-E PARENT (parent.html)
 P1     Code login                        the code from S3 (the login screen shows it in this prototype)
 P2     Weekly report                     faster-response tokens, did it himself (x of y), AI reliance
                                          vs expected, six-week growth charts, one suggestion. Never chats.
 P3     Extension report                  other AI agents the extension noticed, with uses; block or
                                          unblock each one
 P4     Permissions                       turn permissions on or off for Aarav's device

RIGHT AND WRONG ANSWERS
 Algebra   Wrong first move (divide by 2 / add 7) -> hint, try again; wrong twice -> the step
           is shown. Same for 2x = 3 (x = 6 / x = 1). Rating result: 1 on your own,
           0.5 with hints, 0 if a step was shown.
 Apology   "Nothing, she's overreacting" -> pushed back (or leave it, nothing sent);
           a "sorry, but" draft -> rewrite; "write it for me" -> refused, he writes it.
 Gift      "No idea, you pick" -> nudged to choose; an option arriving after her birthday
           -> warned, pick another or order anyway.
 Correct answers never pay tokens. Tokens come from the weekly 500 and from challenges.
 Faster response (next to Send, when sending) works for algebra (10) and gift (50).
 Chores go through free; the apology and feelings prompts can't use it.

NOTES
- Every agent reply is scripted. No AI calls, no network requests.
- Everything is saved in this browser. Reset from Bud-e's profile menu or start screen; a reset or a
  new setup makes a new code, which logs Bud-e Parent out.
- Anything off the demo path shows "Not part of this prototype."
- The Bud-e mark is alive: its eyes follow the mouse, and it giggles when clicked.
- Product photos are bundled in assets/img (freely licensed, from Openverse); credits in assets/img/CREDITS.txt.
- Persona: Aarav, 14, Class 9, Pune. Friend: Riya.
