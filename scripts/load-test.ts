import { performance } from "node:perf_hooks";
import { writeFileSync } from "node:fs";
import { buildServer } from "../server/index.js";

const total = Number(process.env.LOAD_REQUESTS ?? 5_000);
const concurrency = Number(process.env.LOAD_CONCURRENCY ?? 25);
const app = buildServer({ logger: false, rateLimitMax: total + 100 });
await app.listen({ port: 0, host: "127.0.0.1" });
const address = app.server.address();
if (!address || typeof address === "string") throw new Error("Could not resolve benchmark port");
const endpoint = `http://127.0.0.1:${address.port}/api/v1/recommendations`;
const samples: number[] = [];
let errors = 0;
let next = 0;
const users = ["usr_maya", "usr_leo", "usr_amina", "usr_new"];
const runStarted = performance.now();

async function worker() {
  while (true) {
    const index = next++;
    if (index >= total) return;
    const started = performance.now();
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": `load-${index}` },
        body: JSON.stringify({
          userId: users[index % users.length],
          surface: "home",
          limit: 8,
          modelAlias: index % 5 === 0 ? "challenger" : "champion",
        }),
      });
      if (!response.ok) errors++;
      await response.arrayBuffer();
    } catch {
      errors++;
    }
    samples.push(performance.now() - started);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
const elapsedSeconds = (performance.now() - runStarted) / 1000;
await app.close();
samples.sort((a, b) => a - b);
const pct = (p: number) => samples[Math.floor((samples.length - 1) * p)];
const result = {
  generated_at: new Date().toISOString(),
  requests: total,
  concurrency,
  measured: "HTTP loopback through Fastify, validation, ranking and JSON serialization",
  p50_ms: +pct(0.5).toFixed(2),
  p95_ms: +pct(0.95).toFixed(2),
  p99_ms: +pct(0.99).toFixed(2),
  throughput_rps: +(total / elapsedSeconds).toFixed(1),
  errors,
};
writeFileSync("evidence/loadtest.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
