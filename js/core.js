"use strict";
/* ===== Shared helpers, question builders and graphics ===== */

const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = (a) => a[R(0, a.length - 1)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const rd = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const fmt = (n) => (Math.abs(n) >= 10000 ? n.toLocaleString("en-AU") : String(n));
const money = (cents) => "$" + (cents / 100).toFixed(2);
const YEAR_NAMES = ["Foundation", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"];
const NAMES = ["Mia", "Jack", "Ava", "Noah", "Zoe", "Leo", "Ruby", "Max", "Isla", "Tom", "Lily", "Sam", "Chloe", "Ben", "Ella", "Kai"];
const THINGS = [["apples", "🍎"], ["stars", "⭐"], ["fish", "🐟"], ["balls", "⚽"], ["cupcakes", "🧁"], ["flowers", "🌸"], ["ducks", "🦆"], ["cars", "🚗"], ["bees", "🐝"], ["cookies", "🍪"], ["frogs", "🐸"], ["shells", "🐚"]];

/* ---------- question builders ---------- */
// number answer typed on the keypad
function num(q, a, o = {}) { return { type: "num", q, a: rd(a, 3), v: o.v || "", pre: o.pre || "", unit: o.unit || "" }; }
// multiple choice: a = correct choice, wrongs = other choices
function mc(q, a, wrongs, v = "") {
  a = String(a);
  const seen = new Set([a]), ws = [];
  for (const w of shuffle(wrongs.map(String))) if (!seen.has(w)) { seen.add(w); ws.push(w); }
  return { type: "mc", q, a, c: shuffle([a, ...ws.slice(0, 3)]), v };
}
// multiple choice with automatic "close" wrong numbers
function nearMc(q, a, v = "", step = 1) {
  const ws = new Set();
  let guard = 0;
  while (ws.size < 3 && guard++ < 50) {
    const w = rd(a + pick([-3, -2, -1, 1, 2, 3, 10, -10]) * step, 3);
    if (w !== a && w >= 0) ws.add(w);
  }
  return mc(q, a, [...ws], v);
}
const frac = (n, d) => `<span class="fr"><i>${n}</i><i>${d}</i></span>`;

/* ---------- topic registry ---------- */
const TOPICS = [];
const STRANDS = ["Number", "Algebra", "Measurement", "Space", "Statistics & Probability"];
function topic(id, name, icon, strand, minY, maxY, gen) { TOPICS.push({ id, name, icon, strand, minY, maxY, gen }); }

/* ---------- graphics (all return HTML strings) ---------- */
const INK = "#2a2350", C1 = "#6a3fc9", C2 = "#ffb627", C3 = "#22b573", C4 = "#4fc3f7", C5 = "#ff6b9d";
const svg = (w, h, body, cls = "") => `<svg class="vis ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

function emojiRow(e, n, per = 5) {
  let s = "";
  for (let i = 0; i < n; i++) s += `<span>${e}</span>` + ((i + 1) % per === 0 && n > per ? "<br>" : "");
  return `<div class="emojis">${s}</div>`;
}
function groups(e, g, each) {
  let s = "";
  for (let i = 0; i < g; i++) s += `<span class="grp">${e.repeat(each)}</span>`;
  return `<div class="groups">${s}</div>`;
}

function clockSVG(h, m) {
  let b = `<circle cx="60" cy="60" r="56" fill="#fff" stroke="${C1}" stroke-width="5"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    b += `<text x="${60 + 43 * Math.cos(a)}" y="${60 + 43 * Math.sin(a) + 4.5}" font-size="13" font-weight="700" text-anchor="middle" fill="${INK}">${i}</text>`;
  }
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 52 : 50;
    b += `<line x1="${60 + r1 * Math.sin(a)}" y1="${60 - r1 * Math.cos(a)}" x2="${60 + 54 * Math.sin(a)}" y2="${60 - 54 * Math.cos(a)}" stroke="${INK}" stroke-width="${i % 5 ? 0.6 : 1.5}"/>`;
  }
  const ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
  b += `<line x1="60" y1="60" x2="${60 + 24 * Math.sin(ha)}" y2="${60 - 24 * Math.cos(ha)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<line x1="60" y1="60" x2="${60 + 36 * Math.sin(ma)}" y2="${60 - 36 * Math.cos(ma)}" stroke="${C5}" stroke-width="3" stroke-linecap="round"/>`;
  b += `<circle cx="60" cy="60" r="4" fill="${INK}"/>`;
  return svg(120, 120, b, "sq");
}

function fracBar(n, d) {
  const w = 200 / d; let b = "";
  for (let i = 0; i < d; i++) b += `<rect x="${5 + i * w}" y="5" width="${w}" height="40" fill="${i < n ? C2 : "#fff"}" stroke="${INK}" stroke-width="2"/>`;
  return svg(210, 50, b);
}
function fracPie(n, d) {
  let b = "";
  for (let i = 0; i < d; i++) {
    const a0 = (i / d) * 2 * Math.PI, a1 = ((i + 1) / d) * 2 * Math.PI;
    const p = (a) => `${60 + 54 * Math.sin(a)} ${60 - 54 * Math.cos(a)}`;
    b += d === 1 ? `<circle cx="60" cy="60" r="54" fill="${C2}" stroke="${INK}" stroke-width="2"/>`
      : `<path d="M60 60 L${p(a0)} A54 54 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z" fill="${i < n ? C2 : "#fff"}" stroke="${INK}" stroke-width="2"/>`;
  }
  return svg(120, 120, b, "sq");
}
const fracPic = (n, d) => (Math.random() < 0.5 ? fracBar(n, d) : fracPie(n, d));

function polyPts(n, r = 50, cx = 60, cy = 62, rot = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = rot + (i / n) * 2 * Math.PI; pts.push(`${rd(cx + r * Math.sin(a), 1)},${rd(cy - r * Math.cos(a), 1)}`); }
  return pts.join(" ");
}
const SHAPES = {
  circle: `<circle cx="60" cy="60" r="48"/>`,
  oval: `<ellipse cx="60" cy="60" rx="54" ry="32"/>`,
  triangle: `<polygon points="${polyPts(3, 54, 60, 68)}"/>`,
  square: `<rect x="16" y="16" width="88" height="88"/>`,
  rectangle: `<rect x="6" y="28" width="108" height="64"/>`,
  rhombus: `<polygon points="60,8 100,60 60,112 20,60"/>`,
  trapezium: `<polygon points="34,28 86,28 112,92 8,92"/>`,
  parallelogram: `<polygon points="34,30 114,30 86,90 6,90"/>`,
  pentagon: `<polygon points="${polyPts(5)}"/>`,
  hexagon: `<polygon points="${polyPts(6)}"/>`,
  octagon: `<polygon points="${polyPts(8, 52, 60, 60, Math.PI / 8)}"/>`,
};
function shapeSVG(name, color) {
  return svg(120, 120, `<g fill="${color || pick([C2, C3, C4, C5])}" stroke="${INK}" stroke-width="3" stroke-linejoin="round">${SHAPES[name]}</g>`, "sq");
}

function barGraph(labels, vals, step = 1) {
  const max = Math.ceil(Math.max(...vals) / step) * step, n = labels.length, bw = 220 / n;
  const cols = [C1, C2, C3, C4, C5];
  let b = "";
  for (let v = 0; v <= max; v += step) {
    const y = 150 - (v / max) * 130;
    b += `<line x1="34" y1="${y}" x2="260" y2="${y}" stroke="#ddd"/><text x="28" y="${y + 4}" font-size="11" text-anchor="end" fill="${INK}">${v}</text>`;
  }
  labels.forEach((l, i) => {
    const h = (vals[i] / max) * 130, x = 38 + i * bw;
    b += `<rect x="${x + bw * 0.15}" y="${150 - h}" width="${bw * 0.7}" height="${h}" rx="3" fill="${cols[i % 5]}"/>`;
    b += `<text x="${x + bw / 2}" y="168" font-size="${l.length > 2 ? 11 : 18}" text-anchor="middle" fill="${INK}">${l}</text>`;
  });
  b += `<line x1="34" y1="150" x2="260" y2="150" stroke="${INK}" stroke-width="2"/><line x1="34" y1="150" x2="34" y2="14" stroke="${INK}" stroke-width="2"/>`;
  return svg(270, 176, b, "wide");
}
function pictoGraph(labels, vals, e, each) {
  return `<table class="picto">${labels.map((l, i) => `<tr><th>${l}</th><td>${e.repeat(vals[i] / each)}</td></tr>`).join("")}</table><div class="key-note">${e} = ${each}</div>`;
}

function angleSVG(deg, label) {
  const a = deg * Math.PI / 180, x = 30 + 85 * Math.cos(a), y = 100 - 85 * Math.sin(a);
  const ax = 30 + 26 * Math.cos(a), ay = 100 - 26 * Math.sin(a);
  let b = `<path d="M56 100 A26 26 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}" fill="none" stroke="${C5}" stroke-width="3"/>`;
  b += `<line x1="30" y1="100" x2="125" y2="100" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><line x1="30" y1="100" x2="${x}" y2="${y}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  if (label) b += `<text x="${30 + 44 * Math.cos(a / 2)}" y="${104 - 44 * Math.sin(a / 2)}" font-size="13" font-weight="700" text-anchor="middle" fill="${C1}">${label}</text>`;
  return svg(150, 200, `<g transform="translate(20,0)">${b}</g>`, "ang").replace('viewBox="0 0 150 200"', 'viewBox="-70 0 240 200"');
}

function rectDim(w, h, unit, showGrid) {
  const k = Math.min(200 / w, 110 / h), W = w * k, H = h * k, x = (240 - W) / 2, y = 10;
  let b = `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#e6f7ee" stroke="${C3}" stroke-width="3"/>`;
  if (showGrid) {
    for (let i = 1; i < w; i++) b += `<line x1="${x + i * k}" y1="${y}" x2="${x + i * k}" y2="${y + H}" stroke="${C3}"/>`;
    for (let i = 1; i < h; i++) b += `<line x1="${x}" y1="${y + i * k}" x2="${x + W}" y2="${y + i * k}" stroke="${C3}"/>`;
  } else {
    b += `<text x="120" y="${y + H + 18}" font-size="15" font-weight="700" text-anchor="middle" fill="${INK}">${w} ${unit}</text>`;
    b += `<text x="${x + W + 6}" y="${y + H / 2 + 5}" font-size="15" font-weight="700" fill="${INK}">${h} ${unit}</text>`;
  }
  return svg(280, y + H + (showGrid ? 10 : 26), b, "wide");
}

function lengthBars(a, b) {
  return svg(240, 70, `<rect x="10" y="8" width="${a * 20}" height="20" rx="6" fill="${C4}"/><text x="${a * 20 + 18}" y="24" font-size="16" font-weight="700" fill="${INK}">A</text>
    <rect x="10" y="42" width="${b * 20}" height="20" rx="6" fill="${C5}"/><text x="${b * 20 + 18}" y="58" font-size="16" font-weight="700" fill="${INK}">B</text>`, "wide");
}

function coinsHTML(list) {
  return `<div class="coins">${list.map((c) => c >= 500
    ? `<span class="note n${c / 100}">$${c / 100}</span>`
    : `<span class="coin ${c >= 100 ? "gold" : "silver"} c${c}">${c >= 100 ? "$" + c / 100 : c + "c"}</span>`).join("")}</div>`;
}

function marbles(counts) { // counts: {red: 2, blue: 3}
  const col = { red: "#e53935", blue: "#1e88e5", green: "#22b573", yellow: "#fdd835", purple: "#8e44ad" };
  let all = [];
  for (const k in counts) for (let i = 0; i < counts[k]; i++) all.push(k);
  return `<div class="marbles">${shuffle(all).map((k) => `<i style="background:${col[k]}"></i>`).join("")}</div>`;
}

function gridPoint(px, py, size = 6) {
  const k = 150 / size; let b = "";
  for (let i = 0; i <= size; i++) {
    b += `<line x1="${25 + i * k}" y1="10" x2="${25 + i * k}" y2="160" stroke="#cfc6f5"/><line x1="25" y1="${160 - i * k}" x2="175" y2="${160 - i * k}" stroke="#cfc6f5"/>`;
    b += `<text x="${25 + i * k}" y="175" font-size="11" text-anchor="middle" fill="${INK}">${i}</text><text x="16" y="${164 - i * k}" font-size="11" text-anchor="middle" fill="${INK}">${i}</text>`;
  }
  b += `<line x1="25" y1="160" x2="175" y2="160" stroke="${INK}" stroke-width="2"/><line x1="25" y1="10" x2="25" y2="160" stroke="${INK}" stroke-width="2"/>`;
  b += `<text x="${25 + px * k}" y="${166 - py * k}" font-size="18" text-anchor="middle">⭐</text>`;
  return svg(185, 180, b, "sq");
}

/* Kip the koala: the app mascot. mood: "happy" | "wow" | "sad" */
function koala(mood = "happy") {
  const mouth = mood === "wow" ? `<ellipse cx="60" cy="88" rx="6" ry="7" fill="#5a3a4a"/>`
    : mood === "sad" ? `<path d="M51 91 Q60 84 69 91" fill="none" stroke="#3a3a4a" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M50 85 Q60 95 70 85" fill="none" stroke="#3a3a4a" stroke-width="3" stroke-linecap="round"/>`;
  const eyes = mood === "happy" ? `<path d="M36 56 Q41 50 46 56 M74 56 Q79 50 84 56" fill="none" stroke="#2a2a3a" stroke-width="3.5" stroke-linecap="round"/>`
    : `<circle cx="41" cy="55" r="5" fill="#2a2a3a"/><circle cx="79" cy="55" r="5" fill="#2a2a3a"/><circle cx="43" cy="53" r="1.6" fill="#fff"/><circle cx="81" cy="53" r="1.6" fill="#fff"/>`;
  return svg(120, 110, `
    <circle cx="20" cy="34" r="20" fill="#9aa3b5"/><circle cx="100" cy="34" r="20" fill="#9aa3b5"/>
    <circle cx="20" cy="35" r="11" fill="#f6d5e0"/><circle cx="100" cy="35" r="11" fill="#f6d5e0"/>
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#b3bccb"/>
    <ellipse cx="60" cy="70" rx="11" ry="14" fill="#3a3a4a"/><ellipse cx="57" cy="64" rx="3" ry="4" fill="#6a6a7a"/>
    <circle cx="30" cy="72" r="7" fill="#ffb3c7" opacity=".7"/><circle cx="90" cy="72" r="7" fill="#ffb3c7" opacity=".7"/>
    ${eyes}${mouth}`, "koala");
}

if (typeof module !== "undefined") module.exports = {};
