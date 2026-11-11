"use strict";
/* ===== Space (shapes, angles, grids) and Statistics & Probability (graphs, chance) ===== */

topic("shape", "Shapes", "🔷", "Space", 0, 6, (y) => {
  const SIDES = { triangle: 3, square: 4, rectangle: 4, rhombus: 4, trapezium: 4, parallelogram: 4, pentagon: 5, hexagon: 6, octagon: 8 };
  const SOLIDS = { cube: [6, 12, 8], "rectangular prism": [6, 12, 8], "square pyramid": [5, 8, 5], "triangular prism": [5, 9, 6], "triangular pyramid": [4, 6, 4] };
  const nameQ = (names) => { const s = pick(names); return mc("What shape is this?", s, names.concat(["circle", "triangle", "square"]), shapeSVG(s)); };
  const solidQ = () => { const s = pick(Object.keys(SOLIDS)), i = R(0, 2); return nearMc(`How many ${["faces", "edges", "corners (vertices)"][i]} does a ${s} have?`, SOLIDS[s][i]); };
  if (y === 0) return nameQ(["circle", "triangle", "square", "rectangle"]);
  if (y === 1) {
    if (Math.random() < 0.5) return nameQ(["circle", "triangle", "square", "rectangle", "oval"]);
    const s = pick(["triangle", "square", "rectangle"]); return num(`How many ${pick(["sides", "corners"])} does this shape have?`, SIDES[s], { v: shapeSVG(s) });
  }
  if (y === 2) {
    if (Math.random() < 0.5) return nameQ(["pentagon", "hexagon", "octagon", "rhombus", "oval"]);
    const s = pick(Object.keys(SIDES)); return num("How many sides does this shape have?", SIDES[s], { v: shapeSVG(s) });
  }
  if (y === 3) {
    if (Math.random() < 0.5) return solidQ();
    const [obj, s] = pick([["a tin of soup", "cylinder"], ["a soccer ball", "sphere"], ["a dice", "cube"], ["a party hat", "cone"], ["a cereal box", "rectangular prism"]]);
    return mc(`${obj[0].toUpperCase() + obj.slice(1)} is shaped like a…`, s, ["cylinder", "sphere", "cube", "cone", "rectangular prism"]);
  }
  if (y === 4) {
    const t = R(0, 2);
    if (t === 0) return nameQ(["rhombus", "trapezium", "parallelogram", "pentagon", "hexagon", "octagon"]);
    if (t === 1) { const [s, n] = pick([["square", 4], ["rectangle", 2], ["circle", -1], ["rhombus", 2], ["hexagon", 6], ["pentagon", 5]]); return n < 0 ? mc("How many lines of symmetry does a circle have?", "too many to count", ["0", "1", "4"], shapeSVG(s)) : nearMc(`How many lines of symmetry does this ${s === "hexagon" || s === "pentagon" ? "regular " : ""}${s} have?`, n, shapeSVG(s)); }
    return solidQ();
  }
  if (y === 5) {
    const t = R(0, 2);
    if (t === 0) return solidQ();
    if (t === 1) { const [q, a] = pick([["6 square faces", "cube"], ["2 triangle faces and 3 rectangle faces", "triangular prism"], ["1 square face and 4 triangle faces", "square pyramid"], ["2 circle faces and 1 curved surface", "cylinder"], ["4 triangle faces", "triangular pyramid"]]); return mc(`Which 3D object has ${q}?`, a, ["cube", "triangular prism", "square pyramid", "cylinder", "triangular pyramid", "cone"]); }
    const n = pick([3, 4, 5, 6, 8]); return mc(`A shape with ${n} straight sides is called a…`, { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 8: "octagon" }[n], ["triangle", "quadrilateral", "pentagon", "hexagon", "octagon"]);
  }
  const t = R(0, 2);
  if (t === 0) { const [q, a] = pick([["3 equal sides", "equilateral"], ["exactly 2 equal sides", "isosceles"], ["no equal sides", "scalene"], ["one 90° angle", "right-angled"]]); return mc(`A triangle with ${q} is called…`, a, ["equilateral", "isosceles", "scalene", "right-angled"]); }
  if (t === 1) { const n = R(3, 10); return num(`A prism has ends with ${n} sides each. How many faces does it have altogether?`, n + 2); }
  const n = R(3, 8); return num(`A pyramid has a base with ${n} sides. How many edges does it have?`, n * 2);
});

topic("angle", "Angles", "📐", "Space", 3, 6, (y) => {
  const kind = (d) => (d < 90 ? "acute" : d === 90 ? "right" : d < 180 ? "obtuse" : d === 180 ? "straight" : "reflex");
  if (y === 3) { const d = pick([R(20, 65), 90, R(115, 160)]); return mc("Compared with a right angle (a square corner), this angle is…", d < 90 ? "smaller" : d === 90 ? "the same" : "bigger", ["smaller", "the same", "bigger"], angleSVG(d)); }
  if (y === 4) { const d = pick([R(15, 70), 90, R(110, 165), 180]); return mc("What type of angle is this?", kind(d), ["acute", "right", "obtuse", "straight"], angleSVG(d)); }
  if (y === 5) {
    if (Math.random() < 0.5) { const d = pick([R(15, 70), 90, R(110, 165), 180, R(200, 330)]); return mc("What type of angle is this?", kind(d), ["acute", "right", "obtuse", "straight", "reflex"], angleSVG(d)); }
    const d = R(2, 16) * 10, ws = [d + 40, d - 40, d + 80, d - 80, d + 120].filter((w) => w > 0 && w <= 200);
    return mc("About how big is this angle?", d + "°", ws.map((w) => w + "°"), angleSVG(d));
  }
  const t = R(0, 3);
  if (t === 0) { const a = R(20, 160); return num(`Two angles sit on a straight line. One is ${a}°. What is the other?`, 180 - a, { unit: "°" }); }
  if (t === 1) { const a = R(30, 80), b = R(30, 80); return num(`A triangle has angles of ${a}° and ${b}°. What is the third angle?`, 180 - a - b, { unit: "°" }); }
  if (t === 2) { const a = R(10, 80); return num(`Two angles make a right angle. One is ${a}°. What is the other?`, 90 - a, { unit: "°" }); }
  const a = R(40, 150), b = R(40, 150); return num(`Three angles meet at a point and make a full turn. Two are ${a}° and ${b}°. What is the third?`, 360 - a - b, { unit: "°" });
});

topic("grid", "Grids & Coordinates", "🗺️", "Space", 4, 6, (y) => {
  const x = R(0, 6), yv = R(0, 6);
  if (y === 4 || Math.random() < 0.4) {
    const x2 = x === yv ? (x + 2) % 7 : x;
    return mc("Where is the star? (across, up)", `(${x2}, ${yv})`, [`(${yv}, ${x2})`, `(${(x2 + 1) % 7}, ${yv})`, `(${x2}, ${(yv + 1) % 7})`, `(${(x2 + 6) % 7}, ${(yv + 6) % 7})`], gridPoint(x2, yv));
  }
  if (y === 5) { const dx = R(1, 6 - x || 1), ok = x + dx <= 6; return ok ? mc(`The star moves ${dx} to the right. Where is it now?`, `(${x + dx}, ${yv})`, [`(${x}, ${yv + dx})`, `(${x - dx}, ${yv})`, `(${x + dx + 1}, ${yv})`, `(${yv}, ${x + dx})`], gridPoint(x, yv)) : num("What is the x-coordinate (across) of the star?", x, { v: gridPoint(x, yv) }); }
  const a = R(-6, 6) || 2, b = R(-6, 6) || -3;
  const quad = a > 0 && b > 0 ? "1st (top right)" : a < 0 && b > 0 ? "2nd (top left)" : a < 0 ? "3rd (bottom left)" : "4th (bottom right)";
  return mc(`On a Cartesian plane, which quadrant is the point (${a}, ${b}) in?`.replace(/-/g, "−"), quad, ["1st (top right)", "2nd (top left)", "3rd (bottom left)", "4th (bottom right)"]);
});

topic("graph", "Graphs & Data", "📊", "Statistics & Probability", 1, 6, (y) => {
  const SETS = [[["🍎", "🍌", "🍇", "🍊"], "fruit"], [["🐶", "🐱", "🐰", "🐟"], "pet"], [["⚽", "🏀", "🎾", "🏊"], "sport"], [["🔴", "🔵", "🟢", "🟡"], "colour"]];
  const [labels, what] = pick(SETS);
  if (y <= 2) {
    const vals = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4), v = pictoGraph(labels, vals, "😀", 1), t = R(0, 2);
    if (t === 0) { const i = R(0, 3); return num(`How many children chose ${labels[i]}?`, vals[i], { v }); }
    if (t === 1) return mc(`Which ${what} was chosen the most?`, labels[vals.indexOf(Math.max(...vals))], labels, v);
    return y === 1 ? mc(`Which ${what} was chosen the least?`, labels[vals.indexOf(Math.min(...vals))], labels, v) : num("How many children voted altogether?", vals.reduce((a, b) => a + b), { v });
  }
  if (y === 6 && Math.random() < 0.5) {
    const t = R(0, 2), n = R(4, 5);
    if (t === 0) { const mean = R(4, 15), arr = Array.from({ length: n - 1 }, () => mean + R(-3, 3)); arr.push(mean * n - arr.reduce((a, b) => a + b)); return num(`What is the mean (average) of: ${shuffle(arr).join(", ")}?`, mean); }
    const arr = Array.from({ length: 5 }, () => R(1, 9));
    if (t === 1) { const m = R(1, 9), a2 = shuffle([m, m, m, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== m)).slice(0, 3)]); return num(`What is the mode (most common number) of: ${a2.join(", ")}?`, m); }
    return num(`What is the range of: ${arr.join(", ")}?`, Math.max(...arr) - Math.min(...arr));
  }
  const step = y === 3 ? pick([1, 2]) : y === 4 ? pick([2, 5]) : pick([5, 10, 20]);
  const vals = shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4).map((x) => x * step);
  const usePicto = y === 4 && step === 2 || (y === 3 && step === 2 && Math.random() < 0.5);
  const v = usePicto ? pictoGraph(labels, vals, "😀", step) : barGraph(labels, vals, step), t = R(0, 3);
  const i = R(0, 3), j = (i + R(1, 3)) % 4;
  if (t === 0) return num(`How many people chose ${labels[i]}?`, vals[i], { v });
  if (t === 1) return num(`How many more people chose ${labels[vals[i] > vals[j] ? i : j]} than ${labels[vals[i] > vals[j] ? j : i]}?`, Math.abs(vals[i] - vals[j]), { v });
  if (t === 2) return num("How many people voted altogether?", vals.reduce((a, b) => a + b), { v });
  return num(`How many people chose ${labels[i]} or ${labels[j]}?`, vals[i] + vals[j], { v });
});

topic("chance", "Chance", "🎲", "Statistics & Probability", 2, 6, (y) => {
  const WORDS = ["certain", "likely", "unlikely", "impossible"];
  const EVENTS = [["The sun will rise tomorrow", 0], ["You will eat something today", 0], ["A dog will fly to the moon", 3], ["You will grow wings tonight", 3], ["It will snow at the beach in summer", 2], ["You will see a car today", 1], ["You will meet a dinosaur at school", 3], ["Next week will have a Monday", 0], ["You will win a big lottery today", 2], ["Someone in your class will smile today", 1]];
  const cols = shuffle(["red", "blue", "green", "yellow", "purple"]);
  if (y <= 3 && Math.random() < 0.5) { const [e, i] = pick(EVENTS); return mc(`"${e}." How likely is this?`, WORDS[i], WORDS); }
  if (y <= 4) {
    const counts = { [cols[0]]: R(5, 7), [cols[1]]: R(2, 4), [cols[2]]: 1 }, t = R(0, 2), v = marbles(counts);
    if (t === 0) return mc("You pick one marble without looking. Which colour are you most likely to get?", cols[0], cols.slice(0, 3), v);
    if (t === 1) return mc("You pick one marble without looking. Which colour are you least likely to get?", cols[2], cols.slice(0, 3), v);
    return mc(`You pick one marble without looking. Picking a ${cols[3]} one is…`, "impossible", WORDS, v);
  }
  const t = R(0, 3);
  if (t === 0) { const a = R(1, 5), b = R(1, 5), c = R(1, 3), tot = a + b + c; return mc(`You pick one marble without looking. What is the chance it is ${cols[0]}?`, frac(a, tot), [frac(b, tot), frac(a, b + c), frac(1, tot), frac(tot, a), frac(a + 1, tot)], marbles({ [cols[0]]: a, [cols[1]]: b, [cols[2]]: c })); }
  if (t === 1) { const [q, n, d] = pick([["an even number", 3, 6], ["a 5", 1, 6], ["a number bigger than 4", 2, 6], ["a number less than 6", 5, 6], ["a 7", 0, 6]]); return n === 0 ? mc(`You roll a normal dice. Rolling ${q} is…`, "impossible", WORDS) : mc(`You roll a normal dice. What is the chance of rolling ${q}?`, frac(n, d), [frac(1, 6), frac(2, 6), frac(3, 6), frac(4, 6), frac(5, 6), frac(1, 2)].filter((w) => w !== frac(n, d) && !(n === 3 && w === frac(1, 2)))); }
  if (y === 5 || t === 2) { const parts = pick([2, 4, 5, 10]), n = R(1, parts - 1); return y === 5 ? mc(`A spinner has ${parts} equal parts. ${n} ${n > 1 ? "are" : "is"} red. What is the chance of landing on red?`, frac(n, parts), [frac(parts - n || 1, parts + 1), frac(1, parts + n), frac(n, parts + 1), frac(parts, n)]) : num(`A spinner has ${parts} equal parts. ${n} ${n > 1 ? "are" : "is"} red. What is the chance of red, as a percentage?`, n * 100 / parts, { unit: "%" }); }
  const k = R(2, 10); return num(`You roll a dice ${k * 6} times. About how many times would you expect to roll a 4?`, k);
});
