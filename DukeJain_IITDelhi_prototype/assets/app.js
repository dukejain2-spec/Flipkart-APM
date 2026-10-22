/* Core: live state, demo rail, navigation, toast, shared UI helpers and the scripted chat engine.
   Each screen is a function in screens.js: SCREENS[id](screenEl). */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clone = o => JSON.parse(JSON.stringify(o));

const SCREENS = {}, CARDS = {}, HOOKS = {};
let S;

function freshState() {
  const p = DATA.persona;
  return {
    screen: "start", seen: {}, token: 0,
    wallet: p.wallet, monthly: p.walletMonthly, skips: p.skips,
    areas: clone(DATA.areas), beliefs: clone(DATA.beliefs), providers: clone(DATA.providers),
    accommodations: false, setupDone: false, consent: false,
    hints: 0, trigProgress: 0, peopleEarned: false, sentToRiya: false,
    stream: null, gift: null, lastChip: null, parentView: false
  };
}

function item(areaKey, itemKey) {
  return S.areas.find(a => a.key === areaKey).items.find(i => i.key === itemKey);
}

/* ---------- Shared UI ---------- */
function plate(level, big) {
  const L = DATA.levels[level];
  return `<span class="plate ${level}${big ? " big" : ""}" title="${esc(L.name)}">${L.plate}</span>`;
}
function levelName(level) { return level ? DATA.levels[level].name : "New"; }
function sbar(time) {
  return `<div class="sbar"><span>${time}</span><span class="icons">5G &#9646;&#9646;&#9646;</span></div>`;
}
function appbar({ title, sub, avatar, back = true, right = "" }) {
  return `<div class="appbar">
    ${back ? `<button class="back" data-go="home" aria-label="Back to home">&#8249;</button>` : ""}
    ${avatar || ""}
    <div class="ttl"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div>${right}</div>`;
}
function chatShell({ time, title = "My agent", sub, hurry = false, right = "" }) {
  return sbar(time) +
    appbar({ title, sub, right, avatar: `<span class="avatar agent">${esc(DATA.product.name[0])}</span>` }) +
    `<div class="ind-slot"></div><div class="body"></div>` + composer(hurry);
}
function composer(hurry) {
  return `<div class="composer">
    ${hurry ? `<button class="hurry" title="Get it done for you. Doesn't count towards your licence.">&#9889; Hurry <span data-live="skips"></span></button>` : ""}
    <textarea rows="1" placeholder="Message my agent" aria-label="Message"></textarea>
    <button class="send" aria-label="Send">&#10148;</button></div>`;
}
function bar(progress, target) {
  const pct = target ? Math.min(100, Math.round(progress / target * 100)) : 0;
  return `<div class="bar"><i style="width:${pct}%"></i></div>`;
}

/* Elements marked data-live="wallet|skips" always show the current value. */
function refreshLive() {
  $$("[data-live=wallet]").forEach(el => { el.textContent = money(S.wallet); });
  $$("[data-live=skips]").forEach(el => { el.textContent = S.skips + " left"; });
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2300);
}
const offPath = () => toast("Not part of this prototype.");

/* ---------- Rail and navigation ---------- */
function renderRail() {
  $("#rail-list").innerHTML = DATA.moments.map((m, i) =>
    `<button class="rail-item${m.id === S.screen ? " active" : ""}${S.seen[m.id] ? " seen" : ""}" data-go="${m.id}">
      <span class="n">${i}</span><span><b>${esc(m.title)}</b><small>${esc(m.sub)}</small></span></button>`).join("");
}

function go(id) {
  const idx = DATA.moments.findIndex(m => m.id === id);
  if (idx < 0) return;
  S.token++;
  S.screen = id;
  S.seen[id] = true;
  $("#caption").textContent = DATA.moments[idx].caption;
  const screen = $("#screen");
  screen.className = "screen";
  screen.innerHTML = "";
  SCREENS[id](screen);
  refreshLive();
  renderRail();
  $("#prev").disabled = idx === 0;
  $("#next").disabled = idx === DATA.moments.length - 1;
  $("#next").classList.remove("nudge");
}
function step(delta) {
  const idx = DATA.moments.findIndex(m => m.id === S.screen) + delta;
  if (idx >= 0 && idx < DATA.moments.length) go(DATA.moments[idx].id);
}

/* ---------- Chat engine ---------- */
function makeChat(root, hooks = HOOKS) {
  const body = $(".body", root), ta = $("textarea", root), send = $(".send", root), hurry = $(".hurry", root);
  const token = S.token;
  let waiter = null, mode = null, prefill = "", options = [], chipsEl = null, jump = null;

  const alive = () => token === S.token;
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const add = (cls, html) => {
    const el = document.createElement("div");
    el.className = cls;
    el.innerHTML = html;
    body.appendChild(el);
    scroll();
    return el;
  };
  const settle = value => {
    const w = waiter;
    waiter = null; mode = null; options = [];
    if (chipsEl) { chipsEl.remove(); chipsEl = null; }
    ta.value = "";
    ta.placeholder = "Message my agent";
    send.classList.remove("pulse", "wide");
    send.innerHTML = "&#10148;";
    if (w) w(value);
  };
  const wait = () => new Promise(r => { waiter = r; });

  const ctx = {
    alive, add, scroll, wait,
    resolve: value => settle(value),
    bubble: (who, text) => add("msg " + who, esc(text)),
    async typing(text) {
      const el = add("typing", "<i></i><i></i><i></i>");
      await sleep(Math.min(1400, 450 + String(text).length * 7));
      el.remove();
    },
    indicator(s) {
      $(".ind-slot", root).innerHTML = `<div class="indicator">${plate(s.plate)}<span><b>${esc(s.label)}:</b> ${esc(s.text)}</span></div>`;
    },
    compose(text, sendLabel) {
      mode = "compose"; prefill = text;
      ta.value = text;
      send.classList.add("pulse");
      if (sendLabel) { send.classList.add("wide"); send.textContent = sendLabel; }
      return wait();
    },
    chips(opts) {
      mode = "chips"; options = opts;
      chipsEl = add("chips", opts.map((o, i) => `<button class="chip" data-i="${i}">${esc(o.label)}</button>`).join(""));
      ta.placeholder = "Pick one, or type your own";
      chipsEl.addEventListener("click", e => {
        const b = e.target.closest(".chip");
        if (b) settle({ opt: options[+b.dataset.i] });
      });
      return wait();
    },
    pop(s) {
      const wrap = document.createElement("div");
      wrap.className = "pop-wrap";
      wrap.innerHTML = `<div class="pop">${plate(s.plate, true)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
        <button class="btn primary block">${esc(s.button || "OK")}</button></div>`;
      root.appendChild(wrap);
      return new Promise(r => $("button", wrap).addEventListener("click", () => { wrap.remove(); r(); }));
    },
    interrupt(label) { jump = label; settle({ interrupt: true }); },
    takeJump() { const j = jump; jump = null; return j; },
    pending: () => jump !== null,
    done() {
      mode = "done";
      if (hurry) hurry.disabled = true;
      ta.placeholder = "Moment complete";
      $("#next").classList.add("nudge");
    }
  };

  const onSend = () => {
    const text = ta.value.trim();
    if (mode === "compose") settle({ text: text || prefill });
    else if (mode === "chips" && text) settle({ opt: options[0], say: text });
    else if (text) toast("This demo is scripted. Use the highlighted options.");
  };
  send.addEventListener("click", onSend);
  ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } });
  if (hurry) hurry.addEventListener("click", () => {
    if (S.skips <= 0) return toast("No hurry skips left this week.");
    if (mode === "done") return;
    ctx.interrupt("hurry");
  });
  return ctx;
}

async function runFlow(ctx, steps, hooks = HOOKS) {
  const labels = {};
  steps.forEach((s, i) => { if (s.t === "label") labels[s.name] = i; });
  const val = v => (typeof v === "function" ? v(S) : v);
  let i = 0;
  while (i < steps.length && ctx.alive()) {
    const s = steps[i];
    let next = i + 1;
    if (s.t === "agent") {
      const text = val(s.text);
      await ctx.typing(text);
      if (ctx.alive() && !ctx.pending()) ctx.bubble("agent", text);
    } else if (s.t === "teen") {
      ctx.bubble("teen", val(s.text));
    } else if (s.t === "compose") {
      const r = await ctx.compose(val(s.prefill), s.sendLabel);
      if (!r.interrupt) {
        if (s.bubble !== false) ctx.bubble("teen", r.text);
        if (s.hook) hooks[s.hook](r.text, ctx);
        await sleep(350);
      }
    } else if (s.t === "chips") {
      const r = await ctx.chips(s.options);
      if (!r.interrupt) {
        ctx.bubble("teen", r.say || r.opt.label);
        S.lastChip = r.opt.label;
        if (r.opt.go) next = labels[r.opt.go];
        await sleep(350);
      }
    } else if (s.t === "card") {
      const r = await CARDS[s.card](ctx);
      if (typeof r === "string") next = labels[r];
      await sleep(300);
    } else if (s.t === "ind") {
      ctx.indicator(s);
      await sleep(250);
    } else if (s.t === "sys") {
      ctx.add("sys", esc(val(s.text)));
      await sleep(350);
    } else if (s.t === "celebrate") {
      ctx.add("celebrate", esc(val(s.text)));
      await sleep(450);
    } else if (s.t === "fn") {
      hooks[s.fn](ctx);
      refreshLive();
    } else if (s.t === "pop") {
      await ctx.pop(s);
    } else if (s.t === "go") {
      next = labels[s.to];
    } else if (s.t === "end") {
      ctx.done();
      return;
    }
    const j = ctx.takeJump();
    if (j) next = labels[j];
    i = next;
  }
}

/* ---------- Boot ---------- */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { go(g.dataset.go); return; }
  if (e.target.closest("[data-off]")) offPath();
});
document.addEventListener("keydown", e => {
  if (e.target.matches("textarea, input")) return;
  if (e.key === "h" || e.key === "H") document.body.classList.toggle("rail-hidden");
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
window.addEventListener("DOMContentLoaded", () => {
  $("#brand-name").textContent = DATA.product.name;
  $("#brand-tag").textContent = DATA.product.tagline;
  document.title = DATA.product.name + " · prototype";
  $("#prev").addEventListener("click", () => step(-1));
  $("#next").addEventListener("click", () => step(1));
  $("#reset").addEventListener("click", () => { S = freshState(); go("start"); toast("Demo reset."); });
  $("#hide-rail").addEventListener("click", () => { document.body.classList.add("rail-hidden"); toast("Press H to bring the panel back."); });
  S = freshState();
  go("start");
});
