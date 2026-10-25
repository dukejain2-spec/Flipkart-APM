/* Bud-e prototype: saved state, the rating and token rules, the scripted chat engine, and every screen.
   Content (persona, flows, products, report numbers) lives in data.js. */
(function () {
  const D = window.DATA;
  /* laksh.html shows a second child: on that page his details, levels and earlier chats replace Aarav's. */
  const PERSONA = document.body.dataset.persona || "";
  const PER = PERSONA ? D.personas[PERSONA] : null;
  if (PER) {
    Object.assign(D.parent, PER.parent);
    Object.assign(D.child, PER.child);
    D.areas.forEach(a => a.skills.forEach(s => { if (s.id in PER.ratings) s.rating = PER.ratings[s.id]; }));
    D.history = PER.history;
  }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => Math.round(a + Math.random() * (b - a));
  const clone = o => JSON.parse(JSON.stringify(o));
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(Math.round(n));
  /* A story clock: the demo always starts at 4:40 pm on its 2040 Wednesday and runs on in real minutes, so times
     match the scripted day (the 4:42 pm cab) whatever the time where it's shown. */
  const storyStart = Date.now();
  const storyNow = () => new Date(2040, 9, 17, 16, 40 + Math.floor((Date.now() - storyStart) / 60000));
  const clock = () => storyNow().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toLowerCase();

  /* ---------- Icons and brand ---------- */
  const P = {
    chat: '<path d="M4.5 5.5h15v10.5H10l-5.5 4z"/>',
    spark: '<path d="M12 3.5l1.9 5.2 5.1 1.8-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    block: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
    bolt: '<path d="M13 3 5.5 13.5h5.5L10 21l7.5-10.5H12z"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    checks: '<path d="m2.5 12.5 4 4L15 8M11 15.5l1 1L20.5 8"/>',
    car: '<path d="M5 16.5v-5L7.2 7h9.6l2.2 4.5v5M5 16.5h14M5 16.5V19h2.5v-2.5M16.5 16.5V19H19v-2.5M5 11.5h14"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-1.5-4-5.5-4-5.5-1.5S10 9 12 9zm0 0c1.5-4 5.5-4 5.5-1.5S14 9 12 9z"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><path d="M12 9.5v5"/>',
    wallet: '<path d="M4 7.5h15a1.5 1.5 0 0 1 1.5 1.5v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V8a.5.5 0 0 1 .5-.5z"/><path d="M4.5 7.5 15.5 4v3.5"/><circle cx="16.5" cy="13.5" r="1.1"/>',
    shield: '<path d="M12 3.5 19 6v6c0 4.2-3 7.2-7 8.5-4-1.3-7-4.3-7-8.5V6z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chart: '<path d="M4 20h16M7 16v-4M12 16V7M17 16v-6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3M12 13v3.5M8.5 20h7M10 16.5h4V20h-4z"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
    pen: '<path d="M14.5 5.5 18.5 9.5 9 19H5v-4z"/><path d="M12.5 7.5l4 4"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
    users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 6.2a3.2 3.2 0 0 1 0 6M17 14.7c1.8.5 3 2.2 3.5 4.8"/>',
    heart: '<path d="M12 19.5s-7.5-4.4-7.5-9.7A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8c0 5.3-7.5 9.7-7.5 9.7z"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5"/>',
    swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/>',
    puzzle: '<path d="M5 8h3.5a2 2 0 1 1 4 0H16v3.5a2 2 0 1 1 0 4V19H5z"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>',
    data: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    plug: '<path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0zM12 16v4.5"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
    clip: '<path d="m19 11.5-6.8 6.8a4.5 4.5 0 0 1-6.4-6.4l7.4-7.4a3 3 0 0 1 4.2 4.2l-7.3 7.3a1.5 1.5 0 0 1-2.1-2.1l6.5-6.5"/>',
    /* Product pictures (gift and challenge cards) */
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
    speaker: '<rect x="6" y="3.5" width="12" height="17" rx="2"/><circle cx="12" cy="14.5" r="3"/><circle cx="12" cy="8" r="1.2"/>',
    music: '<path d="M9 18V5.5l10-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.6-2.1-.5-1.3.4-2.4 1.8-2.4H17a3.5 3.5 0 0 0 3.5-3.5c0-5-3.8-9-8.5-9z"/><circle cx="8" cy="11" r="1.2"/><circle cx="11" cy="7.5" r="1.2"/><circle cx="15.5" cy="8.5" r="1.2"/>',
    frame: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="m4 16 5-5 4 4 2-2 5 5"/><circle cx="15" cy="9" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4"/>'
  };
  const icon = (n, s = 18, cls = "") => `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* The Bud-e character mark (logo.jpeg), drawn in the logo's own coordinates: a "B" of four soft-gradient layers
     (an orange-to-pink lower bowl, a violet-to-coral upper bowl, a violet body and a blue-to-indigo stem), a white
     visor face with two open eyes, and two sparks. Live marks follow the mouse with their eyes and giggle when clicked
     (see the bottom of this file). The square viewBox includes the sparks, so nothing is clipped. */
  let markId = 0;
  const mark = (s = 28, live = false) => {
    const id = "bd" + (++markId), small = s < 24;
    return `<svg class="mark${live ? " mark--live" : ""}" width="${s}" height="${s}" viewBox="${small ? "40 40 1040 1090" : "50 -8 1180 1180"}" ${live ? 'role="img" aria-label="Bud-e"' : 'aria-hidden="true"'}><defs>
      <linearGradient id="${id}l" x1=".2" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#EE8572"/><stop offset=".38" stop-color="#F2A65E"/><stop offset=".72" stop-color="#EA8F96"/><stop offset="1" stop-color="#CF68D2"/></linearGradient>
      <linearGradient id="${id}u" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#B566CE"/><stop offset=".5" stop-color="#E0779C"/><stop offset="1" stop-color="#F28C6E"/></linearGradient>
      <linearGradient id="${id}v" x1="0" y1=".2" x2="1" y2="1"><stop offset="0" stop-color="#5450F2"/><stop offset=".55" stop-color="#7A57EE"/><stop offset="1" stop-color="#C963D8"/></linearGradient>
      <linearGradient id="${id}s" x1=".15" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#7FA8F8"/><stop offset=".3" stop-color="#4E88F5"/><stop offset=".48" stop-color="#4B6CF1"/><stop offset=".64" stop-color="#4A2FE2"/><stop offset="1" stop-color="#4C55F0"/></linearGradient></defs>
      <g class="m-body">
        <path d="M560 470H790C940 520 1035 640 1035 785C1035 960 895 1097 720 1097H560Z" fill="url(#${id}l)"/>
        <path d="M400 68H615C760 68 880 185 880 335C880 392 866 430 845 464H600Z" fill="url(#${id}u)"/>
        <path d="M598 428C625 442 655 452 685 458C795 525 866 645 866 780C866 905 800 1020 690 1097H255C150 1097 68 1013 68 910V428Z" fill="url(#${id}v)"/>
        <path d="M255 68H410C530 160 598 290 598 430C598 600 520 760 380 840C300 880 180 890 68 880V255C68 150 150 68 255 68Z" fill="url(#${id}s)"/>
        <rect x="193" y="545" width="597" height="368" rx="184" fill="#fff"/>
        <g class="m-eyes"><g class="m-open"><ellipse class="m-eye" cx="374" cy="719" rx="46" ry="50" fill="#1B1640"/><ellipse class="m-eye" cx="608" cy="719" rx="46" ry="50" fill="#1B1640"/></g>
          ${live ? '<path class="m-happy" d="M330 742Q374 676 418 742M564 742Q608 676 652 742" fill="none" stroke="#1B1640" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>' : ""}</g>
      </g>
      ${small ? "" : '<g class="m-sparks" stroke-width="58" stroke-linecap="round"><path class="m-sp1" d="M1037 483 1153 370" stroke="#EE846C"/><path class="m-sp2" d="M1085 585H1183" stroke="#C955C9"/></g>'}
    </svg>`;
  };
  const wordmark = () => '<span class="wordmark">Bud<i></i><b>e</b></span>';
  const logo = (s = 28) => `<span class="logo">${mark(s, true)}${wordmark()}</span>`;

  /* ---------- Saved state ---------- */
  /* Bud-e (index.html) and Bud-e Parent (parent.html) are separate pages that share this browser's saved state. */
  const APP = document.body.dataset.app === "parent" ? "parent" : "child";
  const KEY = "bude.prototype.v3" + (PERSONA ? "." + PERSONA : "");
  const PKEY = "bude.parent.v1";
  function fresh() {
    const c = D.child, skills = {};
    D.areas.forEach(a => a.skills.forEach(s => { skills[s.id] = { rating: s.rating }; }));
    const perms = {};
    D.permissions.forEach(p => { perms[p.id] = p.on; });
    return {
      v: 3, role: null,
      setup: {
        done: false, code: null,
        parent: { name: D.parent.name },
        child: { name: c.name, age: c.age, classNo: c.classNo, uses: c.uses.slice(), provider: c.provider, providers: (c.providers || [c.provider]).slice(), usedBefore: c.usedBefore },
        /* The Bud-e browser extension is installed from its permission card; once installed, its toggle turns monitoring on or off */
        extInstalled: false,
        perms, walletMonthly: c.walletMonthly
      },
      newSkill: false,
      tokens: c.tokens, spent: 0, earned: 0, tokenLog: [],
      wallet: c.wallet, orders: [],
      skills, ratingLog: [],
      done: {}, didIt: [], fasterOn: [],
      reliance: {},
      blocked: Object.fromEntries(D.report.agents.filter(a => a.blocked).map(a => [a.id, true])),
      /* Chats, newest first. `thread` is the open chat's messages (the same array as its entry in `chats`);
         `chatId` is null for a new chat until its first message. */
      chats: D.history.map((h, i) => ({ id: "h" + i, title: h.title, at: h.when, thread: clone(h.thread) })),
      chatId: null, thread: []
    };
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 3) {
        if (!s.chats) { s.chats = fresh().chats; s.chatId = null; s.thread = []; }
        const open = s.chatId && s.chats.find(c => c.id === s.chatId);
        if (open) s.thread = open.thread; else { s.chatId = null; s.thread = []; }
        return s;
      }
    } catch (e) { /* storage blocked */ }
    return fresh();
  }
  let S = load();
  if (!S.blocked) S.blocked = fresh().blocked;
  /* Older saved state: a skill added since (physics) joins with its starting value, so nothing reads a missing skill */
  D.areas.forEach(a => a.skills.forEach(sk => { if (!S.skills[sk.id]) S.skills[sk.id] = { rating: sk.rating }; }));
  /* Older saved state: one agent, and the extension counted as installed if it was on */
  if (!S.setup.child.providers) S.setup.child.providers = [S.setup.child.provider];
  if (S.setup.extInstalled == null) S.setup.extInstalled = !!S.setup.perms.extension;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } }
  function changed() { save(); refreshLive(); }
  /* Bud-e Parent stays logged in with the code it used. A new setup or a reset changes the code, which logs it out. */
  const parentIn = () => { try { const p = JSON.parse(localStorage.getItem(PKEY)); return !!(p && S.setup.done && p.code === S.setup.code); } catch (e) { return false; } };
  const setParentIn = on => { try { if (on) localStorage.setItem(PKEY, JSON.stringify({ code: S.setup.code })); else localStorage.removeItem(PKEY); } catch (e) { /* storage blocked */ } };

  const name = () => S.setup.child.name || D.child.name;
  /* The agents he uses (setup allows several), and how a sentence names them: "Claude", "Claude and ChatGPT" */
  const agents = () => (S.setup.child.providers && S.setup.child.providers.length ? S.setup.child.providers : [S.setup.child.provider]);
  const listText = xs => xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
  const agentList = () => listText(agents().map(p => p === "Other agent" ? "another agent" : p));
  const area = id => D.areas.find(a => a.id === id);
  const skillDef = id => { for (const a of D.areas) { const s = a.skills.find(k => k.id === id); if (s) return Object.assign({ area: a }, s); } return null; };
  const taskDef = id => D.tasks.find(t => t.id === id) || D.challenges.find(c => c.id === id);

  /* ---------- Rating, level and token rules (README §3.3, §3.5) ---------- */
  function modeFor(gap) { return D.modes.find(m => gap <= m.max); }
  function expectedFor(gap) { return 1 / (1 + Math.pow(10, gap / 400)); }
  function updateRating(old, result, expected) { return Math.max(0, Math.min(1000, Math.round(old + D.rating.K * (result - expected)))); }
  function levelFor(rating, age) {
    const g = D.levels.groups.find(x => age >= x.from && age <= x.to) || D.levels.groups[D.levels.groups.length - 1];
    const b = D.levels.bands;
    let i = 0;
    while (i + 1 < b.length && rating >= b[i + 1].min) i++;
    const next = b[i + 1] || null;
    const top = next ? next.min : 1000;
    return { name: b[i].name, i, next, group: g.label, pct: Math.round(((rating - b[i].min) / (top - b[i].min)) * 100) };
  }
  /* Tasks done on your own at a matching weight move the rating about 20 points each (K × 0.5). */
  function movesToNext(rating) { const l = levelFor(rating, S.setup.child.age); return l.next ? Math.max(1, Math.ceil((l.next.min - rating) / (D.rating.K / 2))) : 0; }
  function startRating(id) { const s = skillDef(id); return s.base + (S.setup.perms.past && S.setup.child.usedBefore ? s.pastAdj : 0); }
  function costFor(weight) { return D.costs.find(c => weight <= c.max).tokens; }
  function logTokens(delta, label) { S.tokenLog.unshift({ delta, label, at: clock() }); }
  function spendTokens(weight, label) { const c = costFor(weight); S.tokens -= c; S.spent += c; logTokens(-c, label); changed(); return c; }
  function earnTokens(n, label) { S.tokens += n; S.earned += n; logTokens(n, label); changed(); floatTokens(n); }
  function level(id) { const r = S.skills[id].rating; return r == null ? null : levelFor(r, S.setup.child.age); }
  function rely(areaId, self) { const r = S.reliance[areaId] || (S.reliance[areaId] = { self: 0, total: 0 }); r.self += self; r.total += 1; }
  const article = w => (/^[aeiou]/i.test(w) ? "an " : "a ") + w;
  /* Pocket money left this month: the monthly amount, less what went earlier this month and this session's orders. */
  const walletLeft = () => Math.max(0, S.setup.walletMonthly - (D.child.walletMonthly - D.child.wallet) - S.orders.reduce((n, o) => n + o.price, 0));

  /* ---------- The Bud-e Parent code ---------- */
  const makeCode = () => String(rand(1000, 9999)) + String(rand(1000, 9999));
  const showCode = c => c.slice(0, 4) + " " + c.slice(4);

  /* ---------- Toasts, modals, menus ---------- */
  function toast(text, kind = "") {
    const t = document.createElement("div");
    t.className = "toast " + kind;
    t.innerHTML = (kind === "ok" ? icon("check", 16) : icon("info", 16)) + "<span>" + esc(text) + "</span>";
    $("#toasts").appendChild(t);
    requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 300); }, 2600);
  }
  const offPath = () => toast("Not part of this prototype.");

  /* An action with `sub` renders as a choice card (title, what it does, optional icon) instead of a plain button. */
  function modal({ cls = "", html, actions }) {
    return new Promise(resolve => {
      const layer = $("#layer");
      const cards = actions.some(a => a.sub);
      const button = (a, i) => a.sub
        ? `<button class="opt-card ${a.primary ? "is-primary" : ""}" data-i="${i}">${a.icon ? `<span class="oc-ic">${icon(a.icon, 20)}</span>` : ""}<span class="oc-t"><b>${esc(a.label)}</b><span>${esc(a.sub)}</span></span>${icon("arrow", 16, "oc-go")}</button>`
        : `<button class="btn ${a.primary ? "primary" : "ghost"}" data-i="${i}">${esc(a.label)}</button>`;
      layer.innerHTML = `<div class="scrim"></div><div class="modal ${cls}" role="dialog" aria-modal="true">${html}
        <div class="modal-actions ${cards ? "modal-actions--cards" : ""}">${actions.map(button).join("")}</div></div>`;
      layer.classList.add("open");
      const close = v => { layer.classList.remove("open"); layer.innerHTML = ""; document.removeEventListener("keydown", onKey); resolve(v); };
      const onKey = e => { if (e.key === "Escape") close(actions[0].cancel ? actions[0].value : null); };
      document.addEventListener("keydown", onKey);
      $$("[data-i]", layer).forEach(b => b.addEventListener("click", () => close(actions[+b.dataset.i].value)));
      $(".scrim", layer).addEventListener("click", () => close(null));
      const p = $(".btn.primary, .opt-card.is-primary", layer); if (p) p.focus();
    });
  }

  function floatTokens(n) {
    $$(".token-count").forEach(el => {
      if (!el.offsetParent) return;
      const r = el.getBoundingClientRect();
      const f = document.createElement("div");
      f.className = "float-tokens";
      f.textContent = "+" + n;
      f.style.left = r.left + r.width / 2 + "px";
      f.style.top = r.top + "px";
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 1400);
    });
  }

  /* ---------- Router ---------- */
  /* Each page has only its own app's screens. Laksh's device is already set up, so his page opens on "I'm Laksh". */
  const ROUTES = APP === "parent"
    ? { plogin: viewParentLogin, parent: viewParent, pagents: viewParentAgents, pperms: viewParentPerms }
    : PERSONA
      ? { splash: viewSplash, chat: viewChat, earn: viewEarn, wallet: viewWallet, progress: viewProgress }
      : { start: viewStart, child: viewChildProfile, permissions: viewPermissions, handover: viewHandover, splash: viewSplash,
          chat: viewChat, earn: viewEarn, wallet: viewWallet, progress: viewProgress };
  const HOME = APP === "parent" ? "plogin" : PERSONA ? "splash" : "start";
  const TITLES = { child: "Set up", permissions: "Permissions", handover: "Your Bud-e Parent code", chat: "Home", earn: "Tokens",
    wallet: "Wallet", progress: "My skills", plogin: "Log in", parent: "Weekly report", pagents: "Extension report", pperms: "Permissions" };
  const CHILD = ["chat", "earn", "wallet", "progress"];
  const PARENT = ["parent", "pagents", "pperms"];
  const route = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || HOME);
  function go(r) { if (route() === r) render(); else location.hash = "#/" + r; }

  function render() {
    let r = route();
    if (!ROUTES[r]) r = HOME;
    /* Bud-e Parent opens only after the code login, and skips the login while it's still valid. */
    if (PARENT.includes(r) && !parentIn()) { location.replace("#/plogin"); return; }
    if (r === "plogin" && parentIn()) { location.replace("#/parent"); return; }
    const app = $("#app");
    document.body.dataset.route = r;
    /* the browser tab names the screen and the app */
    const title = TITLES[r], appName = APP === "parent" ? "Bud-e Parent" : PERSONA ? "Bud-e · " + name() : "Bud-e";
    document.title = title ? title + " · " + appName : appName;
    if (CHILD.includes(r)) {
      if (!S.setup.done) quickSetup();
      S.role = "child";
      if (r === "progress") S.newSkill = false;
      app.innerHTML = childShell(r);
      ROUTES[r]($("#main"));
      refreshLive();
    } else if (PARENT.includes(r)) {
      S.role = "parent";
      app.innerHTML = parentShell(r);
      ROUTES[r]($("#main"));
    } else {
      app.innerHTML = `<div class="bare"><div class="canvas canvas--${r}">${ROUTES[r]()}</div></div>`;
      const after = AFTER[r]; if (after) after();
    }
    /* Bud-e Parent saves only when the parent changes something, so it never writes back an old copy of Bud-e's state. */
    if (APP === "child") save();
    window.scrollTo(0, 0);
    queueAim();
  }
  const AFTER = {};

  /* Jumping straight in (demo rail, "I'm Aarav") uses the default setup and makes its Bud-e Parent code. */
  function quickSetup() {
    S.setup.done = true; S.setup.perms.consent = true;
    /* Jumping in skips the permission cards, so the extension counts as installed and monitoring */
    if (!S.setup.extInstalled) { S.setup.extInstalled = true; S.setup.perms.extension = true; }
    if (!S.setup.code) S.setup.code = makeCode();
  }

  /* ---------- Shells ---------- */
  /* Both apps share one frame: a white nav rail on the left, the grey ground, a top bar of status labels. */
  const tab = (href, label, ic, on, val = "") => `<a href="#/${href}" class="tab ${on ? "is-on" : ""}" ${on ? 'aria-current="page"' : ""}>${icon(ic, 20)}<span>${label}</span>${val}</a>`;
  const weekday = () => D.today.long.split(",")[0];
  function frame(cls, nav, top, body, bar = "") {
    return `<div class="shell ${cls}"><div class="frame">
      <nav class="nav" aria-label="Main"><span class="nav-mark">${mark(38, true)}</span>${nav}</nav>
      ${bar}
      <div class="body">
        <header class="top"><span class="top-mark">${mark(30, true)}</span><span class="top-date">${weekday()}, ${clock()}</span><div class="top-right">${top}</div></header>
        ${body}
      </div>
    </div></div>`;
  }
  function childShell(r) {
    return frame("shell--child",
      `${tab("chat", "Home", "home", r === "chat")}${tab("progress", "My skills", "trophy", r === "progress", S.newSkill ? '<i class="tab-dot" aria-label="New skill"></i>' : "")}
       ${tab("earn", "Tokens", "coin", r === "earn", `<em class="tab-val token-count">${S.tokens}</em>`)}
       ${S.setup.perms.wallet ? tab("wallet", "Wallet", "wallet", r === "wallet", `<em class="tab-val wallet-count">${rupee(S.wallet)}</em>`) : ""}
       <span class="nav-fill"></span><button class="tab tab--settings" data-off>${icon("cog", 20)}<span>Settings</span></button>${profileButton(name()[0], "child")}`,
      `<button class="pill-stat chats-pill" data-chatbar aria-label="Chats">${icon("chat", 16)}<span>Chats</span></button>
       <button class="pill-stat areas-pill" data-drawer aria-label="My areas">${icon("chart", 16)}<span>My areas</span></button>`,
      `<div class="cols"><main id="main" class="main"></main><aside class="side" id="side" aria-label="Your areas and tokens"></aside></div>
       <div class="drawer-scrim" data-drawer></div>`,
      `<aside class="chatbar" id="chatbar" aria-label="Chats"></aside>`);
  }
  /* Chats, like a chat app's sidebar: New chat on top, then recent chats, newest first. Beside the nav on wide screens;
     on narrower ones it slides in from the left. Re-rendered on every change. */
  function chatbarHTML() {
    return `<div class="chatbar-h"><b>Chats</b></div>
      <button class="btn block chatbar-new" data-newchat>${icon("plus", 16)} New chat</button>
      <p class="chatbar-l">Recents</p>
      <div class="chat-list">${S.chats.slice(0, 12).map(c => `<button class="chat-item ${c.id === S.chatId ? "is-on" : ""}" data-chat="${c.id}"><span>${esc(c.title)}</span><em>${esc(c.at)}</em></button>`).join("")}</div>`;
  }
  function parentShell(r) {
    return frame("shell--parent",
      `${tab("parent", "Weekly report", "chart", r === "parent")}${tab("pagents", "Extension report", "puzzle", r === "pagents")}${tab("pperms", "Permissions", "shield", r === "pperms")}
       <span class="nav-fill"></span><button class="tab tab--settings" data-off>${icon("cog", 20)}<span>Settings</span></button>${profileButton(S.setup.parent.name[0] || "N", "parent")}`,
      `<span class="pill-stat"><i class="role-dot"></i>Bud-e Parent · ${esc(name())}'s device linked</span>`,
      `<div class="cols"><main id="main" class="main main--wide"></main></div>`);
  }
  function profileButton(initial, role) {
    return `<div class="profile"><button class="avatar avatar--${role}" data-menu aria-label="Profile menu">${esc(initial)}</button>
      <div class="menu" hidden>
        <div class="menu-h">${role === "child" ? esc(name()) + ", " + S.setup.child.age : esc(S.setup.parent.name) + " · " + D.parent.relation}</div>
        ${role === "child" ? `${PERSONA ? "" : `<button data-go="start">${icon("home", 16)} Start screen</button>`}<button data-reset>${icon("refresh", 16)} Reset prototype</button>`
                           : `<button data-logout>${icon("back", 16)} Log out</button>`}
      </div></div>`;
  }

  /* Side panel: areas and levels. Balances live in the nav (Tokens, Wallet), chats in the chat sidebar. Re-rendered on every change. */
  function sideHTML() {
    const age = S.setup.child.age;
    const areas = D.areas.map(a => {
      const rows = a.care
        ? `<div class="sk sk--care">${icon("heart", 15)}<span>Always handled with care</span></div>`
        : a.skills.map(s => {
          const r = S.skills[s.id].rating;
          if (r == null) return `<div class="sk"><span class="sk-name">${esc(s.name)}</span><span class="lvl lvl--new">New</span></div>`;
          const l = levelFor(r, age);
          return `<div class="sk"><span class="sk-name">${esc(s.name)}</span><span class="lvl lvl--${l.i}">${l.name}</span>
            <span class="sk-bar"><i style="width:${l.pct}%"></i></span></div>`;
        }).join("");
      return `<div class="area" data-area="${a.id}"><div class="area-h">${icon(areaIcon(a.id), 15)}<b>${esc(a.name)}</b></div>${rows}</div>`;
    }).join("");
    return `<section class="panel areas">
        <div class="panel-h"><b>My areas</b><a href="#/progress">My skills</a></div>
        ${areas}
        <p class="side-foot">Levels are for ${levelFor(0, age).group}. Chores aren't an area: they're always instant and free.</p>
      </section>`;
  }
  const areaIcon = id => ({ study: "book", writing: "pen", money: "scale", relationships: "users", feelings: "heart" }[id] || "spark");

  function refreshLive() {
    const side = $("#side"); if (side) side.innerHTML = sideHTML();
    const bar = $("#chatbar"); if (bar) bar.innerHTML = chatbarHTML();
    $$(".token-count").forEach(el => { el.textContent = S.tokens; });
    $$(".wallet-count").forEach(el => { el.textContent = rupee(S.wallet); });
    if (route() === "chat") renderComposer();
    if (["earn", "wallet", "progress"].includes(route())) { const m = $("#main"); if (m && !m.contains(document.activeElement)) ROUTES[route()](m); }
  }

  /* ---------- S0 Start ---------- */
  const RAIL = [
    ["S1", "Child details", "child"], ["S2", "Permissions", "permissions"], ["S3", "Code + handover", "handover"], ["S4", "I'm Aarav", "splash"],
    ["S5", "Home", "chat"], ["S6", "Algebra + level up", "task:algebra"], ["S7", "Learner: science", "task:science"],
    ["S8", "Pro: mail to teacher", "task:mail"], ["S9", "Calculator + wallet", "task:calc"], ["S10", "Feelings", "task:feelings"],
    ["S11", "Tokens + earn", "earn"], ["S12", "Wallet", "wallet"], ["S13", "My skills", "progress"]
  ];
  /* How Bud-e answers, one example per kind of reply */
  const HOW = [
    ["Do it", "“mail my class teacher about a retest” · good at emails, so it's written for him"],
    ["Quick check", "“solve 2x + 7 = 10” · one question, then it's his"],
    ["Let him decide", "“buy a calculator for my exam” · three options, he picks"],
    ["Teach", "“a stone dropped from 20 m: how long to fall?” · step by step, he does each step"]
  ];
  function viewStart() {
    return `<header class="start-top">${logo(32)}</header>
    <div class="start">
      <div class="start-main">
        <div class="start-hero">
          <p class="badge-pill"><b>2040</b>For children and their AI agents</p>
          <h1>${D.product.tagline.split(", ").map((t, i) => i ? `<em>${esc(t)}.</em>` : esc(t) + ",").join("<br>")}</h1>
          <p class="lede">${esc(D.product.pitch)}</p>
          <div class="start-btns">
            <button class="btn primary lg" data-go="child">${icon("user", 18)} Set up this device</button>
            <button class="btn ghost lg" data-go="splash">I'm ${esc(name())}</button>
          </div>
        </div>
        <section class="card how" aria-label="How Bud-e answers">
          <div class="how-h"><b>How Bud-e answers</b><span>by ${esc(name())}'s level in each skill</span></div>
          ${HOW.map(([t, ex]) => `<div class="how-row"><b>${t}</b><span>${esc(ex)}</span></div>`).join("")}
          <p class="how-f">${icon("lock", 14)} Parents see progress in Bud-e Parent. Never the chats.</p>
        </section>
      </div>
      <nav class="rail" aria-label="Jump to a screen">
        <div class="rail-h"><span>Jump to a screen</span><button class="link" data-reset>Reset prototype</button></div>
        <div class="rail-list">${RAIL.map(([n, t, to]) => `<button data-jump="${to}"><em>${n}</em>${t}</button>`).join("")}</div>
      </nav>
      <p class="start-foot">Prototype set in ${D.today.long.split(", ")[1].split(" ").pop()}. Every agent reply is scripted. No internet, no real AI.</p>
    </div>`;
  }
  function jump(to) {
    if (to.startsWith("task:")) {
      const id = to.slice(5), skill = taskDef(id).skill;
      quickSetup();
      /* A skill that starts out new (algebra) is reset, so jumping to it always shows the "New skill unlocked" moment. */
      if (skill && skillDef(skill).rating == null) S.skills[skill] = { rating: null };
      newChat();
      pendingPrefill = taskDef(id).prompt;
      go("chat");
      return;
    }
    if (to === "handover" || to === "splash") quickSetup();
    save();
    /* jumping to the code screen still shows setup's last beat: the agent and Bud-e locking together */
    if (to === "handover") linkUp().then(() => go(to));
    else go(to);
  }

  /* ---------- S1–S3 Setting up the child's device (filled in by the parent) ---------- */
  function steps(n) {
    const names = ["Child", "Permissions", "Code"];
    return `<ol class="steps">${names.map((s, i) => `<li class="${i + 1 < n ? "is-done" : i + 1 === n ? "is-now" : ""}"><span>${i + 1 < n ? icon("check", 13) : i + 1}</span>${s}</li>`).join("")}</ol>`;
  }
  function setupFrame(n, title, sub, body) {
    return `<div class="setup">
      <header class="setup-top"><a href="#/start" aria-label="Bud-e start">${logo(30)}</a>${steps(n)}</header>
      <div class="setup-body"><h1>${title}</h1><p class="sub">${sub}</p>${body}</div>
    </div>`;
  }

  function viewChildProfile() {
    const c = S.setup.child;
    return setupFrame(1, "Set up your child's device", "You fill this in once, on their device. It sets their starting point.", `
      <form class="form card" id="childf" novalidate>
        <div class="row2">
          <label class="field"><span>Child's name</span><input name="name" value="${esc(c.name)}"></label>
          <label class="field field--sm"><span>Age</span><input name="age" type="number" min="5" max="18" value="${c.age}"></label>
          <label class="field field--sm"><span>Class</span><select name="classNo">${D.classes.map(n => `<option value="${n}" ${n === c.classNo ? "selected" : ""}>Class ${n}</option>`).join("")}</select></label>
        </div>
        <fieldset class="field"><legend>What does ${esc(c.name)} use AI for?</legend>
          <div class="pills">${D.aiUses.map(u => `<label class="pill"><input type="checkbox" name="uses" value="${u.id}" ${c.uses.includes(u.id) ? "checked" : ""}><span>${esc(u.label)}</span></label>`).join("")}</div>
        </fieldset>
        <fieldset class="field"><legend>Which AI agents does ${esc(c.name)} use? Pick all that apply.</legend>
          <div class="pills">${D.providers.map(p => `<label class="pill"><input type="checkbox" name="providers" value="${esc(p)}" ${agents().includes(p) ? "checked" : ""}><span>${D.providerLogos[p] ? `<img class="pill-logo" src="${esc(D.providerLogos[p])}" alt="">` : ""}${esc(p)}</span></label>`).join("")}</div>
        </fieldset>
        <fieldset class="field"><legend>Has ${esc(c.name)} used AI agents before?</legend>
          <div class="seg"><label><input type="radio" name="usedBefore" value="yes" ${c.usedBefore ? "checked" : ""}><span>Yes</span></label><label><input type="radio" name="usedBefore" value="no" ${!c.usedBefore ? "checked" : ""}><span>No, first time</span></label></div>
          <em class="hint" id="usedHint">${c.usedBefore ? "With your permission, past use helps estimate starting levels." : "Starting levels will come from class averages and the first few chats."}</em>
        </fieldset>
        <p class="form-err" hidden></p>
        <div class="form-nav"><button type="button" class="btn ghost" data-go="start">${icon("back", 16)} Back</button><button class="btn primary" type="submit">Next ${icon("arrow", 16)}</button></div>
      </form>`);
  }
  AFTER.child = () => {
    const f = $("#childf");
    f.addEventListener("change", e => {
      if (e.target.name === "usedBefore") $("#usedHint").textContent = e.target.value === "yes" ? "With your permission, past use helps estimate starting levels." : "Starting levels will come from class averages and the first few chats.";
    });
    f.addEventListener("submit", e => {
      e.preventDefault();
      const age = +f.age.value, uses = $$("input[name=uses]:checked", f).map(i => i.value), providers = $$("input[name=providers]:checked", f).map(i => i.value);
      const msg = !f.name.value.trim() ? "Add your child's name." : !(age >= 5 && age <= 18) ? "Bud-e is for ages 5 to 18." : !uses.length ? "Pick at least one thing they use AI for."
        : !providers.length ? "Pick at least one AI agent they use." : "";
      const err = $(".form-err", f); err.hidden = !msg; err.textContent = msg;
      if (msg) return;
      Object.assign(S.setup.child, { name: f.name.value.trim(), age, classNo: +f.classNo.value, uses, providers, provider: providers[0], usedBefore: f.usedBefore.value === "yes" });
      save(); go("permissions");
    });
  };

  const permIcon = { consent: "shield", agent: "plug", past: "data", restrict: "block", extension: "puzzle", data: "lock", wallet: "wallet", notify: "bell" };
  /* Permission cards, shared by setup (on the child's device) and Bud-e Parent. In Bud-e Parent the two required ones
     stay on while Bud-e is active. */
  function permCards(inParent) {
    const s = S.setup, c = s.child;
    return D.permissions.map(p => {
      const off = p.id === "past" && !c.usedBefore;
      /* The extension is installed first, with its button; its toggle then turns monitoring on or off */
      const toInstall = p.install && !s.extInstalled;
      const on = off || toInstall ? false : s.perms[p.id];
      const locked = inParent && p.required;
      /* Written for any child ("your child"), whatever name setup was given */
      return `<div class="perm ${on ? "is-on" : ""} ${off ? "is-off" : ""}" data-perm="${p.id}">
        <span class="perm-ic">${icon(permIcon[p.id], 20)}</span>
        <div class="perm-txt"><b>${esc(p.title)}${p.required ? '<em class="req">Required</em>' : ""}${p.optional ? '<em class="opt">Optional</em>' : ""}</b>
          <p>${off ? "Not needed: your child hasn't used an AI agent before." : esc(p.why)}</p>
          ${locked ? `<p class="perm-lock">${icon("lock", 13)} Stays on while Bud-e is active. To withdraw it, remove your child's device in Settings.</p>` : ""}
          ${p.detail ? `<details><summary>${esc(p.detailLabel || "What exactly is stored")}</summary><ul>${p.detail.map(d => `<li>${esc(d)}</li>`).join("")}</ul></details>` : ""}
          ${p.install ? (toInstall
            ? `<button type="button" class="btn small primary ext-install" data-install-ext>${icon("puzzle", 15)} Install extension</button>`
            : `<p class="ext-ok">${icon("check", 14)} Installed in Chrome and Edge on ${esc(c.name)}'s device</p>`) : ""}
          ${p.id === "wallet" ? `<label class="amount">Monthly amount <span>₹</span><input type="number" min="0" step="100" id="walletAmt" value="${s.walletMonthly}"></label>` : ""}
        </div>
        ${toInstall ? "" : `<label class="toggle"><input type="checkbox" ${on ? "checked" : ""} ${off || locked ? "disabled" : ""} aria-label="${esc(p.install ? "Monitor other AI agents" : p.title)}"><i class="switch"></i></label>`}
      </div>`;
    }).join("");
  }
  /* Wires the toggles and the wallet amount; `after` runs on every change. */
  function bindPerms(after, inParent = false) {
    $$(".perm").forEach(card => {
      const input = $(".toggle input", card);
      if (!input) return;
      input.addEventListener("change", () => {
        S.setup.perms[card.dataset.perm] = input.checked;
        card.classList.toggle("is-on", input.checked);
        save(); after(card.dataset.perm);
      });
    });
    const amt = $("#walletAmt");
    amt.addEventListener("change", () => { S.setup.walletMonthly = Math.max(0, +amt.value || 0); save(); after("walletAmt"); });
    /* Install extension: a short install, then the card shows it installed with monitoring on */
    const inst = $("[data-install-ext]");
    if (inst) inst.addEventListener("click", async () => {
      inst.disabled = true;
      inst.innerHTML = '<span class="spin"></span> Installing in Chrome and Edge…';
      await sleep(1200);
      S.setup.extInstalled = true; S.setup.perms.extension = true; save();
      $(".perms").innerHTML = permCards(inParent);
      bindPerms(after, inParent);
      after("extensionInstalled");
    });
  }
  function viewPermissions() {
    return setupFrame(2, "Permissions", "Each one is explained. Only the first two are required.", `
      <div class="lock-note">${icon("lock", 18)}<p><b>These permissions can't be changed on this device.</b> After setup, only you can change them, from Bud-e Parent on your phone. This makes sure your child isn't exposed to unrestricted AI agents that do everything for them and hold back their growth and learning.</p></div>
      <div class="perms">${permCards(false)}</div>
      <div class="seebox card">
        <div><h3>${icon("eye", 18)} You will see</h3><ul>${D.willSee.map(x => `<li>${icon("check", 15)}${esc(x)}</li>`).join("")}</ul></div>
        <div><h3>${icon("lock", 18)} You won't see</h3><ul>${D.wontSee.map(x => `<li class="no">${icon("x", 15)}${esc(x)}</li>`).join("")}</ul></div>
      </div>
      <p class="form-err" id="permErr" hidden></p>
      <div class="form-nav"><button class="btn ghost" data-go="child">${icon("back", 16)} Back</button><button class="btn primary" id="finish">Finish setup</button></div>`);
  }
  AFTER.permissions = () => {
    const sync = () => {
      const ok = S.setup.perms.consent && S.setup.perms.agent;
      $("#finish").classList.toggle("is-blocked", !ok);
      $("#finish").setAttribute("aria-disabled", ok ? "false" : "true");
      $("#permErr").hidden = true;
    };
    bindPerms(sync);
    sync();
    $("#finish").addEventListener("click", () => {
      const err = $("#permErr");
      if (!S.setup.perms.consent || !S.setup.perms.agent) {
        err.hidden = false;
        err.textContent = !S.setup.perms.consent ? "Tick parental consent to continue. Bud-e can't process a child's data without it." : "Agent integration is needed to connect " + name() + "'s agent.";
        $('[data-perm="' + (!S.setup.perms.consent ? "consent" : "agent") + '"]').classList.add("shake");
        setTimeout(() => $$(".shake").forEach(x => x.classList.remove("shake")), 500);
        return;
      }
      provision();
    });
  };
  async function provision() {
    const c = S.setup.child, past = S.setup.perms.past && c.usedBefore;
    const items = [
      "Connecting " + c.name + "'s " + (agents().length > 1 ? "agents (" : "agent (") + agentList() + ")",
      past ? "Estimating starting levels from past use (no chats imported)" : "Setting starting levels from Class " + c.classNo + " averages",
      "Setting up " + D.child.tokensWeekly + " tokens a week",
      S.setup.extInstalled ? "Linking the Bud-e browser extension" : "Browser extension not installed",
      S.setup.perms.wallet ? "Opening a " + rupee(S.setup.walletMonthly) + " monthly wallet" : "No wallet",
      "Locking these permissions to Bud-e Parent",
      "Making your Bud-e Parent code"
    ];
    $("#layer").innerHTML = `<div class="scrim"></div><div class="modal provision"><div class="prov-mark">${mark(52, true)}</div><h2>Setting up Bud-e</h2><ul>${items.map(t => `<li><span class="spin"></span>${esc(t)}</li>`).join("")}</ul></div>`;
    $("#layer").classList.add("open");
    const lis = $$(".provision li");
    for (const li of lis) { li.classList.add("is-now"); await sleep(rand(380, 620)); li.classList.remove("is-now"); li.classList.add("is-done"); $(".spin", li).outerHTML = icon("check", 15); }
    await sleep(300);
    S.setup.code = makeCode();
    S.wallet = walletLeft();
    S.setup.done = true; save();
    await linkUp();
    go("handover");
  }
  /* Setup's last beat: the child's agent and Bud-e slide together and lock, Bud-e in front, then a check.
     The agent's tile shows its own logo and name ("Other agent" gets a chat glyph). A click skips it. */
  async function linkUp() {
    const list = agents(), agent = list.length > 1 ? agentList() : list[0] === "Other agent" ? name() + "'s agent" : list[0], layer = $("#layer");
    const logos = list.slice(0, 3).map(p => D.providerLogos[p] ? `<img src="${esc(D.providerLogos[p])}" alt="">` : icon("chat", 24)).join("");
    layer.innerHTML = `<div class="scrim"></div><div class="modal linkup" role="status">
      <div class="link-stage" aria-hidden="true">
        <span class="link-tile link-agent ${list.length > 1 ? "is-many" : ""}"><span class="link-logos">${logos}</span><em>${esc(list.length > 1 ? list.length + " agents" : agent)}</em></span>
        <span class="link-tile link-bude">${mark(60)}</span>
        <i class="link-ring"></i><span class="link-check">${icon("check", 15)}</span>
      </div>
      <h2>${esc(agent)} ${list.length > 1 ? "are" : "is"} connected</h2>
      <p>Every request from ${esc(name())} now goes through Bud-e first.</p>
    </div>`;
    let skip;
    const skipped = new Promise(r => { skip = r; layer.addEventListener("click", skip); });
    layer.classList.add("open");
    await Promise.race([sleep(3200), skipped]);
    layer.removeEventListener("click", skip);
    layer.classList.remove("open"); layer.innerHTML = "";
  }

  /* S3: the code for Bud-e Parent, then the handover. */
  function viewHandover() {
    const n = esc(name());
    return `<div class="handover">
      <div class="hand-card">
        <p class="eyebrow">${icon("check", 14)} Setup complete</p>
        <section class="code-card card">
          <h1>Your Bud-e Parent code</h1>
          <div class="code" aria-label="Code ${esc(S.setup.code.split("").join(" "))}">${esc(showCode(S.setup.code))}</div>
          <p class="sub">Open <b>Bud-e Parent</b> on your phone and enter this code. That's where you'll see ${n}'s weekly report and change permissions.</p>
        </section>
        <div class="hand-ic">${icon("swap", 28)}</div>
        <h2>Now hand the device to ${n}.</h2>
        <button class="btn primary lg" data-go="splash">I'm ${n} ${icon("arrow", 18)}</button>
      </div>
    </div>`;
  }

  /* S4 "I'm Aarav": the mark pops in and winks, the name and the privacy promise follow, then home. */
  function viewSplash() {
    return `<div class="splash">
      <div class="splash-glow"></div>
      <div class="splash-mark">${mark(170, true)}</div>
      <h1 class="splash-word">${wordmark()}</h1>
      <p class="splash-hi">Hey ${esc(name())} 👋</p>
      <p class="splash-note">${icon("lock", 15)} Your chats are private. Your parents see your progress, not your conversations.</p>
    </div>`;
  }
  AFTER.splash = () => {
    quickSetup(); save();
    /* Opening the app as the child always starts a new chat; earlier ones stay under Chats. */
    const done = () => { if (route() === "splash") { newChat(); go("chat"); } };
    $(".splash").addEventListener("click", done);
    setTimeout(done, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 3000);
  };

  /* ---------- Chat engine ---------- */
  const CANCEL = { cancelled: true };
  const chat = { run: 0, ctx: null, flow: null, waiting: null, typing: false, waitSeq: 0, queued: null };
  let pendingPrefill = "";

  function push(m) {
    if (!S.chatId) {
      /* A new chat's first message files it under Chats, titled by what was asked. */
      S.chatId = "c" + Date.now();
      S.chats.unshift({ id: S.chatId, title: (m.text || "New chat").slice(0, 60), at: clock(), thread: S.thread });
      const bar = $("#chatbar"); if (bar) bar.innerHTML = chatbarHTML();
    }
    S.thread.push(m); save();
    const t = $("#thread");
    if (t) {
      if ($(".thread-empty", t)) { $(".thread-empty", t).remove(); $(".chat").classList.remove("chat--home"); }
      const prev = S.thread[S.thread.length - 2];
      t.insertAdjacentHTML("beforeend", msgHTML(m, prev));
      syncWaitButtons();
      scrollDown();
    }
  }
  function scrollDown() { const sc = $("#scroll"); if (sc) sc.scrollTop = sc.scrollHeight; }
  function alive(ctx) { if (ctx.run !== chat.run) throw CANCEL; }

  /* New chat: an empty home screen; the old chat stays under Chats. Opening a chat shows its messages again. */
  function newChat() { cancelFlow(); S.thread = []; S.chatId = null; save(); }
  function openChat(id) {
    const c = S.chats.find(x => x.id === id);
    if (!c) return;
    cancelFlow(); S.thread = c.thread; S.chatId = id; save();
    go("chat");
  }

  function numbers(ctx) {
    const t = ctx.task;
    if (!t.skill) return;
    ctx.skill = skillDef(t.skill);
    ctx.area = ctx.skill.area;
    ctx.rating = S.skills[t.skill].rating;
    ctx.weight = t.weight;
    if (ctx.rating == null) return;
    ctx.gap = ctx.weight - ctx.rating;
    ctx.mode = modeFor(ctx.gap);
    ctx.expected = expectedFor(ctx.gap);
  }

  function tagFor(ctx, st) {
    const t = ctx.task;
    if (st && st.tag === "check") return { text: `${ctx.area.tag} · ${ctx.skill.name} · New skill check`, tone: "check" };
    if (ctx.fast) return { text: `${ctx.area.tag} · ${ctx.skill.name} · Faster response: done for you`, tone: "fast" };
    if (ctx.challenge) return { text: `Challenge · ${ctx.area.name} · +${t.reward} tokens`, tone: "challenge" };
    /* Messages that carry feelings keep their fixed label, except for a Master, whose agent drafts two for him to choose from */
    if (t.tag && !(t.carriesFeelings && ctx.mode.id === "pro")) return { text: t.tag, tone: t.area === "chore" ? "chore" : t.area === "feelings" ? "care" : "care" };
    /* The label names the child's level in the skill (the same names as My skills), then what the agent will do */
    const line = (D.modeLines[ctx.area.id] || {})[ctx.mode.id] || ctx.mode.line, l = level(t.skill);
    return { text: `${ctx.area.tag} · ${ctx.skill.name} · ${l ? l.name : ctx.mode.name}: ${line}`, tone: ctx.mode.id };
  }

  /* The flow interpreter: runs DATA.flows[id] step by step. With `fast` (Faster response, chosen when sending)
     it starts at the flow's "fast" step. */
  async function startFlow(id, text, opts = {}) {
    cancelFlow();
    const run = chat.run;
    const task = taskDef(id);
    /* A pre-fed prompt for a skill that starts out new (algebra) always starts it fresh, so the unlock and, when he
       solves it on his own, the level up show every time, whatever an earlier run left saved. */
    if (!opts.challenge && D.prompts.includes(id) && task.skill && skillDef(task.skill).rating == null) { S.skills[task.skill] = { rating: null }; changed(); }
    const ctx = {
      run, id, task, hints: 0, misses: 0, shown: false, answers: {}, answer: null, rupee, challenge: !!opts.challenge,
      get wallet() { return S.wallet; }
    };
    if (id === "ch_headphones") ctx.products = D.products.headphones;
    if (task.skill && S.skills[task.skill].rating == null && opts.challenge) { S.skills[task.skill].rating = startRating(task.skill); changed(); }
    chat.ctx = ctx; chat.flow = id;
    numbers(ctx);
    push({ t: "child", text, fast: !!opts.fast });
    renderChips(); renderComposer();
    try {
      await runSteps(D.flows[id], ctx, opts.fast ? "fast" : null);
      if (!ctx.undone) S.done[id] = true;
    } catch (e) { if (e !== CANCEL) throw e; }
    if (run === chat.run) { chat.ctx = null; chat.flow = null; save(); renderChips(); renderComposer(); }
  }
  function cancelFlow() {
    chat.run++;
    if (chat.waiting) { const w = chat.waiting; chat.waiting = null; w.resolve(CANCEL); }
    chat.ctx = null; chat.flow = null; chat.queued = null;
    hideTyping();
  }

  async function runSteps(steps, ctx, from) {
    const at = id => { const i = steps.findIndex(s => s.id === id); if (i < 0) throw new Error("No step " + id); return i; };
    let i = from ? at(from) : 0;
    while (i < steps.length) {
      const st = steps[i];
      let next = i + 1;
      if (st.action) {
        const r = await ACTIONS[st.action](st, ctx);
        alive(ctx);
        if (typeof r === "string") next = at(r);
        else if (st.go && !st.from) next = at(st.go);
      }
      if (st.from === "agent") {
        await typing(st.fast ? 280 : rand(600, 1000), ctx);
        const chips = typeof st.chips === "function" ? st.chips(ctx) : st.chips;
        const waits = !!(chips || st.input || st.card === "products");
        const wid = waits ? "w" + (++chat.waitSeq) : null;
        push({ t: "agent", text: typeof st.text === "function" ? st.text(ctx) : st.text, tag: tagFor(ctx, st),
          card: st.card || null, cardData: cardData(st.card, ctx), wait: wid });
        if (waits) {
          const ans = await waitFor(wid, chips, st, ctx);
          alive(ctx);
          ctx.answer = ans.label;
          if (st.id) ctx.answers[st.id] = ans.label;
          if (ans.product) ctx.product = ans.product;
          push({ t: "child", text: ans.product ? `${ans.product.name}, ${rupee(ans.product.price)}` : ans.label });
          if (ans.go) next = at(ans.go); else if (st.go) next = at(st.go);
        } else if (st.go) next = at(st.go);
      }
      if (st.end) break;
      i = next;
    }
  }

  async function typing(ms, ctx) {
    chat.typing = true; renderComposer();
    const t = $("#thread");
    if (t && !$(".typing", t)) { t.insertAdjacentHTML("beforeend", `<div class="msg msg--agent typing"><div class="bubble"><i></i><i></i><i></i></div></div>`); scrollDown(); }
    await sleep(ms);
    hideTyping();
    chat.typing = false;
    alive(ctx);
  }
  function hideTyping() { $$(".typing").forEach(x => x.remove()); }

  function waitFor(id, chips, st, ctx) {
    return new Promise(resolve => {
      chat.waiting = { id, chips: chips || [], input: !!st.input, products: st.card === "products", resolve, ctx };
      renderChips(); renderComposer(); syncWaitButtons();
      if (chat.queued) { const q = chat.queued; chat.queued = null; setTimeout(() => typed(q), 0); }
    });
  }
  function answer(a) {
    if (!chat.waiting) return;
    const w = chat.waiting; chat.waiting = null;
    renderChips(); syncWaitButtons();
    w.resolve(a);
  }
  const chipObj = c => (typeof c === "string" ? { label: c } : c);

  /* Typed words pick the closest chip (README §7: free typing maps to the next scripted step). */
  function closestChip(text, chips) {
    const words = text.toLowerCase().match(/[a-z0-9.²³√−-]+/g) || [];
    let best = null, bestScore = 0;
    chips.map(chipObj).forEach(c => {
      const pool = (c.label + " " + (c.also || "")).toLowerCase();
      const score = words.filter(w => w.length > 0 && pool.split(/[^a-z0-9.²³√−-]+/).includes(w)).length;
      if (score > bestScore) { best = c; bestScore = score; }
    });
    return { chip: best, score: bestScore };
  }

  /* For now the only new requests are the pre-fed prompts (picked from the drop-down, or typed out in full). */
  const norm = s => String(s).toLowerCase().replace(/[−–]/g, "-").replace(/\s+/g, " ").trim();
  const promptTask = text => { const s = norm(text); return s ? D.prompts.map(taskDef).find(t => norm(t.prompt) === s || norm(t.chip) === s) : null; };

  /* Returns false when the text wasn't taken, so the composer keeps it. */
  function typed(raw) {
    const text = raw.trim();
    if (!text) return false;
    if (chat.waiting) {
      const w = chat.waiting;
      if (w.input) return answer({ label: text });
      if (w.products) {
        const p = w.ctx.products.find(x => text.toLowerCase().split(/\s+/).some(word => word.length > 3 && x.name.toLowerCase().includes(word)));
        if (p) return answer({ product: p, label: p.name });
      }
      const { chip, score } = closestChip(text, w.chips);
      const other = promptTask(text);
      if (!score && other && other.id !== chat.flow) return startFlow(other.id, other.prompt);
      if (w.products) return answer({ product: w.ctx.products[0], label: w.ctx.products[0].name });
      const c = chip || chipObj(w.chips[0]);
      return answer({ label: c.label, go: c.go });
    }
    if (chat.ctx) { chat.queued = text; return; }
    const t = promptTask(text);
    if (t) return startFlow(t.id, t.prompt);
    toast("For now, you can only use the pre-fed prompts.");
    return false;
  }

  /* ---------- Flow actions ---------- */
  const ACTIONS = {

    async unlock(st, ctx) {
      const id = ctx.task.skill, start = st.start || "start";
      if (S.skills[id].rating != null) return start;
      const sk = ctx.skill, from = levelFor(startRating(id), S.setup.child.age);
      /* The icon pops in with a burst of confetti in the area colours, then the track fills up to where he starts. */
      const colours = ["#4F46E5", "#2E6BE6", "#7A5AF8", "#DC6803", "#DD2590", "#0E9384", "#FDB022"];
      const confetti = Array.from({ length: 24 }, (_, k) =>
        `<i style="--a:${Math.round(k * 360 / 24)}deg;--d:${rand(70, 150)}px;--c:${colours[k % colours.length]};--t:${(k % 4) * 0.04}s"></i>`).join("");
      const yes = await modal({ cls: "unlock", html: `<div class="unlock-h" data-area="${sk.area.id}"><span class="unlock-ic">${icon(areaIcon(sk.area.id), 22)}<span class="confetti" aria-hidden="true">${confetti}</span></span>
            <p class="eyebrow eyebrow--accent">New skill unlocked</p></div>
          <h2>${esc(sk.name)}</h2>
          <p class="unlock-sub"><i class="dot dot--${sk.area.id}"></i>${esc(sk.area.name)}${sk.chapter ? " · " + esc(sk.chapter) : ""}</p>
          <div class="unlock-track" aria-label="Levels, starting at ${from.name}">
            <div class="track">${D.levels.bands.map((b, i) => `<i class="${i <= from.i ? "is-on" : ""}" style="--k:${i}"></i>`).join("")}</div>
            <div class="track-names">${D.levels.bands.map((b, i) =>
              `<span class="${i === from.i ? "is-start" : ""}">${b.name}${i === from.i ? "<em>You start here</em>" : ""}</span>`).join("")}</div>
            <p class="unlock-note">Every time you do it yourself, you move up.</p>
          </div>`,
        actions: [
          { label: "Yes, let's go", sub: `Start as ${article(from.name)}, based on your class`, icon: "arrow", value: "yes", primary: true },
          { label: "No, I'm not new to this skill", sub: st.noCheck ? "Start higher: this problem is the check" : "Answer 3 quick questions to start higher", icon: "check", value: "no" }
        ] });
      alive(ctx);
      if (yes === "no") {
        push({ t: "child", text: "No, I'm not new to this skill" });
        if (!st.noCheck) return "check";
        setStart(ctx, startRating(id) + 80, "claimed");
      } else setStart(ctx, startRating(id), "new");
      push({ t: "skill", data: cardData("skill", ctx) });
      await flyToSkills(ctx.skill.name);
      alive(ctx);
      return start;
    },
    miss(st, ctx) { ctx.misses++; },
    /* Three right: +80 on the class starting point; two right: +40; otherwise the starting point itself. */
    checkResult(st, ctx) {
      setStart(ctx, startRating(ctx.task.skill) + ({ 0: 80, 1: 40 }[ctx.misses] || 0), "checked");
    },
    async flySkill(st, ctx) { await flyToSkills(ctx.skill.name); },
    byMode(st, ctx) { numbers(ctx); return st.routes[ctx.mode.id]; },
    hint(st, ctx) { ctx.hints++; },
    shown(st, ctx) { ctx.hints++; ctx.shown = true; },

    async score(st, ctx) {
      const id = ctx.task.skill, old = S.skills[id].rating;
      const result = st.result != null ? st.result : ctx.shown ? 0 : ctx.hints ? 0.5 : 1;
      const exp = expectedFor(ctx.weight - old);
      const now = updateRating(old, result, exp);
      const before = levelFor(old, S.setup.child.age), after = levelFor(now, S.setup.child.age);
      S.skills[id].rating = now;
      S.ratingLog.push({ skill: id, from: old, to: now, result });
      rely(ctx.area.id, result);
      if (st.did && result > 0) S.didIt.push(st.did);
      changed();
      const up = after.i > before.i;
      /* All of it right, on his own: the level bar fills from where he was to where he is now (to the end, on a level up) */
      const bar = result === 1 && now > old ? { skill: ctx.skill.name, from: before.pct, to: up ? 100 : after.pct, delta: now - old,
        level: before.name, next: before.next ? before.next.name : null, after: after.name, up, moves: movesToNext(now),
        afterNext: after.next ? after.next.name : null, fresh: true } : null;
      const m = { t: "score", up, bar, text: up ? `Level up: ${ctx.skill.name} is now ${after.name}` : st.say || (result === 1 ? "That's all you" : result ? "Done with a little help" : "Worked through it together"),
        sub: up ? `Rating ${old} → ${now}` : `${ctx.skill.name}: ${after.name}` };
      push(m);
      /* it fills once, as it arrives; drawn again later (another screen, reopening the chat) it rests full */
      if (bar) { bar.fresh = false; save(); }
      if (bar && up) await sleep(1500);
      if (up) { await levelUp(ctx.skill, before, after, old, now); alive(ctx); }
    },

    faster(st, ctx) {
      const c = spendTokens(ctx.weight, "Faster response: " + (ctx.skill ? ctx.skill.name.toLowerCase() : "task"));
      ctx.fast = true;
      S.fasterOn.push(ctx.task.id);
      rely(ctx.area.id, 0);
      changed();
      push({ t: "score", spend: true, text: `−${c} tokens`, sub: "This one won't raise your rating" });
    },

    note(st, ctx) { if (st.undone) ctx.undone = true; push({ t: "note", text: st.text, icon: st.icon || "info" }); },

    /* The mail to the class teacher: the agent's version, a shorter one, or his own words with a subject added */
    shorten(st, ctx) { ctx.short = true; },
    ownMail(st, ctx) { ctx.own = ctx.answer; },
    sendMail(st, ctx) { toast("Sent to " + D.mail.to.split(",")[0] + ".", "ok"); },

    showProducts(st, ctx) { ctx.topic = st.topic; ctx.products = D.products[ctx.topic]; },
    /* An option with a warning (not allowed in the exam, or arriving after it) gets a heads-up before it's ordered */
    checkPick(st, ctx) { return ctx.product.bad ? "late" : "confirm"; },
    /* A Master's pick: the cheapest option without a warning, with the rest kept for "See other options" */
    pickForMe(st, ctx) {
      ctx.topic = st.topic;
      const all = D.products[ctx.topic];
      ctx.product = all.filter(p => !p.bad).sort((a, b) => a.price - b.price)[0];
      ctx.products = [ctx.product];
      ctx.others = all.filter(p => p !== ctx.product);
    },
    showOthers(st, ctx) { ctx.products = ctx.others; },
    checkMasterPick(st, ctx) { return ctx.product.bad ? "lateOne" : "orderNow"; },
    order(st, ctx) {
      S.wallet -= ctx.product.price;
      ctx.orderId = "BDE-40-" + rand(10000, 99999);
      S.orders.unshift({ id: ctx.orderId, name: ctx.product.name, price: ctx.product.price, at: clock() });
      changed();
    },
    autoOrder(st, ctx) {
      if (!ctx.products) ctx.products = D.products[st.topic];
      ctx.product = ctx.products.filter(p => !p.bad).sort((a, b) => a.price - b.price)[0];
      ACTIONS.order(st, ctx);
    },

    reward(st, ctx) {
      const ch = ctx.task;
      ACTIONS.score({ result: ctx.hints ? 0.5 : 1 }, ctx);
      S.tokens += ch.reward; S.earned += ch.reward;
      logTokens(ch.reward, "Challenge: " + ch.title.replace(/\s*\(.*\)$/, ""));
      S.done[ch.id] = true;
      changed();
      push({ t: "reward", n: ch.reward, text: ch.title });
      floatTokens(ch.reward);
    },
    echoDraft() {}
  };
  function setStart(ctx, rating, how) {
    const id = ctx.task.skill;
    S.skills[id].rating = rating; S.skills[id].start = rating; changed();
    numbers(ctx);
    const l = levelFor(rating, S.setup.child.age), sk = skillDef(id);
    const right = 3 - Math.min(3, ctx.misses);
    const text = {
      new: `New skill: ${sk.name}. You're starting as ${article(l.name)}.`,
      checked: `You got ${right} of 3. You're starting ${sk.name} as ${article(l.name)}${right < 3 ? "; we'll build from here" : ""}.`,
      claimed: `Got it. You're starting ${sk.name} as ${article(l.name)}. This problem is the check.`
    }[how];
    push({ t: "note", icon: "spark", text });
  }

  /* Level up: the old level gives way to the new one, the next segment of the track fills with a shine, the rating
     counts up, confetti bursts from the badge and the Bud-e mark giggles. Closing it bumps the My skills tab. */
  async function levelUp(sk, before, after, from, to) {
    const colours = ["#2F6BFF", "#7A5AF8", "#DD2590", "#F2A65E", "#0E9384", "#FDB022", "#4E88F5"];
    const confetti = Array.from({ length: 32 }, (_, k) =>
      `<i style="--a:${Math.round(k * 360 / 32)}deg;--d:${rand(90, 190)}px;--c:${colours[k % colours.length]};--t:${(k % 4) * 0.05 + .45}s"></i>`).join("");
    const next = after.next;
    const done = modal({ cls: "levelup", html: `<div class="lu-stage">
          <span class="lu-rays" aria-hidden="true"></span>
          <span class="lu-badge">${icon("trophy", 34)}<span class="confetti" aria-hidden="true">${confetti}</span></span>
          <span class="lu-mark">${mark(54, true)}</span>
        </div>
        <p class="eyebrow eyebrow--accent">Level up · ${esc(sk.name)}</p>
        <div class="lu-swap" aria-label="${esc(before.name)} to ${esc(after.name)}">
          <span class="lu-old">${esc(before.name)}</span><span class="lu-new">${esc(after.name)}</span>
        </div>
        <p class="lu-rating"><b class="lu-num">${from}</b><span>rating</span><em>+${to - from}</em></p>
        <div class="unlock-track lu-track">
          <div class="track">${D.levels.bands.map((b, i) => `<i class="${i < after.i ? "is-done" : i === after.i ? "is-new" : ""}"></i>`).join("")}</div>
          <div class="track-names">${D.levels.bands.map((b, i) => `<span class="${i === after.i ? "is-start" : ""}">${b.name}${i === after.i ? "<em>You're here</em>" : ""}</span>`).join("")}</div>
          <p class="unlock-note">You did it on your own, so you moved up.${next ? ` Next: ${next.name} at ${next.min}.` : ""}</p>
        </div>`,
      actions: [{ label: "Nice!", value: true, primary: true }] });
    const num = $(".levelup .lu-num"), m = $(".levelup .mark--live");
    if (num && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => { if (m) m.classList.add("is-giggling"); }, 650);
      setTimeout(() => { if (m) m.classList.remove("is-giggling"); }, 1650);
      const t0 = performance.now() + 700, dur = 900;
      const tick = t => {
        const k = Math.max(0, Math.min(1, (t - t0) / dur));
        num.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1 && num.isConnected) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else if (num) num.textContent = to;
    await done;
    const tabEl = $('.tab[href="#/progress"]');
    if (tabEl) { tabEl.classList.remove("is-bump"); void tabEl.offsetWidth; tabEl.classList.add("is-bump"); }
  }

  /* A newly unlocked skill flies from its card in the chat into the My skills tab, which then shows a dot until visited. */
  async function flyToSkills(skillName) {
    const m = S.thread.slice().reverse().find(x => x.t === "skill" || x.card === "skill");
    if (m) (m.data || m.cardData).filed = true;
    S.newSkill = true; save();
    const card = $$(".skillcard").pop(), tabEl = $('.tab[href="#/progress"]');
    const target = tabEl && tabEl.querySelector(".ic");
    if (card && target && target.getClientRects().length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await sleep(350);
      const a = card.getBoundingClientRect(), b = target.getBoundingClientRect();
      const ghost = card.cloneNode(true);
      ghost.classList.add("skillcard--fly");
      Object.assign(ghost.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px" });
      document.body.appendChild(ghost);
      card.classList.add("is-filed");
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const flight = ghost.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${dx * .45}px, ${dy * .45 - 70}px) scale(.62) rotate(-6deg)`, opacity: 1, offset: .5 },
        { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: .15 }
      ], { duration: 950, easing: "cubic-bezier(.55, 0, .3, 1)" });
      /* Browsers pause animations in background tabs; never let that hold up the chat. */
      await Promise.race([flight.finished.catch(() => {}), sleep(1100)]);
      ghost.remove();
    } else if (card) card.classList.add("is-filed");
    const t = $('.tab[href="#/progress"]');
    if (t) {
      if (!$(".tab-dot", t)) t.insertAdjacentHTML("beforeend", '<i class="tab-dot" aria-label="New skill"></i>');
      t.classList.remove("is-bump"); void t.offsetWidth; t.classList.add("is-bump");
    }
    toast(`${skillName} added to My skills`, "ok");
    await sleep(300);
  }

  function cardData(card, ctx) {
    if (card === "skill") {
      const r = S.skills[ctx.task.skill].rating, l = levelFor(r, S.setup.child.age);
      return { name: ctx.skill.name, area: ctx.area.name, areaId: ctx.area.id, level: l.name, i: l.i };
    }
    if (card === "products") {
      const wallet = ctx.challenge ? null : S.wallet, monthly = S.setup.walletMonthly, master = !ctx.challenge && ctx.mode.id === "pro";
      return { items: ctx.products.map(p => Object.assign({}, p)), wallet, monthly, one: ctx.products.length === 1,
        /* a Master's pick orders on one tap; below that he chooses, with a nudge about his wallet */
        verb: master ? "Order" : "Choose", advice: wallet == null || master ? null : walletAdvice(ctx.products, wallet, monthly) };
    }
    if (card === "mail") {
      const fill = t => t.replace(/\{name\}/g, name()).replace(/\{class\}/g, S.setup.child.classNo);
      return { to: D.mail.to, subject: D.mail.subject,
        body: ctx.own ? "Dear Ms Kulkarni,\n\n" + ctx.own.replace(/^dear [^,]*,\s*/i, "") + "\n\nThank you,\n" + name() + ", Class " + S.setup.child.classNo
          : fill(ctx.short ? D.mail.short : D.mail.body) };
    }
    if (card === "order") return { id: ctx.orderId, name: ctx.product.name, price: ctx.product.price, wallet: S.wallet, photo: ctx.product.photo, pic: ctx.product.pic };
    return null;
  }
  /* Once over a third of the month's money is gone, the options end with the one that's easiest on the wallet. */
  function walletAdvice(items, wallet, monthly) {
    const spent = monthly - wallet, onTime = items.filter(p => !p.bad);
    if (!onTime.length || spent < monthly / 3) return null;
    const best = onTime.slice().sort((a, b) => a.price - b.price)[0], most = items.every(p => p.price >= best.price);
    return `It's only mid-month and you've already spent ${rupee(spent)} of your ${rupee(monthly)}. The ${best.say || best.name.toLowerCase()} (${rupee(best.price)}) ` +
      `is allowed, arrives in time and leaves you ${rupee(wallet - best.price)}${most ? ", the most of these" : ""}, so it's the easiest on your pocket.`;
  }

  /* ---------- Chat rendering ---------- */
  function msgHTML(m, prev) {
    switch (m.t) {
      case "child": return `<div class="msg msg--me">${m.fast ? `<span class="me-fast">${icon("bolt", 13)} Faster response</span>` : ""}<div class="bubble">${esc(m.text)}</div></div>`;
      case "agent": {
        const showTag = !(prev && prev.t === "agent" && prev.tag && prev.tag.text === m.tag.text);
        return `<div class="msg msg--agent ${showTag ? "" : "is-cont"} ${m.card === "products" ? "msg--wide" : ""}">
          ${showTag ? tagHTML(m.tag) : ""}
          <div class="bubble">${esc(m.text).replace(/\n/g, "<br>")}</div>
          ${m.card ? cardHTML(m) : ""}
        </div>`;
      }
      case "skill": return skillCardHTML(m.data);
      case "note": return `<div class="note">${icon(m.icon || "info", 15)}<span>${esc(m.text)}</span></div>`;
      case "score": return `<div class="score ${m.up ? "is-up" : ""} ${m.spend ? "is-spend" : ""} ${m.bar ? "has-bar" : ""}">
          <span class="score-ic">${icon(m.spend ? "bolt" : m.up ? "trophy" : "check", 16)}</span><div class="score-t"><b>${esc(m.text)}</b>${m.sub ? `<span>${esc(m.sub)}</span>` : ""}</div>
          ${m.bar ? levelBarHTML(m.bar) : ""}</div>`;
      case "reward": return `<div class="card reward"><div class="reward-n">+${m.n}</div><div><b>Challenge complete</b><span>${esc(m.text)}</span></div>${icon("coin", 30, "reward-ic")}</div>`;
      default: return "";
    }
  }
  /* The level bar on a fully right answer: this level's name, the next one's, the rating gained, and the bar filling
     from where he was to where he is now. On a level up it fills to the end and the next level lights up. */
  const levelBarHTML = b => `<div class="lvbar ${b.fresh ? "is-new" : ""} ${b.up ? "is-up" : ""}" role="img"
      aria-label="${esc(b.skill)}: ${esc(b.level)} bar from ${b.from}% to ${b.to}%${b.up ? ", now " + esc(b.after) : ""}">
      <div class="lvbar-h"><span class="lvbar-l">${esc(b.level)}</span><em class="lvbar-d">+${b.delta}</em>${b.next ? `<span class="lvbar-n">${esc(b.next)}</span>` : ""}</div>
      <div class="lvbar-t"><i style="--from:${b.from}%;--to:${b.to}%"></i></div>
      <p class="lvbar-f">${b.up ? `${esc(b.skill)} is now ${esc(b.after)}${b.afterNext ? `. Next: ${esc(b.afterNext)}` : ""}` : b.next ? `${b.moves} more on your own to reach ${esc(b.next)}` : "Top level for your age group"}</p>
    </div>`;
  /* The reply label: "Study · Algebra · Confident: quick check…" shows the part before the colon in caps, the rest as plain text. */
  const tagHTML = tag => {
    const [head, ...rest] = tag.text.split(": ");
    return `<div class="tag tag--${tag.tone}"><b>${esc(head)}</b>${rest.length ? `<span>${esc(rest.join(": "))}</span>` : ""}</div>`;
  };
  const skillCardHTML = d =>`<div class="card skillcard ${d.filed ? "is-filed" : ""}"><span class="sc-ic">${icon(areaIcon(d.areaId), 20)}</span>
    <div class="sc-t"><b>${esc(d.name)}</b><span>${esc(d.area)} · new skill</span></div><span class="lvl lvl--${d.i}">${esc(d.level)}</span>
    <span class="sc-filed">${icon("check", 14)} In My skills</span></div>`;
  function cardHTML(m) {
    const d = m.cardData;
    if (m.card === "skill") return skillCardHTML(d);
    /* Product cards: photo, delivery badge (late ones flagged before he picks), price, and what's left in the wallet after.
       The line icon sits under the photo and shows if the photo can't load. */
    if (m.card === "products") return `<div class="card products">
        <div class="prod-h">${icon("shield", 15)}<span>No sponsored options</span>${d.wallet == null ? '<em>Practice only, nothing is ordered</em>' : `<em>${icon("wallet", 14)} Wallet now <b>${rupee(d.wallet)}</b></em>`}</div>
        <div class="prod-grid ${d.one ? "prod-grid--one" : ""}">${d.items.map(p => {
          const after = d.wallet == null ? null : d.wallet - p.price;
          const when = p.badge ? `<span class="pc-when ${p.bad ? "is-late" : ""}">${icon(p.bad ? "info" : "check", 13)}${esc(p.badge)}</span>`
            : `<span class="pc-note">${esc(p.note)}</span>`;
          return `<article class="pc ${p.bad ? "is-late" : ""}">
            <div class="pc-pic" aria-hidden="true">${icon(p.pic || "gift", 46)}${p.photo ? `<img src="${esc(p.photo)}" alt="" onerror="this.remove()">` : ""}</div>
            <div class="pc-b">
              <b class="pc-name">${esc(p.name)}</b>
              ${when}
              <div class="pc-price"><b>${rupee(p.price)}</b>${after == null ? "" : `<span class="${after < d.monthly * .25 ? "is-low" : ""}">${rupee(after)} left after</span>`}</div>
              ${after == null ? "" : `<div class="pc-meter" title="Wallet left after this"><i style="width:${Math.max(0, Math.min(100, Math.round(after / d.monthly * 100)))}%"></i></div>`}
            </div>
            <button class="btn small block ${d.verb === "Order" ? "primary" : ""}" data-pick="${p.id}" data-w="${m.wait}">${d.verb || "Choose"}</button>
          </article>`;
        }).join("")}</div>
        ${d.advice ? `<p class="prod-advice">${icon("wallet", 16)}<span>${esc(d.advice)}</span></p>` : ""}</div>`;
    if (m.card === "mail") return `<div class="card letter"><div class="letter-h">${icon("mail", 15)}<span><b>To:</b> ${esc(d.to)}</span></div>
        <div class="letter-s">${esc(d.subject)}</div><p>${esc(d.body).replace(/\n/g, "<br>")}</p></div>`;
    if (m.card === "order") return `<div class="card order"><div class="ride-ic">${icon(d.pic || "gift", 22)}${d.photo ? `<img src="${esc(d.photo)}" alt="" onerror="this.remove()">` : ""}</div><div class="ride-b"><b>${esc(d.name)}</b><span>Order ${esc(d.id)} · ${rupee(d.price)}</span><span class="muted">Wallet now ${rupee(d.wallet)}</span></div>${icon("check", 18, "ok")}</div>`;
    return "";
  }
  function syncWaitButtons() {
    const cur = chat.waiting && chat.waiting.id;
    $$("[data-w]").forEach(b => { b.disabled = b.dataset.w !== cur; });
  }

  /* Reply chips: only the answers to the agent's current question. */
  function renderChips() {
    const box = $("#chips"); if (!box) return;
    const w = chat.waiting;
    /* `draft` chips are ready replies to choose from: full-width, the whole message on show */
    const html = w ? w.chips.map(chipObj).map((c, i) => `<button class="chip ${w.input ? "chip--draft" : ""} ${c.draft ? "chip--reply" : ""} ${c.primary ? "chip--go" : ""}" data-chip="${i}">${w.input ? icon("pen", 14) : ""}${c.draft ? `<span class="reply-n">Reply ${i + 1}</span>` : ""}<span>${esc(c.label)}</span>${c.primary ? icon("arrow", 15) : ""}</button>`).join("") : "";
    box.innerHTML = html;
    box.hidden = !html;
    /* the chips take room from the thread, so keep its last message (a skill card, say) in view */
    requestAnimationFrame(scrollDown);
  }

  /* Faster response is chosen when sending a new request, next to Send, and never partway through a chat. */
  function fasterState(t) {
    if (!t) return { state: "idle", why: "Pick a prompt first. For now, only the pre-fed prompts work." };
    if (t.area === "chore") return { state: "free", why: "Chores are always instant and free, so no tokens are needed." };
    if (t.area === "feelings") return { state: "locked", why: "Feelings aren't something to rush, so there's no Faster response here." };
    if (t.carriesFeelings) return { state: "locked", why: "Messages that carry feelings are written by you, so there's no Faster response here." };
    const cost = costFor(t.weight);
    return S.tokens < cost ? { state: "short", cost, why: `This needs ${cost} tokens and you have ${S.tokens}. Earn more on the Tokens page.` }
      : { state: "ready", cost, why: `Uses ${cost} tokens. Your agent just does it, and your rating doesn't change.` };
  }
  function renderComposer() {
    const wrap = $("#fasterWrap"), input = $("#input");
    if (!wrap || !input) return;
    const w = chat.waiting, ctx = chat.ctx;
    wrap.hidden = !!ctx;
    if (!ctx) {
      const f = fasterState(promptTask(input.value)), b = $("#faster");
      b.className = "faster is-" + f.state;
      b.title = f.why;
      b.innerHTML = `${icon(f.state === "locked" ? "lock" : "bolt", 16)}<span>Faster response</span>${f.cost ? `<em>${f.cost}</em>` : f.state === "free" ? "<em>free</em>" : ""}`;
    }
    /* The wallet shows in the chat header only during a money task (the date is already in the top bar). */
    const side = $("#chatSide");
    if (side) {
      const money = ctx && !ctx.challenge && ctx.area && ctx.area.id === "money";
      side.className = "chat-wallet";
      side.hidden = !money;
      side.innerHTML = money ? `${icon("wallet", 15)}Wallet <b>${rupee(S.wallet)}</b>` : "";
    }
    input.placeholder = w && w.input ? "Write it in your own words…" : w ? "Pick an option, or type your answer…" : ctx ? "…" : "Type to see what I can help with…";
  }

  /* The pre-fed prompts drop down from the composer while typing: a plain list, filtered by what's typed. */
  let promptHL = -1;
  function renderPrompts() {
    const box = $("#prompts"), input = $("#input");
    const words = norm(input.value).split(" ").filter(Boolean);
    const all = D.prompts.map(taskDef);
    let list = all.filter(t => words.every(w => norm(t.prompt + " " + t.chip).includes(w)));
    const none = !list.length;
    if (none) list = all;
    box.innerHTML = `<div class="prompts-h">${icon("info", 14)}<span>For now, you can only use these pre-fed prompts.</span></div>
      ${none ? `<p class="prompts-none">Nothing matches “${esc(input.value.trim())}”. Pick one of these:</p>` : ""}
      <div class="pgroup">${list.map((t, n) => `<button type="button" class="prompt ${n === promptHL ? "is-hl" : ""}" data-prompt="${t.id}" role="option"><span>${esc(t.prompt)}</span></button>`).join("")}</div>`;
  }
  function openPrompts() {
    const box = $("#prompts");
    if (!box || chat.ctx) return;
    if (promptTask($("#input").value)) { closePrompts(); return; }
    promptHL = -1; renderPrompts(); box.hidden = false;
  }
  function closePrompts() { const box = $("#prompts"); if (box) box.hidden = true; promptHL = -1; }
  function pickPrompt(id) {
    const input = $("#input");
    input.value = taskDef(id).prompt;
    closePrompts(); renderComposer(); input.focus();
  }
  const greeting = () => { const h = storyNow().getHours(); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };

  function viewChat(main) {
    const home = !S.thread.length;
    main.innerHTML = `<section class="chat ${home ? "chat--home" : ""}">
      <div class="chat-h"><div class="agent-id"><span class="agent-av">${mark(30, true)}</span><div><b>${agents().length > 1 ? "My agents" : "My agent"}</b><span>${esc(agentList())} · through Bud-e</span></div></div>
        <div class="chat-h-r"><span class="chat-wallet" id="chatSide" hidden></span><button class="btn ghost small" data-newchat aria-label="New chat">${icon("plus", 15)}<span>New chat</span></button></div></div>
      <div class="scroll" id="scroll"><div class="thread" id="thread" role="log" aria-live="polite" aria-label="Chat"></div></div>
      <div class="dock">
        <div class="chips" id="chips" hidden></div>
        <div class="ring"><div class="prompts" id="prompts" role="listbox" aria-label="Pre-fed prompts" hidden></div>
          <form class="composer" id="composer" autocomplete="off">
          <input id="input" placeholder="Type to see what I can help with…" aria-label="Message my agent" aria-controls="prompts">
          <div class="composer-row">
            <div class="composer-tools"><button type="button" class="tool" data-off>${icon("clip", 15)}<span>Attach</span></button><button type="button" class="tool" data-off>${icon("mic", 15)}<span>Voice</span></button></div>
            <div class="composer-go">
              <div class="faster-wrap" id="fasterWrap"><button type="button" class="faster" id="faster"></button><small class="tok-left"><b class="token-count">${S.tokens}</b> tokens left</small></div>
              <button class="send" aria-label="Send"><span>Send</span>${icon("send", 16)}</button>
            </div>
          </div>
        </form></div>
        ${S.didIt.length ? `<div class="home-foot"><span><b>${S.didIt.length}</b> solo ${S.didIt.length === 1 ? "win" : "wins"} this week</span></div>` : ""}
      </div>
    </section>`;
    const t = $("#thread");
    if (home) {
      t.innerHTML = `<div class="thread-empty">
        <div class="hero-mark">${mark(118, true)}</div>
        <p class="badge-pill"><b>New</b>Your ${agents().length > 1 ? "agents are" : "agent is"} ${esc(agentList())}, through Bud-e</p>
        <h1><span>${greeting()}, ${esc(name())}.</span><br>What are we doing <em>today?</em></h1>
        <p class="home-hint">Start typing to pick a prompt. Then press <b>Send</b>, or <b>Faster response</b> if you're in a hurry.</p>
      </div>`;
    } else {
      t.innerHTML = S.thread.map((m, i) => msgHTML(m, S.thread[i - 1])).join("");
      if (chat.typing) t.insertAdjacentHTML("beforeend", `<div class="msg msg--agent typing"><div class="bubble"><i></i><i></i><i></i></div></div>`);
    }
    syncWaitButtons(); renderChips();
    requestAnimationFrame(scrollDown);
    const input = $("#input"), box = $("#prompts");
    $("#composer").addEventListener("submit", e => {
      e.preventDefault();
      const v = input.value; input.value = ""; closePrompts();
      if (typed(v) === false && !chat.ctx) { input.value = v; openPrompts(); }
      renderComposer();
    });
    input.addEventListener("input", () => { renderComposer(); openPrompts(); });
    input.addEventListener("click", openPrompts);
    input.addEventListener("blur", () => setTimeout(closePrompts, 120));
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" && box.hidden) { openPrompts(); return; }
      if (box.hidden) return;
      const items = $$(".prompt", box);
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && items.length) {
        e.preventDefault();
        promptHL = e.key === "ArrowDown" ? (promptHL + 1) % items.length : promptHL <= 0 ? items.length - 1 : promptHL - 1;
        items.forEach((b, i) => b.classList.toggle("is-hl", i === promptHL));
        items[promptHL].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && promptHL >= 0) { e.preventDefault(); pickPrompt(items[promptHL].dataset.prompt); }
      else if (e.key === "Escape") closePrompts();
    });
    /* mousedown, not click, so the input keeps focus while a prompt is picked */
    box.addEventListener("mousedown", e => { e.preventDefault(); const b = e.target.closest("[data-prompt]"); if (b) pickPrompt(b.dataset.prompt); });
    $("#faster").addEventListener("click", onFaster);
    if (pendingPrefill) { input.value = pendingPrefill; pendingPrefill = ""; }
    renderComposer();
    if (window.matchMedia("(min-width: 760px)").matches) input.focus();
  }

  async function onFaster() {
    if (chat.ctx) return;
    const input = $("#input"), t = promptTask(input.value), f = fasterState(t);
    if (f.state === "idle") { toast("Pick a prompt first."); input.focus(); openPrompts(); return; }
    if (f.state === "free") { toast(f.why); input.value = ""; closePrompts(); startFlow(t.id, t.prompt); return; }
    if (f.state !== "ready") { toast(f.why); return; }
    const ok = await modal({ cls: "confirm", html: `<div class="confirm-ic">${icon("bolt", 24)}</div><h2>Faster response?</h2>
        <p>This will use <b>${f.cost} tokens</b> (you have ${S.tokens}). Continue?</p><p class="muted">Faster responses don't raise your rating.</p>`,
      actions: [{ label: "Cancel", value: false, cancel: true }, { label: "Yes, use " + f.cost, value: true, primary: true }] });
    if (!ok || chat.ctx || promptTask(input.value) !== t) return;
    input.value = ""; closePrompts();
    startFlow(t.id, t.prompt, { fast: true });
  }

  /* ---------- Tokens (S11): balance, ways to earn, this week's activity ---------- */
  function balanceCard(cls, label, big, of, pct, foot) {
    return `<section class="bal ${cls}"><span class="bal-l">${label}</span>
      <div class="bal-n">${big}<span>${of}</span></div><div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>
      <p class="bal-f">${foot}</p></section>`;
  }
  function viewEarn(main) {
    main.innerHTML = `<div class="page">
      <header class="page-h"><div><h1>Tokens</h1><p class="sub">Use them for a Faster response when you're in a hurry. Earn more by doing things yourself.</p></div></header>
      ${balanceCard("bal--tokens", "Tokens this week", `<b class="token-count">${S.tokens}</b>`, `/ ${D.child.tokensWeekly}`,
        (S.tokens / D.child.tokensWeekly) * 100, `Resets every ${D.today.reset} · used ${S.spent} · earned ${S.earned}`)}
      <h2 class="sec-h">Earn tokens</h2>
      <p class="sec-sub">This week's challenges, picked from what you've been doing. Finish one to earn its tokens.</p>
      <div class="challenges">${D.challenges.map(c => {
        const done = S.done[c.id];
        return `<article class="ch ${done ? "is-done" : ""}">
          <span class="ch-area">${icon(areaIcon(c.area), 15)}${esc(area(c.area).name)}</span>
          <h3>${esc(c.title)}</h3>
          <div class="ch-f"><span class="ch-r">${icon("coin", 16)}+${c.reward}</span>
          ${done ? `<span class="ch-done">${icon("check", 16)} Done</span>` : c.off ? `<span class="ch-soon">${icon("lock", 14)} Unlocks ${D.today.reset}</span>` : `<button class="btn primary small" data-challenge="${c.id}">Start</button>`}</div>
        </article>`;
      }).join("")}</div>
      <section class="panel"><div class="panel-h"><b>This week</b></div>
        ${S.tokenLog.length ? `<ul class="log">${S.tokenLog.map(logRow).join("")}</ul>` : `<p class="muted">No token activity yet this week.</p>`}</section>
    </div>`;
  }

  /* ---------- Wallet (S12): pocket money and orders ---------- */
  function viewWallet(main) {
    const on = S.setup.perms.wallet, monthly = S.setup.walletMonthly;
    main.innerHTML = `<div class="page">
      <header class="page-h"><div><h1>Wallet</h1><p class="sub">Pocket money from ${esc(S.setup.parent.name.split(" ")[0])}. When you shop through your agent, you see what each option does to it before you choose.</p></div></header>
      ${on ? balanceCard("bal--wallet", "Left this month", `<b class="wallet-count">${rupee(S.wallet)}</b>`, `of ${rupee(monthly)}`,
          monthly ? (S.wallet / monthly) * 100 : 0, `Spent ${rupee(monthly - S.wallet)} this month · no sponsored options, ever`)
        : `<section class="panel"><p>The wallet is turned off. Ask ${esc(S.setup.parent.name.split(" ")[0])} to switch it on in Bud-e's settings.</p></section>`}
      <section class="panel"><div class="panel-h"><b>Orders</b></div>
        ${S.orders.length ? `<ul class="log">${S.orders.map(o => `<li><span>${esc(o.name)}</span><em>${esc(o.id)}</em><b class="neg">−${rupee(o.price)}</b></li>`).join("")}</ul>` : `<p class="muted">No orders yet this month.</p>`}</section>
    </div>`;
  }
  const logRow = x => `<li><span>${esc(x.label)}</span><em>${esc(x.at)}</em><b class="${x.delta > 0 ? "pos" : x.delta < 0 ? "neg" : ""}">${x.delta ? signed(x.delta) : "0"}</b></li>`;

  /* ---------- S13 My skills ---------- */
  function viewProgress(main) {
    const age = S.setup.child.age;
    const areas = D.areas.map(a => {
      const body = a.care
        ? `<p class="care">${icon("heart", 16)} Feelings are always handled the same way, with care. No levels, no tokens: I listen, then point you to people who know you.</p>`
        : a.skills.map(s => {
          const r = S.skills[s.id].rating;
          if (r == null) return `<div class="prog prog--new"><div class="prog-t"><b>${esc(s.name)}</b><span class="lvl lvl--new">Not unlocked</span></div><p class="muted">Unlocks the first time you ask about ${esc(s.name.toLowerCase())}.</p></div>`;
          const l = levelFor(r, age), n = movesToNext(r);
          return `<div class="prog"><div class="prog-t"><b>${esc(s.name)}</b><span class="lvl lvl--${l.i}">${l.name}</span></div>
            <div class="ladder">${D.levels.bands.map((b, i) => `<span class="${i < l.i ? "is-past" : i === l.i ? "is-now" : ""}">${i === l.i ? `<i style="width:${l.pct}%"></i>` : ""}</span>`).join("")}</div>
            <p class="muted">${l.next ? `${esc(s.name)}: ${n} more on your own to reach ${l.next.name}` : "Top level for your age group"}</p></div>`;
        }).join("");
      return `<section class="panel parea" data-area="${a.id}"><div class="panel-h"><span class="pa-ic">${icon(areaIcon(a.id), 18)}</span><b>${esc(a.name)}</b></div>${body}</section>`;
    }).join("");
    main.innerHTML = `<div class="page">
      <header class="page-h"><div><h1>My skills</h1><p class="sub">Levels compare you with ${levelFor(0, age).group}, so they grow with you.</p></div>
        <button class="btn ghost" id="parentsee">${icon("eye", 17)} What my parents see</button></header>
      <div class="levels-key">${D.levels.bands.map((b, i) => `<span class="lvl lvl--${i}">${b.name}</span>`).join(`<span class="arrow">${icon("chevron", 14)}</span>`)}</div>
      <div class="pgrid">${areas}</div>
    </div>`;
    $("#parentsee").addEventListener("click", () => {
      /* The child sees only the privacy note: the report itself is for the parent. */
      modal({ cls: "preview", html: `<p class="eyebrow">${icon("eye", 14)} Read-only preview</p><h2>What ${esc(S.setup.parent.name.split(" ")[0])} sees</h2>
        <div class="never">${icon("lock", 16)}<span><b>Your privacy is protected.</b> Your parents never see your chats, only how you're growing overall: your levels, what you did on your own, and where you're improving.</span></div>`,
        actions: [{ label: "Close", value: null, primary: true }] });
    });
  }

  /* ---------- S14 Parent weekly report ---------- */
  /* Growth charts. Each skill gets its own small line chart on its own scale; a dashed line marks the next level. */
  function lineChart(vals, labels, next) {
    const W = 280, H = 128, L = 32, R = 6, T = 16, B = 22, n = vals.length;
    let lo = Math.min(...vals), hi = Math.max(...vals);
    if (next && next.min - hi <= 90) hi = Math.max(hi, next.min);
    lo = Math.floor((lo - 15) / 50) * 50; hi = Math.ceil((hi + 15) / 50) * 50;
    const x = i => n === 1 ? (L + W - R) / 2 : L + i * (W - L - R) / (n - 1);
    const y = v => T + ((hi - v) / (hi - lo)) * (H - T - B);
    const ticks = [lo, (lo + hi) / 2, hi];
    const lvl = next && next.min > lo && next.min <= hi
      ? `<line class="gc-lvl" x1="${L}" x2="${W - R}" y1="${y(next.min)}" y2="${y(next.min)}"/><text class="gc-lvl-t" x="${W - R}" y="${y(next.min) - 5}" text-anchor="end">${next.name} ${next.min}</text>` : "";
    const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    return `<svg class="gchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${vals.map((v, i) => labels[i] + ": " + v).join(", ")}">
      ${ticks.map(t => `<line class="gc-grid" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text class="gc-ax" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t}</text>`).join("")}
      ${lvl}
      ${n > 1 ? `<polyline class="gc-line" points="${pts}"/>` : ""}
      ${vals.map((v, i) => `<g class="gc-pt${i === n - 1 ? " is-now" : ""}"><circle class="gc-hit" cx="${x(i)}" cy="${y(v)}" r="12"/><circle cx="${x(i)}" cy="${y(v)}" r="4.5"/><title>${labels[i]}: ${v}</title></g>`).join("")}
      <text class="gc-val" x="${x(n - 1) + (n === 1 ? 10 : 0)}" y="${y(vals[n - 1]) + (n === 1 ? 4 : -10)}" text-anchor="${n === 1 ? "start" : "end"}">${vals[n - 1]}</text>
      <text class="gc-ax" x="${x(0)}" y="${H - 6}" text-anchor="${n === 1 ? "middle" : "start"}">${labels[0]}</text>
      ${n > 1 ? `<text class="gc-ax" x="${x(n - 1)}" y="${H - 6}" text-anchor="end">${labels[n - 1]}</text>` : ""}
    </svg>`;
  }
  function barChart(vals, labels) {
    const W = 900, H = 200, L = 40, R = 8, T = 24, B = 28, n = vals.length;
    const slot = (W - L - R) / n, bw = Math.min(64, slot * 0.6), base = H - B;
    const y = v => T + ((100 - v) / 100) * (base - T);
    const bar = (x, top) => `M${x},${base}V${top + 4}Q${x},${top} ${x + 4},${top}H${x + bw - 4}Q${x + bw},${top} ${x + bw},${top + 4}V${base}Z`;
    return `<svg class="gchart gchart--bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="${vals.map((v, i) => labels[i] + ": " + v + "%").join(", ")}">
      ${[0, 50, 100].map(t => `<line class="gc-grid" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text class="gc-ax" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t}%</text>`).join("")}
      ${vals.map((v, i) => { const x = L + i * slot + (slot - bw) / 2; return `<g class="gc-bar${i === n - 1 ? " is-now" : ""}">
        <rect class="gc-hit" x="${L + i * slot}" y="${T}" width="${slot}" height="${base - T}"/><path d="${bar(x, y(v))}"/><title>${labels[i]}: ${v}% himself</title>
        ${i === 0 || i === n - 1 ? `<text class="gc-val" x="${x + bw / 2}" y="${y(v) - 7}" text-anchor="middle">${v}%</text>` : ""}
        <text class="gc-ax" x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${labels[i]}</text></g>`; }).join("")}
    </svg>`;
  }

  function reportHTML() {
    const n = esc(name()), age = S.setup.child.age;
    /* Each area against what's expected at his level: on track, a little below (within 15 points), or needs a nudge. */
    let selfSum = 0, totalSum = 0;
    const rel = D.report.reliance.map(r => {
      const s = S.reliance[r.area] || { self: 0, total: 0 };
      selfSum += r.self + s.self; totalSum += r.total + s.total;
      const pct = Math.round(((r.self + s.self) / (r.total + s.total)) * 100), gap = pct - r.expected;
      const status = gap >= 0 ? { k: "ok", label: "On track" } : gap >= -15 ? { k: "near", label: "A little below" } : { k: "low", label: "Needs a nudge" };
      return { id: r.area, name: area(r.area).name, short: area(r.area).tag, pct, expected: r.expected, gap, status };
    });
    const behind = rel.filter(r => r.gap < 0).sort((a, b) => a.gap - b.gap);
    const relSummary = `On track in ${rel.length - behind.length} of ${rel.length} areas.` + (behind.length
      ? ` Most room to grow: ${behind.slice(0, 2).map(r => r.short).join(" and ")}.` : "");
    const weekShare = Math.round((selfSum / totalSum) * 100);
    const labels = D.report.weeks.concat("This week");
    const skills = [];
    D.areas.forEach(a => a.skills.forEach(sk => skills.push(sk)));
    skills.sort((p, q) => (S.skills[p.id].rating == null) - (S.skills[q.id].rating == null));
    const cards = skills.map(sk => {
      const now = S.skills[sk.id].rating, past = sk.rating != null && D.report.history[sk.id] ? D.report.history[sk.id].map(d => Math.max(0, sk.rating + d)) : null;
      if (now == null) return `<div class="gcard gcard--empty"><div class="g-h"><b>${esc(sk.name)}</b><span class="lvl lvl--new">Not unlocked</span></div>
        <p class="g-d">Unlocks the first time ${n} asks about ${esc(sk.name.toLowerCase())}.</p></div>`;
      const l = levelFor(now, age), wasRating = sk.rating;
      const note = wasRating == null ? `New this week, started at ${l.name}`
        : levelFor(wasRating, age).i !== l.i ? `${levelFor(wasRating, age).name} → ${l.name} this week`
        : past ? `<b class="${now - past[0] >= 0 ? "pos" : "neg"}">${signed(now - past[0])}</b> since ${D.report.weeks[0]}` : "";
      const vals = past ? past.concat(now) : [now];
      return `<div class="gcard"><div class="g-h"><b>${esc(sk.name)}</b><span class="lvl lvl--${l.i}">${l.name}</span></div>
        <p class="g-d">${note}${l.next ? ` · ${movesToNext(now)} more on his own to reach ${l.next.name}` : ""}</p>
        ${lineChart(vals, past ? labels : ["This week"], l.next)}</div>`;
    }).join("");
    const suggestion = S.fasterOn.includes("algebra") ? `Ask him how he's finding algebra. He took the faster route on it this week.`
      : S.skills.algebra.rating != null ? "Ask him how he's finding algebra. It's new this week."
      : "Ask him which subject feels hardest right now.";
    return `<div class="report">
      <div class="never">${icon("lock", 16)}<span><b>Chats are never shown.</b> This report is built from levels, ratings and counts only.</span></div>
      <div class="kpis kpis--3">
        <div class="kpi"><span>Faster response tokens used</span><b>${S.spent} of ${D.child.tokensWeekly}</b><em>Earned ${S.earned} from challenges</em></div>
        <div class="kpi"><span>Did it himself</span><b>${Math.round(selfSum)} of ${totalSum} tasks</b><em>${weekShare}% this week</em></div>
        <div class="kpi kpi--safe"><span>Safety alerts</span><b>None</b><em>this week</em></div>
      </div>
      <section class="rsec rsec--main"><h3>AI reliance by area vs expected</h3>
        <p class="muted">How much ${n} did himself, against what's expected at his level.</p>
        <p class="rel-sum">${icon("chart", 16)}<span>${esc(relSummary)}</span></p>
        <div class="rel">${rel.map(r => `<div class="rel-row rel--${r.status.k}">
            <span class="rel-n">${icon(areaIcon(r.id), 16)}${esc(r.short)}</span>
            <div class="rel-track" role="img" aria-label="${esc(r.name)}: ${r.pct}% himself, ${r.expected}% expected"><i style="width:${r.pct}%"></i><b style="left:${r.expected}%"></b></div>
            <span class="rel-chip">${r.status.label}<em>${signed(r.gap) || "±0"}</em></span>
            <p class="rel-cap">${n} did <b>${r.pct}%</b> himself. Expected for his level: ${r.expected}%.</p></div>`).join("")}</div>
        <div class="rel-key"><span><i class="k-dot k-ok"></i>On track</span><span><i class="k-dot k-near"></i>A little below</span><span><i class="k-dot k-low"></i>Needs a nudge</span><span><i class="k-tick"></i>Expected for his level</span></div>
      </section>
      <section class="rsec growth"><h3>Growth</h3>
        <p class="muted">The last six weeks. Ratings run 0–1000 within ${levelFor(0, age).group}; each chart uses its own scale, and the dashed line is the next level.</p>
        <div class="gwide"><div class="g-h"><b>Did it himself</b><span class="g-sub">Share of all tasks, each week</span></div>${barChart(D.report.selfShare.concat(weekShare), labels)}</div>
        <div class="ggrid">${cards}</div>
      </section>
      <section class="rsec suggest"><h3>${icon("spark", 17)} One suggestion</h3><p>${esc(suggestion)}</p></section>
    </div>`;
  }

  function viewParent(main) {
    main.innerHTML = `<div class="page page--report">
      <header class="page-h"><div><p class="eyebrow">Weekly report · ${D.today.week}</p><h1>${esc(name())}'s week</h1>
        <p class="sub">${esc(name())}, ${S.setup.child.age} · Class ${S.setup.child.classNo} · ${esc(agentList())} through Bud-e</p></div>
        <button class="btn ghost" data-off>Download PDF</button></header>
      ${reportHTML()}
    </div>`;
  }

  /* ---------- Bud-e Parent: extension report. Other AI agents, with a block switch for each ---------- */
  function viewParentAgents(main) {
    const n = esc(name()), list = D.report.agents;
    const uses = list.reduce((t, a) => t + a.uses, 0), blocked = list.filter(a => S.blocked[a.id]).length;
    main.innerHTML = `<div class="page page--report">
      <header class="page-h"><div><p class="eyebrow">Extension report · ${D.today.week}</p><h1>Other AI agents</h1>
        <p class="sub">What the browser extension noticed on ${n}'s device. Names and counts only, never the sites he visited or what he typed.</p></div></header>
      ${!S.setup.extInstalled || !S.setup.perms.extension ? `<section class="rsec"><p>${!S.setup.extInstalled
          ? `The Bud-e browser extension isn't installed, so other AI agents on ${n}'s device aren't monitored.`
          : `Monitoring is paused, so other AI agents on ${n}'s device aren't being counted.`}</p>
        <p class="muted"><button class="link" data-go="pperms">${!S.setup.extInstalled ? "Install it in Permissions" : "Turn it on in Permissions"}</button></p></section>` : `
      <div class="kpis kpis--2">
        <div class="kpi"><span>Uses this week</span><b>${uses}</b><em>across all agents</em></div>
        <div class="kpi"><span>Blocked</span><b>${blocked}</b><em>${blocked === 1 ? "agent" : "agents"} can't open</em></div>
      </div>
      <section class="rsec agents"><h3>Agents</h3>
        <p class="muted">Block an agent to stop it opening on ${n}'s device and in his browser. He sees a short note that you've blocked it.</p>
        <ul class="ag-list">${list.map(a => { const b = !!S.blocked[a.id]; return `<li class="${b ? "is-blocked" : ""}">
          <span class="ag-ic">${!b && D.providerLogos[a.name] ? `<img src="${D.providerLogos[a.name]}" alt="" width="22" height="22">` : icon(b ? "block" : "plug", 17)}</span>
          <div class="ag-n"><b>${esc(a.name)}</b><em>${esc(a.kind)}</em></div>
          <div class="ag-u"><b>${a.uses} ${a.uses === 1 ? "time" : "times"}</b><em>${b ? (a.since ? "Blocked since " + esc(a.since) : "Blocked today") : a.last ? "Last used " + esc(a.last) : "Not used this week"}</em></div>
          <button class="btn small${b ? "" : " danger"}" data-block="${a.id}">${b ? "Unblock" : "Block"}</button></li>`; }).join("")}</ul>
      </section>`}
    </div>`;
    main.onclick = e => {
      const b = e.target.closest("[data-block]");
      if (!b) return;
      const a = list.find(x => x.id === b.dataset.block);
      S.blocked[a.id] = !S.blocked[a.id]; save();
      const y = main.scrollTop;
      viewParentAgents(main); main.scrollTop = y;
      toast(a.name + (S.blocked[a.id] ? " blocked on " : " unblocked on ") + name() + "'s device.", "ok");
    };
  }

  /* ---------- Bud-e Parent: code login ---------- */
  function viewParentLogin() {
    const n = esc(name()), code = S.setup.done && S.setup.code;
    return `<div class="plogin">
      <div class="pl-card card">
        <div class="pl-brand">${mark(56, true)}<div>${wordmark()}<em>Parent</em></div></div>
        <h1>Log in with your code</h1>
        <p class="sub">Enter the 8-digit code shown on ${n}'s device at the end of setup.</p>
        <form id="plf" novalidate>
          <input class="code-in" name="code" inputmode="numeric" autocomplete="one-time-code" placeholder="0000 0000" maxlength="9" aria-label="Bud-e Parent code">
          <p class="form-err" hidden></p>
          <button class="btn primary lg block" type="submit">Log in</button>
        </form>
        <p class="fine">${code ? `Prototype: the code from setup is <b>${esc(showCode(code))}</b>.` : `No device is set up in this browser yet. Set up ${n}'s device in Bud-e first: the code appears when setup finishes.`}</p>
      </div>
    </div>`;
  }
  AFTER.plogin = () => {
    const f = $("#plf"), input = f.code, err = $(".form-err", f);
    input.addEventListener("input", () => {
      const d = input.value.replace(/\D/g, "").slice(0, 8);
      input.value = d.length > 4 ? d.slice(0, 4) + " " + d.slice(4) : d;
      err.hidden = true;
    });
    f.addEventListener("submit", async e => {
      e.preventDefault();
      /* Bud-e may have been set up in another tab since this page opened: check against the code saved now. */
      S = load();
      const d = input.value.replace(/\D/g, "");
      const msg = !S.setup.done ? "Set up " + name() + "'s device first. The code appears when setup finishes."
        : d.length !== 8 ? "The code has 8 digits." : d !== S.setup.code ? "That code doesn't match. Check the code on " + name() + "'s device." : "";
      err.hidden = !msg; err.textContent = msg;
      if (msg) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); return; }
      const b = $("button[type=submit]", f); b.disabled = true; b.innerHTML = '<span class="spin"></span> Linking ' + esc(name()) + "'s device…";
      await sleep(700);
      setParentIn(true);
      go("parent");
    });
    input.focus();
  };

  /* ---------- Bud-e Parent: permissions (the only place they can change) ---------- */
  function viewParentPerms(main) {
    main.innerHTML = `<div class="page">
      <header class="page-h"><div><p class="eyebrow">${icon("shield", 14)} ${esc(name())}'s device</p><h1>Permissions</h1>
        <p class="sub">Only you can change these, from here. ${esc(name())}'s device shows them but can't change them.</p></div></header>
      <div class="perms">${permCards(true)}</div>
    </div>`;
    bindPerms(id => {
      if (id === "extensionInstalled") { toast("Bud-e extension installed on " + name() + "'s device. Other AI agents now show in the Extension report.", "ok"); return; }
      if (id === "walletAmt") S.wallet = walletLeft();
      const p = D.permissions.find(x => x.id === id);
      save();
      toast(id === "walletAmt" ? "Monthly wallet set to " + rupee(S.setup.walletMonthly) + "."
        : id === "extension" ? (S.setup.perms.extension ? "Monitoring is on. Other AI agents on " + name() + "'s device show in the Extension report." : "Monitoring is paused. The extension stays installed, but other AI agents aren't monitored.")
        : p.title + (S.setup.perms[id] ? " turned on." : " turned off.") + " " + name() + "'s device updates now.", "ok");
    }, true);
  }

  /* ---------- Global events ---------- */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-chip],[data-pick],[data-menu],[data-logout],[data-newchat],[data-chat],[data-go],[data-reset],[data-off],[data-jump],[data-challenge],[data-drawer],[data-chatbar]");
    $$(".menu").forEach(m => { if (!el || !el.hasAttribute("data-menu") || !m.parentElement.contains(el)) m.hidden = true; });
    if (!el) return;
    const d = el.dataset;
    if (d.chip != null && chat.waiting) {
      const c = chipObj(chat.waiting.chips[+d.chip]);
      answer({ label: c.label, go: c.go });
    } else if (d.newchat != null) {
      closeDrawers();
      newChat(); go("chat");
    } else if (d.chat) {
      closeDrawers();
      openChat(d.chat);
    } else if (d.logout != null) {
      setParentIn(false); toast("Logged out of Bud-e Parent.", "ok"); go("plogin");
    } else if (d.pick && chat.waiting && chat.waiting.products) {
      const p = chat.waiting.ctx.products.find(x => x.id === d.pick);
      answer({ product: p, label: p.name });
    } else if (d.menu != null) {
      const m = el.parentElement.querySelector(".menu"); m.hidden = !m.hidden;
    } else if (d.go) {
      go(d.go);
    } else if (d.reset != null) {
      modal({ html: "<h2>Reset the prototype?</h2><p>Clears setup, chats, tokens, ratings and orders, and starts again.</p>",
        actions: [{ label: "Cancel", value: false, cancel: true }, { label: "Reset", value: true, primary: true }] }).then(ok => {
        if (!ok) return;
        cancelFlow(); S = fresh(); save(); toast("Prototype reset.", "ok");
        if (route() === HOME) render(); else go(HOME);
      });
    } else if (d.off != null) {
      e.preventDefault(); offPath();
    } else if (d.jump) {
      jump(d.jump);
    } else if (d.challenge) {
      const ch = taskDef(d.challenge);
      if (chat.ctx) cancelFlow();
      go("chat");
      setTimeout(() => startFlow(ch.id, "Start challenge: " + ch.title.replace(/\s*\(.*\)$/, ""), { challenge: true }), 50);
    } else if (d.chatbar != null) {
      document.body.classList.remove("drawer-open");
      document.body.classList.toggle("chats-open");
    } else if (d.drawer != null) {
      /* the scrim closes whichever drawer is open; the My areas button toggles its own */
      if (document.body.classList.contains("chats-open")) closeDrawers();
      else document.body.classList.toggle("drawer-open");
    }
  });
  /* On narrower screens Chats slides in from the left and My areas from the right */
  function closeDrawers() { document.body.classList.remove("drawer-open", "chats-open"); }
  window.addEventListener("hashchange", () => { closeDrawers(); render(); });

  /* ---------- The live Bud-e mark: eyes follow the mouse; a click makes it giggle ---------- */
  let lookAt = null, lookFrame = 0;
  function aimEyes() {
    lookFrame = 0;
    $$(".mark--live").forEach(m => {
      const eyes = $(".m-eyes", m), r = m.getBoundingClientRect();
      if (!eyes || !r.width) return;
      if (!lookAt) { eyes.style.transform = ""; return; }
      const dx = lookAt.x - (r.left + r.width * .5), dy = lookAt.y - (r.top + r.height * .62);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240);
      eyes.style.transform = `translate(${(dx / d * 56 * k).toFixed(1)}px, ${(dy / d * 40 * k).toFixed(1)}px)`;
    });
  }
  const queueAim = () => { if (!lookFrame) lookFrame = requestAnimationFrame(aimEyes); };
  document.addEventListener("mousemove", e => { lookAt = { x: e.clientX, y: e.clientY }; queueAim(); });
  document.documentElement.addEventListener("mouseleave", () => { lookAt = null; queueAim(); });
  window.addEventListener("hashchange", queueAim);
  document.addEventListener("click", e => {
    const m = e.target.closest && e.target.closest(".mark--live");
    if (!m || m.classList.contains("is-giggling")) return;
    m.classList.add("is-giggling");
    setTimeout(() => m.classList.remove("is-giggling"), 950);
    const r = m.getBoundingClientRect();
    if (r.width < 56) return;
    const b = document.createElement("div");
    b.className = "giggle";
    b.textContent = ["hehe", "hihi!", "heh, that tickles"][rand(0, 2)];
    b.style.left = r.left + r.width * .86 + "px";
    b.style.top = r.top + r.height * .08 + "px";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1300);
  });

  /* ---------- Bud-e and Bud-e Parent open side by side ----------
     Each page picks up the other's saved changes. Bud-e Parent takes the whole state, since Bud-e writes most of it, and
     re-draws only when something it shows has changed. Bud-e takes only what the parent controls, so a chat carries on. */
  const parentView = s => JSON.stringify([s.setup, s.skills, s.reliance, s.didIt, s.spent, s.earned, s.tokens, s.wallet, s.blocked, s.fasterOn]);
  window.addEventListener("storage", e => {
    if (APP === "parent") {
      if (e.key !== KEY && e.key !== PKEY) return;
      const before = parentView(S);
      S = load();
      const typing = $("#plf") && $("#plf").code.value;
      if ((e.key === PKEY || parentView(S) !== before) && !typing) {
        const main = $("#main"), top = main ? main.scrollTop : 0;
        render();
        if ($("#main")) $("#main").scrollTop = top;
      }
      return;
    }
    if (e.key !== KEY) return;
    const next = load(), walletWas = S.setup.perms.wallet;
    S.setup.perms = next.setup.perms; S.setup.walletMonthly = next.setup.walletMonthly;
    S.wallet = next.wallet; S.blocked = next.blocked;
    /* turning the wallet on or off changes the nav, so re-draw the screen unless a chat is under way */
    if (S.setup.perms.wallet !== walletWas && CHILD.includes(route()) && !chat.ctx) render(); else refreshLive();
  });

  if (!location.hash) location.replace("#/" + HOME);
  render();
})();
