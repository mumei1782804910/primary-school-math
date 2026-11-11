"use strict";
/* ===== Algebra (patterns, missing numbers) and Measurement (time, units, perimeter & area) ===== */

topic("pattern", "Patterns", "🧵", "Algebra", 0, 6, (y) => {
  const seq = (arr) => arr.join(", ") + ", <b>?</b>";
  if (y === 0) {
    const [a, b, c] = shuffle(["🔴", "🔵", "🟡", "🟢", "⭐", "🌸", "🐸"]);
    const unit = pick([[a, b], [a, b, b], [a, a, b], [a, b, c]]);
    const len = unit.length * 2 + R(0, unit.length - 1), shown = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
    return mc("What comes next?", unit[len % unit.length], [a, b, c], `<div class="emojis pat">${shown.join(" ")} <b>?</b></div>`);
  }
  let step, start, n = 4;
  if (y === 1) { step = pick([1, 2, 5, 10]); start = step * R(0, 5); }
  else if (y === 2) { step = pick([2, 3, 5, 10, -2, -5, -10]); start = step > 0 ? R(1, 30) : R(60, 100); }
  else if (y === 3) { step = pick([3, 4, 6, 7, 8, 9, 25, 50, 100, -3, -4, -6]); start = step > 0 ? R(1, 100) : R(80, 200); }
  else if (y === 4) {
    if (Math.random() < 0.4) { const s = R(1, 5), k = pick([2, 3]); return num("What comes next?", s * k ** 4, { v: `<div class="seq">${seq([0, 1, 2, 3].map((i) => s * k ** i))}</div>` }); }
    step = pick([6, 7, 8, 9, 11, 12, 15, -7, -8, -9]); start = step > 0 ? R(1, 200) : R(150, 400);
  } else if (y === 5) {
    step = pick([0.5, 0.25, 0.2, 1.5, 0.1, -0.5, 25, 125]); start = step > 0 ? R(0, 10) : R(8, 20);
  } else {
    const t = R(0, 2);
    if (t === 0) { const m = R(2, 5), c = R(1, 9), x = R(3, 12); return num(`Rule: multiply by ${m}, then add ${c}. What do you get if you start with ${x}?`, x * m + c); }
    if (t === 1) { const s = R(1, 5); return num("What comes next?", (s + 4) ** 2, { v: `<div class="seq">${seq([0, 1, 2, 3].map((i) => (s + i) ** 2))}</div>` }); }
    step = pick([0.3, 0.75, 1.25, -1.5, -0.4, 250]); start = step > 0 ? R(0, 10) : R(10, 20);
  }
  const arr = Array.from({ length: n }, (_, i) => rd(start + i * step));
  return num("What comes next?", rd(start + n * step), { v: `<div class="seq">${seq(arr)}</div>` });
});

topic("missing", "Missing Numbers", "❓", "Algebra", 1, 6, (y) => {
  const B = "<b class='box'>?</b>";
  if (y === 1) { const a = R(1, 10), b = R(1, 10); return num(`${a} + ${B} = ${a + b}`, b); }
  if (y === 2) {
    const a = R(5, 50), b = R(5, 49), t = R(0, 2);
    return t === 0 ? num(`${a} + ${B} = ${a + b}`, b) : t === 1 ? num(`${B} − ${b} = ${a}`, a + b) : num(`${a + b} − ${B} = ${a}`, b);
  }
  if (y === 3 || y === 4) {
    const t = R(0, 3), a = R(2, y === 3 ? 5 : 10) * (y === 3 && Math.random() < 0.3 ? 2 : 1), b = R(2, 10);
    if (t === 0) return num(`${a} × ${B} = ${a * b}`, b);
    if (t === 1) return num(`${B} ÷ ${a} = ${b}`, a * b);
    if (t === 2) return num(`${a * b} ÷ ${B} = ${b}`, a);
    const p = R(20, y === 3 ? 200 : 2000), q = R(10, y === 3 ? 200 : 2000); return num(`${B} − ${p} = ${q}`, p + q);
  }
  if (y === 5) {
    const t = R(0, 2);
    if (t === 0) { const a = R(10, 60), b = R(10, 60), c = R(5, a + b - 5); return num(`${a} + ${b} = ${B} + ${c}`, a + b - c); }
    if (t === 1) { const a = R(2, 9), b = R(2, 6) * 2; return num(`${a} × ${b} = ${B} × ${b / 2}`, a * 2); }
    const a = R(3, 12), b = R(3, 12), c = R(1, 20); return num(`${a} × ${B} + ${c} = ${a * b + c}`, b);
  }
  const a = R(2, 9), b = R(2, 9), c = R(2, 9), t = R(0, 4);
  if (t === 0) return num(`${a} + ${b} × ${c} = ?`, a + b * c);
  if (t === 1) return num(`(${a} + ${b}) × ${c} = ?`, (a + b) * c);
  if (t === 2) return num(`${a * b + c * 2} − ${a} × ${b} = ?`, c * 2);
  if (t === 3) return num(`${a * 10} − ${b * c} ÷ ${c} = ?`, a * 10 - b);
  return num(`${a} × (${b + c} − ${c}) + ${c} = ?`, a * b + c);
});

topic("time", "Time", "🕒", "Measurement", 1, 6, (y) => {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const t12 = (h, m) => `${h}:${String(m).padStart(2, "0")}`;
  const clockQ = (mins) => {
    const h = R(1, 12), m = pick(mins);
    const ws = new Set();
    ws.add(t12(m === 0 ? (h % 12) + 1 : Math.round(m / 5) || 12, m === 0 ? 30 : (h * 5) % 60)); // hands swapped
    ws.add(t12((h % 12) + 1, m)); ws.add(t12(h, (m + 30) % 60)); ws.add(t12(h === 1 ? 12 : h - 1, m)); ws.add(t12(h, (m + 15) % 60));
    return mc("What time does the clock show?", t12(h, m), [...ws], clockSVG(h, m));
  };
  const t = R(0, 2);
  if (y === 1) {
    if (t === 0) { const i = R(0, 6); return mc(`What day comes after ${DAYS[i]}?`, DAYS[(i + 1) % 7], DAYS); }
    return clockQ([0, 0, 30]);
  }
  if (y === 2) {
    if (t === 0) { const i = R(0, 11); return mc(`What month comes after ${MONTHS[i]}?`, MONTHS[(i + 1) % 12], MONTHS); }
    if (t === 1) return pick([num("How many days are in a week?", 7), num("How many months are in a year?", 12), num("How many minutes are in one hour?", 60), num("How many hours are in one day?", 24)]);
    return clockQ([0, 15, 30, 45]);
  }
  if (y === 3) {
    if (t === 0) { const h = R(2, 5); return num(`How many minutes are in ${h} hours?`, h * 60); }
    if (t === 1) { const m = R(2, 5); return num(`How many seconds are in ${m} minutes?`, m * 60); }
    return clockQ([5, 10, 20, 25, 35, 40, 50, 55, R(1, 59)]);
  }
  if (y === 4) {
    const h = R(1, 10), m = pick([0, 15, 30, 45]), dur = pick([20, 30, 45, 60, 90]);
    if (t === 0) { const e = h * 60 + m + dur; return mc(`A movie starts at ${t12(h, m)} pm and runs for ${dur} minutes. When does it end?`, t12(Math.floor(e / 60), e % 60) + " pm", [t12(Math.floor(e / 60) + 1, e % 60) + " pm", t12(h, (m + 30) % 60) + " pm", t12(Math.floor((e + 15) / 60), (e + 15) % 60) + " pm", t12(Math.floor((e - 10) / 60), (e - 10) % 60) + " pm"]); }
    if (t === 1) { const a = R(1, 4), mm = pick([15, 30, 45, 10, 20]); return num(`How many minutes is ${a} hour${a > 1 ? "s" : ""} and ${mm} minutes?`, a * 60 + mm); }
    const add = pick([20, 35, 50, 75]), e = h * 60 + m + add;
    return num(`How many minutes from ${t12(h, m)} to ${t12(Math.floor(e / 60), e % 60)}?`, add);
  }
  if (y === 5) {
    const h = R(13, 23), m = R(0, 11) * 5;
    if (t === 0) return mc(`What is ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} in 12-hour time?`, `${t12(h - 12, m)} pm`, [`${t12(h - 12, m)} am`, `${t12(h - 13 || 12, m)} pm`, `${t12(h - 11, m)} pm`]);
    if (t === 1) { const hh = R(1, 11); return mc(`What is ${t12(hh, m)} pm in 24-hour time?`, `${hh + 12}:${String(m).padStart(2, "0")}`, [`${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`, `${hh + 10}:${String(m).padStart(2, "0")}`, `${hh + 11}:${String(m).padStart(2, "0")}`]); }
    const s = R(6, 11), e = R(13, 18), ms = pick([0, 15, 30]), me = pick([30, 45]);
    return num(`How many minutes from ${t12(s, ms)} am to ${t12(e - 12, me)} pm?`, (e * 60 + me) - (s * 60 + ms));
  }
  if (t === 0) { const d = R(2, 6), h = R(1, 23); return num(`How many hours are in ${d} days and ${h} hours?`, d * 24 + h); }
  if (t === 1) { const sH = R(6, 20), sM = R(0, 11) * 5, dur = R(25, 170), e = sH * 60 + sM + dur; const f = (x) => `${String(Math.floor(x / 60) % 24).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`; return mc(`A train leaves at ${f(sH * 60 + sM)} and the trip takes ${dur} minutes. When does it arrive?`, f(e), [f(e + 60), f(e - 20), f(e + 40), f(e - 60)]); }
  const mins = R(7, 50) * 5; return mc(`${mins} minutes is the same as…`, `${Math.floor(mins / 60)} h ${mins % 60} min`, [`${Math.floor(mins / 60) + 1} h ${mins % 60} min`, `${Math.floor(mins / 100)} h ${mins % 100} min`, `${Math.floor(mins / 60)} h ${(mins % 60) + 10} min`]);
});

topic("measure", "Measuring", "📏", "Measurement", 0, 6, (y) => {
  if (y <= 1) {
    if (Math.random() < 0.5) { const a = R(2, 9), b = pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== a)), w = pick(["longer", "shorter"]); return mc(`Which bar is ${w}?`, (a > b) === (w === "longer") ? "A" : "B", ["A", "B"], lengthBars(a, b)); }
    const pairs = [["🐘", "🐭"], ["🚌", "🚲"], ["🍉", "🍓"], ["🐋", "🐟"], ["🏠", "⛺"], ["🦒", "🐶"]], [hv, lt] = pick(pairs), w = pick(["heavier", "lighter"]);
    return mc(`Which is ${w}?`, w === "heavier" ? hv : lt, [hv, lt]);
  }
  if (y === 2) { const a = R(3, 10), b = R(1, a - 1); return num(`Each block is 1 unit long. How many units longer is A than B?`, a - b, { v: lengthBars(a, b) }); }
  if (y === 3) {
    if (Math.random() < 0.5) { const [what, u] = pick([["the length of a pencil", "centimetres"], ["the height of a door", "metres"], ["the distance between two towns", "kilometres"], ["the mass of an apple", "grams"], ["the mass of a dog", "kilograms"], ["water in a bathtub", "litres"], ["medicine on a spoon", "millilitres"], ["the width of a fingernail", "millimetres"]]); const fam = { centimetres: 0, metres: 0, kilometres: 0, millimetres: 0, grams: 1, kilograms: 1, litres: 2, millilitres: 2 }; return mc(`What is the best unit to measure ${what}?`, u, Object.keys(fam).filter((k) => fam[k] === fam[u])); }
    const m = R(2, 9); return pick([num(`How many centimetres are in ${m} metres?`, m * 100), num(`How many grams are in ${m} kilograms?`, m * 1000), num(`How many millilitres are in ${m} litres?`, m * 1000)]);
  }
  const CONV = [["m", "cm", 100], ["cm", "mm", 10], ["kg", "g", 1000], ["L", "mL", 1000], ["km", "m", 1000]];
  const [bigU, smallU, k] = pick(y === 4 ? CONV.slice(0, 4) : CONV);
  if (y === 4) { const n = R(2, 12); return Math.random() < 0.5 ? num(`${n} ${bigU} = ? ${smallU}`, n * k, { unit: smallU }) : num(`${n * k} ${smallU} = ? ${bigU}`, n, { unit: bigU }); }
  const n = y === 5 ? R(1, 9) + pick([0.5, 0.25, 0.1, 0.2]) : R(1, 999) / (k === 10 ? 10 : 100);
  if (rd(n * k, 3) % 1) { const w = R(2, 9); return num(`${w * k} ${smallU} = ? ${bigU}`, w, { unit: bigU }); }
  return Math.random() < 0.5 ? num(`${n} ${bigU} = ? ${smallU}`, n * k, { unit: smallU }) : num(`${fmt(rd(n * k, 3))} ${smallU} = ? ${bigU}`, n, { unit: bigU });
});

topic("area", "Perimeter & Area", "🟩", "Measurement", 2, 6, (y) => {
  const u = pick(["cm", "m"]);
  if (y === 2) { const w = R(2, 5), h = R(1, 4); return num("How many squares cover this shape?", w * h, { v: rectDim(w, h, "", true) }); }
  if (y === 3) {
    const w = R(2, 7), h = R(2, 5);
    return Math.random() < 0.5 ? num("What is the area in squares?", w * h, { v: rectDim(w, h, "", true) }) : num(`What is the perimeter of this rectangle?`, 2 * (w + h), { v: rectDim(w, h, u), unit: u });
  }
  const max = y === 4 ? 10 : y === 5 ? 20 : 30, w = R(3, max), h = R(2, Math.min(w, 12)), t = R(0, y === 4 ? 1 : 3);
  if (t === 0) return num("What is the perimeter?", 2 * (w + h), { v: rectDim(w, h, u), unit: u });
  if (t === 1) return num("What is the area?", w * h, { v: rectDim(w, h, u), unit: u + "²" });
  if (t === 2) return num(`A rectangle has an area of ${w * h} ${u}². It is ${w} ${u} long. How wide is it?`, h, { unit: u });
  if (y === 5) { const s = R(3, 15); return num(`A square has a perimeter of ${s * 4} ${u}. How long is each side?`, s, { unit: u }); }
  const a = R(2, 6), b = R(2, 5), c = R(2, 5); return num(`A box is ${a} cm long, ${b} cm wide and ${c} cm high. What is its volume in cubic centimetres?`, a * b * c, { unit: "cm³" });
});
