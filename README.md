# Flipkart APM 2029 case

Prompt 1 submission: "Bud-e" (working name), a learner's licence for a teen's AI agent.

- `SPEC.md` is the product spec. Section 8 says exactly what the prototype must do.
- `DukeJain_IITDelhi_prototype/` is the clickable prototype: plain HTML/CSS/JS, no build step. Open `index.html` in a browser. Its own `README.txt` explains the demo.
- To run it on a local server instead: `npm run dev` from this folder, then open the address it prints (http://localhost:3000, or the next free port). It needs Node but no `npm install` (no dependencies).
  - `Missing script: "dev"` or no `package.json`: you're on an older copy. Get this branch (`git fetch origin claude/hopeful-ramanujan-0zh8kg && git checkout claude/hopeful-ramanujan-0zh8kg`), or download it from GitHub as a ZIP.
  - `npm: command not found` / `'npm' is not recognized`: install Node (LTS) from nodejs.org, or skip the server and double-click `index.html`.
  - Without Node: `python3 -m http.server 3000 --directory DukeJain_IITDelhi_prototype` works too.
- The submission zip (`DukeJain_IITDelhi.zip`) is made from that folder and is not tracked.

Deadline: Sun 25 Oct 2026, 12 noon.
