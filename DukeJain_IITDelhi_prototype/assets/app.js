/* Core: live state, demo rail, navigation, toast, shared UI and the scripted chat engine, then every screen in rail order.
   Each screen is a function SCREENS[id](screenEl). Flow steps call ACTIONS by name. */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clone = o => JSON.parse(JSON.stringify(o));
const val = v => (typeof v === "function" ? v(S) : v);
const pct = (progress, target) => (target ? Math.max(0, Math.min(100, Math.round(progress / target * 100))) : 0);

const SCREENS = {}, ACTIONS = {};
const prefs = { grad: true }; /* demo-rail preferences; they survive "Reset demo" */
let S;

function freshState() {
  const p = DATA.persona;
  return {
    screen: "start", seen: {}, token: 0,
    wallet: p.wallet.left, monthly: p.wallet.monthly, skips: p.skips.left,
    licences: clone(DATA.licences), beliefs: clone(DATA.beliefs), providers: clone(DATA.providers),
    setupAge: p.age, setupClass: parseInt(p.class.replace(/\D/g, ""), 10),
    accommodations: false, consent: false, setupDone: false,
    hints: 0, trigFrom: 0, peopleEarned: false, gift: null, snack: false, lastChip: null, parentView: false
  };
}
function licence(area) { return S.licences.find(l => l.area === area); }
function topic(area, key) { return licence(area).topics.find(t => t.key === key); }

/* ---------- Shared UI ---------- */
function plate(level, big) {
  const L = DATA.levels[level];
  return `<span class="plate ${level}${big ? " big" : ""}" title="${esc(L.name + ": " + L.does)}">${L.plate}</span>`;
}
function levelName(level) { return level ? DATA.levels[level].name : "New"; }
function nextLevel(level) { return DATA.order[DATA.order.indexOf(level) + 1]; }
/* "My agent" is the teen's own AI agent, so it gets a neutral avatar rather than the product's mark. */
const agentAvatar = (sm = "") => `<span class="avatar agent${sm}" aria-hidden="true">&#10022;</span>`;
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
  return sbar(time) + appbar({ title, sub, right, avatar: agentAvatar() }) +
    `<div class="ind-slot"></div><div class="body"></div>` + composer(hurry);
}
function composer(hurry) {
  return `<div class="composer">
    ${hurry ? `<button class="hurry" title="Get it done for you. Doesn't count towards your licence." disabled>&#9889; Hurry <span data-live="skips"></span></button>` : ""}
    <textarea rows="1" placeholder="Message my agent" aria-label="Message"></textarea>
    <button class="send" aria-label="Send">&#10148;</button></div>`;
}
function bar(progress, target) {
  return `<div class="bar"><i style="width:${pct(progress, target)}%"></i></div>`;
}

/* Elements marked data-live always show the current wallet or hurry skips. */
function refreshLive() {
  $$("[data-live=wallet]").forEach(el => { el.textContent = money(S.wallet); });
  $$("[data-live=skips]").forEach(el => { el.textContent = S.skips + " left"; });
  $$("[data-live=skipsOf]").forEach(el => { el.textContent = S.skips + " of " + DATA.persona.skips.perWeek + " left"; });
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

/* Which option label best matches what the teen typed: the most label words found in her text
   (whole words, or words she started). -1 if nothing matches. */
const STOP = ["and", "the", "her", "you", "for", "what", "with", "to", "of", "on", "in", "it", "is", "me", "my", "an", "at", "so", "do", "be", "or", "if", "as", "by"];
function words(s) {
  return s.toLowerCase().replace(/(\d)([a-z])/g, "$1 $2").split(/[^a-z0-9√]+/)
    .filter(w => (w.length > 1 || /[\d√]/.test(w)) && !STOP.includes(w));
}
function closest(labels, text) {
  const said = words(text);
  let best = -1, top = 0;
  labels.forEach((label, i) => {
    const n = words(label).filter(w => said.some(t => t === w || (w.length > 2 && !/[\d√]/.test(w) && t.startsWith(w)))).length;
    if (n > top) { best = i; top = n; }
  });
  return best;
}

/* ---------- Rail and navigation ---------- */
function moments() { return DATA.moments.filter(m => prefs.grad || !m.optional); }
function renderRail() {
  $("#rail-list").innerHTML = moments().map((m, i) =>
    `<button class="rail-item${m.id === S.screen ? " active" : ""}${S.seen[m.id] ? " seen" : ""}" data-go="${m.id}">
      <span class="n">${i}</span><span><b>${esc(m.title)}</b><small>${esc(m.sub)}</small></span></button>`).join("");
}
function navState() {
  const list = moments(), idx = list.findIndex(m => m.id === S.screen);
  $("#prev").disabled = idx <= 0;
  $("#next").disabled = idx < 0 || idx === list.length - 1;
}
function go(id) {
  const m = DATA.moments.find(x => x.id === id);
  if (!m) return;
  S.token++;
  S.screen = id;
  S.seen[id] = true;
  $("#caption").textContent = m.caption;
  const screen = $("#screen");
  screen.className = "screen";
  screen.innerHTML = "";
  SCREENS[id](screen);
  refreshLive();
  renderRail();
  navState();
  $("#next").classList.remove("nudge");
}
function step(delta) {
  const list = moments(), idx = list.findIndex(m => m.id === S.screen) + delta;
  if (idx >= 0 && idx < list.length) go(list[idx].id);
}
function setBehindScenes(on) {
  document.body.classList.toggle("bts", on);
  $("#bts").checked = on;
}

/* ---------- Chat engine ---------- */
function makeChat(root, opts = {}) {
  const body = $(".body", root), ta = $("textarea", root), send = $(".send", root), hurry = $(".hurry", root);
  const token = S.token;
  let waiter = null, mode = null, prefill = "", options = [], chipsEl = null, jump = null, onType = null, autoSend = !!opts.autoSend;
  let queued = null; /* sent while the agent was still typing: it answers the next step */

  const alive = () => token === S.token;
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  /* Grow the composer to fit a long pre-filled message. Empty, it keeps its CSS height (Chrome measures the placeholder). */
  const fit = () => {
    ta.style.height = "";
    if (ta.value) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight + 2, 96) + "px"; }
  };
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
    waiter = null; mode = null; options = []; onType = null;
    if (chipsEl) { chipsEl.remove(); chipsEl = null; }
    ta.value = "";
    fit();
    ta.placeholder = "Message my agent";
    send.classList.remove("pulse", "wide");
    send.innerHTML = "&#10148;";
    if (w) w(value || {});
  };
  const wait = () => new Promise(r => {
    waiter = r;
    if (queued) { const q = queued; queued = null; handle(q); }
  });

  const ctx = {
    alive, add, scroll,
    resolve: value => settle(value),
    pending: () => jump !== null,
    bubble: (who, text) => add("msg " + who, esc(text)),
    async typing(text, fast) {
      const el = add("typing", "<i></i><i></i><i></i>");
      await sleep(fast ? 300 : Math.min(1100, 350 + String(text).length * 5));
      el.remove();
    },
    indicator(s) {
      $(".ind-slot", root).innerHTML = `<div class="indicator">${plate(s.level)}<span><b>${esc(s.label)}</b> ${esc(s.text)}</span></div>`;
    },
    trace(lines) {
      add("trace", lines.map(([k, v]) => `<div><b>${esc(k)}</b><span>${esc(val(v))}</span></div>`).join(""));
    },
    compose(text, to) {
      if (autoSend) { autoSend = false; return Promise.resolve({ text }); }
      mode = "compose"; prefill = text;
      ta.value = text;
      fit();
      send.classList.add("pulse");
      if (to) { send.classList.add("wide"); send.textContent = "Send to " + to; }
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
    /* A card waits for a tap; typed text goes to `handler`, which returns false if it matches nothing. */
    awaitTap(handler) {
      mode = "card"; onType = handler;
      ta.placeholder = "Tap an option, or type its name";
      return wait();
    },
    /* A pop-up over the chat. Resolves true for the main button, false for the second one. */
    pop(s) {
      const wrap = document.createElement("div");
      wrap.className = "pop-wrap";
      wrap.innerHTML = `<div class="pop">${plate(s.level, true)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
        <button class="btn primary block" data-yes>${esc(s.yes || "OK")}</button>
        ${s.no ? `<button class="btn ghost block" data-no>${esc(s.no)}</button>` : ""}</div>`;
      root.appendChild(wrap);
      return new Promise(r => wrap.addEventListener("click", e => {
        const b = e.target.closest("button");
        if (!b) return;
        wrap.remove();
        r(b.hasAttribute("data-yes"));
      }));
    },
    hurryOn() { if (hurry && mode !== "done") hurry.disabled = false; },
    hurryOff() { if (hurry) hurry.disabled = true; },
    interrupt(label) { jump = label; settle({ interrupt: true }); },
    takeJump() { const j = jump; jump = null; return j; },
    done() {
      mode = "done";
      ctx.hurryOff();
      ta.placeholder = "Moment complete";
      $("#next").classList.add("nudge");
    }
  };

  function handle(text) {
    if (mode === "compose") settle({ text: text || prefill });
    else if (mode === "chips") {
      if (text) settle({ opt: options[Math.max(0, closest(options.map(o => o.label + " " + (o.also || "")), text))], say: text });
    } else if (mode === "card") {
      if (text && !onType(text)) toast("Tap an option above, or type its name.");
    } else if (mode === "done") {
      if (text) offPath();
    } else if (text) queued = text;
  }
  const onSend = () => handle(ta.value.trim());
  send.addEventListener("click", onSend);
  ta.addEventListener("input", fit);
  ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } });
  if (hurry) hurry.addEventListener("click", () => {
    if (S.skips <= 0) return toast("No hurry skips left this week.");
    hurry.disabled = true;
    ctx.interrupt("hurry");
  });
  return ctx;
}

async function runFlow(ctx, steps) {
  const at = {};
  steps.forEach((s, i) => { if (s.id) at[s.id] = i; });
  const live = () => ctx.alive() && !ctx.pending();
  let i = 0;
  while (i < steps.length && ctx.alive()) {
    const s = steps[i];
    let next = i + 1, said;
    if (s.from === "teen") {
      if (s.sent) ctx.bubble("teen", val(s.text));
      else {
        const r = await ctx.compose(val(s.text), s.to);
        if (!r.interrupt) {
          said = r.text;
          if (!s.to) ctx.bubble("teen", said);
          ctx.hurryOn();
          await sleep(350);
        }
      }
    } else if (s.from === "agent") {
      const text = val(s.text);
      await ctx.typing(text, s.fast);
      if (live()) ctx.bubble("agent", text);
    }
    if (s.trace && live()) ctx.trace(s.trace);
    if (s.chips && live()) {
      const r = await ctx.chips(s.chips.map(c => (typeof c === "string" ? { label: c } : c)));
      if (!r.interrupt) {
        ctx.bubble("teen", r.say || r.opt.label);
        S.lastChip = r.opt.label;
        if (r.opt.go) next = at[r.opt.go];
        await sleep(350);
      }
    }
    if (s.action && live()) {
      const r = await ACTIONS[s.action](s, ctx, said);
      refreshLive();
      if (s.action === "end") return;
      if (typeof r === "string") next = at[r];
    }
    if (s.go && live()) next = at[s.go];
    const j = ctx.takeJump();
    if (j) next = at[j];
    i = next;
  }
  if (ctx.alive()) ctx.done();
}

ACTIONS.indicator = async (s, ctx) => { ctx.indicator(s); await sleep(250); };
ACTIONS.note = async (s, ctx) => { ctx.add("sys", esc(val(s.text))); await sleep(350); };
ACTIONS.celebrate = async (s, ctx) => { ctx.add("celebrate", esc(val(s.text))); await sleep(450); };
ACTIONS.end = (s, ctx) => ctx.done();
ACTIONS.hurryOff = (s, ctx) => ctx.hurryOff();

function openAgentChat(el, flowKey, opts) {
  el.innerHTML = chatShell(opts);
  if (opts.night) el.classList.add("night");
  refreshLive();
  runFlow(makeChat(el, opts), DATA.flows[flowKey]);
}
const walletChip = `<span class="wallet-chip">&#128091; <span data-live="wallet"></span></span>`;

/* ---------- 0. Start ---------- */
SCREENS.start = el => {
  el.innerHTML = sbar("9:41") + `<div class="body pad-lg start">
    <div class="hero">${plate("learner", true)}<h1>${esc(DATA.product.name)}</h1><p>${esc(DATA.product.tagline)}</p></div>
    <p class="pitch">${esc(DATA.product.pitch)}</p>
    <div class="stack"><button class="btn primary block" data-go="setup">Parent setup</button>
    <button class="btn ghost block" data-go="home">Ananya's day</button></div></div>`;
};

/* ---------- 1. Parent setup, then the handover to Ananya ---------- */
function defaultRows() {
  const d = DATA.defaults.find(x => x.classes.includes(S.setupClass));
  const skills = DATA.licences.find(l => l.area === "skills").topics;
  const w = skills.find(t => t.key === "writing"), m = skills.find(t => t.key === "maths");
  const row = (plates, html) => `<div class="row">${plates}<span>${html}</span></div>`;
  const choices = d.choices === d.money
    ? row(plate(d.choices), `<b>Choices</b> and <b>Money</b>: ${levelName(d.choices)}`)
    : row(plate(d.choices), `<b>Choices</b>: ${levelName(d.choices)}`) + row(plate(d.money), `<b>Money</b>: ${levelName(d.money)}`);
  return row(`<span class="plates">${plate(w.level)}${plate(m.level)}</span>`, `<b>Skills</b> per subject, from her school record: Writing ${levelName(w.level)}, Maths ${levelName(m.level)}`) +
    choices +
    row(plate(d.people), `<b>People</b>: ${levelName(d.people)} for routine messages`) +
    row(plate("always"), `<b>Self</b>, <b>Feelings</b> and messages that carry feelings: always on until 18`);
}
SCREENS.setup = el => {
  const prov = S.providers.map((p, i) => `<label class="check"><input type="checkbox" data-p="${i}" ${p.on ? "checked" : ""} ${p.locked ? "disabled" : ""}>
    <span>${esc(p.name)}${p.locked ? `<small class="muted"> · blocked on her phone and school Wi-Fi</small>` : ""}</span></label>`).join("");
  const options = (list, current, label) => list.map(v => `<option value="${v}" ${v === current ? "selected" : ""}>${label(v)}</option>`).join("");
  el.innerHTML = sbar("8:15 PM") + appbar({ title: "Set up " + DATA.product.name, sub: "For Ananya", back: false }) + `<div class="body pad-lg">
    <div class="card"><p class="label">Your child</p>
      <div class="row between"><span>Age</span><select id="age" aria-label="Age">${options([13, 14, 15, 16, 17, 18], S.setupAge, v => v)}</select></div>
      <div class="row between gap-top"><span>Class</span><select id="cls" aria-label="Class">${options([8, 9, 10, 11, 12], S.setupClass, v => "Class " + v)}</select></div></div>
    <div class="card"><p class="label">Default levels</p>
      <div class="stack small-rows" id="defaults">${defaultRows()}</div>
      <p class="muted fine">Levels then change only through her own progress.</p></div>
    <div class="card"><p class="label">AI providers she may use</p>${prov}</div>
    <div class="card"><p class="label">Pocket-money wallet</p>
      <div class="row between"><span>Per month</span><select id="monthly" aria-label="Pocket money per month">${options(DATA.pocketMoney, S.monthly, money)}</select></div></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">Accommodations</p><button class="switch${S.accommodations ? " on" : ""}" id="acc" aria-label="Accommodations" aria-pressed="${S.accommodations}"></button></div>
      <p class="muted fine">For learning differences: more hints, read-aloud, extra time. Protect her from harm, not from help.</p></div>
    <div class="card see"><p class="label">What you will and won't see</p>
      <div class="row"><span class="yes">&#10003;</span>You'll see her progress and safety alerts.</div>
      <div class="row"><span class="no">&#10007;</span>You won't see her chats.</div></div>
    <label class="check"><input type="checkbox" id="consent" ${S.consent ? "checked" : ""}><span>I'm Ananya's parent and give verifiable consent under the DPDP Act, 2023.</span></label>
    <button class="btn primary block" id="finish" ${S.consent ? "" : "disabled"}>Finish setup</button></div>`;
  const showDefaults = () => { $("#defaults", el).innerHTML = defaultRows(); };
  $("#age", el).addEventListener("change", e => {
    S.setupAge = +e.target.value;
    S.setupClass = Math.max(8, Math.min(12, S.setupAge - 5));
    $("#cls", el).value = S.setupClass;
    showDefaults();
  });
  $("#cls", el).addEventListener("change", e => { S.setupClass = +e.target.value; showDefaults(); });
  /* Changing the monthly amount moves what's left by the same amount. */
  $("#monthly", el).addEventListener("change", e => { const v = +e.target.value; S.wallet += v - S.monthly; S.monthly = v; });
  $("#acc", el).addEventListener("click", e => {
    S.accommodations = !S.accommodations;
    e.currentTarget.classList.toggle("on", S.accommodations);
    e.currentTarget.setAttribute("aria-pressed", S.accommodations);
  });
  $$("[data-p]", el).forEach(cb => cb.addEventListener("change", () => { S.providers[+cb.dataset.p].on = cb.checked; }));
  $("#consent", el).addEventListener("change", e => { S.consent = e.target.checked; $("#finish", el).disabled = !S.consent; });
  $("#finish", el).addEventListener("click", () => { S.setupDone = true; handover(el); });
};
function handover(el) {
  el.innerHTML = sbar("8:17 PM") + `<div class="body pad-lg handover">
    <div class="hand">&#128241;</div><h2>Setup done. Hand the phone to Ananya.</h2>
    <p class="muted">She'll see what ${esc(DATA.product.name)} does, and what you can and can't see.</p>
    <button class="btn primary block" id="im-teen">I'm Ananya</button></div>`;
  $("#im-teen", el).addEventListener("click", () => welcome(el));
}
function welcome(el) {
  const h = DATA.handover;
  el.innerHTML = sbar("8:18 PM") + `<div class="body pad-lg welcome">
    <div>${plate("learner", true)}<h2>Hi Ananya</h2></div>
    <p class="pitch">${esc(h.intro)}</p>
    ${h.points.map(([icon, text]) => `<div class="card row top"><span class="icon" aria-hidden="true">${icon}</span><span>${esc(text)}</span></div>`).join("")}
    <button class="btn primary block" data-go="home">Let's go</button></div>`;
}

/* ---------- 2. Ananya's home (chore) ---------- */
function areaLevel(l) { return l.level || l.topics[0].level; }
SCREENS.home = el => {
  const areas = S.licences.map(l => `<div class="mini-area">${plate(areaLevel(l))}<span>${esc(l.name)}</span></div>`).join("");
  el.innerHTML = sbar("4:32 PM") + `<div class="body pad-lg home">
    <div><p class="muted fine" style="margin:0">Thursday</p><h2 class="hi">Hi Ananya</h2></div>
    <button class="ask" id="ask">${agentAvatar()}<span><b>My agent</b><small>Ask anything&hellip;</small></span></button>
    <div class="chips left"><button class="chip" id="cab">Book a cab to Riya's at 5</button></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">My licence</p><button class="link" data-go="profile">See all &rsaquo;</button></div>
      <div class="mini-areas">${areas}</div></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">Pocket money</p><span class="muted fine">of ${money(S.monthly)} this month</span></div>
      <div class="big-num small" data-live="wallet"></div>${bar(S.wallet, S.monthly)}</div>
    <div class="card row between"><span>&#9889; Hurry skips this week</span><b data-live="skipsOf"></b></div></div>
    <nav class="tabbar"><button class="on" data-go="home">Home</button><button data-go="profile">Licence</button><button data-off>Wallet</button><button data-off>Settings</button></nav>`;
  const chat = { time: "4:33 PM", sub: "Here to help" };
  $("#ask", el).addEventListener("click", () => openAgentChat(el, "home", chat));
  /* The suggestion chip is Ananya saying it, so it sends straight away. */
  $("#cab", el).addEventListener("click", () => openAgentChat(el, "home", Object.assign({ autoSend: true }, chat)));
};

/* ---------- 3. People: apology to Riya ---------- */
SCREENS.people = el => {
  el.innerHTML = sbar("6:10 PM") + appbar({ title: "Riya", sub: "last seen 5:58 PM", avatar: `<span class="avatar friend">R</span>` }) + `
    <div class="thread">
      <div class="sys">Saturday</div>
      <div class="msg friend">where are you?? it's starting<span class="meta">6:02 PM</span></div>
      <div class="msg friend">you didn't even come.<span class="meta">7:41 PM</span></div>
      <div class="sys">Sunday</div>
      <div class="msg teen">ugh sorry stuff came up<span class="meta">11:20 AM</span></div>
      <div class="msg friend">it's fine. whatever.<span class="meta">11:46 AM</span></div>
    </div>
    <div class="sheet"><div class="sheet-head">${agentAvatar(" sm")}My agent<span class="muted fine">· helping with this chat</span></div>
      <div class="ind-slot"></div><div class="body"></div>${composer(false)}</div>`;
  const thread = $(".thread", el);
  thread.scrollTop = thread.scrollHeight;
  runFlow(makeChat($(".sheet", el)), DATA.flows.people);
};
ACTIONS.sendToRiya = (s, ctx, text) => {
  const thread = $(".thread");
  thread.insertAdjacentHTML("beforeend", `<div class="msg teen">${esc(text)}<span class="meta">6:14 PM &#10003;&#10003;</span></div>`);
  thread.scrollTop = thread.scrollHeight;
};
ACTIONS.riyaReplies = () => {
  const token = S.token;
  setTimeout(() => {
    const thread = $(".thread");
    if (token !== S.token || !thread) return;
    thread.insertAdjacentHTML("beforeend", `<div class="msg friend">ok that actually means a lot &#10084;&#65039;<span class="meta">6:15 PM</span></div>`);
    thread.scrollTop = thread.scrollHeight;
  }, 1600);
};

/* ---------- 4. Choices + Self: Class 11 stream ---------- */
SCREENS.choices = el => {
  S.beliefs.find(b => b.id === "science").state = null;
  openAgentChat(el, "choices", { time: "9:05 PM", sub: "Choices" });
};
ACTIONS.streams = async (s, ctx) => {
  ctx.add("card options", `<p class="label">Class 11 streams</p>` + DATA.streams.map(x =>
    `<div class="option static"><b>${esc(x.name)}</b><small>${esc(x.line)}</small></div>`).join(""));
  await sleep(400);
};
ACTIONS.belief = async (s, ctx) => {
  const b = S.beliefs.find(x => x.id === "science");
  const choices = { true: "True", outdated: "Outdated", dont: "Don't assume this" };
  const replies = { true: "Okay. I'll keep it, but I'll still show you every option.", outdated: "Got it. I've dropped it from what I assume about you.", dont: "Done. I won't assume that about you again." };
  const card = ctx.add("card belief", `<p class="label">Me, not my model</p>
    <p class="belief-q">I've been assuming: <b>&lsquo;${esc(b.text)}&rsquo;</b> <span class="muted">(${esc(b.since)})</span>. Still true?</p>
    <div class="row wrap" data-btns>${Object.keys(choices).map(v =>
      `<button class="btn ${v === "outdated" ? "primary" : "ghost"} small" data-v="${v}">${choices[v]}</button>`).join("")}</div>`);
  const mark = (v, typed) => {
    if (b.state) return;
    b.state = v;
    $("[data-btns]", card).outerHTML = `<p class="belief-done">&#10003; Marked <b>${choices[v]}</b>. ${replies[v]}</p>`;
    if (typed) ctx.bubble("teen", typed);
    ctx.resolve();
  };
  card.addEventListener("click", e => { const btn = e.target.closest("[data-v]"); if (btn) mark(btn.dataset.v); });
  await ctx.awaitTap(text => {
    const t = text.toLowerCase();
    const v = /outdated|anymore|not true|no longer|changed|^no\b|nope/.test(t) ? "outdated"
      : /don.?t assume|stop assuming/.test(t) ? "dont"
      : /true|yes|still/.test(t) ? "true" : null;
    if (v) mark(v, text);
    return !!v;
  });
  ctx.scroll();
  await sleep(300);
};

/* ---------- 5. Money: birthday gift, then a low-stakes snack ---------- */
SCREENS.money = el => {
  /* Replaying the moment replaces its orders, so the wallet starts where it did. */
  if (S.gift) { S.wallet += S.gift.price; S.gift = null; }
  if (S.snack) { S.wallet += DATA.snack.price; S.snack = false; }
  openAgentChat(el, "money", { time: "5:20 PM", sub: "Money", right: walletChip });
};
ACTIONS.products = async (s, ctx) => {
  const card = ctx.add("card options", `<div class="row between"><p class="label" style="margin:0">Under ${money(800)}</p><span class="pill">No sponsored options.</span></div>` +
    DATA.products.map(g => `<button class="option gift" data-id="${g.id}"><span><b>${esc(g.name)}</b><small>${esc(g.why)}</small></span>
      <span class="price"><b>${money(g.price)}</b><small>leaves ${money(S.wallet - g.price)}</small></span></button>`).join(""));
  const pick = (g, typed) => {
    if (S.gift) return;
    S.gift = g;
    S.wallet -= g.price;
    refreshLive();
    $$(".option", card).forEach(o => { o.disabled = true; o.classList.toggle("picked", o.dataset.id === g.id); });
    ctx.bubble("teen", typed || "The " + g.name.toLowerCase() + ".");
    ctx.resolve();
  };
  card.addEventListener("click", e => { const btn = e.target.closest(".option"); if (btn) pick(DATA.products.find(g => g.id === btn.dataset.id)); });
  await ctx.awaitTap(text => {
    const i = closest(DATA.products.map(g => g.name), text);
    if (i >= 0) pick(DATA.products[i], text);
    return i >= 0;
  });
  await sleep(350);
};
ACTIONS.buySnack = () => { S.snack = true; S.wallet -= DATA.snack.price; };

/* ---------- 6. Skills: trigonometry, try first ---------- */
SCREENS.skills = el => {
  S.hints = 0;
  openAgentChat(el, "skills", { time: "7:12 PM", sub: "Skills · Maths homework", hurry: true });
};
/* The pop-up only appears the first time; after that the flow follows the level she already has. */
ACTIONS.unlockTrig = async (s, ctx) => {
  const t = topic("skills", "trig");
  if (t.level === "licensed") return "licensed";
  if (t.level) return;
  if (!(await ctx.pop(s))) return "notNew";
  t.level = "practising";
};
ACTIONS.setTrig = s => { topic("skills", "trig").level = s.level; };
ACTIONS.useHint = () => { S.hints++; };
ACTIONS.trigSolved = (s, ctx) => {
  ctx.hurryOff();
  const t = topic("skills", "trig");
  S.trigFrom = t.progress;
  if (S.hints <= 1) t.progress = Math.min(t.target, t.progress + 1);
};
ACTIONS.trigProgress = async (s, ctx) => {
  const t = topic("skills", "trig"), next = levelName(nextLevel(t.level));
  const counted = S.hints <= 1;
  const card = ctx.add("card progress", `<div class="row between"><b>${esc(t.name)}</b><span class="muted fine">${levelName(t.level)}</span></div>
    ${bar(S.trigFrom, t.target)}<small>${counted ? `${t.progress} of ${t.target} towards ${next}` : `Doesn't count yet: ${next} needs tasks done with 1 hint or fewer`}</small>`);
  await sleep(80);
  $(".bar > i", card).style.width = pct(t.progress, t.target) + "%";
  await sleep(700);
};
ACTIONS.hurrySpent = () => {
  S.skips = Math.max(0, S.skips - 1);
  const t = topic("skills", "trig");
  if (!t.level) t.level = "practising";
};

/* ---------- 7. Feelings: 11 pm ---------- */
SCREENS.feelings = el => openAgentChat(el, "feelings", { time: "11:04 PM", sub: "Feelings", night: true });

/* ---------- 8. Licence profile ---------- */
function itemRow(it, name = it.name) {
  if (it.level === "always") return `<div class="item">${plate("always")}<div class="grow"><b>${esc(name)}</b><small>Always on until 18</small></div></div>`;
  if (!it.level) return `<div class="item"><span class="pill">New</span><div class="grow"><b>${esc(name)}</b><small>${it.of ? "In " + esc(it.of) + ". " : ""}Starts the first time you use it</small></div></div>`;
  const next = nextLevel(it.level), left = it.target - it.progress;
  const note = !next ? "Top level" : left <= 0 ? "Ready for " + levelName(next) : `${left} more task${left === 1 ? "" : "s"} to ${levelName(next)}`;
  return `<div class="item">${plate(it.level)}<div class="grow"><div class="row between"><b>${esc(name)}</b><span class="muted fine">${levelName(it.level)}</span></div>
    ${bar(it.progress, it.target)}<small>${note}</small></div></div>`;
}
function beliefList() {
  const tag = { true: "Confirmed by you", outdated: "Outdated: dropped", dont: "Won't assume" };
  return `<div class="beliefs"><p class="label">What my agent believes about me</p>` + S.beliefs.map(b =>
    `<div class="belief-row${b.state === "outdated" || b.state === "dont" ? " gone" : ""}"><span>&lsquo;${esc(b.text)}&rsquo;</span>
      <small>${b.state ? tag[b.state] : "Expires in 3 weeks unless you confirm"}</small></div>`).join("") + `</div>`;
}
function parentView() {
  const w = DATA.weekly;
  return `<div class="card"><p class="label">Self-authored share</p><div class="row"><span class="big-num">${w.share}%</span><span class="up">&uarr; from ${w.was}%</span></div>
      <p class="muted fine">Of the moments that matter (decisions, emotional messages, skill tasks), the share she did herself, against what's expected at her levels.</p></div>
    <div class="card"><p class="label">This week</p><p class="tight">${esc(w.insight)}</p></div>
    <div class="card"><p class="label">One thing to do</p><p class="tight">${esc(w.action)}</p></div>
    <div class="card see"><div class="row"><span class="yes">&#10003;</span>Safety alerts: none</div><div class="row"><span class="no">&#128274;</span>Chats: never shown</div></div>`;
}
function showPop(root, s, onOk) {
  const wrap = document.createElement("div");
  wrap.className = "pop-wrap";
  wrap.innerHTML = `<div class="pop">${plate(s.plate, true)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><button class="btn primary block">${esc(s.button)}</button></div>`;
  root.appendChild(wrap);
  $("button", wrap).addEventListener("click", () => { wrap.remove(); if (onOk) onOk(); });
}
SCREENS.profile = el => {
  const writing = topic("skills", "writing");
  const claim = S.peopleEarned ? "" : `<div class="card claim"><div class="row between"><span><b>Ready to level up</b><small>People · Routine messages</small></span>
    <button class="btn primary small" id="claim">Claim licence</button></div></div>`;
  const teen = `<p class="next">Next: ${writing.target - writing.progress} more tasks to <b>${levelName(nextLevel(writing.level))}</b> in Writing</p>${claim}` +
    S.licences.map(l => `<div class="card area"><div class="row between"><b>${esc(l.name)}</b><span class="muted fine">${esc(l.line)}</span></div>
      ${l.level ? itemRow(l, l.scope) : ""}${l.topics.map(t => itemRow(t)).join("")}${l.area === "self" ? beliefList() : ""}</div>`).join("");
  el.innerHTML = sbar("8:00 PM") + appbar({ title: "My licence", sub: "Ananya · 15" }) + `<div class="body pad-lg">
    <div class="card row between"><span><b>What my parents see</b><small class="muted block">Exactly their view, nothing more</small></span>
      <button class="switch${S.parentView ? " on" : ""}" id="pv" aria-label="What my parents see" aria-pressed="${S.parentView}"></button></div>
    ${S.parentView ? `<p class="next">This is everything Mum sees:</p>` + parentView() : teen}</div>`;
  $("#pv", el).addEventListener("click", () => { S.parentView = !S.parentView; SCREENS.profile(el); });
  const btn = $("#claim", el);
  if (btn) btn.addEventListener("click", () => showPop(el, {
    plate: "licensed", title: "People: " + levelName("licensed"),
    text: "I can now send routine messages for you after a quick check, like \"reached home\" or \"running late\". Messages that carry feelings stay yours.",
    button: "Nice"
  }, () => {
    const p = licence("people");
    p.level = "licensed"; p.progress = 0; p.target = 5;
    S.peopleEarned = true;
    SCREENS.profile(el);
    toast("Licence earned: People · " + levelName("licensed"));
  }));
};

/* ---------- 9. Parent weekly highlight ---------- */
SCREENS.parent = el => {
  el.innerHTML = sbar("Sun 7:30 PM") + appbar({ title: "Ananya's week", sub: "Weekly highlight for Priya", back: false }) +
    `<div class="body pad-lg">${parentView()}<p class="muted fine center">You see progress and safety alerts only. Ananya sees this exact screen too.</p></div>`;
};

/* ---------- 10. Graduation (optional teaser) ---------- */
SCREENS.grad = el => {
  el.innerHTML = sbar("10:00 AM") + `<div class="body pad-lg grad">
    ${plate("pro", true)}<h2>You're fully licensed</h2><p class="muted">Ananya · 18</p>
    <div class="card"><p class="label">My agent charter</p><p class="muted fine">The rules I chose to keep:</p>
      <ol><li>I write my own apologies and birthday wishes.</li><li>On big choices, ask what I think before telling me what you think.</li><li>Show me one thing outside my usual taste every week.</li></ol></div>
    <button class="btn primary block" id="keep">Keep my charter</button>
    <button class="btn ghost block" data-go="start">Back to start</button></div>`;
  $("#keep", el).addEventListener("click", () => toast("Charter saved. Parent access ends today."));
};

/* ---------- Boot ---------- */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { go(g.dataset.go); return; }
  if (e.target.closest("[data-off]")) offPath();
});
document.addEventListener("keydown", e => {
  if (e.target.matches("textarea, select, input:not([type=checkbox])")) return;
  if (e.key === "h" || e.key === "H") document.body.classList.toggle("rail-hidden");
  if (e.key === "b" || e.key === "B") setBehindScenes(!document.body.classList.contains("bts"));
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
window.addEventListener("DOMContentLoaded", () => {
  $("#brand-name").textContent = DATA.product.name;
  $("#brand-tag").textContent = DATA.product.tagline;
  $("#brand-plate").outerHTML = plate("learner", true);
  document.title = DATA.product.name + " · prototype";
  $("#prev").addEventListener("click", () => step(-1));
  $("#next").addEventListener("click", () => step(1));
  $("#reset").addEventListener("click", () => { S = freshState(); go("start"); toast("Demo reset."); });
  $("#hide-rail").addEventListener("click", () => { document.body.classList.add("rail-hidden"); toast("Press H to bring the panel back."); });
  $("#bts").addEventListener("change", e => setBehindScenes(e.target.checked));
  $("#show-grad").addEventListener("change", e => {
    prefs.grad = e.target.checked;
    if (!prefs.grad && S.screen === "grad") go("parent");
    else { renderRail(); navState(); }
  });
  S = freshState();
  go("start");
});
