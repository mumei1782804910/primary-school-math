"use strict";
/* ===== Maths Buddy: settings, progress, home screen, stickers ===== */

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem("mb-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("mb-" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};

// time: base seconds per question (0 = no timer); slower question types get a multiple of it
const S = Object.assign({ year: 3, count: 10, time: 10, sound: true }, store.get("settings2", {}));
let BEST = store.get("best", {}); // key -> best % (key = "3-add", "3-mixed"…)
const LIMITS = { count: [5, 30], time: [0, 60] };
const saveSettings = () => store.set("settings2", S);

const STICKERS = ["🐨", "🦘", "🐧", "🦄", "🐬", "🦖", "🚀", "🌈", "🍦", "🎈", "🐢", "🦋", "🐙", "🦊", "🐼", "🍉", "⚽", "🎸", "🏆", "👑",
  "🦜", "🐳", "🍩", "🛹", "🪁", "🦁", "🐸", "🍓", "🚂", "🎨", "🦉", "🐝", "🌻", "🍕", "🤖", "🛸", "🐉", "💎", "🪐", "🥇"];
const STARS_PER_STICKER = 3;

const starsFor = (pct) => (pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 50 ? 1 : 0);
const starsOf = (key) => (key in BEST ? starsFor(BEST[key]) : 0);
const totalStars = () => Object.keys(BEST).reduce((s, k) => s + starsOf(k), 0);
const stickerCount = () => Math.min(STICKERS.length, Math.floor(totalStars() / STARS_PER_STICKER));
const starsHTML = (n) => `<span class="stars"><b>${"★".repeat(n)}</b>${"★".repeat(3 - n)}</span>`;

/* Save a quiz result. Returns stars for this result and any newly unlocked stickers. */
function recordResult(key, pct) {
  const before = stickerCount();
  const isBest = !(key in BEST) || pct > BEST[key];
  if (isBest) { BEST[key] = pct; store.set("best", BEST); }
  return { stars: starsFor(pct), isBest, newStickers: STICKERS.slice(before, stickerCount()) };
}

/* ---------- sound ---------- */
let actx = null;
function tone(freq, dur, type = "sine", vol = 0.15, when = 0) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur);
  } catch (e) { /* no audio */ }
}
const sfx = {
  tap: () => tone(620, 0.05, "square", 0.04),
  good: () => { tone(660, 0.12); tone(990, 0.2, "sine", 0.15, 0.1); },
  bad: () => tone(170, 0.3, "sawtooth", 0.08),
  tick: () => tone(900, 0.04, "square", 0.05),
  done: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "triangle", 0.14, i * 0.13)),
};

/* ---------- screens ---------- */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0);
}

const HELLOS = ["Pick a topic and let's play!", "Ready to earn some stars?", "Let's grow your maths brain!", "Which one shall we try today?", "Every star gets you closer to a sticker!"];

function renderHome() {
  const y = S.year;
  $("total-stars").textContent = "⭐ " + totalStars();
  $("btn-sound").textContent = S.sound ? "🔊" : "🔇";
  $("hero-koala").innerHTML = koala("happy");
  $("hero-msg").textContent = pick(HELLOS);
  $("years").innerHTML = YEAR_NAMES.map((n, i) =>
    `<button data-year="${i}" class="${i === y ? "selected" : ""}" aria-label="${n}"><small>${i ? "Year" : "Found."}</small>${i || "F"}</button>`).join("");
  $("mixed-sub").textContent = "A bit of everything from " + YEAR_NAMES[y];
  $("mixed-stars").innerHTML = starsHTML(starsOf(y + "-mixed"));
  $("topic-list").innerHTML = STRANDS.map((strand) => {
    const list = TOPICS.filter((t) => t.strand === strand && y >= t.minY && y <= t.maxY);
    if (!list.length) return "";
    return `<div class="strand">${strand}</div><div class="topics">` + list.map((t) =>
      `<button class="topic" data-topic="${t.id}"><span class="ic">${t.icon}</span>${t.name}${starsHTML(starsOf(y + "-" + t.id))}</button>`).join("") + "</div>";
  }).join("");
}

function goHome() { renderHome(); show("home"); }

function renderSteppers() {
  $("v-count").textContent = S.count;
  $("v-time").innerHTML = S.time ? `${S.time} <small>sec</small>` : "Off";
}

function renderStickers() {
  const got = stickerCount(), left = STARS_PER_STICKER - (totalStars() % STARS_PER_STICKER);
  $("sticker-note").textContent = got >= STICKERS.length ? "You collected them all! 🎉" : `${got} of ${STICKERS.length} stickers · ${left} more ⭐ for the next one`;
  $("sticker-grid").innerHTML = STICKERS.map((s, i) => (i < got ? `<div class="sticker got">${s}</div>` : `<div class="sticker locked">?</div>`)).join("");
}

/* ---------- starting quizzes ---------- */
/* How many times the base timer a question gets: quick recall = 1, working-out = 2, long = 3 */
const SUMS = ["add", "sub", "mul", "div"], QUICK = ["count", "compare", "pattern", "shape"];
function timeFactor(t, y) {
  if (SUMS.includes(t.id)) return y <= 3 ? 1 : y === 4 ? 2 : 3; // written methods from Year 4
  if (QUICK.includes(t.id)) return 1;
  return t.id === "word" ? 3 : 2;
}
const timedGen = (t, y) => { const q = t.gen(y); q.tx = timeFactor(t, y); return q; };

function startTopic(id) {
  const y = S.year, t = TOPICS.find((x) => x.id === id);
  startQuiz({ key: y + "-" + id, title: t.icon + " " + t.name, count: S.count, time: S.time, gen: () => timedGen(t, y) });
}

function startMixed() {
  const y = S.year, list = TOPICS.filter((t) => y >= t.minY && y <= t.maxY);
  startQuiz({ key: y + "-mixed", title: "🎲 Mixed · " + YEAR_NAMES[y], count: S.count, time: S.time, gen: () => timedGen(pick(list), y) });
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  const d = el.dataset;
  if (d.year !== undefined) { S.year = Number(d.year); saveSettings(); sfx.tap(); renderHome(); }
  else if (d.topic) { sfx.tap(); startTopic(d.topic); }
  else if (d.home !== undefined) { sfx.tap(); goHome(); }
  else if (d.step) {
    const [lo, hi] = LIMITS[d.step];
    S[d.step] = Math.max(lo, Math.min(hi, S[d.step] + Number(d.d)));
    saveSettings(); sfx.tap(); renderSteppers();
  }
});
$("btn-mixed").onclick = () => { sfx.tap(); startMixed(); };
$("btn-settings").onclick = () => { sfx.tap(); renderSteppers(); show("settings"); };
$("btn-stickers").onclick = () => { sfx.tap(); renderStickers(); show("stickers"); };
$("btn-sound").onclick = () => { S.sound = !S.sound; saveSettings(); renderHome(); sfx.tap(); };
$("btn-reset").onclick = () => {
  if (!confirm("Reset all stars and stickers? This cannot be undone.")) return;
  BEST = {}; store.set("best", BEST); goHome();
};

renderHome();
