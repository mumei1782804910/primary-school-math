"use strict";
/* ===== Number: fractions, decimals, percentages, money, number facts, word problems ===== */

topic("frac", "Fractions", "🍕", "Number", 1, 6, (y) => {
  const fr = (n, d) => frac(n, d);
  const wrongFr = (n, d) => [fr(d, n || 1), fr(n + 1, d), fr(n, d + 1), fr(Math.max(1, n - 1), d + 2), fr(d - n || 1, d + 1)];
  if (y === 1) {
    if (Math.random() < 0.5) { const n = R(1, 10); return num(`What is half of ${n * 2}?`, n); }
    const d = pick([2, 2, 4]);
    return mc("How much is coloured in?", d === 2 ? "one half" : "one quarter", ["one half", "one quarter", "one whole", "one third"], fracPic(1, d));
  }
  if (y === 2) {
    const d = pick([2, 4, 8]), t = R(0, 1);
    if (t) { const n = R(1, d === 8 ? 3 : 6); return num(`What is one ${{ 2: "half", 4: "quarter", 8: "eighth" }[d]} of ${n * d}?`, n); }
    const n = R(1, d - 1); return mc("What fraction is coloured in?", fr(n, d), wrongFr(n, d), fracPic(n, d));
  }
  if (y === 3) {
    const d = pick([2, 3, 4, 5, 10]);
    if (Math.random() < 0.5) { const n = R(1, d - 1); return mc("What fraction is coloured in?", fr(n, d), wrongFr(n, d), fracPic(n, d)); }
    const n = R(2, 10); return num(`What is ${fr(1, d)} of ${n * d}?`, n);
  }
  if (y === 4) {
    const t = R(0, 2), d = pick([2, 3, 4, 5, 6, 8, 10]);
    if (t === 0) { // equivalent
      const n = R(1, d - 1), k = R(2, 4), g = gcd(n, d);
      return mc(`Which fraction is equal to ${fr(n / g, d / g)}?`, fr(n * k, d * k), [fr(n * k + 1, d * k), fr(n * k, d * k + k), fr(n + k, d + k), fr(d * k, n * k)].filter((w) => w !== fr(n * k, d * k)));
    }
    if (t === 1) { // compare same denominator or unit fractions
      const a = R(2, 9), b = R(2, 9);
      if (a === b) return num(`How many quarters make one whole?`, 4);
      return mc("Which fraction is larger?", fr(1, Math.min(a, b)), [fr(1, Math.max(a, b))]);
    }
    const whole = R(1, 3), n = R(1, d - 1); // mixed number counting
    return num(`How many ${d === 2 ? "halves" : d === 4 ? "quarters" : fr(1, d) + " pieces"} are in ${whole} whole${whole > 1 ? "s" : ""}?`, whole * d);
  }
  if (y === 5) {
    const t = R(0, 2), d = pick([3, 4, 5, 6, 8, 10, 12]);
    if (t === 0) { const a = R(1, d - 2), b = R(1, d - 1 - a); return mc(`${fr(a, d)} + ${fr(b, d)} = ?`, fr(a + b, d), [fr(a + b, d * 2), fr(a + b + 1, d), fr(Math.abs(a - b) || d, d), fr(a * b + d, d)]); }
    if (t === 1) { const a = R(2, d - 1), b = R(1, a - 1); return mc(`${fr(a, d)} − ${fr(b, d)} = ?`, fr(a - b, d), [fr(a + b, d), fr(a - b, d + 1), fr(a - b + 1, d), fr(a, d - b || 1)]); }
    const n = R(1, d - 1), q = R(2, 9); return num(`What is ${fr(n, d)} of ${q * d}?`, q * n);
  }
  const t = R(0, 2);
  if (t === 0) { // related denominators
    const d = pick([2, 3, 4, 5]), k = pick([2, 3]), D = d * k, a = R(1, d - 1), b = R(1, D - a * k - 1 > 0 ? D - a * k - 1 : 1);
    const ans = fr(a * k + b, D);
    return mc(`${fr(a, d)} + ${fr(b, D)} = ?`, ans, [fr(a + b, d + D), fr(a + b, D), fr(a * k + b + 1, D), fr(a * k + b, d)].filter((w) => w !== ans));
  }
  if (t === 1) { // simplify
    const d = pick([3, 4, 5, 7, 8]), n = R(1, d - 1), g = gcd(n, d), k = R(2, 6), ans = fr(n / g, d / g);
    return mc(`Simplify ${fr(n * k, d * k)}`, ans, [fr(n / g + 1, d / g), fr(n / g, d / g + 1), fr(n * k - 1, d * k - 1), fr(d / g, n / g + d / g)].filter((w) => w !== ans));
  }
  const d = pick([3, 4, 5, 6, 8, 10]), n = R(2, d - 1), q = R(3, 12);
  return num(`What is ${fr(n, d)} of ${q * d}?`, q * n);
});

topic("dec", "Decimals", "🔸", "Number", 4, 6, (y) => {
  const t = R(0, 3);
  if (y === 4) {
    if (t === 0) { const n = R(1, 9); return num(`Write ${frac(n, 10)} as a decimal`, n / 10); }
    if (t === 1) { const n = R(1, 99); return num(`Write ${frac(n, 100)} as a decimal`, n / 100); }
    if (t === 2) { const a = R(1, 9) / 10, b = R(1, 9) / 10; return num(`${a} + ${b} = ?`, a + b); }
    const w = R(1, 9), n = R(1, 9); return num(`What number is one tenth more than ${w}.${n}?`, w + (n + 1) / 10);
  }
  if (y === 5) {
    if (t === 0) { const a = R(101, 999) / 100, b = R(101, 999) / 100; return num(`${a} + ${b} = ?`, a + b); }
    if (t === 1) { const b = R(101, 499) / 100, a = rd(b + R(101, 499) / 100); return num(`${a} − ${b} = ?`, a - b); }
    if (t === 2) { const a = R(11, 999) / 100, k = pick([10, 100]); return num(`${a} × ${k} = ?`, a * k); }
    let k = R(101, 989); if (k % 10 === 5 || k % 10 === 0) k++;
    return num(`Round ${k / 100} to one decimal place`, Math.round(k / 10) / 10);
  }
  if (t === 0) { const a = R(11, 99) / 10, b = R(2, 9); return num(`${a} × ${b} = ?`, a * b); }
  if (t === 1) { const k = pick([10, 100, 1000]), a = k === 1000 ? R(12, 9999) : R(11, 999) / 10; return num(`${a} ÷ ${k} = ?`, a / k); }
  if (t === 2) { const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 8]]); return num(`Write ${frac(n, d)} as a decimal`, n / d); }
  const a = R(1001, 9999) / 1000, b = R(101, 999) / 100; return num(`${a} + ${b} = ?`, a + b);
});

topic("pct", "Percentages", "💯", "Number", 5, 6, (y) => {
  const t = R(0, 3);
  const BENCH = [[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 10, 10], [1, 5, 20], [1, 1, 100]];
  if (t === 0) { const [n, d, p] = pick(BENCH); return num(`Write ${n === d ? "one whole" : frac(n, d)} as a percentage`, p, { unit: "%" }); }
  if (y === 5 || t === 1) { const p = pick(y === 5 ? [10, 25, 50] : [10, 20, 25, 50, 75]), n = R(1, 12) * (p % 25 ? 10 : 4) * (y === 5 ? 1 : pick([1, 5])); return num(`What is ${p}% of ${n}?`, n * p / 100); }
  if (t === 2) { const n = R(1, 99); return num(`Write ${n / 100} as a percentage`, n, { unit: "%" }); }
  const p = pick([10, 20, 25, 50]), price = R(2, 20) * 20;
  return num(`A ${pick(["bike", "game", "toy", "jacket", "scooter"])} costs $${price}. It is ${p}% off. What is the sale price?`, price * (100 - p) / 100, { pre: "$" });
});

topic("money", "Money", "💰", "Number", 1, 6, (y) => {
  const ITEMS = ["a pencil", "a drink", "a book", "an ice cream", "a toy car", "a sandwich", "a comic", "a ball"];
  if (y === 1) {
    const c = pick([100, 200, 10, 5]), n = R(1, c === 5 ? 4 : 5);
    return num(`How ${c >= 100 ? "many dollars" : "many cents"} altogether?`, n * c / (c >= 100 ? 100 : 1), c >= 100 ? { pre: "$", v: coinsHTML(Array(n).fill(c)) } : { unit: "c", v: coinsHTML(Array(n).fill(c)) });
  }
  if (y === 2) {
    const list = Array.from({ length: R(2, 5) }, () => pick([5, 10, 20, 50, 10, 20])).sort((a, b) => b - a);
    return num("How many cents altogether?", list.reduce((a, b) => a + b), { unit: "c", v: coinsHTML(list) });
  }
  if (y === 3) {
    const pay = pick([200, 500, 1000]), cost = R(pay / 50, pay / 5 - 1) * 5;
    return num(`${pick(NAMES)} buys ${pick(ITEMS)} for ${money(cost)} and pays with ${money(pay).replace(".00", "")}. How much change?`, (pay - cost) / 100, { pre: "$" });
  }
  if (y === 4) {
    if (Math.random() < 0.5) { const a = R(20, 199) * 5, b = R(20, 199) * 5; return num(`${money(a)} + ${money(b)} = ?`, (a + b) / 100, { pre: "$" }); }
    const pay = pick([2000, 5000]), cost = R(20, pay / 5 - 1) * 5;
    return num(`You pay ${money(cost)} with a $${pay / 100} note. How much change?`, (pay - cost) / 100, { pre: "$" });
  }
  if (y === 5) {
    if (Math.random() < 0.5) { const c = R(101, 999), r = Math.round(c / 5) * 5; return num(`The total is ${money(c)}. Round it to the nearest 5 cents.`, r / 100, { pre: "$" }); }
    const n = R(2, 6), c = R(11, 99) * 5; return num(`${n} tickets cost ${money(c)} each. What is the total?`, n * c / 100, { pre: "$" });
  }
  if (Math.random() < 0.5) { const p = pick([10, 20, 25, 50]), price = R(3, 30) * 4; return num(`A $${price} item has ${p}% off. How much do you save?`, price * p / 100, { pre: "$" }); }
  const n = R(3, 8), each = R(5, 60) * 5; return num(`${n} friends share a bill of ${money(n * each)} equally. How much does each pay?`, each / 100, { pre: "$" });
});

topic("facts", "Number Facts", "🧩", "Number", 2, 6, (y) => {
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  if (y <= 3) {
    const t = R(0, 2), max = y === 2 ? 50 : 500;
    if (t === 0) { const n = R(1, max); return mc(`Is ${n} odd or even?`, n % 2 ? "odd" : "even", ["odd", "even"]); }
    if (t === 1) { const n = R(1, y === 2 ? 20 : 50); return num(`Double ${n} is?`, n * 2); }
    const n = R(1, y === 2 ? 10 : 40) * 2; return num(`Half of ${n} is?`, n / 2);
  }
  if (y === 4) {
    const t = R(0, 2);
    if (t === 0) { const a = R(11, 99), b = R(11, 99), op = pick(["+", "×"]); const r = op === "+" ? a + b : a * b; return mc(`Without working it out: is ${a} ${op} ${b} odd or even?`, r % 2 ? "odd" : "even", ["odd", "even"]); }
    if (t === 1) { const k = R(3, 9), n = R(2, 9); return mc(`Which number is a multiple of ${k}?`, k * n, [k * n + 1, k * n - 1, k * n + k - 1, k * (n + 1) + 1].filter((w) => w % k)); }
    const n = R(2, 12); return num(`${n} × ${n} = ?`, n * n);
  }
  if (y === 5) {
    const t = R(0, 2);
    if (t === 0) { const n = pick([12, 16, 18, 20, 24, 30, 36, 40]), f = pick([2, 3, 4, 5, 6, 8, 9, 10].filter((x) => n % x === 0)); return mc(`Which number is a factor of ${n}?`, f, [5, 7, 9, 11, 13, 14, 16, 17].filter((x) => n % x)); }
    if (t === 1) { const a = pick([2, 3, 4, 6]), b = pick([3, 4, 5, 6, 8].filter((x) => x !== a)); return num(`What is the lowest common multiple of ${a} and ${b}?`, a * b / gcd(a, b)); }
    const g = pick([2, 3, 4, 5, 6]), a = g * pick([2, 3, 5]), b = g * pick([4, 7, 9]); return num(`What is the highest common factor of ${a} and ${b}?`, gcd(a, b));
  }
  const t = R(0, 3);
  if (t === 0) { const p = pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]); return mc("Which number is prime?", p, shuffle([4, 6, 8, 9, 15, 21, 25, 27, 33, 35, 39, 49, 51]).slice(0, 3)); }
  if (t === 1) { const n = R(2, 12); return Math.random() < 0.5 ? num(`${n}² = ?`, n * n) : num(`What is the square root of ${n * n}?`, n); }
  if (t === 2) {
    const a = R(1, 9), b = R(1, 15), s = b - a, neg = (n) => (n < 0 ? `−${-n}` : `${n}`);
    return mc(`−${a} + ${b} = ?`, neg(s), [neg(-s), neg(s + 1), neg(s - 1), neg(a + b), neg(-(a + b))]);
  }
  const from = R(1, 8), drop = R(from + 1, from + 9);
  return mc(`The temperature is ${from}°C. It drops by ${drop} degrees. What is it now?`, `−${drop - from}°C`, [`${drop - from}°C`, `−${drop - from + 1}°C`, `−${drop + from}°C`, `${drop + from}°C`]);
});

topic("word", "Word Problems", "📖", "Number", 1, 6, (y) => {
  const n1 = pick(NAMES), n2 = pick(NAMES.filter((n) => n !== n1)), [thing] = pick(THINGS);
  const big = [0, 10, 50, 300, 2000, 5000, 20000][y];
  const ops = y === 1 ? ["+", "-"] : y <= 2 ? ["+", "-", "x"] : ["+", "-", "x", "/", "2"];
  const op = pick(ops);
  if (op === "+") { const a = R(2, big), b = R(2, big); return num(`${n1} has ${fmt(a)} ${thing}. ${n2} gives ${n1} ${fmt(b)} more. How many ${thing} does ${n1} have now?`, a + b); }
  if (op === "-") { const a = R(4, big * 2), b = R(1, a - 1); return num(`There are ${fmt(a)} ${thing}. ${fmt(b)} are taken away. How many are left?`, a - b); }
  const m = y <= 3 ? [2, 5, 10, 3, 4] : [3, 4, 6, 7, 8, 9, 12];
  if (op === "x") { const a = pick(m), b = R(2, y <= 3 ? 10 : y * 6); return num(`There are ${b} bags with ${a} ${thing} in each bag. How many ${thing} altogether?`, a * b); }
  if (op === "/") { const a = pick(m), b = R(2, y <= 3 ? 10 : y * 6); return num(`${n1} shares ${a * b} ${thing} equally into ${a} boxes. How many in each box?`, b); }
  // two-step
  const a = R(2, 9), b = R(2, y + 4), c = R(1, a * b - 1);
  return num(`${n1} buys ${b} packs of ${a} ${thing}, then gives ${c} to ${n2}. How many does ${n1} have left?`, a * b - c);
});
