// Dev tool: generates thousands of questions from every topic/year and checks they are valid.
// Run: node tools/test-questions.js [--samples]
const fs = require("fs"), vm = require("vm"), path = require("path");
const files = ["core", "topics-number1", "topics-number2", "topics-measure", "topics-space"];
const src = files.map((f) => fs.readFileSync(path.join(__dirname, "../js", f + ".js"), "utf8")).join("\n") + "\n;globalThis.TOPICS = TOPICS; globalThis.YEAR_NAMES = YEAR_NAMES;";
const ctx = { module: undefined, console }; ctx.globalThis = ctx; vm.createContext(ctx); vm.runInContext(src, ctx);
const strip = (s) => String(s).replace(/<span class="fr"><i>(.*?)<\/i><i>(.*?)<\/i><\/span>/g, "$1/$2").replace(/<svg.*?<\/svg>/gs, "[pic]").replace(/<[^>]+>/g, "");
let bad = 0, total = 0;
const seenFail = {};
const fail = (t, y, q, why) => { bad++; const k = t.id + y + why; seenFail[k] = (seenFail[k] || 0) + 1; if (seenFail[k] <= 2) console.log(`FAIL ${t.id} y${y}: ${why}\n   ${strip(q.q)} => ${strip(q.a)} ${q.c ? "[" + q.c.map(strip).join(" | ") + "]" : ""}`); };
for (const t of ctx.TOPICS) for (let y = t.minY; y <= t.maxY; y++) {
  const samples = [];
  for (let i = 0; i < 1500; i++) {
    let q; total++;
    try { q = t.gen(y); } catch (e) { bad++; console.log(`THROW ${t.id} y${y}: ${e.stack.split("\n").slice(0, 2).join(" ")}`); break; }
    const all = JSON.stringify(q);
    if (!q || !q.q) { fail(t, y, q || {}, "empty"); continue; }
    if (/undefined|NaN|Infinity|\bnull\b/.test(all)) fail(t, y, q, "bad text");
    if (/\d\.\d{4,}/.test(strip(q.q) + " " + strip(q.a) + " " + (q.c || []).map(strip).join(" "))) fail(t, y, q, "long decimal");
    if (q.type === "num") {
      if (typeof q.a !== "number" || !isFinite(q.a) || q.a < 0) fail(t, y, q, "bad number answer");
      else if (String(q.a).replace(".", "").length > 7) fail(t, y, q, "answer too long");
    } else {
      if (q.c.length < 2) fail(t, y, q, "too few choices");
      if (!q.c.includes(q.a)) fail(t, y, q, "answer not in choices");
      if (new Set(q.c).size !== q.c.length) fail(t, y, q, "duplicate choices");
      if (y >= 2 && q.c.length < 3 && !/odd|larger/.test(q.q) && i === 0) console.log(`note: ${t.id} y${y} has a 2-choice question: ${strip(q.q)}`);
    }
    if (samples.length < 3 && Math.random() < 0.05) samples.push(`${strip(q.q)} ${q.v ? "[pic] " : ""}=> ${strip(q.a)}${q.c ? "   of [" + q.c.map(strip).join(" | ") + "]" : ""}`);
  }
  if (process.argv.includes("--samples")) console.log(`\n== ${t.name} / ${ctx.YEAR_NAMES[y]}\n  ` + samples.join("\n  "));
}
console.log(`\n${ctx.TOPICS.length} topics, ${total} questions generated, ${bad} problems`);
process.exit(bad ? 1 : 0);
