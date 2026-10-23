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
 S5     Home: tap the suggestion chips, or type. Options appear as chips.
 S6     book a cab to Riya's at 5         chore: instant, no tokens
 S7     solve 2x + 7 = 10                 New skill unlocked pop-up (try "No, I'm not new to this" too)
 S8     solve x^3 + 2x + 1 = 3            Learner mode; tap "Faster response" (100 tokens)
 S9     reply to Riya                     he writes the apology; "Sent, in your words"
 S10    gift for Riya under Rs 800        three options with wallet impact, no sponsored options
 S11    I feel low today                  support, then real people first
 S12    Earn tokens                       e.g. compare 3 headphones -> +40 tokens
 S13    My progress                       levels, next steps, token history, "What my parents see"
 S14    Profile menu -> Switch to parent  weekly report, never chats

BEHIND THE SCENES
The "Behind the scenes" switch (or press B) shows under each reply:
child rating, task weight, gap and mode, the pipeline, and each rating update.

NOTES
- Every agent reply is scripted. No AI calls, no network requests.
- Everything is saved in this browser. Reset from the profile menu or the start screen.
- Anything off the demo path shows "Not part of this prototype."
- Persona: Aarav, 14, Class 9, Pune. Friend: Riya.
