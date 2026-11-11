"use strict";
/* ===== Number: counting, place value, comparing, + − × ÷ =====
   y = year level: 0 = Foundation, 1–6 = Year 1–6 */

topic("count", "Counting", "🔢", "Number", 0, 1, (y) => {
  const max = y ? 20 : 10, t = R(0, 3);
  if (t <= 1) { const [name, e] = pick(THINGS), n = R(1, max); return num(`How many ${name}?`, n, { v: emojiRow(e, n) }); }
  if (t === 2) { const n = R(1, max - 1); return num(`What number comes after ${n}?`, n + 1); }
  const n = R(2, max); return num(`What number comes before ${n}?`, n - 1);
});

topic("place", "Place Value", "🏠", "Number", 1, 6, (y) => {
  const digits = [0, 2, 3, 4, 5, 6, 7][y];
  const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions"];
  const n = R(10 ** (digits - 1), 10 ** digits - 1), s = String(n);
  const t = R(0, 3);
  if (y >= 4 && t === 0) { // rounding
    const to = pick(y === 4 ? [10, 100] : [100, 1000]), m = R(to + 1, to * 90);
    const x = m % to === to / 2 || m % to === 0 ? m + 1 : m;
    return num(`Round ${fmt(x)} to the nearest ${fmt(to)}`, Math.round(x / to) * to);
  }
  if (y >= 5 && t === 1) { // decimal place value
    const d = [R(1, 9), R(1, 9), R(1, 9)], names = ["tenths", "hundredths", "thousandths"];
    const k = R(0, y === 5 ? 1 : 2), dec = `${R(1, 9)}.${d.join("")}`.slice(0, y === 5 ? 4 : 5);
    if (d.indexOf(d[k]) !== k || d[k] === Number(dec[0])) return num(`Round ${dec} to the nearest whole number`, Math.round(Number(dec)));
    return mc(`In ${dec}, the digit ${d[k]} is in which place?`, names[k], ["ones", "tens", ...names]);
  }
  if (t === 1) { // expanded form
    const parts = s.split("").map((c, i) => Number(c) * 10 ** (s.length - 1 - i)).filter((p) => p);
    return num(parts.map(fmt).join(" + ") + " = ?", n);
  }
  if (t === 2 && y <= 2) {
    const tens = R(1, 9), ones = R(0, 9);
    return num(`${tens} tens and ${ones} ones make what number?`, tens * 10 + ones);
  }
  // value / place of a digit (digit must be unique in the number)
  const uniq = s.split("").map((c, k) => k).filter((k) => s[k] !== "0" && s.split(s[k]).length === 2);
  if (!uniq.length || (t === 3 && y >= 2)) {
    const step = 10 ** R(1, Math.max(1, digits - 2)), more = Math.random() < 0.5 || n <= step;
    return num(`What number is ${fmt(step)} ${more ? "more" : "less"} than ${fmt(n)}?`, more ? n + step : n - step);
  }
  const i = pick(uniq), dgt = s[i];
  const place = s.length - 1 - i;
  return Math.random() < 0.5
    ? num(`What is the value of the ${dgt} in ${fmt(n)}?`, Number(dgt) * 10 ** place)
    : mc(`In ${fmt(n)}, the digit ${dgt} is in which place?`, PLACES[place], PLACES.slice(0, Math.max(4, s.length)));
});

topic("compare", "Compare & Order", "⚖️", "Number", 0, 6, (y) => {
  const big = Math.random() < 0.5, word = big ? (y ? "largest" : "biggest") : "smallest";
  let set = new Set();
  const max = [10, 100, 1000, 10000, 100000, 1000000, 1000000][y];
  let guard = 0;
  while (set.size < 3 && guard++ < 99) {
    if (y >= 4 && guard % 2) set.add(rd(R(1, 9) + R(1, 99) / pick([10, 100]), 2));
    else if (y === 6 && Math.random() < 0.4) set.add(-R(1, 20));
    else if (y >= 4 && set.size) set.add([...set][0] + pick([0.1, 0.01, -0.1, 0.09]));
    else set.add(y >= 2 ? R(max / 10, max) : R(0, max));
  }
  const arr = [...set].map((x) => rd(x, 2)).filter((x, i, a) => a.indexOf(x) === i);
  if (arr.length < 3) arr.push(rd(Math.max(...arr) + 1, 2));
  const ans = big ? Math.max(...arr) : Math.min(...arr);
  return mc(`Which number is the ${word}?`, fmt(ans), arr.filter((x) => x !== ans).map(fmt));
});

topic("add", "Addition", "➕", "Number", 0, 6, (y) => {
  if (y === 0) {
    const a = R(1, 5), b = R(1, 5), [, e] = pick(THINGS);
    return num(`${a} + ${b} = ?`, a + b, { v: `<div class="emojis">${e.repeat(a)} <b>+</b> ${e.repeat(b)}</div>` });
  }
  if (y === 1) { const a = R(1, 12), b = R(1, 20 - a > 9 ? 9 : 20 - a); return num(`${a} + ${b} = ?`, a + b); }
  if (y === 2) { const a = R(10, 79), b = R(5, 99 - a); return num(`${a} + ${b} = ?`, a + b); }
  if (y === 3) { const a = R(100, 799), b = R(20, 999 - a); return num(`${a} + ${b} = ?`, a + b); }
  if (y === 4) { const a = R(1000, 7999), b = R(100, 9999 - a); return num(`${a} + ${b} = ?`, a + b); }
  if (Math.random() < 0.5) { // decimals
    const d = y === 5 ? 10 : 100, a = R(11, 99 * d / 10) / d, b = R(11, 99 * d / 10) / d;
    return num(`${a} + ${b} = ?`, a + b);
  }
  const a = R(10000, 79999), b = R(1000, 19999);
  return num(`${fmt(a)} + ${fmt(b)} = ?`, a + b);
});

topic("sub", "Subtraction", "➖", "Number", 0, 6, (y) => {
  if (y === 0) {
    const a = R(2, 10), b = R(1, a - 1), [, e] = pick(THINGS);
    return num(`${a} take away ${b} = ?`, a - b, { v: `<div class="emojis">${e.repeat(a - b)}<span class="gone">${e.repeat(b)}</span></div>` });
  }
  if (y === 1) { const a = R(5, 20), b = R(1, Math.min(a, 10)); return num(`${a} − ${b} = ?`, a - b); }
  if (y === 2) { const a = R(20, 99), b = R(5, a - 1); return num(`${a} − ${b} = ?`, a - b); }
  if (y === 3) { const a = R(200, 999), b = R(20, a - 10); return num(`${a} − ${b} = ?`, a - b); }
  if (y === 4) { const a = R(2000, 9999), b = R(100, a - 100); return num(`${a} − ${b} = ?`, a - b); }
  if (Math.random() < 0.5) {
    const d = y === 5 ? 10 : 100, b = R(11, 50 * d / 10) / d, a = rd(b + R(11, 50 * d / 10) / d, 2);
    return num(`${a} − ${b} = ?`, a - b);
  }
  const a = R(20000, 99999), b = R(1000, 19999);
  return num(`${fmt(a)} − ${fmt(b)} = ?`, a - b);
});

topic("mul", "Multiplication", "✖️", "Number", 2, 6, (y) => {
  if (y === 2) {
    const g = R(2, 5), each = pick([2, 5, 10, 2, 5, 3]), [name, e] = pick(THINGS);
    return each <= 5 && Math.random() < 0.6
      ? num(`${g} groups of ${each} ${name}. How many altogether?`, g * each, { v: groups(e, g, each) })
      : num(`${g} × ${each} = ?`, g * each);
  }
  if (y === 3) { const a = pick([2, 3, 4, 5, 10]), b = R(1, 10); return Math.random() < 0.5 ? num(`${a} × ${b} = ?`, a * b) : num(`${b} × ${a} = ?`, a * b); }
  if (y === 4) {
    if (Math.random() < 0.25) { const a = R(2, 9), b = pick([10, 100]) * R(1, 9); return num(`${a} × ${b} = ?`, a * b); }
    const a = R(2, 10), b = R(2, 10); return num(`${a} × ${b} = ?`, a * b);
  }
  if (y === 5) {
    if (Math.random() < 0.3) { const a = R(2, 12), b = R(2, 12); return num(`${a} × ${b} = ?`, a * b); }
    const a = R(12, 99), b = R(2, 9); return num(`${a} × ${b} = ?`, a * b);
  }
  const t = R(0, 2);
  if (t === 0) { const a = R(11, 40), b = R(11, 30); return num(`${a} × ${b} = ?`, a * b); }
  if (t === 1) { const a = R(11, 99) / 10, b = pick([10, 100, 1000]); return num(`${a} × ${b} = ?`, a * b); }
  const a = R(101, 999), b = R(2, 9); return num(`${a} × ${b} = ?`, a * b);
});

topic("div", "Division", "➗", "Number", 2, 6, (y) => {
  if (y === 2) {
    const g = R(2, 5), each = R(1, 5), [name, e] = pick(THINGS);
    return num(`Share ${g * each} ${name} equally between ${g} friends. How many each?`, each, { v: emojiRow(e, g * each, 10) });
  }
  if (y === 3) { const b = pick([2, 3, 4, 5, 10]), a = R(2, 10); return num(`${a * b} ÷ ${b} = ?`, a); }
  if (y === 4) {
    const b = R(2, 10), a = R(2, 10);
    if (Math.random() < 0.25) { const r = R(1, b - 1); return num(`${a * b + r} ÷ ${b} has what remainder?`, r); }
    return num(`${a * b} ÷ ${b} = ?`, a);
  }
  if (y === 5) {
    const b = R(2, 9), a = R(11, 99);
    if (Math.random() < 0.25) { const r = R(1, b - 1); return num(`${a * b + r} ÷ ${b} has what remainder?`, r); }
    return num(`${a * b} ÷ ${b} = ?`, a);
  }
  const t = R(0, 2);
  if (t === 0) { const b = R(3, 12), a = R(21, 150); return num(`${a * b} ÷ ${b} = ?`, a); }
  if (t === 1) { const a = R(12, 999), b = pick([10, 100]); return num(`${a} ÷ ${b} = ?`, a / b); }
  const b = pick([2, 4, 5]), a = R(1, 20) * b + pick([1, b / 2].filter((r) => r && Number.isInteger(r)));
  return num(`${a} ÷ ${b} = ? (as a decimal)`, a / b);
});
