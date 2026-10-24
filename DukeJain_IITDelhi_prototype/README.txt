Bud-e: your AI companion which protects you from AI (prototype)

Open index.html in any browser. No internet needed.

HOW TO OPEN
Double-click index.html. It works in current Chrome, Edge, Safari and Firefox.
No server, installation or internet. Laptop-first; it also works at phone width.

WHAT IT IS
Bud-e sits between a child and their personal AI agent. Chores happen instantly.
For everything else it compares the child's rating in that skill (0-1000) with the
task's weight, and the gap decides how much the agent does:
  gap <= -200 Pro (does it) | -200..0 Confident (quick check) |
  0..+200 Practising (hints) | > +200 Learner (step by step).
Ratings update after each task (Elo, K = 40). The child sees level names, never numbers.

THE DEMO PATH (2-3 minutes)
Start: "I'm a parent". The "Jump to a screen" list on the start screen goes to any screen.
 S1-S4  Sign up, child profile, permissions (consent is required), hand over to Aarav.
 S5     Home: five prompts, as chips or typed. Each one runs end to end.
 S6     book a cab to Riya's at 5         chore: instant, no tokens
 S7     solve 2x + 7 = 10                 New skill pop-up, then two steps
 S8     reply to Riya                     he writes the apology; "Sent, in your words"
 S9     gift for Riya under Rs 800        options with wallet impact; the wallet shows only here
 S10    I feel low today                  support, then real people first
 S11    Tokens (nav)                      balance, challenges to earn (e.g. headphones -> +40), history
 S12    Wallet (nav)                      pocket money left, orders
 S13    My progress                       levels, next steps, "What my parents see"
 S14    Profile menu -> Switch to parent  weekly report, never chats

RIGHT AND WRONG ANSWERS
 Algebra   Wrong first move (divide by 2 / add 7) -> hint, try again; wrong twice -> the step
           is shown. Same for 2x = 3 (x = 6 / x = 1). Rating result: 1 on your own,
           0.5 with hints, 0 if a step was shown.
 Apology   "Nothing, she's overreacting" -> pushed back (or leave it, nothing sent);
           a "sorry, but" draft -> rewrite; "write it for me" -> refused, he writes it.
 Gift      "No idea, you pick" -> nudged to choose; an option arriving after her birthday
           -> warned, pick another or order anyway.
 Correct answers never pay tokens. Tokens come from the weekly 500 and from challenges.
 Faster response (next to Send) works in algebra (10) and gift (50).

BEHIND THE SCENES
The "Behind the scenes" switch (or press B) shows under each reply:
child rating, task weight, gap and mode, the pipeline, and each rating update.

NOTES
- Every agent reply is scripted. No AI calls, no network requests.
- Everything is saved in this browser. Reset from the profile menu or the start screen.
- Anything off the demo path shows "Not part of this prototype."
- The Bud-e mark is alive: its eyes follow the mouse, and it giggles when clicked.
- Persona: Aarav, 14, Class 9, Pune. Friend: Riya.
