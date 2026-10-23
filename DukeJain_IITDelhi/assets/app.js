/* Bud-e prototype: state, the rules from plan section 3, the pipeline from section 5 (with rules standing in for
   the small AI models), the chat runtime, and every screen S0–S14. No network, no libraries. */

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const val = v => (typeof v === "function" ? v(S) : v);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const signed = n => (n === 0 ? "0" : (n > 0 ? "+" : "−") + Math.abs(Math.round(n)));
const REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

const ICONS = {
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  wallet: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3"/><rect x="3" y="8" width="18" height="12" rx="2.5"/><circle cx="16.5" cy="14" r="1.2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  block: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  puzzle: '<path d="M9 4h4v2a2 2 0 1 0 4 0V4h3v6h-2a2 2 0 1 0 0 4h2v6h-6v-2a2 2 0 1 0-4 0v2H4v-6h2a2 2 0 1 0 0-4H4V4z"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};
function icon(name, size = 18) {
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}
const AREA_ICON = { study: "book", writing: "pen", money: "bag", relationships: "users", feelings: "heart" };

/* The Bud-e character mark, drawn inline. Each copy gets its own gradient ids. */
let logoCount = 0;
function logoMark(size = 32) {
  const n = ++logoCount, body = "logoBody" + n, lobes = "logoLobes" + n;
  return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="${body}" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#2D9CF0"/><stop offset="0.55" stop-color="#5B4BF0"/><stop offset="1" stop-color="#7B3FE4"/></linearGradient>
    <linearGradient id="${lobes}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="0.5" stop-color="#F25FC6"/><stop offset="1" stop-color="#FF8A4C"/></linearGradient></defs>
    <rect x="6" y="6" width="60" height="88" rx="26" fill="url(#${body})"/>
    <g opacity="0.9"><rect x="34" y="6" width="46" height="48" rx="24" fill="url(#${lobes})"/><rect x="34" y="40" width="60" height="54" rx="27" fill="url(#${lobes})"/></g>
    <rect x="17" y="38" width="64" height="34" rx="17" fill="#fff"/>
    <path d="M33 53q6 6 12 0M54 53q6 6 12 0" fill="none" stroke="#12142B" stroke-width="4.5" stroke-linecap="round"/></svg>`;
}
function wordmark() {
  const name = DATA.product.name, i = name.lastIndexOf("-");
  return i > 0 ? `<span class="wm">${esc(name.slice(0, i))}<span class="wm-accent">${esc(name.slice(i))}</span></span>` : `<span class="wm">${esc(name)}</span>`;
}
const agentAvatar = () => `<span class="avatar agent" title="My agent">${icon("sparkle", 16)}</span>`;

/* ---------- State ---------- */
const prefs = { bts: false }; /* demo preferences: they survive "Reset demo" */
let S;

function freshState() {
  const c = DATA.child;
  const st = {
    screen: "s0", seen: {},
    parent: clone(DATA.parent),
    child: { name: c.name, age: c.age, class: c.class, uses: c.uses.slice(), agent: c.agent, usedBefore: c.usedBefore },
    perms: {}, safety: clone(DATA.safetyContact), walletMonthly: c.wallet,
    setupDone: false, handover: "hand", flow: {}, lastChip: null
  };
  DATA.permissions.forEach(p => { st.perms[p.key] = p.default; });
  applyStart(st);
  return st;
}
function skillDef(key) {
  for (const area of DATA.areas) for (const skill of area.skills) if (skill.key === key) return { area, skill };
  return null;
}
function classAverage(sk, st) { return sk.classAvg + (st.child.class - 9) * 30; }
function usesPastData(st) { return !!(st.perms.pastData && st.child.usedBefore); }
function startRating(sk, st) { return clamp(Math.round(classAverage(sk, st) + (usesPastData(st) ? sk.pastAdj : 0)), 0, 1000); }
/* A fresh week: starting ratings, 500 tokens, a full wallet, no history. */
function applyStart(st) {
  st.skills = {};
  DATA.areas.forEach(a => a.skills.forEach(sk => {
    const r = sk.unlocked ? startRating(sk, st) : null;
    st.skills[sk.key] = { area: a.key, unlocked: sk.unlocked, rating: r, weekStart: r };
  }));
  st.tokens = DATA.child.tokens;
  st.wallet = st.perms.wallet ? st.walletMonthly : 0;
  st.tokenLog = [];
  st.events = [];
  st.challenges = {};
}

/* ---------- Rules (plan 3.3 and 8.4) ---------- */
function modeFor(gap) { return gap <= -200 ? "pro" : gap <= 0 ? "confident" : gap <= 200 ? "practising" : "learner"; }
function expectedFor(gap) { return 1 / (1 + Math.pow(10, gap / 400)); }
function updateRating(old, result, expected) { return clamp(Math.round(old + DATA.K * (result - expected)), 0, 1000); }
function bands(age) { const c = DATA.levels.centre(age); return DATA.levels.cuts.map(d => c + d); }
function levelIndex(rating, age) { const b = bands(age); let i = 0; while (i < b.length && rating >= b[i]) i++; return i; }
function levelFor(rating, age) { return DATA.levels.names[levelIndex(rating, age)]; }
function tokenCost(weight) { return DATA.tokenCost.find(t => weight < t.below).cost; }
function stakesWeight(amount) { return clamp(Math.round(-394 + 290.7 * Math.log10(Math.max(amount, 10))), 50, 1000); }

function spendTokens(weight, reason) {
  const cost = tokenCost(weight);
  if (S.tokens < cost) return false;
  S.tokens -= cost;
  S.tokenLog.unshift({ delta: -cost, reason });
  refreshLive();
  flyTokens(-cost);
  return true;
}
function earnTokens(amount, reason) {
  S.tokens += amount;
  S.tokenLog.unshift({ delta: amount, reason });
  refreshLive();
  flyTokens(amount);
}
function recordReliance(area, result) { S.events.push({ type: "rel", area, result }); }
function didIt(text) { S.events.push({ type: "did", text }); }

function lvBadge(rating) { const i = levelIndex(rating, S.child.age); return `<span class="lv l${i}">${DATA.levels.names[i]}</span>`; }
/* Progress inside the current level, and roughly how many at-level tasks done alone reach the next one
   (an at-level task done alone moves the rating by K × 0.5). */
function nextInfo(rating) {
  const b = bands(S.child.age), i = levelIndex(rating, S.child.age);
  if (i >= b.length) return { top: true, pct: 100 };
  const lo = i ? b[i - 1] : 0, hi = b[i];
  return { next: DATA.levels.names[i + 1], pct: clamp(Math.round((rating - lo) / (hi - lo) * 100), 0, 100), more: Math.max(1, Math.ceil((hi - rating) / (DATA.K / 2))) };
}

/* ---------- Shared UI ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}
const offPath = () => toast("Not part of this prototype.");
function flyTokens(delta) {
  const pill = $(".token-pill");
  if (!pill || REDUCED) return;
  const f = document.createElement("span");
  f.className = "fly" + (delta < 0 ? " minus" : "");
  f.textContent = (delta > 0 ? "+" : "−") + Math.abs(delta);
  pill.appendChild(f);
  setTimeout(() => f.remove(), 1300);
}
function modal(o) {
  return new Promise(resolve => {
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = `<div class="modal${o.wide ? " wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      ${o.icon ? `<div class="modal-icon">${icon(o.icon, 24)}</div>` : ""}<h3 id="modal-title">${esc(o.title)}</h3>${o.body ? `<p>${esc(o.body)}</p>` : ""}${o.html || ""}
      <div class="modal-actions"><button class="btn primary lg" data-yes>${esc(o.yes || "OK")}</button>${o.no ? `<button class="btn ghost lg" data-no>${esc(o.no)}</button>` : ""}</div></div>`;
    document.body.appendChild(wrap);
    const done = v => { wrap.remove(); document.removeEventListener("keydown", onKey, true); resolve(v); };
    const onKey = e => { if (e.key === "Escape" && !o.noEscape) { e.stopPropagation(); done(false); } };
    document.addEventListener("keydown", onKey, true);
    wrap.addEventListener("click", e => {
      if (e.target.closest("[data-yes]")) done(true);
      else if (e.target.closest("[data-no]")) done(false);
    });
    $("[data-yes]", wrap).focus();
  });
}

/* Which label best matches what the child typed: the most label words found in the text. */
const STOP = ["and", "the", "her", "you", "for", "what", "with", "to", "of", "on", "in", "it", "is", "me", "my", "an", "at", "so", "do", "be", "or", "if", "as", "by", "i", "a"];
function words(s) {
  return String(s).toLowerCase().replace(/(\d)([a-z])/g, "$1 $2").split(/[^a-z0-9√.\/]+/)
    .filter(w => (w.length > 1 || /\d/.test(w)) && !STOP.includes(w));
}
function bestMatch(labels, text) {
  const said = words(text);
  let i = -1, score = 0;
  labels.forEach((label, k) => {
    const n = words(label).filter(w => said.some(t => t === w || (w.length > 2 && !/\d/.test(w) && t.startsWith(w)))).length;
    if (n > score) { i = k; score = n; }
  });
  return { i, score };
}

/* ---------- Shells ---------- */
function childShell(tab, main, withPanel) {
  const tabs = [["chat", "s5", "chat", "Chat"], ["earn", "s12", "star", "Earn tokens"], ["progress", "s13", "chart", "My progress"]];
  return `<header class="app-top"><div class="brand">${logoMark(30)}${wordmark()}</div>
      <nav class="tabs" aria-label="Aarav's app">${tabs.map(([k, id, ic, label]) => `<button data-go="${id}"${k === tab ? ' class="on" aria-current="page"' : ""}>${icon(ic, 16)}<span>${label}</span></button>`).join("")}</nav>
      <div class="top-right"><span class="token-pill" title="Tokens this week">${icon("coin", 15)}<b data-live="tokens"></b><span class="token-word">tokens</span></span><span class="avatar child" title="${esc(S.child.name)}">${esc(S.child.name[0])}</span></div></header>
    <div class="child-body${withPanel ? "" : " no-panel"}"><main class="child-main">${main}</main>${withPanel ? '<aside class="panel" id="panel" aria-label="Areas, tokens and wallet"></aside>' : ""}</div>`;
}
function parentShell(step, inner, o = {}) {
  const steps = ["Account", "Child", "Permissions", "Handover"];
  const nav = o.report ? `<nav class="tabs"><button class="on" aria-current="page">${icon("chart", 16)}<span>Weekly report</span></button><button data-off>${icon("user", 16)}<span>Settings</span></button></nav>` : "";
  return `<header class="app-top"><div class="brand">${logoMark(30)}${wordmark()}</div><span class="role">Parent</span>${nav}
      <div class="top-right"><span class="avatar parent" title="${esc(S.parent.name)}">${esc((S.parent.name || "P")[0])}</span></div></header>
    ${step ? `<ol class="stepper">${steps.map((s, i) => `<li class="${i + 1 < step ? "done" : i + 1 === step ? "on" : ""}"><span>${i + 1 < step ? icon("check", 13) : i + 1}</span>${s}</li>`).join("")}</ol>` : ""}
    ${o.raw ? inner : `<div class="page"><div class="page-inner${o.narrow ? " narrow" : ""}">${inner}</div></div>`}`;
}
function panelHTML() {
  const areas = DATA.areas.map(a => `<div><div class="area-h">${icon(AREA_ICON[a.key], 16)}<b>${esc(a.name)}</b></div>${a.care
    ? '<div class="sk"><span>Always handled with care</span></div>'
    : a.skills.filter(s => !s.soon).map(s => { const st = S.skills[s.key]; return `<div class="sk"><span>${esc(s.name)}</span>${st.unlocked ? lvBadge(st.rating) : '<span class="lv new">New</span>'}</div>`; }).join("")}</div>`).join("");
  const mini = DATA.areas.filter(a => !a.care).map(a => {
    const best = a.skills.filter(s => S.skills[s.key].unlocked).map(s => S.skills[s.key].rating).sort((x, y) => y - x)[0];
    return `<span class="mini-area">${icon(AREA_ICON[a.key], 14)}${esc(a.tag)} ${best == null ? '<span class="lv new">New</span>' : lvBadge(best)}</span>`;
  }).join("");
  const per = DATA.child.tokensPerWeek;
  return `<div class="card areas-card"><div class="stat-row"><span class="label">Your areas</span><button class="link-btn" data-go="s13">See progress</button></div><div class="panel-areas">${areas}</div></div>
    <div class="card areas-mini"><div class="stat-row"><span class="label">Your areas</span><button class="link-btn" data-go="s13">See all</button></div><div class="mini-row">${mini}</div></div>
    <div class="card"><span class="label">Tokens this week</span><div class="big">${S.tokens}<small> / ${per}</small></div><div class="bar"><i style="width:${clamp(S.tokens / per * 100, 0, 100)}%"></i></div>
      <div class="stat-row panel-foot"><span class="hint">Resets Monday</span><button class="btn ghost small" data-go="s12">${icon("star", 14)}Earn tokens</button></div></div>
    <div class="card"><span class="label">Wallet</span><div class="big">${money(S.wallet)}</div><div class="bar"><i style="width:${S.walletMonthly ? clamp(S.wallet / S.walletMonthly * 100, 0, 100) : 0}%"></i></div>
      <p class="hint">left of ${money(S.walletMonthly)} this month</p></div>`;
}
function refreshLive() {
  $$("[data-live=tokens]").forEach(e => { e.textContent = S.tokens; });
  const p = $("#panel");
  if (p) p.innerHTML = panelHTML();
}

/* ---------- Demo rail and navigation ---------- */
function renderRail() {
  let html = "", group = "";
  DATA.moments.forEach(m => {
    if (m.group !== group) { group = m.group; html += `<div class="rail-group">${esc(group)}</div>`; }
    html += `<button class="rail-item${m.id === S.screen ? " active" : ""}${S.seen[m.id] ? " seen" : ""}" data-go="${m.id}"${m.id === S.screen ? ' aria-current="page"' : ""}><span class="n">${m.id.toUpperCase()}</span><b>${esc(m.title)}</b></button>`;
  });
  $("#rail-list").innerHTML = html;
}
function navState() {
  const i = DATA.moments.findIndex(m => m.id === S.screen);
  $("#prev").disabled = i <= 0;
  $("#next").disabled = i >= DATA.moments.length - 1;
}
function go(id) {
  const m = DATA.moments.find(x => x.id === id);
  if (!m) return;
  $$(".modal-wrap").forEach(x => x.remove());
  document.body.classList.remove("rail-open");
  S.screen = id;
  S.seen[id] = true;
  $("#caption").textContent = m.caption;
  const el = $("#screen");
  el.innerHTML = "";
  (SCREENS[id] || chatScreen)(el, m);
  renderRail();
  navState();
  refreshLive();
}
function step(delta) {
  const i = DATA.moments.findIndex(m => m.id === S.screen) + delta;
  if (i >= 0 && i < DATA.moments.length) go(DATA.moments[i].id);
}
function setBts(on) {
  prefs.bts = on;
  document.body.classList.toggle("show-bts", on);
  $("#bts").checked = on;
}
function setPresent(on) {
  document.body.classList.toggle("present", on);
  document.body.classList.remove("rail-open");
  $("#show-demo").hidden = !on;
}

/* ---------- Chat runtime ---------- */
/* One persistent conversation. A task is one request worked through by a flow; `C.id` changes whenever a new
   request starts, so an abandoned flow stops at its next step. */
const C = { id: 0, wait: null, task: null, busy: false, queue: null, turn: null, after: null };
let CHAT = null;

function buildChat() {
  const el = document.createElement("section");
  el.className = "chat";
  el.setAttribute("aria-label", "Chat with my agent");
  el.innerHTML = `<header class="chat-head">${agentAvatar()}<div class="ttl"><b>My agent</b><small>Your personal AI agent, with ${esc(DATA.product.name)} in between</small></div>
      <button class="btn ghost small" id="new-chat">${icon("refresh", 15)}New chat</button></header>
    <div class="thread" id="thread"></div>
    <div class="composer">
      <div class="suggest" id="suggest"></div>
      <div class="cbar">
        <button class="faster" id="faster" hidden>${icon("bolt", 15)}<span>Faster response</span><span class="cost" id="faster-cost"></span></button>
        <textarea id="msg" rows="1" placeholder="Message my agent" aria-label="Message my agent"></textarea>
        <button class="send" id="send" aria-label="Send">${icon("send", 18)}</button>
      </div>
    </div>`;
  CHAT = { el, thread: $("#thread", el), input: $("#msg", el), send: $("#send", el), faster: $("#faster", el), cost: $("#faster-cost", el), suggest: $("#suggest", el) };
  CHAT.send.addEventListener("click", () => sendText(CHAT.input.value.trim()));
  CHAT.input.addEventListener("input", fit);
  CHAT.input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(CHAT.input.value.trim()); } });
  CHAT.faster.addEventListener("click", onFaster);
  $("#new-chat", el).addEventListener("click", () => { abandon(); CHAT.thread.innerHTML = ""; C.after = null; renderEmpty(); });
  CHAT.suggest.addEventListener("click", e => { const b = e.target.closest("button"); if (b) sendText(b.dataset.text); });
  CHAT.suggest.innerHTML = DATA.suggestions.map(s => `<button data-text="${esc(s)}">${esc(s)}</button>`).join("");
  renderEmpty();
  setComposer();
}
function renderEmpty() {
  if (CHAT.thread.children.length) return;
  CHAT.thread.innerHTML = `<div class="empty"><h2>Hi ${esc(S.child.name)}</h2><p>Ask for anything. Chores happen instantly. For everything else, you'll do as much as you're ready for.</p></div>`;
}
function fit() {
  const ta = CHAT.input;
  ta.style.height = "";
  if (ta.value) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight + 2, 140) + "px"; }
}
function setComposer(o = {}) {
  CHAT.input.value = o.value || "";
  CHAT.input.placeholder = o.placeholder || "Message my agent";
  CHAT.send.classList.toggle("pulse", !!o.pulse);
  CHAT.send.innerHTML = o.to ? "Send to " + esc(o.to) : icon("send", 18);
  CHAT.send.setAttribute("aria-label", o.to ? "Send to " + o.to : "Send");
  CHAT.suggest.hidden = !!C.wait || C.busy;
  fit();
}
const alive = id => id === C.id;
const scrollDown = () => { CHAT.thread.scrollTop = CHAT.thread.scrollHeight; };
function append(el) { const e = $(".empty", CHAT.thread); if (e) e.remove(); CHAT.thread.appendChild(el); scrollDown(); return el; }
function div(cls, html) { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; return d; }
function childBubble(text) { C.turn = null; append(div("me", esc(text))); }
function note(html) { append(div("note", html)); }
function showReward(n, why) { append(div("reward", `${icon("coin", 14)}+${n} tokens ${esc(why)}`)); }
function bts(text) {
  const t = C.turn, d = div("bts", esc(text));
  if (t && CHAT.thread.lastElementChild === t.el) { t.body.appendChild(d); scrollDown(); }
  else { d.style.marginLeft = "42px"; append(d); }
}
function ensureTurn(tag, tone) {
  const t = C.turn;
  if (t && t.tag === tag && CHAT.thread.lastElementChild === t.el) return t;
  const el = div("turn", agentAvatar() + `<div class="turn-body"><div class="tag t-${tone}"><span class="dot"></span><span>${esc(tag)}</span></div></div>`);
  append(el);
  C.turn = { el, body: el.lastElementChild, tag };
  return C.turn;
}
async function say(text, o) {
  if (!alive(o.id)) return false;
  C.busy = true;
  const dots = append(div("typing", "<i></i><i></i><i></i>"));
  await sleep(o.fast ? 220 : REDUCED ? 150 : Math.min(1000, 380 + String(text).length * 6));
  dots.remove();
  if (!alive(o.id)) return false;
  const turn = ensureTurn(o.tag, o.tone);
  const b = div("bubble", "");
  b.textContent = text;
  turn.body.appendChild(b);
  scrollDown();
  return true;
}
function waitFor(w, id) {
  return new Promise(resolve => {
    if (!alive(id)) return;
    w.resolve = resolve;
    C.wait = w;
    C.busy = false;
    if (w.row) w.row.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (b && C.wait === w) settle({ opt: w.options[+b.dataset.i] });
    });
    setComposer({ value: w.prefill || "", placeholder: w.placeholder, pulse: w.type === "compose" && !!w.prefill, to: w.to });
    syncFaster();
    drain();
  });
}
function settle(r) {
  const w = C.wait;
  if (!w) return;
  C.wait = null;
  if (w.row) w.row.remove();
  C.busy = true;
  setComposer();
  syncFaster();
  if (w.type === "chips") childBubble(r.typed || r.opt.label);
  if (w.type === "compose" && !w.to) childBubble(r.text);
  w.resolve(r);
}
function ask(options, o) {
  const opts = options.map(x => (typeof x === "string" ? { label: x } : x));
  const row = div("chips", opts.map((x, i) => `<button class="chip" data-i="${i}">${esc(x.label)}</button>`).join(""));
  if (alive(o.id)) append(row);
  return waitFor({ type: "chips", options: opts, row, placeholder: "Pick one, or type your own" }, o.id);
}
const compose = (prefill, o) => waitFor({ type: "compose", prefill, to: o.to, placeholder: o.placeholder || "Type your message" }, o.id);
const waitCard = (card, onType, o) => waitFor({ type: "card", card, onType, placeholder: "Tap an option, or type its name" }, o.id);

function sendText(text) {
  const w = C.wait;
  if (w) {
    if (w.type === "compose") {
      const t = text || w.prefill;
      if (!t) return toast("Type your message first.");
      return settle({ text: t });
    }
    if (!text) return;
    if (looksLikeNewRequest(text, w)) { abandon(); return startMessage(text); }
    if (w.type === "chips") {
      const m = bestMatch(w.options.map(o => o.label + " " + (o.also || "")), text);
      return settle({ typed: text, opt: w.options[Math.max(0, m.i)] });
    }
    if (w.type === "card" && !w.onType(text)) toast("Tap an option above, or type its name.");
    return;
  }
  if (!text) return;
  if (C.busy) { C.queue = text; setComposer({ placeholder: "Sending when your agent is done…" }); return; }
  startMessage(text);
}
function looksLikeNewRequest(text, w) {
  if (w.options && bestMatch(w.options.map(o => o.label + " " + (o.also || "")), text).score > 0) return false;
  if (matchTask(text)) return true;
  if (/^\s*(solve|write|reply|text|message|order|buy|book|remind|wish|tell)\b/i.test(text)) return true;
  const d = detect(text);
  return d.type === "chore" || d.type === "feelings";
}
function drain() {
  if (!C.queue) return;
  const q = C.queue;
  C.queue = null;
  if (C.wait || !C.busy) sendText(q);
  else C.queue = q;
}
function abandon() {
  C.id++;
  if (C.wait) { if (C.wait.row) C.wait.row.remove(); C.wait = null; }
  $$(".typing", CHAT.thread).forEach(x => x.remove());
  C.busy = false;
  C.task = null;
  C.turn = null;
  setComposer();
  syncFaster();
}
function endTask() {
  C.busy = false;
  if (C.task) C.task.done = true;
  syncFaster();
  setComposer();
  drain();
}
async function startMessage(text, o = {}) {
  if (o.bubble !== false) childBubble(text);
  const id = ++C.id;
  C.busy = true;
  setComposer();
  const res = await handle(text, id);
  if (!alive(id)) return;
  endTask();
  if (res && res.next) startMessage(res.next, { bubble: false });
}
function syncFaster() {
  const t = C.task;
  const show = !!(t && t.fasterRun && !t.done && !t.faster && t.mode !== "pro" && C.wait);
  CHAT.faster.hidden = !show;
  if (show) CHAT.cost.textContent = tokenCost(t.weight);
}
/* Faster response (plan 3.5): costs tokens by weight, does the task directly, never raises the rating. */
async function onFaster() {
  const t = C.task;
  if (!t || !t.fasterRun || t.done) return;
  const cost = tokenCost(t.weight);
  if (S.tokens < cost) {
    if (await modal({ icon: "coin", title: "Not enough tokens", body: `A Faster response here costs ${cost} tokens and you have ${S.tokens}. Earn more by doing things yourself.`, yes: "Earn tokens", no: "Not now" })) go("s12");
    return;
  }
  const ok = await modal({ icon: "bolt", title: "Faster response", body: `This will use ${cost} tokens (you have ${S.tokens}). Continue?`, yes: "Yes", no: "Not now" });
  if (!ok || C.task !== t || t.done) return;
  abandon();
  const id = C.id;
  C.task = t;
  t.faster = true;
  C.busy = true;
  const before = S.tokens;
  spendTokens(t.weight, "Faster response · " + t.skillName);
  childBubble("⚡ Faster response");
  if (!(await say(t.fasterRun(), { id, tag: t.tag, tone: t.tone }))) return;
  note(esc("Faster responses don't raise your rating."));
  bts(`Faster response · ${before} → ${S.tokens} tokens · rating stays ${S.skills[t.skill].rating}`);
  recordReliance(t.area, 0);
  endTask();
}

/* ---------- ① Detector and ③ weight estimator (rules standing in for small AI models) ---------- */
const RX = {
  feelings: /\b(i feel|i'?m feeling|feeling|i'?m so|i am so|i'?m really|i am really|i feel so)\b.*\b(low|sad|down|lonely|alone|anxious|stressed|upset|scared|worried|awful|terrible|empty|bad)\b|\b(no ?one|nobody) (gets|understands) me\b|\b(depressed|heartbroken|crying)\b/i,
  relVerb: /\b(reply|respond|text|message|msg|tell|wish|say sorry|apologi[sz]e|invite|thank)\b/i,
  chore: /\b(book|cab|taxi|auto|ride|remind|reminder|alarm|timer|groceries|grocery|milk|bread|eggs|vegetables|fruits?|pizza|lunch|dinner|bus|train|metro|timings?|weather)\b/i,
  money: /(₹|\brs\.?\s?\d|\brupees?\b|\bbuy\b|\border\b|\bgift\b|\bpurchase\b|\bshop(ping)?\b)/i,
  choice: /\b(stream|which subjects?|which course|class 11|11th)\b/i,
  writing: /\b(write|draft)\b|\b(e-?mail|mail|application|essay|story|poem|letter|paragraph)\b/i,
  study: /\b(geometry|triangle|angle|circle|area|perimeter|science|physics|chemistry|biology|history|geography|homework|chapter|trigonometry)\b/i,
  small: /^\s*(thanks|thank you|thx|ok|okay|cool|nice|great|got it|bye|hi|hello|hey)\b/i
};
function matchTask(text) { return DATA.tasks.find(t => t.match.test(text)); }
function detect(text) {
  const t = text.toLowerCase();
  if (RX.feelings.test(t)) return { type: "feelings" };
  const who = recipient(t);
  if (who && RX.relVerb.test(t) && !/\bgift\b/.test(t)) return { type: "skill", kind: "message", area: "relationships", skill: "messages", who, msg: messageKind(t) };
  if (RX.chore.test(t) && !/\b(gift|buy)\b/.test(t)) return { type: "chore", chore: choreType(t) };
  const eq = parseEquation(text);
  if (eq) return { type: "skill", kind: "equation", area: "study", skill: "algebra", eq };
  if (/=/.test(t) && /\bsolve\b|[a-z]\s*[\^²³]|\d[a-z]\b/.test(t)) return { type: "help", help: "equation" };
  if (RX.money.test(t)) return purchaseDetect(t);
  if (RX.choice.test(t)) return { type: "skill", kind: "decision", area: "money", skill: "choices" };
  if (RX.writing.test(t)) return { type: "skill", kind: "writing", area: "writing", skill: /essay|paragraph/.test(t) ? "essays" : /story|poem/.test(t) ? "stories" : "emails" };
  if (RX.study.test(t)) return { type: "help", help: "study", topic: cap(t.match(RX.study)[0]) };
  if (RX.small.test(t)) return { type: "small" };
  return { type: "unknown" };
}
function taskDetect(task, text) {
  if (task.chore) return { type: "chore", chore: task.chore, scripted: true };
  if (task.flow === "feelings") return { type: "feelings" };
  if (task.flow === "apology") return { type: "skill", kind: "message", area: "relationships", skill: "messages", who: "Riya", msg: { feelings: true, weight: task.weight } };
  if (task.flow === "gift") return Object.assign(purchaseDetect(text.toLowerCase()), { gift: true, who: "Riya" });
  return { type: "skill", kind: "equation", area: task.area, skill: task.skill, eq: parseEquation(text) };
}
function recipient(t) {
  const m = t.match(/\b(?:reply to|respond to|text|message|msg|tell|wish|write to|thank|invite|say sorry to|apologi[sz]e to)\s+(?:my\s+)?([a-z]+)/i);
  if (!m) return null;
  const w = m[1].toLowerCase();
  if (["me", "a", "an", "the", "that", "this", "it", "him", "her", "them", "someone", "everyone", "you", "us"].includes(w)) return null;
  return { mom: "Mom", mum: "Mom", mother: "Mom", amma: "Mom", dad: "Dad", papa: "Dad", father: "Dad", didi: "Didi", sister: "Didi" }[w] || cap(w);
}
function messageKind(t) {
  if (/\b(sorry|apologi|fight|forgive|hurt|miss you|love you|comfort|condolence|feel better)/.test(t)) return { feelings: true, weight: 700, type: "sorry" };
  if (/\b(birthday|congrat|wish|proud|thank|good luck|get well)/.test(t)) return { feelings: true, weight: 400, type: /thank/.test(t) ? "thanks" : "wish" };
  if (/\b(reached|home|late|on my way|omw|coming|leaving|be there|running|outside|downstairs)\b/.test(t)) return { feelings: false, weight: 100, routine: routineText(t) };
  return { feelings: false, weight: 300, routine: null };
}
function routineText(t) {
  if (/reached|home/.test(t)) return "Reached home.";
  if (/late|running/.test(t)) return "Running 10 minutes late, sorry!";
  if (/on my way|omw/.test(t)) return "On my way!";
  if (/leaving/.test(t)) return "Leaving now.";
  if (/outside|downstairs/.test(t)) return "I'm downstairs.";
  return "Coming!";
}
function choreType(t) {
  if (/\b(book|cab|taxi|auto|ride)\b/.test(t)) return "ride";
  if (/\b(remind|reminder|alarm|timer)\b/.test(t)) return "reminder";
  if (/\b(bus|train|metro|timings?)\b/.test(t)) return "timings";
  if (/\bweather\b/.test(t)) return "weather";
  return "groceries";
}
function parseBudget(t) {
  const m = t.match(/(?:under|below|less than|up ?to|within|max(?:imum)?)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i) || t.match(/(?:₹|rs\.?\s?)\s*([\d,]+)/i);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
}
function purchaseDetect(t) {
  const budget = parseBudget(t);
  const gift = /\bgift\b/.test(t);
  const forWho = t.match(/\bfor\s+(?:my\s+)?([a-z]+)/);
  const who = forWho && !["a", "the", "under", "below", "me", "myself"].includes(forWho[1]) ? cap(forWho[1]) : null;
  const cat = DATA.products.catalog.find(c => c.words.some(w => new RegExp("\\b" + w + "\\b").test(t)));
  if (!gift && !cat) return { type: "help", help: "money" };
  const items = gift ? null : (typeof cat.items === "string" ? DATA.products[cat.items] : cat.items);
  const top = gift ? 600 : Math.max.apply(null, items.map(p => p.price));
  return { type: "skill", kind: "purchase", area: "money", skill: "spending", gift, who, budget, items, cat: cat && cat.cat, weight: stakesWeight(budget || top) };
}
function estimateWeight(det, text) {
  const t = text.toLowerCase();
  if (det.kind === "equation") {
    const eq = det.eq;
    if (eq.degree === 1) return 200 + (Number.isInteger(Math.round(eq.roots[0] * 1e6) / 1e6) ? 0 : 50) + (eq.bothX ? 50 : 0);
    return eq.degree === 2 ? 500 : eq.degree === 3 ? 720 : 850;
  }
  if (det.kind === "message") return det.msg.weight;
  if (det.kind === "purchase") return det.weight;
  if (det.kind === "decision") return 900;
  if (det.kind === "writing") return /leave/.test(t) ? 300 : det.skill === "essays" ? 550 : det.skill === "stories" ? 500 : 400;
  return 400;
}

/* ---------- Equations: a small parser and solver, so any linear or polynomial question works ---------- */
const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function normMath(s) {
  return s.toLowerCase().replace(/[−–—]/g, "-").replace(/[×·]/g, "*")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => "^" + Array.from(m).map(ch => SUPS.indexOf(ch)).join(""));
}
function extractEquation(text) {
  const tokens = normMath(text).replace(/[?,!:;]+/g, " ").replace(/=/g, " = ").split(/\s+/).filter(Boolean);
  const ok = tok => /^[0-9a-z.^+\-*=]+$/.test(tok) && !/[a-z]{2}/.test(tok);
  const at = tokens.indexOf("=");
  if (at < 0) return null;
  let lo = at, hi = at;
  while (lo > 0 && ok(tokens[lo - 1])) lo--;
  while (hi < tokens.length - 1 && ok(tokens[hi + 1])) hi++;
  const eq = tokens.slice(lo, hi + 1).join("");
  return eq.split("=").length === 2 ? eq : null;
}
function parseSide(s) {
  if (!s) return null;
  const terms = s.replace(/-/g, "+-").split("+").filter(Boolean);
  const coef = {};
  let v = null;
  for (const term of terms) {
    const m = term.match(/^(-?)(\d*\.?\d*)\*?([a-z]?)(?:\^(\d+))?$/);
    if (!m || (!m[2] && !m[3]) || (m[4] && !m[3])) return null;
    if (m[3]) { if (v && v !== m[3]) return null; v = m[3]; }
    const c = (m[2] ? parseFloat(m[2]) : 1) * (m[1] ? -1 : 1);
    const e = m[3] ? (m[4] ? parseInt(m[4], 10) : 1) : 0;
    if (isNaN(c) || e > 6) return null;
    coef[e] = (coef[e] || 0) + c;
  }
  return { coef, v };
}
const hasVar = c => Object.keys(c).some(e => +e > 0 && Math.abs(c[e]) > 1e-12);
function parseEquation(text) {
  const raw = extractEquation(text);
  if (!raw) return null;
  const sides = raw.split("=");
  const L = parseSide(sides[0]), R = parseSide(sides[1]);
  if (!L || !R) return null;
  const v = L.v || R.v;
  if (!v || (L.v && R.v && L.v !== R.v)) return null;
  let Lc = L.coef, Rc = R.coef;
  if (!hasVar(Lc) && hasVar(Rc)) { const tmp = Lc; Lc = Rc; Rc = tmp; }
  const lk = Object.keys(Lc).filter(e => Math.abs(Lc[e]) > 1e-12);
  if (lk.length === 1 && lk[0] === "1" && Lc[1] === 1 && !hasVar(Rc)) return null; /* "x = 5" is an answer */
  const f = {};
  new Set(Object.keys(Lc).concat(Object.keys(Rc))).forEach(e => { const c = (Lc[e] || 0) - (Rc[e] || 0); if (Math.abs(c) > 1e-12) f[e] = c; });
  const degree = Math.max.apply(null, [0].concat(Object.keys(f).map(Number)));
  if (degree === 0) return null;
  const roots = degree === 1 ? [-(f[0] || 0) / f[1]] : realRoots(f);
  return { v, L: Lc, R: Rc, f, degree, roots, bothX: hasVar(Lc) && hasVar(Rc), rearranged: fmtPoly(f, v) + " = 0" };
}
function evalPoly(f, x) { return Object.keys(f).reduce((s, e) => s + f[e] * Math.pow(x, +e), 0); }
function realRoots(f) {
  const found = [];
  let x0 = -50, y0 = evalPoly(f, x0);
  for (let i = 1; i <= 2000; i++) {
    const x1 = -50 + i * 0.05, y1 = evalPoly(f, x1);
    if (Math.abs(y1) < 1e-9) found.push(x1);
    else if (y0 * y1 < 0) {
      let a = x0, b = x1;
      for (let k = 0; k < 60; k++) { const m = (a + b) / 2; if (evalPoly(f, a) * evalPoly(f, m) <= 0) b = m; else a = m; }
      found.push((a + b) / 2);
    }
    x0 = x1; y0 = y1;
  }
  const out = [];
  found.forEach(r => { const rr = Math.abs(r - Math.round(r)) < 1e-6 ? Math.round(r) : r; if (!out.some(o => Math.abs(o - rr) < 1e-6)) out.push(rr); });
  return out.sort((a, b) => a - b);
}
function fmtNum(n) {
  const r = Math.round(n * 100) / 100;
  return String(Math.abs(r) < 1e-9 ? 0 : r).replace("-", "−");
}
function fmtPoly(c, v) {
  const exps = Object.keys(c).map(Number).filter(e => Math.abs(c[e]) > 1e-12).sort((a, b) => b - a);
  if (!exps.length) return "0";
  return exps.map((e, i) => {
    const k = c[e], a = Math.abs(k);
    const num = e > 0 && Math.abs(a - 1) < 1e-12 ? "" : fmtNum(a);
    const term = num + (e > 0 ? v + (e > 1 ? Array.from(String(e)).map(d => SUPS[+d]).join("") : "") : "");
    return (k < 0 ? (i ? " − " : "−") : (i ? " + " : "")) + term;
  }).join("");
}
const fmtCoefX = (a, v) => (a === 1 ? v : a === -1 ? "−" + v : fmtNum(a) + v);

/* ---------- The pipeline: ① detect → ② rating → ③ weight → ④ mode → ⑤ reply → ⑦ score ---------- */
async function handle(text, id) {
  const scripted = matchTask(text);
  if (C.after === "feelings" && !scripted && words(text).length <= 6) {
    const d = detect(text);
    if (d.type === "unknown" || d.type === "small") { C.after = null; return feelingsFollowUp(id); }
  }
  C.after = null;
  const det = scripted ? taskDetect(scripted, text) : detect(text);
  if (det.type === "chore") return runChore(det, text, id);
  if (det.type === "feelings") return runFeelings(id);
  if (det.type === "small") return runSmall(text, id);
  if (det.type === "help") return runHelp(det, id);
  if (det.type === "unknown") return runUnknown(id);

  const task = { id, text, area: det.area, skill: det.skill, kind: det.kind, det, scripted };
  if (!(await ensureSkill(task))) return;
  setupTask(task, scripted && scripted.weight != null ? scripted.weight : estimateWeight(det, text));
  C.task = task;
  S.flow = {};
  return KINDS[det.kind](task);
}
function setupTask(task, weight) {
  const d = skillDef(task.skill);
  task.areaDef = d.area;
  task.skillDef = d.skill;
  task.skillName = d.skill.name;
  task.weight = clamp(Math.round(weight), 0, 1000);
  task.rating = S.skills[task.skill].rating;
  task.gap = task.weight - task.rating;
  task.mode = modeFor(task.gap);
  const feelingsMsg = task.kind === "message" && task.det.msg.feelings;
  task.tone = feelingsMsg ? "care" : task.mode;
  task.tag = feelingsMsg ? DATA.tags.feelingsMsg : tagFor(task);
  task.btsLine = `child rating ${task.rating} · task weight ${task.weight} · gap ${signed(task.gap)} → ${MODES[task.mode].name}`;
}
function tagFor(task) {
  const a = task.areaDef, sk = task.skillDef;
  const lines = DATA.tags.lines[sk.key === "choices" ? "decisions" : a.key];
  const withSkill = a.key === "study" || a.key === "writing";
  return `${sk.tag || a.tag}${withSkill ? " · " + sk.name : ""} · ${MODES[task.mode].name}: ${lines[task.mode]}`;
}
async function sayT(task, text, fast) {
  const ok = await say(text, { id: task.id, tag: task.tag, tone: task.tone, fast });
  if (ok && !task.btsDone) {
    task.btsDone = true;
    if (task.startNote) bts(task.startNote);
    if (task.btsLine) bts(task.btsLine);
  }
  return ok;
}
const askT = (task, options) => ask(options, { id: task.id });
const composeT = (task, prefill, o = {}) => compose(prefill, Object.assign({ id: task.id }, o));
async function askUntil(task, labels, right, retry) {
  const rights = [].concat(right);
  for (;;) {
    const r = await askT(task, labels);
    if (!alive(task.id)) return false;
    if (rights.includes(r.opt.label)) return true;
    if (!(await sayT(task, retry))) return false;
  }
}
/* ⑦ Result scorer → Elo update (plan 3.3). result: 1 = did it himself, 0.5 = with hints, 0 = done for him. */
function finish(task, result, o = {}) {
  if (!alive(task.id) || task.done) return;
  task.done = true;
  const st = S.skills[task.skill];
  let line;
  if (task.mode === "pro") line = "Pro mode: done for him by design, so the rating doesn't change";
  else {
    const exp = expectedFor(task.gap), from = st.rating, to = updateRating(from, result, exp);
    const before = levelFor(from, S.child.age), after = levelFor(to, S.child.age);
    st.rating = to;
    line = `Rating ${from} → ${to} (expected ${exp.toFixed(2)}, result ${result}, K = ${DATA.K}) · ${before === after ? "level stays " + after : before + " → " + after}`;
    if (before !== after) toast(`${task.skillName}: ${before} → ${after}`);
    recordReliance(task.area, result);
  }
  if (o.bonus) {
    earnTokens(o.bonus, o.bonusWhy || "Did it yourself · " + task.skillName);
    showReward(o.bonus, "for doing it yourself");
    line += ` · +${o.bonus} bonus tokens`;
  }
  bts(line);
  if (o.did) didIt(o.did);
  refreshLive();
}
/* "New skill unlocked" (plan 3.4). */
async function ensureSkill(task) {
  const st = S.skills[task.skill];
  if (st.unlocked) return true;
  const def = skillDef(task.skill).skill;
  const yes = await modal({ icon: "star", title: "New skill unlocked: " + def.name,
    body: `Your first ${def.name.toLowerCase()} request. I'll start you from your class average${usesPastData(S) ? " and what your agent already knows about you" : ""}.`,
    yes: "Yes, let's go", no: "No, I'm not new to this", noEscape: true });
  if (!alive(task.id)) return false;
  const avg = classAverage(def, S), past = usesPastData(S) ? def.pastAdj : 0;
  let rating = startRating(def, S);
  let why = `class average ${avg}${past ? ", " + signed(past) + " from past data" : ""}`;
  if (!yes) {
    const score = await quickCheck(task, def);
    if (score === null) return false;
    const bonus = [0, 40, 120][score];
    rating = clamp(rating + bonus, 0, 1000);
    why += `, quick check ${score}/2 (${signed(bonus)})`;
  }
  st.unlocked = true;
  st.rating = rating;
  st.weekStart = null;
  task.startNote = `Starting rating ${rating} (${why})`;
  refreshLive();
  return true;
}
async function quickCheck(task, def) {
  const qs = DATA.checks[def.key] || DATA.checks.default;
  const a = skillDef(def.key).area;
  const o = { id: task.id, tag: `${def.tag || a.tag} · ${def.name} · Quick check: two questions to find your level`, tone: "check" };
  let score = 0;
  if (!(await say("Okay, two quick questions so I start you at the right level.", o))) return null;
  for (const q of qs) {
    if (!(await say(q.q, o))) return null;
    const r = await ask(q.options, o);
    if (!alive(task.id)) return null;
    if (r.opt.label === q.options[q.answer]) score++;
  }
  if (!(await say(score === 2 ? "Nice, you know this. I'll start you higher." : score === 1 ? "Good. I'll start you a little higher." : "No problem. We'll start from your class level.", o))) return null;
  return score;
}

/* ---------- Flows ---------- */
async function runFlowSteps(steps, task) {
  const at = {};
  steps.forEach((s, i) => { if (s.id) at[s.id] = i; });
  let i = 0;
  while (i < steps.length && alive(task.id)) {
    const s = steps[i];
    let next = i + 1, said = null;
    if (s.from === "agent" && !(await sayT(task, val(s.text)))) return false;
    if (s.from === "child") {
      if (s.compose) { const r = await composeT(task, val(s.text), { to: s.to }); if (!alive(task.id)) return false; said = r.text; }
      else childBubble(val(s.text));
    }
    if (s.chips) {
      const r = await askT(task, s.chips);
      if (!alive(task.id)) return false;
      S.lastChip = r.opt.label;
      said = r.typed || r.opt.label;
      if (r.opt.go) next = at[r.opt.go];
    }
    if (s.action) {
      const res = await FLOW_ACTIONS[s.action](task, said, s);
      if (!alive(task.id)) return false;
      if (typeof res === "string") next = at[res];
    }
    if (s.go) next = at[s.go];
    i = next;
  }
  return alive(task.id);
}
const FLOW_ACTIONS = {
  riyaCard: () => {
    S.flow.peer = append(div("card peer-card", `<div class="peer-head"><span class="avatar friend sm">R</span><div><b>Riya</b><small>Chat</small></div></div>
      <div class="peer-thread"><div class="pmsg">whatever, forget it<span class="meta">9:12 pm</span></div></div>`));
  },
  draft: (task, said) => {
    const rude = /rude/i.test(S.lastChip || "");
    S.flow.plan = rude ? "can we talk after school?" : "can we go this weekend instead?";
    S.flow.hasPlan = /\b(weekend|tomorrow|later|meet|instead|after school|make it up|talk|hang out)\b/i.test(said);
    S.flow.final = S.flow.hasPlan ? said : said.replace(/[.!\s]*$/, "") + ". " + S.flow.plan;
  },
  sendToRiya: (task, said) => {
    $(".peer-thread", S.flow.peer).insertAdjacentHTML("beforeend", `<div class="pmsg mine">${esc(said)}<span class="meta">Sent from Aarav · 9:16 pm ✓✓</span></div>`);
    scrollDown();
    toast("Sent, in your words.");
  },
  giftOptions: async task => {
    const interest = (S.lastChip || "art").toLowerCase();
    const list = DATA.products.gift[interest] || DATA.products.gift[Object.keys(DATA.products.gift).find(k => interest.indexOf(k) >= 0)] || DATA.products.gift.art;
    return buy(task, await pickProduct(task, list, { title: `${cap(interest)} ideas for ${task.det.who || "her"}${task.det.budget ? " under " + money(task.det.budget) : ""}`, budget: task.det.budget }));
  },
  privacyNote: () => note(`${icon("lock", 13)}<span>Your chats are private. If you're ever in danger, your safety contact is alerted.</span>`)
};

async function runChore(det, text, id) {
  C.task = null;
  const reply = det.scripted ? val(DATA.flows.cab[0].text) : choreReply(det.chore, text);
  if (!(await say(reply, { id, tag: DATA.tags.chore, tone: "chore", fast: true }))) return;
  bts("① Detector: chore · no rating, no tokens, no waiting");
}
function parseTime(t) {
  const m = t.match(/\b(?:at|by)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const ap = m[3] ? m[3].toLowerCase() : h >= 8 && h <= 11 ? "am" : "pm";
  return `${h}:${m[2] || "00"} ${ap}`;
}
function choreReply(type, text) {
  const t = text.toLowerCase(), time = parseTime(t);
  if (type === "ride") {
    const m = t.match(/\bto\s+([a-z' ]+?)(?:\s+(?:at|by)\b|[,.!?]|$)/);
    let dest = m ? m[1].trim() : "where you're going";
    dest = /'s$/.test(dest) ? cap(dest) + " place" : dest.replace(/\b(my|the)\b\s*/g, "").trim() || dest;
    return time ? `Done. Cab booked for ${time} to ${dest}. 🚗` : `Done. A cab to ${dest} is 6 minutes away. 🚗`;
  }
  if (type === "reminder") {
    const m = t.match(/\bto\s+(.+?)(?:\s+(?:at|by)\s+\d|[.!?]|$)/);
    return `Done. I'll remind you${m ? " to " + m[1] : ""}${time ? " at " + time : ""}.`;
  }
  if (type === "timings") return "The next bus from your stop leaves at 4:10 pm, then 4:40 pm.";
  if (type === "weather") return "It's 27°C and clear in Pune right now.";
  const m = t.match(/\b(?:order|get|add|buy)\s+(?:some\s+|a\s+|an\s+)?([a-z ]+?)(?:\s+(?:for|at|by|from)\b|[.!?,]|$)/);
  return `Done. ${cap(m ? m[1].trim() : "That")} added to today's order. It arrives by 7:00 pm.`;
}
async function runFeelings(id) {
  C.task = null;
  S.flow = {};
  const task = { id, tag: DATA.tags.feelings, tone: "care", btsLine: "① Detector: feelings · always handled with care · no rating, no tokens" };
  if (await runFlowSteps(DATA.flows.feelings, task)) C.after = "feelings";
}
async function feelingsFollowUp(id) {
  await say("I'm glad you told me. I'm here whenever you want to talk, and Didi is too.", { id, tag: DATA.tags.feelings, tone: "care" });
}
async function runSmall(text, id) {
  const t = text.toLowerCase();
  const reply = /thank|thx/.test(t) ? "Anytime." : /bye/.test(t) ? "See you later." : /^(hi|hello|hey)/.test(t.trim()) ? `Hey ${S.child.name}. What do you need?` : "Cool.";
  await say(reply, { id, tag: DATA.tags.small, tone: "chore", fast: true });
}
async function runHelp(det, id) {
  const o = { id, tag: DATA.tags.other, tone: "chore" };
  const msg = {
    equation: ["I couldn't read that equation. Try one like this:", ["solve 3x + 4 = 19"]],
    study: [`${det.topic} help isn't in this prototype yet. Algebra is. Try this one:`, ["solve 3x + 4 = 19"]],
    money: ["What would you like to buy? Try one of these:", ["buy headphones under ₹1,500", "gift for Riya under ₹800"]]
  }[det.help];
  if (!(await say(msg[0], o))) return;
  const r = await ask(msg[1], o);
  if (alive(id)) return { next: r.opt.label };
}
async function runUnknown(id) {
  offPath();
  const o = { id, tag: DATA.tags.other, tone: "chore" };
  if (!(await say("I can't help with that one in this prototype yet. Try one of these:", o))) return;
  const r = await ask(DATA.suggestions, o);
  if (alive(id)) return { next: r.opt.label };
}

/* Equations (Study · Algebra), by mode. */
async function runEquation(task) {
  const eq = task.det.eq;
  if (!eq) return runHelp({ help: "equation" }, task.id);
  return eq.degree === 1 ? linearFlow(task, eq) : polyFlow(task, eq);
}
function numberOptions(right, wrongs) {
  const out = [right];
  wrongs.concat([right + 1, right - 1, right * 2]).forEach(n => { if (isFinite(n) && !out.some(o => fmtNum(o) === fmtNum(n))) out.push(n); });
  return out.slice(0, 3).sort((a, b) => a - b);
}
async function linearFlow(task, eq) {
  const v = eq.v, L = eq.L, R = eq.R;
  const a = (L[1] || 0) - (R[1] || 0), k = L[0] || 0, c = R[0] || 0;
  const rhs = c - k, x = rhs / a, ax = fmtCoefX(a, v), answer = `${v} = ${fmtNum(x)}`;
  const undo = k > 0 ? `subtract ${fmtNum(k)} from both sides` : k < 0 ? `add ${fmtNum(-k)} to both sides` : null;
  const divide = a === 1 ? null : a === -1 ? "multiply both sides by −1" : `divide both sides by ${fmtNum(a)}`;
  const steps = [eq.bothX ? `get the ${v} terms on one side` : null, undo, divide].filter(Boolean);
  task.fasterRun = () => `${answer} (${steps.join(", then ")}).`;
  const sayIt = t => sayT(task, t);

  if (task.mode === "pro") {
    if (await sayIt(`${answer}. (${cap(steps.join(", then "))}.)`)) finish(task, 1);
    return;
  }
  if (task.mode === "confident" && !eq.bothX) {
    const first = undo || `divide by ${fmtNum(a)}`;
    const alt = undo && divide ? `divide by ${fmtNum(a)}` : undo ? (k > 0 ? `add ${fmtNum(k)} to both sides` : `subtract ${fmtNum(-k)} from both sides`) : `subtract ${fmtNum(a)} from both sides`;
    if (!(await sayIt(`Quick one: what would you do first to get ${v} on its own?`))) return;
    const r = await askT(task, [{ label: first, right: true }, { label: alt }]);
    if (!alive(task.id)) return;
    const done = undo && divide ? `${ax} = ${fmtNum(rhs)}, so ${answer}` : answer;
    if (r.opt.right) {
      if (await sayIt(`Exactly. ${done}. ✅ Nice, that's all you.`)) finish(task, 1, { bonus: 5, did: "Solved an algebra problem with just a quick check." });
      return;
    }
    const fix = undo && divide ? `That works, but it gets messy. Undoing the ${k > 0 ? "+" : "−"} ${fmtNum(Math.abs(k))} first is cleaner: ${done}.` : `Not quite, that goes the wrong way. ${cap(first)} instead, and ${answer}.`;
    if (await sayIt(fix)) finish(task, 0.5);
    return;
  }
  if (task.mode === "learner" && !eq.bothX && undo) {
    if (!(await sayIt(`Let's do it together. To get ${v} on its own, first ${undo}. What does it become?`))) return;
    const s1 = [`${ax} = ${fmtNum(rhs)}`, `${ax} = ${fmtNum(c + k)}`].sort();
    if (!(await askUntil(task, s1, `${ax} = ${fmtNum(rhs)}`, `Not quite: ${fmtNum(c)} ${k > 0 ? "−" : "+"} ${fmtNum(Math.abs(k))} = ${fmtNum(rhs)}. Try again.`))) return;
    if (divide) {
      if (!(await sayIt(`Right. Now ${divide}. What's ${v}?`))) return;
      const s2 = numberOptions(x, [rhs * a]).map(n => `${v} = ${fmtNum(n)}`);
      if (!(await askUntil(task, s2, answer, `Not quite: ${fmtNum(rhs)} ÷ ${fmtNum(a)} = ${fmtNum(x)}. Try again.`))) return;
    }
    if (await sayIt(`That's it: ${answer}. You did each step yourself.`)) finish(task, 0.5, { did: "Worked through an algebra problem step by step." });
    return;
  }
  /* Practising, and the shapes above don't cover: one hint, then he solves it. */
  const hint = steps.length > 1 ? `${steps[0]} first, then ${steps.slice(1).join(", then ")}` : steps[0];
  if (!(await sayIt(`Hint: ${hint}. What's ${v}?`))) return;
  const labels = numberOptions(x, [(c + k) / a, c / a - k]).map(n => `${v} = ${fmtNum(n)}`);
  let tries = 0;
  for (;;) {
    const r = await askT(task, labels);
    if (!alive(task.id)) return;
    if (r.opt.label === answer) break;
    tries++;
    if (!(await sayIt(`Not quite. ${undo && divide ? `${ax} = ${fmtNum(rhs)}, so now ${divide}.` : cap(steps[0]) + "."} What's ${v}?`))) return;
  }
  if (await sayIt(tries ? `That's it: ${answer}.` : `Yes, ${answer}. That's all you.`)) finish(task, tries ? 0.5 : 1, tries ? {} : { bonus: 5, did: "Solved an algebra problem with one hint." });
}
async function polyFlow(task, eq) {
  const v = eq.v, f = eq.f, roots = eq.roots;
  const exact = roots.length > 0 && roots.every(r => Number.isInteger(r));
  const answer = roots.map(r => `${v} ${exact ? "=" : "≈"} ${fmtNum(r)}`).join(" or ");
  task.fasterRun = () => (!roots.length ? `${eq.rearranged} has no real solution.` : exact ? `${eq.rearranged} → ${answer}.` : `${eq.rearranged} → ${answer} (no neat factor here, so it's solved numerically).`);
  const sayIt = t => sayT(task, t);
  if (task.mode === "pro" || !roots.length) {
    if (await sayIt(task.fasterRun())) finish(task, 1);
    return;
  }
  const r0 = roots[0], lo = Math.floor(r0), hi = lo + 1;
  const range = `between ${lo} and ${hi}`;
  const intAnswer = `${v} = ${fmtNum(r0)}`;
  const rootLabels = roots.map(r => `${v} = ${fmtNum(r)}`);
  const nonRoots = [r0 + 1, r0 - 1, r0 + 2, r0 - 2, r0 + 3].filter(n => !roots.includes(n)).slice(0, 2);
  const testOptions = [r0].concat(nonRoots).sort((a, b) => a - b).map(n => `${v} = ${fmtNum(n)}`);
  if (task.mode === "confident") {
    if (!(await sayIt(exact ? `Quick check: does ${intAnswer} make it true?` : `Quick check: is the answer ${range}?`))) return;
    const r = await askT(task, [{ label: "Yes", also: "yep yeah sure" }, { label: "No", also: "nope nah" }]);
    if (!alive(task.id)) return;
    const right = r.opt.label === "Yes";
    if (await sayIt(right ? `Exactly: ${answer}. ✅ Nice.` : `It ${exact ? "does" : "is"}: the left side changes sign there. So ${answer}.`)) finish(task, right ? 1 : 0.5, right ? { bonus: 5, did: "Checked a harder algebra answer himself." } : {});
    return;
  }
  if (task.mode === "learner") {
    if (!(await sayIt("This one's a step up. First, can we get everything on one side? What does it become?"))) return;
    const wrong = Object.assign({}, f);
    const R0 = eq.R[0] || 0;
    wrong[0] = R0 ? (eq.L[0] || 0) + R0 : -(f[0] || 1);
    const wrongText = fmtPoly(wrong, v) + " = 0";
    const r = await askT(task, [eq.rearranged, wrongText].sort());
    if (!alive(task.id)) return;
    if (r.opt.label !== eq.rearranged && !(await sayIt(`Careful with the sign: moving it across flips it. It's ${eq.rearranged}.`))) return;
    if (exact) {
      if (!(await sayIt(`Good. Now try small whole numbers. Which value of ${v} makes it true?`))) return;
      if (!(await askUntil(task, testOptions, rootLabels, `Not that one. Put it in and the left side isn't 0. Try another.`))) return;
    } else {
      if (!(await sayIt(`Good. Try ${v} = ${lo} and ${v} = ${hi}: the left side goes from ${fmtNum(evalPoly(f, lo))} to ${fmtNum(evalPoly(f, hi))}. So where's the answer?`))) return;
      if (!(await askUntil(task, [range, `above ${hi}`, `below ${lo}`], range, "Look at where the left side crosses 0. Try again."))) return;
    }
    if (await sayIt(exact ? `Yes. ${answer}.` : `Right. Narrowing it down gives ${answer}. There's no neat factor here, so that's how it's solved.`)) finish(task, 0.5, { did: "Worked through a harder algebra problem step by step." });
    return;
  }
  /* Practising */
  if (!(await sayIt(exact ? `Hint: move everything to one side, then try small whole numbers. Which one works?` : `Hint: move everything to one side, then test whole numbers. Between which two is the answer?`))) return;
  const labels = exact ? testOptions : [range, `between ${hi} and ${hi + 1}`, `between ${lo - 1} and ${lo}`];
  const rights = exact ? rootLabels : [range];
  let tries = 0;
  for (;;) {
    const r = await askT(task, labels);
    if (!alive(task.id)) return;
    if (rights.includes(r.opt.label)) break;
    tries++;
    if (!(await sayIt(`Not quite. ${eq.rearranged}: check where the left side changes sign. Try again.`))) return;
  }
  if (await sayIt(`Yes. ${answer}.`)) finish(task, tries ? 0.5 : 1, tries ? {} : { bonus: 5, did: "Solved a harder algebra problem with one hint." });
}

/* Relationships: feelings messages are always his own; routine ones depend on the mode. */
async function runMessage(task) {
  task.who = task.det.who;
  if (task.scripted && task.scripted.flow === "apology") {
    if (await runFlowSteps(DATA.flows.apology, task)) finish(task, 1, { bonus: 10, did: "Wrote his own apology to a friend." });
    return;
  }
  return task.det.msg.feelings ? feelingsMessage(task) : routineMessage(task);
}
async function feelingsMessage(task) {
  const who = task.who, type = task.det.msg.type;
  const ex = { sorry: ["sorry about earlier, that wasn't fair of me"], thanks: ["thank you for always having my back"], wish: [`happy birthday ${who.toLowerCase()}! you're the best`] }[type];
  const tip = { sorry: "add how you'll make it up", thanks: "say what exactly you're thankful for", wish: "add a plan, like “cake after school?”" }[type];
  if (!(await sayT(task, `I'll help you say it, but it should come from you. What do you want ${who} to know?`))) return;
  const r = await askT(task, ex);
  if (!alive(task.id)) return;
  const draft = r.typed || r.opt.label;
  if (!(await sayT(task, `That sounds like you. Maybe ${tip}.`))) return;
  const sent = await composeT(task, draft, { to: who });
  if (!alive(task.id)) return;
  note(`${icon("check", 13)}<span>Sent to ${esc(who)}, in your words.</span>`);
  toast("Sent, in your words.");
  finish(task, 1, { bonus: 10, did: "Wrote his own message to someone close." });
  return sent;
}
async function routineMessage(task) {
  const who = task.who, msg = task.det.msg.routine || "Okay!";
  task.fasterRun = () => `Sent to ${who}: “${msg}”`;
  if (task.mode === "pro") {
    if (await sayT(task, `Sent to ${who}: “${msg}” ✓`)) finish(task, 1);
    return;
  }
  if (task.mode === "confident") {
    if (!(await sayT(task, `Here's a quick one for ${who}: “${msg}” Send it?`))) return;
    const r = await askT(task, [{ label: "Send it", also: "yes ok sure" }, { label: "I'll write it" }]);
    if (!alive(task.id)) return;
    if (r.opt.label !== "Send it") { await composeT(task, "", { to: who }); if (!alive(task.id)) return; }
    note(`${icon("check", 13)}<span>Sent to ${esc(who)}.</span>`);
    return finish(task, 1);
  }
  if (!(await sayT(task, task.mode === "practising" ? `How about “${msg}”? Change anything, then send it.` : `You write it, I'll check it. What do you want to tell ${who}?`))) return;
  await composeT(task, task.mode === "practising" ? msg : "", { to: who });
  if (!alive(task.id)) return;
  note(`${icon("check", 13)}<span>Sent to ${esc(who)}.</span>`);
  finish(task, 1, { did: "Sent his own message." });
}

/* Decisions & Money: options with wallet impact, never sponsored; he decides. */
function productCard(list, o) {
  return append(div("card in-card", `<div class="stat-row"><span class="label">${esc(o.title)}</span><span class="pill good">${icon("shield", 12)}No sponsored options.</span></div>
    <div class="opts">${list.map((p, i) => {
      const over = o.budget && p.price > o.budget, broke = p.price > S.wallet;
      return `<button class="opt" data-i="${i}"${over || broke ? " disabled" : ""}><span><b>${esc(p.name)}</b><small>${esc(over ? "Over your budget" : broke ? "More than your wallet has" : p.note)}</small></span>
        <span class="price"><b>${money(p.price)}</b><small>wallet after ${money(Math.max(0, S.wallet - p.price))}</small></span></button>`;
    }).join("")}</div>
    <div class="card-foot"><span>${icon("wallet", 13)}</span><span>Wallet: ${money(S.wallet)} left this month</span></div>`));
}
async function pickProduct(task, list, o) {
  const card = productCard(list, o);
  let picked = null;
  const choose = (i, typed) => {
    const b = $(`[data-i="${i}"]`, card);
    if (!b || b.disabled || picked) return false;
    picked = list[i];
    $$(".opt", card).forEach(x => { x.disabled = true; x.classList.toggle("picked", x === b); });
    childBubble(typed || "The " + picked.name.toLowerCase() + ".");
    settle({ pick: picked });
    return true;
  };
  card.addEventListener("click", e => { const b = e.target.closest(".opt"); if (b && C.wait && C.wait.card === card) choose(+b.dataset.i); });
  const r = await waitCard(card, text => { const m = bestMatch(list.map(p => p.name), text); return m.score > 0 && choose(m.i, text); }, { id: task.id });
  return r.pick;
}
function buy(task, item) {
  S.wallet -= item.price;
  S.flow.pick = item;
  refreshLive();
  return null;
}
async function runPurchase(task) {
  const d = task.det, who = d.who || "them", she = who === "Riya" ? "she" : "they";
  const pool = d.gift ? null : d.items;
  const best = list => list.filter(p => (!d.budget || p.price <= d.budget) && p.price <= S.wallet)[0];
  const doneMsg = p => `Done. ${p.name} is ordered${d.gift ? " for " + who : ""}. ${money(p.price)} paid, ${money(S.wallet)} left this month.`;
  task.fasterRun = () => { const p = best(pool || DATA.products.gift.art); if (!p) return "Nothing fits that budget."; buy(task, p); return doneMsg(p); };
  const did = { bonus: 5, did: d.gift ? "Chose his own gift within budget." : "Compared options and chose within budget." };
  S.flow.who = d.who || "Riya";

  if (d.gift && task.mode === "practising") {
    if (await runFlowSteps(DATA.flows.gift, task)) finish(task, 1, did);
    return;
  }
  if (task.mode === "pro") {
    const p = best(pool || DATA.products.gift.art);
    if (!p) { await sayT(task, "Nothing fits that budget right now."); return finish(task, 1); }
    buy(task, p);
    if (await sayT(task, doneMsg(p) + " Change it any time.")) finish(task, 1);
    return;
  }
  let list = pool;
  if (d.gift) {
    if (!(await sayT(task, task.mode === "learner" ? `Let's work it out together. What's ${she === "she" ? "she" : "they're"} into right now?` : `What's ${she === "she" ? "she" : "they're"} into right now?`))) return;
    const r = await askT(task, ["music", "art", "books"]);
    if (!alive(task.id)) return;
    list = DATA.products.gift[r.opt.label];
  }
  if (task.mode === "learner") {
    if (!(await sayT(task, "What matters most to you here?"))) return;
    const r = await askT(task, ["The price", "Something that lasts", "Something special"]);
    if (!alive(task.id)) return;
    list = list.slice().sort((x, y) => (/price/i.test(r.opt.label) ? x.price - y.price : y.price - x.price));
    if (!(await sayT(task, "Here they are in that order. You pick; I'll order it."))) return;
  } else if (task.mode === "confident") {
    const p = best(list);
    if (p && (await sayT(task, `I'd go with the ${p.name.toLowerCase()}. It leaves you ${money(S.wallet - p.price)}. Order it?`))) {
      const r = await askT(task, [{ label: "Yes, order it", also: "yes ok sure" }, { label: "Show me the options" }]);
      if (!alive(task.id)) return;
      if (r.opt.label === "Yes, order it") { buy(task, p); if (await sayT(task, doneMsg(p))) finish(task, 1, did); return; }
    }
    if (!alive(task.id)) return;
  } else if (!(await sayT(task, `Here are three${d.budget ? " under " + money(d.budget) : ""}. You pick; I'll order it.`))) return;
  const title = d.gift ? `Ideas for ${who}${d.budget ? " under " + money(d.budget) : ""}` : `${cap(d.cat)}${d.budget ? " under " + money(d.budget) : ""}`;
  const p = await pickProduct(task, list, { title, budget: d.budget });
  if (!alive(task.id)) return;
  buy(task, p);
  if (await sayT(task, doneMsg(p))) finish(task, task.mode === "learner" ? 0.5 : 1, did);
}
async function runDecision(task) {
  if (!(await sayT(task, "Big one. Let's lay it out before anyone decides. What do you enjoy most?"))) return;
  if (!alive(task.id) || !(await askT(task, ["How things work", "Numbers and money", "Writing and people", "Living things"]))) return;
  if (!(await sayT(task, "And what matters most to you in picking one?"))) return;
  if (!alive(task.id) || !(await askT(task, ["Doing what I enjoy", "Keeping options open", "What my parents expect"]))) return;
  if (!(await sayT(task, "Here's the full range. No ranking, and no pick from me."))) return;
  append(div("card in-card", `<span class="label">Class 11 streams</span><div class="opts">${DATA.streams.map(s => `<div class="opt static"><span><b>${esc(s.name)}</b><small>${esc(s.note)}</small></span></div>`).join("")}</div>`));
  if (!(await sayT(task, "Which one feels like you?"))) return;
  const r = await askT(task, DATA.streams.map(s => s.name));
  if (!alive(task.id)) return;
  if (await sayT(task, `${r.opt.label}: your call. Talk it through with your parents and a teacher this week too.`)) finish(task, 1, { bonus: 5, did: "Made his own call on a big choice." });
}
/* Writing: coach → hints → check → write, by mode. */
function topicOf(text) { const m = text.match(/\b(?:on|about)\s+([^.?!]+)/i); return m ? m[1].trim() : null; }
function leaveMail(text) {
  const m = text.match(/\b(?:because|as|since)\s+([^.?!]+)/i);
  const reason = m ? m[1].trim().replace(/^i am|^i'm/i, "I'm") : "I'm unwell";
  return `Subject: Leave request for tomorrow\n\nDear Ma'am,\n\nI won't be able to attend school tomorrow because ${reason}. Kindly grant me leave for one day. I'll catch up on the work I miss.\n\nThank you,\n${S.child.name}, Class ${S.child.class}`;
}
async function runWriting(task) {
  const t = task.text, mode = task.mode;
  if (task.skill === "emails") {
    const draft = leaveMail(t);
    task.fasterRun = () => `Here's your mail, ready to send:\n\n${draft}`;
    if (mode === "pro" || mode === "confident") {
      if (!(await sayT(task, mode === "pro" ? `Here it is:\n\n${draft}\n\nSummary: polite, gives the reason and the date.` : `Here's a draft. Check the reason and the date, then I'll send it.\n\n${draft}`))) return;
      const r = await askT(task, [{ label: "Send it", also: "looks good yes ok" }, { label: "I'll edit it" }]);
      if (!alive(task.id)) return;
      if (r.opt.label !== "Send it") { await composeT(task, draft); if (!alive(task.id)) return; }
      note(`${icon("check", 13)}<span>Sent to your class teacher.</span>`);
      return finish(task, 1);
    }
    if (!(await sayT(task, mode === "learner" ? "Let's write it together. Start with a greeting and why you need leave." : "You write it. Hint: greeting, the reason, the date, then thank you."))) return;
    let text = (await composeT(task, mode === "learner" ? "Dear Ma'am,\nI won't be able to come to school tomorrow because " : "Dear Ma'am,\n")).text;
    if (!alive(task.id)) return;
    const missing = [/\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|\d)/i.test(text) ? null : "the date", /\b(because|as|due to|since)\b/i.test(text) ? null : "the reason", /thank/i.test(text) ? null : "a thank-you"].filter(Boolean);
    if (missing.length) {
      if (!(await sayT(task, `Nearly there. Add ${missing.join(" and ")}.`))) return;
      text = (await composeT(task, text + (missing.includes("a thank-you") ? "\nThank you,\n" + S.child.name : ""))).text;
      if (!alive(task.id)) return;
    }
    if (await sayT(task, "That's a complete leave mail. Sent to your class teacher.")) finish(task, missing.length || mode === "learner" ? 0.5 : 1, { did: "Wrote his own leave mail." });
    return;
  }
  const topic = topicOf(t) || (task.skill === "stories" ? "your story" : "your topic");
  const kind = task.skill === "stories" ? "story" : "essay";
  task.fasterRun = () => kind === "essay"
    ? `Here's an outline for ${topic}:\n1. Why ${topic} matters\n2. Two examples you've seen\n3. What can change, and how\nAnd a first line: “${cap(topic)} affects more of our day than we notice.”`
    : `Here's a story start: “The lights went out at exactly 9:14, and that's when the phone buzzed.” Keep going from there.`;
  if (mode === "pro") { if (await sayT(task, task.fasterRun())) finish(task, 1); return; }
  if (mode === "confident") {
    if (!(await sayT(task, `Here's a plan. Check it fits what you think:\n${task.fasterRun()}`))) return;
    if (!(await askT(task, ["Looks right", "Change the main point"])) || !alive(task.id)) return;
    return finish(task, 1);
  }
  if (!(await sayT(task, kind === "essay" ? `${mode === "learner" ? "Let's plan it together. " : ""}An essay needs one main point. What's yours about ${topic}?` : `${mode === "learner" ? "Let's plan it together. " : ""}Every story needs someone who wants something. Who's yours?`))) return;
  if (!(await askT(task, kind === "essay" ? [`${cap(topic)} affects everyone`, `We can change ${topic}`] : ["A girl who finds a lost phone", "A boy who misses the last bus"])) || !alive(task.id)) return;
  if (!(await sayT(task, kind === "essay" ? "Good. Now two examples that back it up." : "Good. What gets in their way?"))) return;
  if (!(await askT(task, kind === "essay" ? ["One from home, one from the news", "Two from school"] : ["The battery is dying", "It's raining and late"])) || !alive(task.id)) return;
  if (await sayT(task, `That's your plan: ${kind === "essay" ? "main point, two examples, then a wrap-up" : "who, what they want, what's in the way"}. Write the first paragraph from it, and I'll check it.`)) finish(task, mode === "learner" ? 0.5 : 1, { did: `Planned his own ${kind}.` });
}
const KINDS = { equation: runEquation, message: runMessage, purchase: runPurchase, decision: runDecision, writing: runWriting };

/* ---------- S0 Start ---------- */
const SCREENS = {};
SCREENS.s0 = el => {
  el.innerHTML = `<div class="start"><div class="start-inner">${logoMark(120)}${wordmark()}<p class="tagline">${esc(DATA.product.tagline)}</p>
    <div class="actions"><button class="btn primary lg" data-go="s1">I'm a parent</button><button class="btn ghost lg" data-go="s5">I'm ${esc(S.child.name)}</button></div>
    <p class="meta">Prototype for the Flipkart APM case. Works offline; every agent reply is scripted or rule-based.</p></div></div>`;
};

/* ---------- S1 Parent sign-up ---------- */
SCREENS.s1 = el => {
  const p = S.parent;
  el.innerHTML = parentShell(1, `<div class="page-head"><h1>Create your parent account</h1><p>Next you'll set up ${esc(S.child.name)}'s profile and permissions. It takes about a minute.</p></div>
    <form class="card form-card" id="f-signup" novalidate>
      <label class="field"><span>Your name</span><input class="input" id="p-name" autocomplete="name" value="${esc(p.name)}"><small class="err" id="e-name"></small></label>
      <label class="field"><span>Email or phone</span><input class="input" id="p-contact" autocomplete="email" value="${esc(p.contact)}"><small class="err" id="e-contact"></small></label>
      <label class="field"><span>Password</span><span class="with-btn"><input class="input" id="p-pass" type="password" autocomplete="new-password" value="${esc(p.password)}"><button type="button" id="show-pass">Show</button></span><small class="hint">At least 8 characters.</small><small class="err" id="e-pass"></small></label>
      <button class="btn primary lg block" type="submit">Create account</button>
      <p class="hint center">Already have an account? <button type="button" class="link-btn" data-off>Sign in</button></p>
    </form>`, { narrow: true });
  $("#show-pass", el).addEventListener("click", e => {
    const i = $("#p-pass", el), show = i.type === "password";
    i.type = show ? "text" : "password";
    e.currentTarget.textContent = show ? "Hide" : "Show";
  });
  $("#f-signup", el).addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#p-name", el).value.trim(), contact = $("#p-contact", el).value.trim(), pass = $("#p-pass", el).value;
    const errs = {
      name: name.length < 2 ? "Enter your name." : "",
      contact: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact) || contact.replace(/\D/g, "").length >= 10 ? "" : "Enter an email address or a 10-digit phone number.",
      pass: pass.length < 8 ? "Use at least 8 characters." : ""
    };
    Object.keys(errs).forEach(k => { $("#e-" + k, el).textContent = errs[k]; $("#p-" + k, el).classList.toggle("invalid", !!errs[k]); });
    if (errs.name || errs.contact || errs.pass) return;
    Object.assign(S.parent, { name, contact, password: pass });
    if (S.safety.name === DATA.safetyContact.name) S.safety.name = name + " (parent)";
    toast("Account created.");
    go("s2");
  });
};

/* ---------- S2 Child profile ---------- */
SCREENS.s2 = el => {
  const c = S.child;
  el.innerHTML = parentShell(2, `<div class="page-head"><h1>Tell us about your child</h1><p>This sets ${esc(c.name)}'s starting levels. You can change it later.</p></div>
    <form class="card form-card" id="f-child" novalidate>
      <div class="form-grid">
        <label class="field"><span>Child's name</span><input class="input" id="c-name" value="${esc(c.name)}"><small class="err" id="e-cname"></small></label>
        <label class="field"><span>Age</span><input class="input num" id="c-age" type="number" min="5" max="17" value="${c.age}"><small class="err" id="e-cage"></small></label>
        <label class="field"><span>Class / grade</span><select class="select" id="c-class">${[5, 6, 7, 8, 9, 10, 11, 12].map(n => `<option value="${n}"${n === c.class ? " selected" : ""}>Class ${n}</option>`).join("")}</select></label>
        <label class="field"><span>Which AI agent does ${esc(c.name)} use?</span><select class="select" id="c-agent">${DATA.providers.map(p => `<option${p === c.agent ? " selected" : ""}>${esc(p)}</option>`).join("")}</select></label>
        <div class="field wide"><span>What does ${esc(c.name)} use AI for?</span><div class="choice-chips" id="c-uses">${DATA.uses.map(u => `<button type="button" class="cchip${c.uses.includes(u) ? " on" : ""}" aria-pressed="${c.uses.includes(u)}" data-use="${esc(u)}">${icon("check", 14)}${esc(u)}</button>`).join("")}</div></div>
        <div class="field wide"><span>Has ${esc(c.name)} used this agent before?</span><div class="segmented" id="c-before" role="group"><button type="button" data-v="yes" class="${c.usedBefore ? "on" : ""}">Yes</button><button type="button" data-v="no" class="${c.usedBefore ? "" : "on"}">No</button></div>
          <small class="hint" id="c-before-hint">${c.usedBefore ? "With your permission on the next step, past data helps set starting levels. Chats are never imported." : "Starting levels will come from class averages and the first conversations."}</small></div>
      </div>
      <div class="form-actions"><button type="button" class="btn ghost" data-go="s1">Back</button><button class="btn primary lg" type="submit">Next</button></div>
    </form>`);
  $("#c-uses", el).addEventListener("click", e => {
    const b = e.target.closest(".cchip");
    if (!b) return;
    b.classList.toggle("on");
    b.setAttribute("aria-pressed", b.classList.contains("on"));
  });
  $("#c-before", el).addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", e.currentTarget).forEach(x => x.classList.toggle("on", x === b));
    $("#c-before-hint", el).textContent = b.dataset.v === "yes" ? "With your permission on the next step, past data helps set starting levels. Chats are never imported." : "Starting levels will come from class averages and the first conversations.";
  });
  $("#f-child", el).addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#c-name", el).value.trim(), age = parseInt($("#c-age", el).value, 10);
    const eName = name ? "" : "Enter your child's name.", eAge = age >= 5 && age <= 17 ? "" : "Bud-e is for ages 5 to 17.";
    $("#e-cname", el).textContent = eName; $("#e-cage", el).textContent = eAge;
    $("#c-name", el).classList.toggle("invalid", !!eName); $("#c-age", el).classList.toggle("invalid", !!eAge);
    if (eName || eAge) return;
    Object.assign(S.child, {
      name, age, class: parseInt($("#c-class", el).value, 10), agent: $("#c-agent", el).value,
      uses: $$(".cchip.on", el).map(b => b.dataset.use), usedBefore: $("#c-before .on", el).dataset.v === "yes"
    });
    if (!S.child.usedBefore) S.perms.pastData = false;
    go("s3");
  });
};

/* ---------- S3 Permissions ---------- */
SCREENS.s3 = el => {
  const name = S.child.name, fill = s => s.replace(/\{child\}/g, name);
  const card = p => {
    const on = !!S.perms[p.key], locked = p.key === "pastData" && !S.child.usedBefore;
    const control = p.checkbox
      ? `<label class="check"><input type="checkbox" id="perm-${p.key}" data-perm="${p.key}"${on ? " checked" : ""}><span>${esc(fill(p.checkbox))}</span></label>`
      : `<button type="button" class="toggle${on ? " on" : ""}" data-perm="${p.key}" aria-pressed="${on}" aria-label="${esc(p.title)}"${locked ? " disabled" : ""}></button>`;
    const extra = p.key === "safety" ? `<div class="mini"><label class="field"><span>Contact name</span><input class="input" id="safety-name" value="${esc(S.safety.name)}"></label><label class="field"><span>Phone</span><input class="input num" id="safety-phone" value="${esc(S.safety.phone)}"></label></div>`
      : p.key === "wallet" ? `<div class="mini"><label class="field"><span>Monthly amount (₹)</span><input class="input num" id="wallet-amount" type="number" min="0" step="100" value="${S.walletMonthly}"></label></div>` : "";
    return `<div class="card perm${p.required && !on ? " need" : ""}" data-card="${p.key}"><div class="perm-head"><span class="perm-icon">${icon(p.icon, 18)}</span>
      <div class="perm-title"><b>${esc(fill(p.title))}</b><span class="pill ${p.required ? "req" : "optional"}">${p.required ? "Required" : "Optional"}</span></div>${p.checkbox ? "" : control}</div>
      <p>${esc(locked ? "Not available: " + name + " hasn't used an agent before." : fill(p.why))}</p>${p.checkbox ? control : ""}${extra}</div>`;
  };
  el.innerHTML = parentShell(3, `<div class="page-head"><h1>Permissions</h1><p>Each one says why it's needed. Parental consent and agent integration are required.</p></div>
    <div class="perm-grid">${DATA.permissions.map(card).join("")}</div>
    <div class="card see-box"><div class="yes"><h3>${icon("eye", 18)}You will see</h3><ul>${DATA.willSee.map(s => `<li>${icon("check", 16)}<span>${esc(fill(s))}</span></li>`).join("")}</ul></div>
      <div class="no"><h3>${icon("lock", 18)}You won't see</h3><ul>${DATA.wontSee.map(s => `<li>${icon("x", 16)}<span>${esc(s)}</span></li>`).join("")}</ul></div></div>
    <div class="card finish-bar"><span class="hint" id="finish-hint"></span><div class="row-btns"><button type="button" class="btn ghost" data-go="s2">Back</button> <button class="btn primary lg" id="finish">Finish setup</button></div></div>`);
  const sync = () => {
    const ready = S.perms.consent && S.perms.integration;
    $("#finish", el).disabled = !ready;
    $("#finish-hint", el).textContent = ready ? "All set. You can change any of this later in Settings." : !S.perms.consent ? "Tick parental consent to continue." : "Agent integration is required to continue.";
    DATA.permissions.forEach(p => { const c = $(`[data-card="${p.key}"]`, el); if (c) c.classList.toggle("need", !!p.required && !S.perms[p.key]); });
  };
  el.addEventListener("click", e => {
    const t = e.target.closest("button.toggle[data-perm]");
    if (!t) return;
    const k = t.dataset.perm;
    S.perms[k] = !S.perms[k];
    t.classList.toggle("on", S.perms[k]);
    t.setAttribute("aria-pressed", S.perms[k]);
    sync();
  });
  $("#perm-consent", el).addEventListener("change", e => { S.perms.consent = e.target.checked; sync(); });
  $("#safety-name", el).addEventListener("input", e => { S.safety.name = e.target.value; });
  $("#safety-phone", el).addEventListener("input", e => { S.safety.phone = e.target.value; });
  $("#wallet-amount", el).addEventListener("input", e => { S.walletMonthly = Math.max(0, parseInt(e.target.value, 10) || 0); });
  $("#finish", el).addEventListener("click", () => {
    applyStart(S);
    S.setupDone = true;
    S.handover = "hand";
    if (CHAT) { abandon(); CHAT.thread.innerHTML = ""; renderEmpty(); }
    go("s4");
  });
  sync();
};

/* ---------- S4 Handover ---------- */
SCREENS.s4 = el => {
  const name = S.child.name;
  if (S.handover === "hand") {
    el.innerHTML = parentShell(4, `<div class="center-stage"><div class="card handover"><div class="device">${logoMark(54)}</div>
      <h2>Hand the device to ${esc(name)}.</h2><p class="muted">Setup is done. ${esc(name)} will see what ${esc(DATA.product.name)} does, and what you can and can't see.</p>
      <button class="btn primary lg block" id="im-child">I'm ${esc(name)}</button></div></div>`, { raw: true });
    $("#im-child", el).addEventListener("click", () => { S.handover = "welcome"; SCREENS.s4(el); });
    return;
  }
  const points = [
    ["sparkle", "What " + DATA.product.name + " does", DATA.product.what],
    ["lock", "Your privacy", "Your chats are private. Your parents see your progress, not your conversations, unless you're ever in danger."],
    S.perms.restrict || S.perms.extension ? ["block", "Other AI apps", [S.perms.restrict ? "Other AI apps are restricted on this device." : "", S.perms.extension ? "A browser extension counts other-AI use each week. Your parents see the count only, never what you did." : ""].join(" ").trim()] : null,
    ["coin", `${S.tokens} tokens this week`, "Use them for a Faster response when you're in a hurry. Earn more by doing things yourself."]
  ].filter(Boolean);
  el.innerHTML = `<div class="center-stage"><div class="card welcome">${logoMark(52)}<h2>Hi ${esc(name)}</h2>
    <div class="points">${points.map(([ic, t, d]) => `<div class="point">${icon(ic, 18)}<span><b>${esc(t)}</b>${esc(d)}</span></div>`).join("")}</div>
    <button class="btn primary lg block" data-go="s5">Let's go</button></div></div>`;
};

/* ---------- S5–S11 The chat ---------- */
function chatScreen(el, m) {
  el.innerHTML = childShell("chat", '<div id="chat-mount"></div>', true);
  $("#chat-mount", el).replaceWith(CHAT.el);
  scrollDown();
  if (m && m.request) {
    if (C.wait || C.busy) abandon();
    setComposer({ value: m.request, pulse: true });
  }
}

/* ---------- S12 Earn tokens ---------- */
function chState(id) { return S.challenges[id] || (S.challenges[id] = { open: false, done: false, tries: 0 }); }
function inviteFeedback(text) {
  const t = text.toLowerCase();
  return [
    [/\b(\d{1,2}(:\d{2})?\s*(am|pm)?|noon|evening|morning)\b/.test(t), "Says when"],
    [/\b(saturday|sat|sunday|weekend|tomorrow)\b/.test(t), "Says which day"],
    [/\b(at|in)\s+(the\s+)?[a-z]+/.test(t), "Says where"],
    [/\?/.test(t), "Asks if they're in"]
  ];
}
function chBody(c, st) {
  if (st.done) return `<p class="pill good">${icon("check", 13)}Done · +${c.reward} tokens earned</p>`;
  if (!st.open) return `<button class="btn ghost small" data-act="start">Start</button>`;
  if (c.kind === "quiz") return `<div class="ch-body"><b>${esc(c.question)}</b><div class="choice-chips">${c.options.map((o, i) => `<button class="cchip" data-act="answer" data-i="${i}">${esc(o)}</button>`).join("")}</div>${st.tries ? `<p class="hint">${esc(c.hint)}</p>` : ""}</div>`;
  if (c.kind === "invite") {
    const fb = st.text ? inviteFeedback(st.text) : null;
    return `<div class="ch-body"><textarea id="invite-text" placeholder="Write it the way you'd send it">${esc(st.text || "")}</textarea>
      <div class="choice-chips"><button class="cchip" data-act="sample">Use an example</button><button class="btn ghost small" data-act="feedback">Get feedback</button></div>
      ${st.feedback && fb ? `<div class="feedback">${fb.map(([ok, label]) => `<span class="${ok ? "ok" : "todo"}">${ok ? "✓" : "○"} ${label}</span>`).join("")}</div>` : ""}
      <button class="btn primary small" data-act="send"${st.feedback && st.text && st.text.trim().length >= 12 ? "" : " disabled"}>Send invite</button></div>`;
  }
  if (c.kind === "compare") {
    const opts = DATA.products.headphones;
    return `<div class="ch-body"><div class="opts">${opts.map((p, i) => `<button class="opt${st.pick === i ? " picked" : ""}" data-act="pick" data-i="${i}"${st.pick != null ? " disabled" : ""}><span><b>${esc(p.name)}</b><small>${esc(p.note)}</small></span><span class="price"><b>${money(p.price)}</b></span></button>`).join("")}</div>
      ${st.pick != null ? `<b>Why this one?</b><div class="choice-chips">${c.reasons.map((r, i) => `<button class="cchip" data-act="reason" data-i="${i}">${esc(r)}</button>`).join("")}</div>` : '<p class="hint">Pick one. Nothing here is sponsored.</p>'}</div>`;
  }
  const tt = st.tt || {};
  return `<div class="ch-body">${c.days.map(d => `<label class="tt"><span>${d}</span><select class="select" data-act="tt" data-day="${d}"><option value="">Choose a subject</option>${c.subjects.map(s => `<option${tt[d] === s ? " selected" : ""}>${s}</option>`).join("")}</select></label>`).join("")}
    ${st.err ? `<p class="hint">${esc(st.err)}</p>` : ""}<button class="btn primary small" data-act="save">Save my timetable</button></div>`;
}
function chCard(c) {
  const st = chState(c.id);
  return `<div class="card ch${st.done ? " done" : ""}" data-ch="${c.id}"><div class="ch-top"><span class="pill brand">${esc(c.area)}</span><span class="reward-tag">${icon("coin", 15)}+${c.reward}</span></div>
    <h3>${esc(c.title)}</h3>${chBody(c, st)}</div>`;
}
function completeChallenge(c, result) {
  const st = chState(c.id);
  st.done = true;
  earnTokens(c.reward, "Challenge · " + c.title);
  didIt(c.did);
  toast(`+${c.reward} tokens. Nice, that's all you.`);
  if (c.skill && S.skills[c.skill].unlocked) {
    const sk = S.skills[c.skill], gap = c.weight - sk.rating;
    sk.rating = updateRating(sk.rating, result, expectedFor(gap));
    recordReliance("study", result);
  }
}
SCREENS.s12 = el => {
  el.innerHTML = childShell("earn", `<div class="page"><div class="page-inner">
    <div class="head-row"><div class="page-head"><h1>Earn tokens</h1><p>Do it yourself and earn tokens back. Challenges come from what you've been doing this week.</p></div>
      <div class="card balance">${icon("coin", 24)}<div><span class="label">Balance</span><div class="big"><span data-live="tokens"></span><small> tokens</small></div></div></div></div>
    <div class="ch-grid" id="ch-grid">${DATA.challenges.map(chCard).join("")}</div></div></div>`, false);
  const grid = $("#ch-grid", el);
  const rerender = id => { const c = DATA.challenges.find(x => x.id === id); $(`[data-ch="${id}"]`, grid).outerHTML = chCard(c); };
  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"), cardEl = e.target.closest("[data-ch]");
    if (!b || !cardEl) return;
    const c = DATA.challenges.find(x => x.id === cardEl.dataset.ch), st = chState(c.id), act = b.dataset.act;
    if (act === "start") st.open = true;
    else if (act === "answer") { if (+b.dataset.i === c.answer) completeChallenge(c, st.tries ? 0.5 : 1); else st.tries++; }
    else if (act === "sample") { st.text = c.sample; st.feedback = false; }
    else if (act === "feedback") { st.text = $("#invite-text", cardEl).value; st.feedback = true; }
    else if (act === "send") { st.text = $("#invite-text", cardEl).value; if (st.text.trim().length >= 12) completeChallenge(c, 1); }
    else if (act === "pick") st.pick = +b.dataset.i;
    else if (act === "reason") completeChallenge(c, 1);
    else if (act === "save") {
      const tt = st.tt || {}, chosen = c.days.map(d => tt[d]).filter(Boolean);
      if (chosen.length < c.days.length) st.err = "Pick a subject for every day.";
      else if (new Set(chosen).size < 3) st.err = "Spread it out: use at least three different subjects.";
      else { st.err = ""; completeChallenge(c, 1); }
    } else return;
    rerender(c.id);
  });
  grid.addEventListener("change", e => {
    const s = e.target.closest("[data-act=tt]");
    if (!s) return;
    const st = chState("timetable");
    (st.tt || (st.tt = {}))[s.dataset.day] = s.value;
  });
  grid.addEventListener("input", e => { if (e.target.id === "invite-text") { const st = chState("invite"); st.text = e.target.value; } });
};

/* ---------- S13 My progress ---------- */
function progressAreas() {
  return DATA.areas.map(a => `<div class="card area-card"><div class="area-h">${icon(AREA_ICON[a.key], 18)}${esc(a.name)}</div>${a.care
    ? '<div class="skill-row"><div class="top"><span>Coping, talking things through</span><span class="pill optional">Always with care</span></div><small>Feelings are never rated. Support comes first, then real people.</small></div>'
    : a.skills.filter(s => !s.soon).map(s => {
      const st = S.skills[s.key];
      if (!st.unlocked) return `<div class="skill-row"><div class="top"><span>${esc(s.name)}</span><span class="lv new">New</span></div><small>Starts the first time you ask for help with it.</small></div>`;
      const n = nextInfo(st.rating);
      return `<div class="skill-row"><div class="top"><span>${esc(s.name)}</span>${lvBadge(st.rating)}</div><div class="bar"><i style="width:${n.pct}%"></i></div>
        <small>${n.top ? "Top level for your age" : `${esc(s.name)}: ${n.more} more on your own to reach ${n.next}`}</small></div>`;
    }).join("")}</div>`).join("");
}
SCREENS.s13 = el => {
  const hist = S.tokenLog.length ? S.tokenLog.map(h => `<div><span>${esc(h.reason)}</span><span class="${h.delta > 0 ? "plus" : "minus"} num">${h.delta > 0 ? "+" : "−"}${Math.abs(h.delta)}</span></div>`).join("") : '<div><span class="faint">No token activity yet this week.</span></div>';
  el.innerHTML = childShell("progress", `<div class="page"><div class="page-inner">
    <div class="head-row"><div class="page-head"><h1>My progress</h1><p>Levels are worked out against other ${S.child.age}-year-olds. You'll never see a number.</p></div>
      <button class="btn ghost" id="parents-see">${icon("eye", 16)}What my parents see</button></div>
    <div class="area-grid">${progressAreas()}</div>
    <div class="two-col"><div class="card section"><div class="kv"><h3>Tokens</h3><span class="big"><span data-live="tokens"></span><small> / ${DATA.child.tokensPerWeek} this week</small></span></div><div class="history">${hist}</div></div>
      <div class="card section"><h3>How levels work</h3><p class="muted">Rookie → Explorer → Achiever → Pro → Master. The more ready you are for a task, the more your agent does. The less ready, the more you do, with help. The task always gets done.</p></div></div>
  </div></div>`, false);
  $("#parents-see", el).addEventListener("click", () => modal({ title: "What my parents see", wide: true, html: `<p class="muted">This is the exact weekly report your parents get. It never shows your chats.</p><div class="report-preview">${reportHTML()}</div>`, yes: "Close" }));
};

/* ---------- S14 Parent report ---------- */
function reportData() {
  const R = DATA.report, name = S.child.name, age = S.child.age;
  const reliance = R.reliance.map(r => {
    const ev = S.events.filter(e => e.type === "rel" && e.area === r.area);
    const tasks = r.tasks + ev.length;
    return Object.assign({}, r, { tasks, self: Math.round((r.self * r.tasks + ev.reduce((s, e) => s + e.result * 100, 0)) / tasks) });
  });
  const growth = R.growth.slice();
  DATA.areas.forEach(a => a.skills.forEach(s => {
    const st = S.skills[s.key];
    if (!st.unlocked) return;
    if (st.weekStart == null) growth.push(`${s.name}: started this week, now ${levelFor(st.rating, age)}.`);
    else if (levelFor(st.rating, age) !== levelFor(st.weekStart, age)) growth.push(`${s.name}: ${levelFor(st.weekStart, age)} → ${levelFor(st.rating, age)} this week.`);
  }));
  const live = S.events.filter(e => e.type === "did").map(e => e.text);
  const used = S.tokenLog.filter(h => h.delta < 0).reduce((s, h) => s - h.delta, 0), earned = S.tokenLog.filter(h => h.delta > 0).reduce((s, h) => s + h.delta, 0);
  const fasterAlgebra = S.tokenLog.some(h => h.delta < 0 && /Algebra/.test(h.reason));
  const suggestion = fasterAlgebra ? `Ask ${name} how he's finding algebra. He used a Faster response on a hard problem this week.` : S.skills.algebra && S.skills.algebra.unlocked ? `Ask ${name} how algebra is going. He started it this week.` : R.suggestion;
  return { name, reliance, growth, did: live.concat(R.didItHimself).slice(0, 5), used, earned, otherAI: S.perms.extension ? R.otherAI : null, suggestion };
}
function reportHTML() {
  const d = reportData();
  return `<div class="banner">${icon("lock", 18)}Chats are never shown.</div>
    <div class="two-col">
      <div class="card section"><h3>AI reliance by area vs expected</h3><div class="legend"><span><i></i>Did it himself</span><span><em></em>Expected for his level</span></div>
        ${d.reliance.map(r => `<div class="rel"><div class="top"><span>${esc(r.label)}</span><span class="num">${r.self}%</span></div><div class="track"><i style="width:${r.self}%"></i><em style="left:${r.expected}%"></em></div>
          <p>${esc(r.label)}: ${esc(d.name)} did ${r.self}% himself. Expected for his level: ${r.expected}%.</p></div>`).join("")}</div>
      <div class="stack">
        <div class="card section"><h3>Growth</h3><ul class="list">${d.growth.map(g => `<li>${icon("chart", 15)}<span>${esc(g)}</span></li>`).join("")}</ul></div>
        <div class="card section"><h3>Did it himself</h3><ul class="list">${d.did.map(g => `<li>${icon("check", 15)}<span>${esc(g)}</span></li>`).join("")}</ul></div>
      </div>
    </div>
    <div class="report-row">
      <div class="card section"><h3>Tokens</h3><p class="num">Used ${d.used} of ${DATA.child.tokensPerWeek}. Earned ${d.earned}.</p></div>
      <div class="card section"><h3>Other AI use</h3><p>${d.otherAI == null ? "The browser extension is off, so this isn't counted." : `Other AI agents were used ${d.otherAI} times this week. (Count only.)`}</p></div>
      <div class="card section"><h3>Safety alerts</h3><p>None.</p></div>
      <div class="card section"><h3>One suggestion</h3><p>${esc(d.suggestion)}</p></div>
    </div>`;
}
SCREENS.s14 = el => {
  el.innerHTML = parentShell(null, `<div class="page-head"><h1>${esc(S.child.name)}'s week</h1><p>${esc(DATA.report.week)} · for ${esc(S.parent.name)}. Developmental insight only.</p></div>${reportHTML()}`, { report: true });
};

/* ---------- Boot ---------- */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g && !g.disabled) { go(g.dataset.go); return; }
  if (e.target.closest("[data-off]")) offPath();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.body.classList.remove("rail-open");
  if ($(".modal-wrap") || e.target.matches("textarea, select, input:not([type=checkbox])")) return;
  if (e.key === "h" || e.key === "H") setPresent(!document.body.classList.contains("present"));
  else if (e.key === "b" || e.key === "B") setBts(!prefs.bts);
  else if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
});
window.addEventListener("DOMContentLoaded", () => {
  $("#rail-logo").innerHTML = logoMark(34);
  $("#rail-name").innerHTML = wordmark();
  document.title = DATA.product.name;
  const fav = $("link[rel=icon]");
  if (fav) fav.href = "data:image/svg+xml," + encodeURIComponent(logoMark(64).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
  $("#prev").addEventListener("click", () => step(-1));
  $("#next").addEventListener("click", () => step(1));
  $("#reset").addEventListener("click", () => { abandon(); S = freshState(); C.queue = null; C.after = null; buildChat(); go("s0"); toast("Demo reset."); });
  $("#present").addEventListener("click", () => { setPresent(true); toast("Press H, or the button in the corner, to bring the controls back."); });
  $("#show-demo").addEventListener("click", () => setPresent(false));
  $("#open-rail").addEventListener("click", () => document.body.classList.add("rail-open"));
  $("#scrim").addEventListener("click", () => document.body.classList.remove("rail-open"));
  $("#bts").addEventListener("change", e => setBts(e.target.checked));
  S = freshState();
  buildChat();
  go("s0");
});
