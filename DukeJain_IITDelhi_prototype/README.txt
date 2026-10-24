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

TWO APPS
 Bud-e         the child's device. The parent sets it up once, on that device.
 Bud-e Parent  the parent's phone. Log in with the code shown at the end of setup.
               Permissions can only be changed here, never on the child's device.

THE DEMO PATH (2-3 minutes)
Start: "Set up Aarav's device". The "Jump to a screen" list on the start screen goes to any screen.
 S1-S3  Child details, permissions (consent is required; locked to Bud-e Parent), the Bud-e Parent code.
 S4     "I'm Aarav": the logo animation, then home.
 S5     Home: start typing and pick one of the pre-fed prompts from the drop-down
        (for now only those work). Then press Send, or Faster response, which shows
        the tokens left underneath. Faster response is offered only here, when sending.
 S6     book a cab to Riya's at 5         chore: instant, no tokens
 S7     solve 2x + 7 = 10                 New skill unlocked: "Yes, let's go", or "No, I'm not new to this skill"
                                          for three quick questions, then "Let's begin": the skill flies into My skills
 S8     solve x³ + 2x + 1 = 3             Learner mode; or send it with Faster response (100 tokens)
 S9     reply to Riya                     he writes the apology; "Sent, in your words"
 S10    gift for Riya under Rs 800        three options with wallet impact, no sponsored options
 S11    I feel low today                  support, then real people first
 S12    Earn tokens                       e.g. compare 3 headphones -> +40 tokens
 S13    My skills                         levels, next steps, token history, "What my parents see"
 S14    Bud-e Parent: code login          the code from S3 (the login screen shows it in this prototype)
 S15    Weekly report                     progress, never chats
 S16    Permissions                       turn permissions on or off for Aarav's device

NOTES
- Every agent reply is scripted. No AI calls, no network requests.
- Everything is saved in this browser. Reset from the profile menu or the start screen.
- Anything off the demo path shows "Not part of this prototype."
- The Bud-e mark is alive: its eyes follow the mouse, and it giggles when clicked.
- Persona: Aarav, 14, Class 9, Pune. Friend: Riya.
