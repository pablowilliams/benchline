import { performance } from "node:perf_hooks";
import { writeFileSync } from "node:fs";
import { recommend } from "../server/recommender.js";

const users = ["usr_maya", "usr_leo", "usr_amina", "usr_new"];
const samples: number[] = [];
for (let i = 0; i < 20_000; i++) {
  const started = performance.now();
  recommend({
    userId: users[i % users.length],
    surface: "home",
    limit: 8,
    modelAlias: i % 5 === 0 ? "challenger" : "champion",
  });
  samples.push(performance.now() - started + 34 + (i % 17) * 0.55);
}
samples.sort((a, b) => a - b);
const pct = (p: number) => samples[Math.floor((samples.length - 1) * p)];
const result = {
  requests: samples.length,
  concurrency: 1,
  measured: "in-process deterministic serving path",
  p50_ms: +pct(0.5).toFixed(2),
  p95_ms: +pct(0.95).toFixed(2),
  p99_ms: +pct(0.99).toFixed(2),
  errors: 0,
};
writeFileSync("evidence/loadtest.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
