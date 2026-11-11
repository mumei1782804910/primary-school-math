"use strict";
/* ===== Maths Buddy: quiz engine + results =====
   startQuiz({ key, title, count, time, gen }) — time = seconds per question (0 = no timer) */

const Q = { cfg: null, qs: [], i: 0, score: 0, results: [], input: "", locked: true, deadline: 0, lastTick: 0, timerId: null, nextId: null };
const CHEERS = ["Correct! 🎉", "Great job! ⭐", "You got it! 🙌", "Awesome! 🌟", "Spot on! 🎯", "Too easy! 😎"];
const plain = (html) => String(html).replace(/<[^>]*>/g, "");

function answerText(q) {
  if (q.type !== "num") return q.a;
  const n = q.pre === "$" && !Number.isInteger(q.a) ? q.a.toFixed(2) : fmt(q.a);
  return q.pre + n + (q.unit.length > 1 ? " " : "") + q.unit;
}

function startQuiz(cfg) {
  const seen = new Set(), qs = [];
  while (qs.length < cfg.count) {
    let q, tries = 0;
    do { q = cfg.gen(); } while (seen.has(q.q + "|" + q.a) && ++tries < 30);
    seen.add(q.q + "|" + q.a);
    qs.push(q);
  }
  Object.assign(Q, { cfg, qs, i: 0, score: 0, results: [] });
  $("quiz-title").textContent = cfg.title;
  $("score").textContent = "0";
  $("timer").classList.toggle("off", !cfg.time);
  show("quiz");
  showQuestion();
}

function stopTimers() { clearInterval(Q.timerId); clearTimeout(Q.nextId); Q.timerId = Q.nextId = null; }

function showQuestion() {
  stopTimers();
  const q = Q.qs[Q.i], isNum = q.type === "num";
  Q.input = ""; Q.locked = false;
  $("dots").innerHTML = Q.qs.map((_, k) => `<i class="${k < Q.i ? (Q.results[k].ok ? "ok" : "no") : k === Q.i ? "now" : ""}"></i>`).join("");
  $("qcard").className = "question-card";
  $("q-text").className = "q-text" + (q.big ? " big" : "");
  $("q-text").innerHTML = q.q;
  $("q-vis").innerHTML = q.v || "";
  $("feedback").className = "feedback"; $("feedback").textContent = "";
  $("mini-koala").className = "mini-koala"; $("mini-koala").innerHTML = koala("happy");
  $("answer-row").classList.toggle("hidden", !isNum);
  $("keypad").classList.toggle("hidden", !isNum);
  $("choices").classList.toggle("hidden", isNum);
  $("btn-next").classList.add("hidden");
  if (isNum) {
    $("ans-pre").textContent = q.pre; $("ans-unit").textContent = q.unit;
    renderInput();
  } else {
    const long = q.c.some((c) => plain(c).length > 9);
    $("choices").className = "choices" + (long ? " one-col" : "");
    $("choices").innerHTML = q.c.map((c, k) => `<button class="choice" data-c="${k}">${c}</button>`).join("");
  }
  window.scrollTo(0, 0);
  if (Q.cfg.time) {
    Q.deadline = Date.now() + Q.cfg.time * 1000; Q.lastTick = 0;
    tickTimer();
    Q.timerId = setInterval(tickTimer, 50);
  }
}

function tickTimer() {
  const left = Math.max(0, Q.deadline - Date.now()), frac = left / (Q.cfg.time * 1000), secs = Math.ceil(left / 1000);
  $("timer-fill").style.width = frac * 100 + "%";
  $("timer-fill").style.background = frac > 0.5 ? "var(--good)" : frac > 0.25 ? "var(--accent)" : "var(--bad)";
  $("timer-num").textContent = secs;
  if (secs <= 3 && secs > 0 && secs !== Q.lastTick) { Q.lastTick = secs; sfx.tick(); }
  if (left <= 0) submit(true);
}

function renderInput() {
  const box = $("answer");
  box.textContent = Q.input || "?";
  box.className = "answer-box " + (Q.input ? "filled" : "empty");
}

function pressKey(k) {
  if (Q.locked || Q.qs[Q.i].type !== "num") return;
  if (k === "ok") return submit(false);
  sfx.tap();
  if (k === "del") Q.input = Q.input.slice(0, -1);
  else if (k === ".") { if (!Q.input.includes(".") && Q.input.length < 6) Q.input += Q.input ? "." : "0."; }
  else if (Q.input.length < 7) Q.input = Q.input === "0" ? k : Q.input + k;
  renderInput();
}

/* timedOut = the clock ran out; choice = index picked for multiple choice */
function submit(timedOut, choice) {
  if (Q.locked) return;
  const q = Q.qs[Q.i];
  let given = null, ok = false;
  if (q.type === "num") {
    const v = parseFloat(Q.input);
    if (Number.isNaN(v)) { if (!timedOut) return; } else { given = Q.input; ok = Math.abs(v - q.a) < 0.0005; }
  } else if (choice !== undefined) { given = q.c[choice]; ok = given === q.a; }
  Q.locked = true;
  stopTimers();
  Q.results.push({ q, given, ok });
  if (q.type === "mc") {
    document.querySelectorAll("#choices .choice").forEach((b, k) => {
      b.disabled = true;
      if (q.c[k] === q.a) b.classList.add("right");
      else if (k === choice) b.classList.add("picked-wrong");
    });
  }
  const fb = $("feedback");
  if (ok) {
    Q.score++; $("score").textContent = Q.score;
    $("qcard").classList.add("correct");
    fb.className = "feedback good"; fb.textContent = pick(CHEERS);
    $("mini-koala").innerHTML = koala("wow"); $("mini-koala").classList.add("hop");
    sfx.good();
    Q.nextId = setTimeout(nextQuestion, 850);
  } else {
    $("qcard").classList.add("wrong");
    fb.className = "feedback bad";
    fb.innerHTML = (given === null ? "⏰ Time's up! " : "") + "Answer: " + answerText(q);
    $("mini-koala").innerHTML = koala("sad");
    sfx.bad();
    if (Q.cfg.time) Q.nextId = setTimeout(nextQuestion, 1900);
    else { $("keypad").classList.add("hidden"); $("btn-next").classList.remove("hidden"); }
  }
  const dot = $("dots").children[Q.i];
  if (dot) dot.className = ok ? "ok" : "no";
}

function nextQuestion() {
  stopTimers();
  Q.i++;
  if (Q.i < Q.qs.length) showQuestion(); else showResults();
}

/* ---------- results ---------- */
function showResults() {
  const n = Q.qs.length, pct = Math.round((Q.score / n) * 100);
  const res = recordResult(Q.cfg.key, pct);
  $("score-line").textContent = `${Q.score} out of ${n} correct`;
  $("result-msg").textContent = pct === 100 ? "Perfect! You're a maths star!" : pct >= 80 ? "Fantastic work!" : pct >= 50 ? "Good effort — keep going!" : "Nice try! Practice makes perfect.";
  $("earned").innerHTML = [0, 1, 2].map((k) => `<span class="${k < res.stars ? "on" : ""}" style="animation-delay:${0.9 + k * 0.25}s">⭐</span>`).join("");
  const ns = $("new-sticker");
  ns.classList.toggle("hidden", !res.newStickers.length);
  ns.innerHTML = res.newStickers.length ? `New sticker! <b>${res.newStickers.join(" ")}</b>` : "";

  const wrong = Q.results.filter((r) => !r.ok);
  $("wrong-title").textContent = wrong.length ? "Let's learn these" : "Well done";
  $("wrong-list").innerHTML = wrong.length ? wrong.map((r) => `<li>
      <div>${r.q.q}</div>${r.q.v ? `<div class="q-vis">${r.q.v}</div>` : ""}
      <div class="ans"><span class="correct-ans">✔ ${answerText(r.q)}</span>
      <span class="yours">${r.given === null ? "⏰ no answer" : "you said <s>" + (r.q.type === "num" ? r.q.pre + r.given + r.q.unit : r.given) + "</s>"}</span></div>
    </li>`).join("") : `<li class="all-right">No mistakes — every answer was right! 🎉</li>`;

  show("results");
  const ring = $("ring");
  ring.style.strokeDashoffset = 326.7;
  setTimeout(() => { ring.style.strokeDashoffset = 326.7 * (1 - pct / 100); }, 60);
  let shown = 0;
  $("pct").textContent = "0%";
  const up = setInterval(() => {
    shown = Math.min(pct, shown + Math.max(1, Math.ceil(pct / 25)));
    $("pct").textContent = shown + "%";
    if (shown >= pct) clearInterval(up);
  }, 35);
  sfx.done();
  if (pct >= 80) confetti();
}

function confetti() {
  const colors = ["#ffb627", "#22b573", "#4fc3f7", "#ff6b9d", "#ffffff"];
  for (let k = 0; k < 45; k++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = pick(colors);
    c.style.animationDuration = 1.6 + Math.random() * 1.8 + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}

/* ---------- events ---------- */
$("keypad").addEventListener("pointerdown", (e) => {
  const b = e.target.closest(".key");
  if (b) { e.preventDefault(); pressKey(b.dataset.k); }
});
$("choices").addEventListener("click", (e) => {
  const b = e.target.closest(".choice");
  if (b) submit(false, Number(b.dataset.c));
});
$("btn-next").onclick = nextQuestion;
$("btn-quit").onclick = () => { stopTimers(); Q.locked = true; goHome(); };
$("btn-home").onclick = goHome;
$("btn-again").onclick = () => startQuiz(Q.cfg);

document.addEventListener("keydown", (e) => {
  if (!$("quiz").classList.contains("active")) return;
  if (e.key === "Escape") return $("btn-quit").click();
  if (e.key === "Enter") {
    e.preventDefault();
    return $("btn-next").classList.contains("hidden") ? pressKey("ok") : nextQuestion();
  }
  if (Q.locked) return;
  const q = Q.qs[Q.i];
  if (q.type === "mc") { const k = Number(e.key) - 1; if (k >= 0 && k < q.c.length) submit(false, k); return; }
  if (/^[0-9.]$/.test(e.key)) pressKey(e.key);
  else if (e.key === "Backspace") pressKey("del");
});
