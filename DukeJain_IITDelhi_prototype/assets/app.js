/* Bud-e prototype: saved state, the rating and token rules, the scripted chat engine, and every screen.
   Content (persona, flows, products, report numbers) lives in data.js. */
(function () {
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => Math.round(a + Math.random() * (b - a));
  const clone = o => JSON.parse(JSON.stringify(o));
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(Math.round(n));
  const clock = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toLowerCase();

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
    clip: '<path d="m19 11.5-6.8 6.8a4.5 4.5 0 0 1-6.4-6.4l7.4-7.4a3 3 0 0 1 4.2 4.2l-7.3 7.3a1.5 1.5 0 0 1-2.1-2.1l6.5-6.5"/>'
  };
  const icon = (n, s = 18, cls = "") => `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* The Bud-e character mark ("Winking Buddy" from color-theme-logo.jpeg): a "B" built from three solid layers with
     hard edges between them (blue-to-violet stem, magenta-to-coral upper bowl, orange lower bowl), a white visor face
     (one eye open, one winking) and two sparks. Live marks follow the mouse with their eyes and giggle when clicked
     (see the bottom of this file). The viewBox includes the sparks, so nothing is clipped. */
  let markId = 0;
  const mark = (s = 28, live = false) => {
    const id = "bd" + (++markId), small = s < 24;
    return `<svg class="mark${live ? " mark--live" : ""}" width="${s}" height="${s}" viewBox="16 10 228 228" ${live ? 'role="img" aria-label="Bud-e"' : 'aria-hidden="true"'}><defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#2F95FF"/><stop offset=".42" stop-color="#4C7DFD"/><stop offset=".72" stop-color="#6A5CFB"/><stop offset="1" stop-color="#8152FD"/></linearGradient>
      <linearGradient id="${id}u" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#C65ED8"/><stop offset=".5" stop-color="#F0699B"/><stop offset="1" stop-color="#FF8A62"/></linearGradient>
      <linearGradient id="${id}l" x1=".3" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FF9A4C"/><stop offset=".5" stop-color="#FFA758"/><stop offset="1" stop-color="#F57FB4"/></linearGradient></defs>
      <g class="m-body">
        <path d="M80 18H140a54 54 0 0 1 0 108H80z" fill="url(#${id}u)"/>
        <path d="M80 104H147a59 59 0 0 1 0 118H80z" fill="url(#${id}l)"/>
        <path d="M70 18H108C126 42 140 80 144 116C149 156 147 194 158 222H70a50 50 0 0 1-50-50V68a50 50 0 0 1 50-50z" fill="url(#${id}s)"/>
        ${small ? "" : '<path d="M56 120 65 94 90 120z" fill="#3A27D6" opacity=".3"/>'}
        <rect x="56" y="116" width="121" height="70" rx="35" fill="#fff"/>
        <g class="m-eyes"><g class="m-open"><circle class="m-eye" cx="92" cy="151" r="10.5" fill="#0B0A46"/><path d="M133 155 154 143" stroke="#0B0A46" stroke-width="10" stroke-linecap="round"/></g>
          ${live ? '<path class="m-happy" d="M81 156Q92 139 103 156M132 156Q143 139 154 156" fill="none" stroke="#0B0A46" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' : ""}</g>
      </g>
      ${small ? "" : '<g class="m-sparks" stroke-width="9.5" stroke-linecap="round"><path class="m-sp1" d="M206 96 226 80" stroke="#F4775F"/><path class="m-sp2" d="M213 120H237" stroke="#E04BCB"/></g>'}
    </svg>`;
  };
  const wordmark = () => '<span class="wordmark">Bud<i></i><b>e</b></span>';
  const logo = (s = 28) => `<span class="logo">${mark(s, true)}${wordmark()}</span>`;

  /* ---------- Saved state ---------- */
  const KEY = "bude.prototype.v3";
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
        child: { name: c.name, age: c.age, classNo: c.classNo, uses: c.uses.slice(), provider: c.provider, usedBefore: c.usedBefore },
        perms, walletMonthly: c.walletMonthly
      },
      parentIn: false, newSkill: false,
      tokens: c.tokens, spent: 0, earned: 0, tokenLog: [],
      wallet: c.wallet, orders: [],
      skills, ratingLog: [],
      done: {}, didIt: [], fasterOn: [],
      reliance: {},
      thread: []
    };
  }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 3) return s; } catch (e) { /* storage blocked */ }
    return fresh();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } }
  function changed() { save(); refreshLive(); }

  const name = () => S.setup.child.name || D.child.name;
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

  function modal({ cls = "", html, actions }) {
    return new Promise(resolve => {
      const layer = $("#layer");
      layer.innerHTML = `<div class="scrim"></div><div class="modal ${cls}" role="dialog" aria-modal="true">${html}
        <div class="modal-actions">${actions.map((a, i) => `<button class="btn ${a.primary ? "primary" : "ghost"}" data-i="${i}">${esc(a.label)}</button>`).join("")}</div></div>`;
      layer.classList.add("open");
      const close = v => { layer.classList.remove("open"); layer.innerHTML = ""; document.removeEventListener("keydown", onKey); resolve(v); };
      const onKey = e => { if (e.key === "Escape") close(actions[0].cancel ? actions[0].value : null); };
      document.addEventListener("keydown", onKey);
      $$("[data-i]", layer).forEach(b => b.addEventListener("click", () => close(actions[+b.dataset.i].value)));
      $(".scrim", layer).addEventListener("click", () => close(null));
      const p = $(".btn.primary", layer); if (p) p.focus();
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
  const ROUTES = {
    start: viewStart, child: viewChildProfile, permissions: viewPermissions, handover: viewHandover, splash: viewSplash,
    chat: viewChat, earn: viewEarn, wallet: viewWallet, progress: viewProgress, plogin: viewParentLogin, parent: viewParent, pperms: viewParentPerms
  };
  const CHILD = ["chat", "earn", "wallet", "progress"];
  const PARENT = ["parent", "pperms"];
  const route = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || "start");
  function go(r) { if (route() === r) render(); else location.hash = "#/" + r; }

  function render() {
    let r = route();
    if (!ROUTES[r]) r = "start";
    /* Bud-e Parent opens only after the code login. */
    if (PARENT.includes(r) && !S.parentIn) { location.replace("#/plogin"); return; }
    const app = $("#app");
    document.body.dataset.route = r;
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
      app.innerHTML = `<div class="bare"><div class="canvas">${ROUTES[r]()}</div></div>`;
      const after = AFTER[r]; if (after) after();
    }
    save();
    window.scrollTo(0, 0);
    queueAim();
  }
  const AFTER = {};

  /* Jumping straight into either app (demo rail, "I'm Aarav") uses the default setup and its code. */
  function quickSetup() {
    S.setup.done = true; S.setup.perms.consent = true;
    if (!S.setup.code) S.setup.code = makeCode();
  }

  /* ---------- Shells ---------- */
  /* Both apps share one frame: a soft colour-washed canvas, a nav rail on the left, a top bar of status pills. */
  const tab = (href, label, ic, on, val = "") => `<a href="#/${href}" class="tab ${on ? "is-on" : ""}" ${on ? 'aria-current="page"' : ""}>${icon(ic, 20)}<span>${label}</span>${val}</a>`;
  const weekday = () => D.today.long.split(",")[0];
  function frame(cls, nav, top, body) {
    return `<div class="shell ${cls}"><div class="frame">
      <nav class="nav" aria-label="Main"><span class="nav-mark">${mark(38, true)}</span>${nav}</nav>
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
      `<button class="pill-stat areas-pill" data-drawer aria-label="My areas">${icon("chart", 16)}<span>My areas</span></button>`,
      `<div class="cols"><main id="main" class="main"></main><aside class="side" id="side" aria-label="Your areas and tokens"></aside></div>
       <div class="drawer-scrim" data-drawer></div>`);
  }
  function parentShell(r) {
    return frame("shell--parent",
      `${tab("parent", "Weekly report", "chart", r === "parent")}${tab("pperms", "Permissions", "shield", r === "pperms")}
       <span class="nav-fill"></span><button class="tab tab--settings" data-off>${icon("cog", 20)}<span>Settings</span></button>${profileButton(S.setup.parent.name[0] || "N", "parent")}`,
      `<span class="pill-stat"><i class="role-dot"></i>Bud-e Parent · ${esc(name())}'s device linked</span>`,
      `<div class="cols"><main id="main" class="main main--wide"></main></div>`);
  }
  function profileButton(initial, role) {
    return `<div class="profile"><button class="avatar avatar--${role}" data-menu aria-label="Profile menu">${esc(initial)}</button>
      <div class="menu" hidden>
        <div class="menu-h">${role === "child" ? esc(name()) + ", " + S.setup.child.age : esc(S.setup.parent.name) + " · " + D.parent.relation}</div>
        ${role === "child" ? `<button data-switch="parent">${icon("swap", 16)} Open Bud-e Parent</button>`
                           : `<button data-switch="chat">${icon("swap", 16)} Switch to ${esc(name())}'s device</button><button data-logout>${icon("back", 16)} Log out</button>`}
        <button data-go="start">${icon("home", 16)} Start screen</button>
        <button data-reset>${icon("refresh", 16)} Reset prototype</button>
      </div></div>`;
  }

  /* Side panel: areas and levels. Balances live in the nav (Tokens, Wallet). Re-rendered on every change. */
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
      return `<div class="area"><div class="area-h">${icon(areaIcon(a.id), 15)}<b>${esc(a.name)}</b></div>${rows}</div>`;
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
    $$(".token-count").forEach(el => { el.textContent = S.tokens; });
    $$(".wallet-count").forEach(el => { el.textContent = rupee(S.wallet); });
    if (route() === "chat") renderComposer();
    if (["earn", "wallet", "progress"].includes(route())) { const m = $("#main"); if (m && !m.contains(document.activeElement)) ROUTES[route()](m); }
  }

  /* ---------- S0 Start ---------- */
  const RAIL = [
    ["S1", "Child details", "child"], ["S2", "Permissions", "permissions"], ["S3", "Code + handover", "handover"], ["S4", "I'm Aarav", "splash"],
    ["S5", "Home", "chat"], ["S6", "Chore", "task:cab"], ["S7", "New skill + algebra", "task:algebra"],
    ["S8", "Relationships", "task:apology"], ["S9", "Gift + wallet", "task:gift"], ["S10", "Feelings", "task:feelings"],
    ["S11", "Tokens + earn", "earn"], ["S12", "Wallet", "wallet"], ["S13", "My skills", "progress"], ["S14", "Parent code login", "plogin"],
    ["S15", "Parent report", "parent"], ["S16", "Edit permissions", "pperms"]
  ];
  function viewStart() {
    return `<div class="start">
      <div class="start-hero">
        <div class="hero-mark">${mark(150, true)}</div>
        <h1>${wordmark()}</h1>
        <p class="tagline">${esc(D.product.tagline)}</p>
        <p class="lede">Bud-e sits between a child and their personal AI agent. Chores happen instantly. For the moments that build a person, the AI does less as the child gets better.</p>
        <div class="start-btns">
          <button class="btn primary lg" data-go="child">${icon("user", 18)} Set up ${esc(name())}'s device</button>
          <button class="btn ghost lg" data-go="splash">I'm ${esc(name())}</button>
          <button class="btn ghost lg" data-go="plogin">${icon("shield", 18)} Bud-e Parent</button>
        </div>
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
      const id = to.slice(5);
      quickSetup();
      pendingPrefill = taskDef(id).prompt;
      go("chat");
      return;
    }
    if (to === "handover" || to === "splash" || to === "plogin") quickSetup();
    if (to === "plogin") S.parentIn = false;
    if (PARENT.includes(to)) { quickSetup(); S.parentIn = true; }
    save();
    go(to);
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
        <fieldset class="field"><legend>Which AI agent does ${esc(c.name)} use?</legend>
          <div class="pills">${D.providers.map(p => `<label class="pill"><input type="radio" name="provider" value="${esc(p)}" ${p === c.provider ? "checked" : ""}><span>${esc(p)}</span></label>`).join("")}</div>
        </fieldset>
        <fieldset class="field"><legend>Has ${esc(c.name)} used this agent before?</legend>
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
      const age = +f.age.value, uses = $$("input[name=uses]:checked", f).map(i => i.value);
      const msg = !f.name.value.trim() ? "Add your child's name." : !(age >= 5 && age <= 18) ? "Bud-e is for ages 5 to 18." : !uses.length ? "Pick at least one thing they use AI for." : "";
      const err = $(".form-err", f); err.hidden = !msg; err.textContent = msg;
      if (msg) return;
      Object.assign(S.setup.child, { name: f.name.value.trim(), age, classNo: +f.classNo.value, uses, provider: f.provider.value, usedBefore: f.usedBefore.value === "yes" });
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
      const on = off ? false : s.perms[p.id];
      const locked = inParent && p.required;
      const why = p.why.replace(/Aarav/g, esc(c.name));
      return `<div class="perm ${on ? "is-on" : ""} ${off ? "is-off" : ""}" data-perm="${p.id}">
        <span class="perm-ic">${icon(permIcon[p.id], 20)}</span>
        <div class="perm-txt"><b>${esc(p.title)}${p.required ? '<em class="req">Required</em>' : ""}${p.optional ? '<em class="opt">Optional</em>' : ""}</b>
          <p>${off ? "Not needed: " + esc(c.name) + " hasn't used an agent before." : why}</p>
          ${locked ? `<p class="perm-lock">${icon("lock", 13)} Stays on while Bud-e is active. To withdraw it, remove ${esc(c.name)}'s device in Settings.</p>` : ""}
          ${p.detail ? `<details><summary>What exactly is stored</summary><ul>${p.detail.map(d => `<li>${esc(d)}</li>`).join("")}</ul></details>` : ""}
          ${p.id === "wallet" ? `<label class="amount">Monthly amount <span>₹</span><input type="number" min="0" step="100" id="walletAmt" value="${s.walletMonthly}"></label>` : ""}
        </div>
        <label class="toggle"><input type="checkbox" ${on ? "checked" : ""} ${off || locked ? "disabled" : ""} aria-label="${esc(p.title)}"><i class="switch"></i></label>
      </div>`;
    }).join("");
  }
  /* Wires the toggles and the wallet amount; `after` runs on every change. */
  function bindPerms(after) {
    $$(".perm").forEach(card => {
      const input = $(".toggle input", card);
      input.addEventListener("change", () => {
        S.setup.perms[card.dataset.perm] = input.checked;
        card.classList.toggle("is-on", input.checked);
        save(); after(card.dataset.perm);
      });
    });
    const amt = $("#walletAmt");
    amt.addEventListener("change", () => { S.setup.walletMonthly = Math.max(0, +amt.value || 0); save(); after("walletAmt"); });
  }
  function viewPermissions() {
    return setupFrame(2, "Permissions", "Each one is explained. Only the first two are required.", `
      <div class="lock-note">${icon("lock", 18)}<p><b>These permissions can't be changed on this device.</b> After setup, only you can change them, from Bud-e Parent on your phone.</p></div>
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
      "Connecting " + c.name + "'s agent (" + c.provider + ")",
      past ? "Estimating starting levels from past use (no chats imported)" : "Setting starting levels from Class " + c.classNo + " averages",
      "Setting up " + D.child.tokensWeekly + " tokens a week",
      S.setup.perms.extension ? "Installing the browser extension" : "Skipping the browser extension",
      S.setup.perms.wallet ? "Opening a " + rupee(S.setup.walletMonthly) + " monthly wallet" : "No wallet",
      "Locking these permissions to Bud-e Parent",
      "Making your Bud-e Parent code"
    ];
    $("#layer").innerHTML = `<div class="scrim"></div><div class="modal provision"><div class="prov-mark">${mark(52, true)}</div><h2>Setting up Bud-e</h2><ul>${items.map(t => `<li><span class="spin"></span>${esc(t)}</li>`).join("")}</ul></div>`;
    $("#layer").classList.add("open");
    const lis = $$(".provision li");
    for (const li of lis) { li.classList.add("is-now"); await sleep(rand(380, 620)); li.classList.remove("is-now"); li.classList.add("is-done"); $(".spin", li).outerHTML = icon("check", 15); }
    await sleep(300);
    $("#layer").classList.remove("open"); $("#layer").innerHTML = "";
    S.setup.code = makeCode();
    S.wallet = walletLeft();
    S.setup.done = true; S.parentIn = false; save();
    go("handover");
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
        <button class="link" data-go="plogin">Open Bud-e Parent instead</button>
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
    const done = () => { if (route() === "splash") go("chat"); };
    $(".splash").addEventListener("click", done);
    setTimeout(done, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 3000);
  };

  /* ---------- Chat engine ---------- */
  const CANCEL = { cancelled: true };
  const chat = { run: 0, ctx: null, flow: null, waiting: null, typing: false, waitSeq: 0, queued: null };
  let pendingPrefill = "";

  function push(m) {
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
    if (ctx.fast) return { text: `${ctx.area.tag}${ctx.area.id === "study" ? " · " + ctx.skill.name : ""} · Faster response: done for you`, tone: "fast" };
    if (ctx.challenge) return { text: `Challenge · ${ctx.area.name} · +${t.reward} tokens`, tone: "challenge" };
    if (t.tag) return { text: t.tag, tone: t.area === "chore" ? "chore" : t.area === "feelings" ? "care" : "care" };
    const line = (D.modeLines[ctx.area.id] || {})[ctx.mode.id] || ctx.mode.line;
    return { text: `${ctx.area.tag}${ctx.area.id === "study" ? " · " + ctx.skill.name : ""} · ${ctx.mode.name}: ${line}`, tone: ctx.mode.id };
  }

  /* The flow interpreter: runs DATA.flows[id] step by step. With `fast` (Faster response, chosen when sending)
     it starts at the flow's "fast" step. */
  async function startFlow(id, text, opts = {}) {
    cancelFlow();
    const run = chat.run;
    const task = taskDef(id);
    const ctx = {
      run, id, task, hints: 0, misses: 0, shown: false, answers: {}, answer: null, rupee, challenge: !!opts.challenge,
      get wallet() { return S.wallet; },
      /* Apology draft chips: a good first line, a "sorry, but" line and asking the agent to write it. */
      draftChips() {
        const rude = this.answers.sorry === "I said something rude" || this.answers.blameHer2 === "I said something rude";
        return [rude ? "sorry for what i said, that was rude of me" : "sorry i bailed on saturday, that wasn't cool",
          "sorry but you're overreacting tbh", "can you just write it for me?"];
      }
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
    chore(st, ctx) { logTokens(0, "Cab to " + D.child.friend + "'s (chore, free)"); changed(); },

    async unlock(st, ctx) {
      const id = ctx.task.skill, start = st.start || "start";
      if (S.skills[id].rating != null) return start;
      const sk = ctx.skill;
      const yes = await modal({ cls: "unlock", html: `<div class="unlock-badge">${icon("spark", 30)}</div>
          <p class="eyebrow">New skill unlocked</p><h2>${esc(sk.name)}</h2>
          <p>First time with ${esc(sk.name.toLowerCase())} here. We'll start you at a level that fits, and it grows as you do.</p>`,
        actions: [{ label: "No, I'm not new to this skill", value: "no" }, { label: "Yes, let's go", value: "yes", primary: true }] });
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

    score(st, ctx) {
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
      push({ t: "score", up, text: up ? `Level up: ${ctx.skill.name} is now ${after.name}` : st.say || (result === 1 ? "That's all you" : result ? "Done with a little help" : "Worked through it together"),
        sub: up ? "" : `${ctx.skill.name}: ${after.name}` });
      if (up) toast(`${ctx.skill.name}: ${before.name} → ${after.name}`, "ok");
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

    riya(st, ctx) { push({ t: "riya" }); },
    checkDraft(st, ctx) {
      if (/\b(you write|write it|for me|just send|do it|you do|make one|draft it)\b/i.test(ctx.answer)) return "ghost";
      if (/\bbut\b|overreact|your fault|chill out|calm down/i.test(ctx.answer)) { ctx.hints++; return "blame"; }
      ctx.draft = ctx.answer;
    },
    addPlan(st, ctx) { ctx.draft = ctx.draft.replace(/[.!\s]+$/, "") + ". can we go this weekend instead?"; ctx.answers.plan = true; },
    send(st, ctx) {
      push({ t: "sent", text: ctx.draft });
      toast("Sent, in your words.", "ok");
      const s0 = S;
      setTimeout(() => { if (S === s0) push({ t: "riya-reply", text: D.riyaReply }); }, 4200);
    },

    showProducts(st, ctx) { ctx.topic = D.products[ctx.answer] ? ctx.answer : "art"; ctx.products = D.products[ctx.topic]; },
    checkPick(st, ctx) { return ctx.product.late ? "late" : "confirm"; },
    order(st, ctx) {
      S.wallet -= ctx.product.price;
      ctx.orderId = "BDE-40-" + rand(10000, 99999);
      S.orders.unshift({ id: ctx.orderId, name: ctx.product.name, price: ctx.product.price, at: clock() });
      changed();
    },
    autoOrder(st, ctx) {
      if (!ctx.products) ctx.products = D.products.art;
      ctx.product = ctx.products.filter(p => !p.late).sort((a, b) => a.price - b.price)[0];
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
    S.skills[id].rating = rating; changed();
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
    if (card === "products") return { items: ctx.products.map(p => Object.assign({}, p)), wallet: ctx.challenge ? null : S.wallet };
    if (card === "draft") return { text: ctx.draft };
    if (card === "order") return { id: ctx.orderId, name: ctx.product.name, price: ctx.product.price, wallet: S.wallet };
    return null;
  }

  /* ---------- Chat rendering ---------- */
  function msgHTML(m, prev) {
    switch (m.t) {
      case "child": return `<div class="msg msg--me">${m.fast ? `<span class="me-fast">${icon("bolt", 13)} Faster response</span>` : ""}<div class="bubble">${esc(m.text)}</div></div>`;
      case "agent": {
        const showTag = !(prev && prev.t === "agent" && prev.tag && prev.tag.text === m.tag.text);
        return `<div class="msg msg--agent ${showTag ? "" : "is-cont"}">
          ${showTag ? `<div class="tag tag--${m.tag.tone}">${mark(16)}<span>${esc(m.tag.text)}</span></div>` : ""}
          <div class="bubble">${esc(m.text).replace(/\n/g, "<br>")}</div>
          ${m.card ? cardHTML(m) : ""}
        </div>`;
      }
      case "skill": return skillCardHTML(m.data);
      case "note": return `<div class="note">${icon(m.icon || "info", 15)}<span>${esc(m.text)}</span></div>`;
      case "score": return `<div class="score ${m.up ? "is-up" : ""} ${m.spend ? "is-spend" : ""}">
          <span class="score-ic">${icon(m.spend ? "bolt" : m.up ? "trophy" : "check", 16)}</span><div class="score-t"><b>${esc(m.text)}</b>${m.sub ? `<span>${esc(m.sub)}</span>` : ""}</div></div>`;
      case "riya": return `<div class="card riya"><div class="riya-h"><span class="r-av">R</span><div><b>${esc(D.child.friend)}</b><span>Messages</span></div></div>
          ${D.riya.map(x => `<div class="r-msg"><span>${esc(x.text)}</span><em>${esc(x.time)}</em></div>`).join("")}</div>`;
      case "sent": return `<div class="card sent"><div class="sent-h">${icon("checks", 16)}<span>Sent to ${esc(D.child.friend)}, in your words</span></div><div class="sent-b">${esc(m.text)}</div><em>from ${esc(name())} · ${clock()}</em></div>`;
      case "riya-reply": return `<div class="card riya riya--reply"><div class="riya-h"><span class="r-av">R</span><div><b>${esc(D.child.friend)}</b><span>replied</span></div></div><div class="r-msg"><span>${esc(m.text)}</span><em>just now</em></div></div>`;
      case "reward": return `<div class="card reward"><div class="reward-n">+${m.n}</div><div><b>Challenge complete</b><span>${esc(m.text)}</span></div>${icon("coin", 30, "reward-ic")}</div>`;
      default: return "";
    }
  }
  const skillCardHTML = d => `<div class="card skillcard ${d.filed ? "is-filed" : ""}"><span class="sc-ic">${icon(areaIcon(d.areaId), 20)}</span>
    <div class="sc-t"><b>${esc(d.name)}</b><span>${esc(d.area)} · new skill</span></div><span class="lvl lvl--${d.i}">${esc(d.level)}</span>
    <span class="sc-filed">${icon("check", 14)} In My skills</span></div>`;
  function cardHTML(m) {
    const d = m.cardData;
    if (m.card === "skill") return skillCardHTML(d);
    if (m.card === "ride") { const r = D.ride; return `<div class="card ride"><div class="ride-ic">${icon("car", 22)}</div><div class="ride-b">
        <b>Cab booked · pickup ${esc(r.pickup)}</b><span>${esc(r.from)} → ${esc(r.to)}</span><span class="muted">${esc(r.car)} · arrives ${esc(r.arrive)}</span></div><span class="free">Free</span></div>`; }
    if (m.card === "products") return `<div class="card products">
        <div class="prod-h">${icon("shield", 15)}<span>No sponsored options</span>${d.wallet == null ? '<em>Practice only</em>' : `<em>Wallet now ${rupee(d.wallet)}</em>`}</div>
        ${d.items.map(p => `<div class="prod"><div class="prod-n"><b>${esc(p.name)}</b><span>${esc(p.note)}</span></div>
          <div class="prod-p"><b>${rupee(p.price)}</b>${d.wallet == null ? "" : `<span>Wallet after ${rupee(d.wallet - p.price)}</span>`}</div>
          <button class="btn small" data-pick="${p.id}" data-w="${m.wait}">Choose</button></div>`).join("")}</div>`;
    if (m.card === "draft") return `<div class="card draft"><div class="draft-h">${icon("pen", 14)}<span>Your draft to ${esc(D.child.friend)}</span></div><p>${esc(d.text)}</p></div>`;
    if (m.card === "order") return `<div class="card order"><div class="ride-ic">${icon("gift", 22)}</div><div class="ride-b"><b>${esc(d.name)}</b><span>Order ${esc(d.id)} · ${rupee(d.price)}</span><span class="muted">Wallet now ${rupee(d.wallet)}</span></div>${icon("check", 18, "ok")}</div>`;
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
    const html = w ? w.chips.map(chipObj).map((c, i) => `<button class="chip ${w.input ? "chip--draft" : ""} ${c.primary ? "chip--go" : ""}" data-chip="${i}">${w.input ? icon("pen", 14) : ""}${esc(c.label)}${c.primary ? icon("arrow", 15) : ""}</button>`).join("") : "";
    box.innerHTML = html;
    box.hidden = !html;
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
    /* The wallet shows in the chat header only during a money task. */
    const side = $("#chatSide");
    if (side) {
      const money = ctx && !ctx.challenge && ctx.area && ctx.area.id === "money";
      side.className = money ? "chat-wallet" : "chat-date";
      side.innerHTML = money ? `${icon("wallet", 15)}Wallet <b>${rupee(S.wallet)}</b>` : D.today.long;
    }
    input.placeholder = w && w.input ? "Write it in your own words…" : w ? "Pick an option, or type your answer…" : ctx ? "…" : "Type to see what I can help with…";
  }

  /* The pre-fed prompts drop down from the composer while typing, grouped by how much the agent does. */
  const PROMPT_GROUPS = [
    { label: "Always got your back", tone: "instant", match: t => t.area === "chore" },
    { label: "Done together", tone: "together", match: t => t.skill },
    { label: "Just talk", tone: "care", match: t => t.area === "feelings" }
  ];
  const promptMeta = t => t.area === "chore" ? "Instant · free" : t.area === "feelings" ? "With care" : area(t.area).tag + (t.area === "study" ? " · " + skillDef(t.skill).name : "");
  let promptHL = -1;
  function renderPrompts() {
    const box = $("#prompts"), input = $("#input");
    const words = norm(input.value).split(" ").filter(Boolean);
    const all = D.prompts.map(taskDef);
    let list = all.filter(t => words.every(w => norm(t.prompt + " " + t.chip).includes(w)));
    const none = !list.length;
    if (none) list = all;
    let n = 0;
    box.innerHTML = `<div class="prompts-h">${icon("info", 14)}<span>For now, you can only use these pre-fed prompts.</span></div>
      ${none ? `<p class="prompts-none">Nothing matches “${esc(input.value.trim())}”. Pick one of these:</p>` : ""}
      ${PROMPT_GROUPS.map(g => {
        const items = list.filter(g.match);
        return items.length ? `<div class="pgroup"><span class="pgroup-l pgroup-l--${g.tone}">${g.label}</span>
          ${items.map(t => `<button type="button" class="prompt ${n++ === promptHL ? "is-hl" : ""}" data-prompt="${t.id}" role="option"><span>${esc(t.prompt)}</span><em>${esc(promptMeta(t))}</em></button>`).join("")}</div>` : "";
      }).join("")}`;
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
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };

  function viewChat(main) {
    const home = !S.thread.length;
    main.innerHTML = `<section class="chat ${home ? "chat--home" : ""}">
      <div class="chat-h"><div class="agent-id"><span class="agent-av">${mark(30, true)}</span><div><b>My agent</b><span>${esc(S.setup.child.provider)} · through Bud-e</span></div></div>
        <span class="chat-date" id="chatSide">${D.today.long}</span></div>
      <div class="scroll" id="scroll"><div class="thread" id="thread"></div></div>
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
        <div class="home-foot"><span><b>${S.didIt.length}</b> solo ${S.didIt.length === 1 ? "win" : "wins"} this week</span><span>Chores are always free</span><span>${icon("lock", 13)} Your chats stay private</span></div>
      </div>
    </section>`;
    const t = $("#thread");
    if (home) {
      t.innerHTML = `<div class="thread-empty">
        <div class="hero-mark hero-mark--home">${mark(150, true)}</div>
        <h1><span>${greeting()}, ${esc(name())}.</span><br>What are we doing today?</h1>
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
          ${done ? `<span class="ch-done">${icon("check", 16)} Done</span>` : `<button class="btn ${c.off ? "ghost" : "primary"} small" ${c.off ? "data-off" : `data-challenge="${c.id}"`}>Start</button>`}</div>
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
      return `<section class="panel parea"><div class="panel-h"><span class="pa-ic">${icon(areaIcon(a.id), 18)}</span><b>${esc(a.name)}</b></div>${body}</section>`;
    }).join("");
    main.innerHTML = `<div class="page">
      <header class="page-h"><div><h1>My skills</h1><p class="sub">Levels compare you with ${levelFor(0, age).group}, so they grow with you.</p></div>
        <button class="btn ghost" id="parentsee">${icon("eye", 17)} What my parents see</button></header>
      <div class="levels-key">${D.levels.bands.map((b, i) => `<span class="lvl lvl--${i}">${b.name}</span>`).join(`<span class="arrow">${icon("chevron", 14)}</span>`)}</div>
      <div class="pgrid">${areas}</div>
    </div>`;
    $("#parentsee").addEventListener("click", () => {
      modal({ cls: "preview", html: `<p class="eyebrow">${icon("eye", 14)} Read-only preview</p><h2>What ${esc(S.setup.parent.name.split(" ")[0])} sees</h2>${reportHTML()}`,
        actions: [{ label: "Close", value: null, primary: true }] });
    });
  }

  /* ---------- S14 Parent weekly report ---------- */
  function reportHTML() {
    const n = esc(name()), age = S.setup.child.age;
    const rel = D.report.reliance.map(r => {
      const s = S.reliance[r.area] || { self: 0, total: 0 };
      const pct = Math.round(((r.self + s.self) / (r.total + s.total)) * 100);
      return { name: area(r.area).name, short: area(r.area).tag, pct, expected: r.expected };
    });
    const growth = [];
    D.areas.forEach(a => a.skills.forEach(sk => {
      const was = sk.rating, now = S.skills[sk.id].rating;
      if (now == null) return;
      if (was == null) growth.push(`<b>${esc(sk.name)}:</b> new skill this week, started at ${levelFor(now, age).name}`);
      else if (levelFor(now, age).i !== levelFor(was, age).i) growth.push(`<b>${esc(sk.name)}:</b> ${levelFor(was, age).name} → ${levelFor(now, age).name} this week`);
      else if (now > was) growth.push(`<b>${esc(sk.name)}:</b> growing within ${levelFor(now, age).name}`);
    }));
    const did = D.report.didItHimself.concat(S.didIt);
    const other = S.setup.perms.extension ? D.report.otherAI : null;
    const suggestion = S.fasterOn.includes("algebra") ? `Ask him how he's finding algebra. He took the faster route on it this week.`
      : S.skills.algebra.rating != null ? "Ask him how he's finding algebra. It's new this week."
      : "Ask him which subject feels hardest right now.";
    return `<div class="report">
      <div class="never">${icon("lock", 16)}<span><b>Chats are never shown.</b> This report is built from levels, ratings and counts only.</span></div>
      <div class="kpis">
        <div class="kpi"><span>Tokens</span><b>Used ${S.spent} of ${D.child.tokensWeekly}</b><em>Earned ${S.earned}</em></div>
        <div class="kpi"><span>Did it himself</span><b>${did.length} ${did.length === 1 ? "thing" : "things"}</b><em>this week</em></div>
        <div class="kpi"><span>Other AI use</span><b>${other == null ? "Not tracked" : other + " times"}</b><em>${other == null ? "Browser extension is off" : "Count only, from the extension"}</em></div>
      </div>
      <section class="rsec"><h3>AI reliance by area vs expected</h3>
        <p class="muted">How much ${n} did himself, against what's expected at his level.</p>
        <div class="rel">${rel.map(r => `<div class="rel-row" title="${esc(r.name)}: ${r.pct}% himself, ${r.expected}% expected">
            <span class="rel-n">${esc(r.short)}</span>
            <div class="rel-track"><i style="width:${r.pct}%"></i><b style="left:${r.expected}%" aria-hidden="true"></b></div>
            <span class="rel-v">${r.pct}%</span></div>`).join("")}</div>
        <div class="rel-key"><span><i class="k-bar"></i>Did it himself</span><span><i class="k-tick"></i>Expected for his level</span></div>
        <ul class="rel-text">${rel.map(r => `<li><b>${esc(r.short)}:</b> ${n} did ${r.pct}% himself. Expected for his level: ${r.expected}%.</li>`).join("")}</ul>
      </section>
      <div class="rgrid">
        <section class="rsec"><h3>Growth</h3>${growth.length ? `<ul class="rlist">${growth.map(g => `<li>${icon("chart", 15)}<span>${g}</span></li>`).join("")}</ul>` : `<p class="muted">Steady across all areas so far this week.</p>`}</section>
        <section class="rsec"><h3>Did it himself</h3><ul class="rlist">${did.map(d => `<li>${icon("check", 15)}<span>${esc(d)}.</span></li>`).join("")}</ul></section>
      </div>
      <section class="rsec suggest"><h3>${icon("spark", 17)} One suggestion</h3><p>${esc(suggestion)}</p></section>
    </div>`;
  }
  function viewParent(main) {
    main.innerHTML = `<div class="page page--report">
      <header class="page-h"><div><p class="eyebrow">Weekly report · ${D.today.week}</p><h1>${esc(name())}'s week</h1>
        <p class="sub">${esc(name())}, ${S.setup.child.age} · Class ${S.setup.child.classNo} · ${esc(S.setup.child.provider)} through Bud-e</p></div>
        <button class="btn ghost" data-off>Download PDF</button></header>
      ${reportHTML()}
    </div>`;
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
        <p class="fine">${code ? `Prototype: the code from setup is <b>${esc(showCode(code))}</b>.` : `No device is set up yet. <button class="link" data-go="child">Set up ${n}'s device</button> to get a code.`}</p>
      </div>
      <button class="link" data-go="start">${icon("back", 14)} Back to start</button>
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
      const d = input.value.replace(/\D/g, "");
      const msg = !S.setup.done ? "Set up " + name() + "'s device first. The code appears when setup finishes."
        : d.length !== 8 ? "The code has 8 digits." : d !== S.setup.code ? "That code doesn't match. Check the code on " + name() + "'s device." : "";
      err.hidden = !msg; err.textContent = msg;
      if (msg) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); return; }
      const b = $("button[type=submit]", f); b.disabled = true; b.innerHTML = '<span class="spin"></span> Linking ' + esc(name()) + "'s device…";
      await sleep(700);
      S.parentIn = true; save();
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
      if (id === "walletAmt") S.wallet = walletLeft();
      const p = D.permissions.find(x => x.id === id);
      save();
      toast(id === "walletAmt" ? "Monthly wallet set to " + rupee(S.setup.walletMonthly) + "." : p.title + (S.setup.perms[id] ? " turned on." : " turned off.") + " " + name() + "'s device updates now.", "ok");
    });
  }

  /* ---------- Global events ---------- */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-chip],[data-pick],[data-menu],[data-switch],[data-logout],[data-go],[data-reset],[data-off],[data-jump],[data-challenge],[data-drawer]");
    $$(".menu").forEach(m => { if (!el || !el.hasAttribute("data-menu") || !m.parentElement.contains(el)) m.hidden = true; });
    if (!el) return;
    const d = el.dataset;
    if (d.chip != null && chat.waiting) {
      const c = chipObj(chat.waiting.chips[+d.chip]);
      answer({ label: c.label, go: c.go });
    } else if (d.logout != null) {
      S.parentIn = false; save(); toast("Logged out of Bud-e Parent.", "ok"); go("plogin");
    } else if (d.pick && chat.waiting && chat.waiting.products) {
      const p = chat.waiting.ctx.products.find(x => x.id === d.pick);
      answer({ product: p, label: p.name });
    } else if (d.menu != null) {
      const m = el.parentElement.querySelector(".menu"); m.hidden = !m.hidden;
    } else if (d.switch) {
      go(d.switch);
    } else if (d.go) {
      go(d.go);
    } else if (d.reset != null) {
      modal({ html: "<h2>Reset the prototype?</h2><p>Clears setup, chats, tokens, ratings and orders, and starts again.</p>",
        actions: [{ label: "Cancel", value: false, cancel: true }, { label: "Reset", value: true, primary: true }] }).then(ok => {
        if (!ok) return;
        cancelFlow(); S = fresh(); save(); toast("Prototype reset.", "ok");
        if (route() === "start") render(); else go("start");
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
    } else if (d.drawer != null) {
      document.body.classList.toggle("drawer-open");
    }
  });
  window.addEventListener("hashchange", () => { document.body.classList.remove("drawer-open"); render(); });

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
      eyes.style.transform = `translate(${(dx / d * 11 * k).toFixed(1)}px, ${(dy / d * 8 * k).toFixed(1)}px)`;
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

  if (!location.hash) location.replace("#/start");
  render();
})();
