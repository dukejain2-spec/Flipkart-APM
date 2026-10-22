/* The demo screens, in rail order, plus the cards and hooks their chat flows call. */

function openAgentChat(el, flowKey, opts) {
  el.innerHTML = chatShell(opts);
  if (opts.night) el.classList.add("night");
  refreshLive();
  runFlow(makeChat(el), DATA.flows[flowKey]);
}
const walletChip = `<span class="wallet-chip">&#128091; <span data-live="wallet"></span></span>`;

/* ---------- 0. Start ---------- */
SCREENS.start = el => {
  const ladder = DATA.order.map(k => `<div class="ladder-row">${plate(k)}<div><b>${DATA.levels[k].name}</b><small>${esc(DATA.levels[k].does)}</small></div></div>`).join("");
  el.innerHTML = sbar("9:41") + `<div class="body pad-lg start">
    <div class="hero">${plate("learner", true)}<h1>${esc(DATA.product.name)}</h1><p>${esc(DATA.product.tagline)}</p></div>
    <p class="pitch">In 2040 everyone's agent knows them better than they know themselves, and does their tasks for them. For a teenager, it can quietly do their growing up for them.</p>
    <p class="pitch"><b>${esc(DATA.product.name)} hands control to the agent in stages</b>, like a driving licence, as the teen shows they can handle it.</p>
    <div class="stack"><button class="btn primary block" data-go="setup">Parent setup</button>
    <button class="btn ghost block" data-go="home">Ananya's day</button></div>
    <p class="label" style="margin:6px 0 -6px">The four levels</p>
    <div class="ladder">${ladder}</div></div>`;
};

/* ---------- 1. Parent setup ---------- */
SCREENS.setup = el => {
  const prov = S.providers.map((p, i) => `<label class="check"><input type="checkbox" data-p="${i}" ${p.on ? "checked" : ""} ${p.locked ? "disabled" : ""}>
    <span>${esc(p.name)}${p.locked ? `<small class="muted"> · blocked on her phone and school Wi-Fi</small>` : ""}</span></label>`).join("");
  el.innerHTML = sbar("8:15 PM") + appbar({ title: "Set up " + DATA.product.name, sub: "For Ananya, 15 · Class 10", back: false }) + `<div class="body pad-lg">
    <div class="card"><p class="label">Her starting levels</p>
      <div class="stack small-rows">
        <div class="row">${plate("practising")}<span><b>Skills</b> set per subject from her school baseline</span></div>
        <div class="row">${plate("learner")}<span><b>Choices</b> and <b>Money</b></span></div>
        <div class="row">${plate("practising")}<span><b>People</b> routine messages</span></div>
        <div class="row">${plate("always")}<span><b>Self</b>, <b>Feelings</b> and feelings messages: always on until 18</span></div>
      </div><p class="muted fine">Levels then change only through her own progress.</p></div>
    <div class="card"><p class="label">AI providers she may use</p>${prov}</div>
    <div class="card"><p class="label">Pocket-money wallet</p>
      <div class="row between"><span>Per month</span><select id="monthly">${[1000, 2000, 3000].map(v => `<option value="${v}" ${v === S.monthly ? "selected" : ""}>${money(v)}</option>`).join("")}</select></div></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">Accommodations</p><button class="switch${S.accommodations ? " on" : ""}" id="acc" aria-label="Accommodations"></button></div>
      <p class="muted fine">For learning differences: more hints, read-aloud, extra time. Protect her from harm, not from help.</p></div>
    <div class="card see"><p class="label">What you will and won't see</p>
      <div class="row"><span class="yes">&#10003;</span>Her levels and progress, in general</div>
      <div class="row"><span class="yes">&#10003;</span>Safety alerts</div>
      <div class="row"><span class="no">&#10007;</span>Her chats, ever</div>
      <div class="row"><span class="no">&#10007;</span>What she asks, writes or buys, item by item</div></div>
    <label class="check"><input type="checkbox" id="consent" ${S.consent ? "checked" : ""}><span>I'm Ananya's parent and give verifiable consent under the DPDP Act, 2023.</span></label>
    <button class="btn primary block" id="finish" ${S.consent ? "" : "disabled"}>Finish setup</button></div>`;
  $("#acc", el).addEventListener("click", e => { S.accommodations = !S.accommodations; e.currentTarget.classList.toggle("on", S.accommodations); });
  $("#monthly", el).addEventListener("change", e => { S.monthly = +e.target.value; });
  $$("[data-p]", el).forEach(cb => cb.addEventListener("change", () => { S.providers[+cb.dataset.p].on = cb.checked; }));
  $("#consent", el).addEventListener("change", e => { S.consent = e.target.checked; $("#finish", el).disabled = !S.consent; });
  $("#finish", el).addEventListener("click", () => { S.setupDone = true; toast("Setup complete. Ananya's agent is ready."); go("home"); });
};

/* ---------- 2. Ananya's home (chore) ---------- */
function mainLevel(area) {
  const lv = area.items.map(i => i.level).filter(Boolean);
  return lv.includes("always") && lv.length === 1 ? "always" : lv.filter(l => l !== "always")[0] || "always";
}
SCREENS.home = el => {
  const areas = S.areas.map(a => `<div class="mini-area">${plate(mainLevel(a))}<span>${esc(a.name)}</span></div>`).join("");
  el.innerHTML = sbar("4:32 PM") + `<div class="body pad-lg home">
    <div><p class="muted fine" style="margin:0">Thursday</p><h2 class="hi">Hi Ananya</h2></div>
    <button class="ask" id="ask"><span class="avatar agent">${esc(DATA.product.name[0])}</span><span>Ask my agent&hellip;</span></button>
    <div class="chips left"><button class="chip" id="cab">Book a cab to Riya's at 5</button></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">My licence</p><button class="link" data-go="profile">See all &rsaquo;</button></div>
      <div class="mini-areas">${areas}</div></div>
    <div class="card"><div class="row between"><p class="label" style="margin:0">Pocket money</p><span class="muted fine">of ${money(S.monthly)} this month</span></div>
      <div class="big-num small" data-live="wallet"></div>${bar(S.wallet, S.monthly)}</div>
    <div class="card row between"><span>&#9889; Hurry skips this week</span><b data-live="skips"></b></div></div>
    <nav class="tabbar"><button class="on">Home</button><button data-go="profile">Licence</button><button data-off>Wallet</button><button data-off>Settings</button></nav>`;
  const openChore = () => openAgentChat(el, "chore", { time: "4:33 PM", sub: "Here to help" });
  $("#ask", el).addEventListener("click", openChore);
  $("#cab", el).addEventListener("click", openChore);
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
    <div class="sheet"><div class="sheet-head"><span class="avatar agent sm">${esc(DATA.product.name[0])}</span>My agent<span class="muted fine">· helping with this chat</span></div>
      <div class="ind-slot"></div><div class="body"></div>${composer(false)}</div>`;
  const thread = $(".thread", el);
  thread.scrollTop = thread.scrollHeight;
  runFlow(makeChat($(".sheet", el)), DATA.flows.people);
};
HOOKS.sendToRiya = text => {
  const thread = $(".thread");
  thread.insertAdjacentHTML("beforeend", `<div class="msg teen">${esc(text)}<span class="meta">6:14 PM &#10003;&#10003;</span></div>`);
  thread.scrollTop = thread.scrollHeight;
  S.sentToRiya = true;
};
HOOKS.riyaReplies = () => {
  const token = S.token;
  setTimeout(() => {
    const thread = $(".thread");
    if (token !== S.token || !thread) return;
    thread.insertAdjacentHTML("beforeend", `<div class="msg friend">ok that actually means a lot. bubble tea sat &#129483;<span class="meta">6:15 PM</span></div>`);
    thread.scrollTop = thread.scrollHeight;
  }, 1600);
};

/* ---------- 4. Choices + Self: Class 11 stream ---------- */
SCREENS.choices = el => {
  S.stream = null;
  S.beliefs.find(b => b.id === "science").state = null;
  openAgentChat(el, "choices", { time: "9:05 PM", sub: "Choices" });
};

CARDS.belief = async ctx => {
  const b = S.beliefs.find(x => x.id === "science");
  const card = ctx.add("card belief", `<p class="label">Me, not my model</p>
    <p class="belief-q">I've been assuming: <b>"${esc(b.text)}"</b> <span class="muted">(${esc(b.since)})</span>. Still true?</p>
    <div class="row wrap" data-btns><button class="btn ghost small" data-v="true">True</button><button class="btn primary small" data-v="outdated">Outdated</button><button class="btn ghost small" data-v="dont">Don't assume this</button></div>`);
  const replies = { true: "Okay. I'll keep it, but I'll still show you every option.", outdated: "Got it. I've dropped it from what I assume about you.", dont: "Done. I won't assume that about you again." };
  card.addEventListener("click", e => {
    const btn = e.target.closest("[data-v]");
    if (!btn || b.state) return;
    b.state = btn.dataset.v;
    $("[data-btns]", card).outerHTML = `<p class="belief-done">&#10003; Marked <b>${btn.textContent}</b>. ${replies[b.state]}</p>`;
    ctx.resolve("picked");
  });
  await ctx.wait();
  ctx.scroll();
  return null;
};

CARDS.streams = async ctx => {
  const card = ctx.add("card options", `<p class="label">Class 11 streams</p>` + DATA.streams.map(s =>
    `<button class="option" data-id="${s.id}"><b>${esc(s.name)}</b><small>${esc(s.line)}</small></button>`).join(""));
  card.addEventListener("click", e => {
    const btn = e.target.closest(".option");
    if (!btn || S.stream) return;
    S.stream = DATA.streams.find(s => s.id === btn.dataset.id);
    $$(".option", card).forEach(o => { o.disabled = true; o.classList.toggle("picked", o === btn); });
    ctx.resolve("picked");
  });
  await ctx.wait();
  ctx.bubble("teen", "I think " + S.stream.name + ".");
  return null;
};

/* ---------- 5. Money: birthday gift ---------- */
SCREENS.money = el => {
  if (S.gift) { S.wallet += S.gift.price; S.gift = null; }
  openAgentChat(el, "money", { time: "5:20 PM", sub: "Money", right: walletChip });
};

CARDS.gifts = async ctx => {
  const card = ctx.add("card options", `<div class="row between"><p class="label" style="margin:0">Under ${money(800)}</p><span class="pill">No sponsored options</span></div>` +
    DATA.gifts.map(g => `<button class="option gift" data-id="${g.id}"><span><b>${esc(g.name)}</b><small>${esc(g.why)}</small></span>
      <span class="price"><b>${money(g.price)}</b><small>leaves ${money(S.wallet - g.price)}</small></span></button>`).join(""));
  card.addEventListener("click", e => {
    const btn = e.target.closest(".option");
    if (!btn || S.gift) return;
    S.gift = DATA.gifts.find(g => g.id === btn.dataset.id);
    S.wallet -= S.gift.price;
    refreshLive();
    $$(".option", card).forEach(o => { o.disabled = true; o.classList.toggle("picked", o === btn); });
    ctx.resolve("picked");
  });
  await ctx.wait();
  ctx.bubble("teen", "The " + S.gift.name.toLowerCase() + ".");
  return null;
};

/* ---------- 6. Skills: trigonometry, try first ---------- */
SCREENS.skills = el => {
  S.hints = 0;
  openAgentChat(el, "skills", { time: "7:12 PM", sub: "Skills · Maths homework", hurry: true });
};
HOOKS.unlockTrig = () => { item("skills", "trig").level = "practising"; };
HOOKS.useHint = () => { S.hints++; };
HOOKS.trigSolved = () => {
  if (S.hints > 1) return;
  const t = item("skills", "trig");
  t.progress = Math.min(t.target, t.progress + 1);
  S.trigProgress = t.progress;
};
HOOKS.hurrySpent = () => { S.skips = Math.max(0, S.skips - 1); };

/* ---------- 7. Feelings: 11 pm ---------- */
SCREENS.feelings = el => openAgentChat(el, "feelings", { time: "11:04 PM", sub: "Feelings", night: true });

/* ---------- 8. Licence profile ---------- */
function itemRow(it) {
  if (it.level === "always") return `<div class="item">${plate("always")}<div class="grow"><b>${esc(it.name)}</b><small>Always on until 18</small></div></div>`;
  if (!it.level) return `<div class="item"><span class="pill">New</span><div class="grow"><b>${esc(it.name)}</b><small>Starts the first time you use it</small></div></div>`;
  const next = DATA.order[DATA.order.indexOf(it.level) + 1];
  const left = it.target - it.progress;
  const note = !next ? "Top level" : left <= 0 ? "Ready for " + levelName(next) : `${left} more task${left === 1 ? "" : "s"} to ${levelName(next)}`;
  return `<div class="item">${plate(it.level)}<div class="grow"><div class="row between"><b>${esc(it.name)}</b><span class="muted fine">${levelName(it.level)}</span></div>
    ${bar(it.progress, it.target)}<small>${note}</small></div></div>`;
}
function beliefList() {
  const tag = { true: "Confirmed by you", outdated: "Outdated: dropped", dont: "Won't assume" };
  return `<div class="beliefs"><p class="label">What my agent believes about me</p>` + S.beliefs.map(b =>
    `<div class="belief-row${b.state === "outdated" || b.state === "dont" ? " gone" : ""}"><span>"${esc(b.text)}"</span>
      <small>${b.state ? tag[b.state] : "Expires in 3 weeks unless you confirm"}</small></div>`).join("") + `</div>`;
}
function parentView() {
  const people = S.peopleEarned ? "Earned Licensed this week" : "Close to Licensed";
  const rows = [
    ["skills", "Skills", "Steady progress; started a new Maths topic"],
    ["choices", "Choices", "Making more of her own calls"],
    ["people", "People", people],
    ["self", "Self and Feelings", "Protected until 18"]
  ].map(([k, name, line]) => {
    const a = S.areas.find(x => x.key === k);
    return `<div class="item">${plate(mainLevel(a))}<div class="grow"><b>${name}</b><small>${line}</small></div></div>`;
  }).join("");
  return `<div class="card"><p class="label">Self-authored share</p><div class="row"><span class="big-num">68%</span><span class="up">&uarr; from 61%</span></div>
      <p class="muted fine">How much of her decisions, feelings messages and skill tasks she did herself, against what's expected at her levels.</p></div>
    <div class="card"><p class="label">How her skills are growing</p>${rows}
      <p class="insight">Biggest growth: People and Choices. She's doing more of her own thinking before asking her agent.</p></div>
    <div class="card"><p class="label">One thing to try</p><p class="tight">Ask her what she's been deciding on lately. She's at Learner for big choices, so talking it through helps.</p></div>
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
  const writing = item("skills", "writing");
  const claim = S.peopleEarned ? "" : `<div class="card claim"><div class="row between"><span><b>Ready to level up</b><small>People · Routine messages</small></span>
    <button class="btn primary small" id="claim">Claim licence</button></div></div>`;
  const teen = `<p class="next">Next: ${writing.target - writing.progress} more tasks to <b>Licensed</b> in Writing</p>${claim}` +
    S.areas.map(a => `<div class="card area"><div class="row between"><b>${esc(a.name)}</b><span class="muted fine">${esc(a.line)}</span></div>
      ${a.items.map(itemRow).join("")}${a.key === "self" ? beliefList() : ""}</div>`).join("");
  el.innerHTML = sbar("8:00 PM") + appbar({ title: "My licence", sub: "Ananya · 15" }) + `<div class="body pad-lg">
    <div class="card row between"><span><b>What my parents see</b><small class="muted block">Exactly their view, nothing more</small></span>
      <button class="switch${S.parentView ? " on" : ""}" id="pv" aria-label="What my parents see"></button></div>
    ${S.parentView ? `<p class="next">This is everything Mum sees:</p>` + parentView() : teen}</div>`;
  $("#pv", el).addEventListener("click", () => { S.parentView = !S.parentView; SCREENS.profile(el); });
  const btn = $("#claim", el);
  if (btn) btn.addEventListener("click", () => showPop(el, {
    plate: "licensed", title: "People · Licensed",
    text: "I can now send routine messages for you after a quick check, like \"reached home\" or \"running late\". Messages that carry feelings stay yours.",
    button: "Nice"
  }, () => {
    const r = item("people", "routine");
    r.level = "licensed"; r.progress = 0; r.target = 5;
    S.peopleEarned = true;
    SCREENS.profile(el);
    toast("Licence earned: People · Licensed");
  }));
};

/* ---------- 9. Parent weekly highlight ---------- */
SCREENS.parent = el => {
  el.innerHTML = sbar("Sun 7:30 PM") + appbar({ title: "Ananya's week", sub: "Weekly highlight for Priya", back: false }) +
    `<div class="body pad-lg">${parentView()}<p class="muted fine center">You see levels and progress only. Ananya sees this exact screen too.</p></div>`;
};

/* ---------- 10. Graduation (teaser) ---------- */
SCREENS.grad = el => {
  el.innerHTML = sbar("10:00 AM") + `<div class="body pad-lg grad">
    ${plate("pro", true)}<h2>You're fully licensed</h2><p class="muted">Ananya · 18</p>
    <div class="card"><p class="label">My agent charter</p><p class="muted fine">The rules I chose to keep:</p>
      <ol><li>I write my own apologies and birthday wishes.</li><li>On big choices, ask what I think before telling me what you think.</li><li>Show me one thing outside my usual taste every week.</li></ol></div>
    <button class="btn primary block" id="keep">Keep my charter</button>
    <button class="btn ghost block" data-go="start">Back to start</button></div>`;
  $("#keep", el).addEventListener("click", () => toast("Charter saved. Parent access ends today."));
};
