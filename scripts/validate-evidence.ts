import { readFileSync } from "node:fs";
const data = JSON.parse(readFileSync("evidence/backtest.json", "utf8"));
const load = JSON.parse(readFileSync("evidence/loadtest.json", "utf8"));
const failures: string[] = [];
if (data.dataset.users < 500) failures.push("evaluation population is too small");
if (data.methodology.bootstrap.resamples < 1000) failures.push("bootstrap evidence is incomplete");
if (!data.headline.interval_excludes_zero) failures.push("quality interval crosses zero");
if (data.challenger.catalogue_coverage <= data.baseline.catalogue_coverage)
  failures.push("coverage did not improve");
if (load.requests < 5_000) failures.push("load sample is too small");
if (load.measured !== "HTTP loopback through Fastify, validation, ranking and JSON serialization")
  failures.push("load test did not exercise the declared HTTP path");
if (load.concurrency < 20) failures.push("load concurrency is too low");
if (load.p95_ms >= 60) failures.push("serving p95 exceeded its 60 ms budget");
if (load.errors !== 0) failures.push("load test returned errors");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Evidence valid: ${data.dataset.users} users, ${data.headline.ndcg_uplift_percent.toFixed(1)}% NDCG uplift, 95% CI excludes zero.`,
);
