import { readFileSync } from "node:fs";
import { join } from "node:path";

export type BacktestEvidence = {
  generated_on: string;
  methodology: {
    primary_metric: string;
    baseline: string;
    challenger: string;
    bootstrap: {
      resamples: number;
      absolute_delta: number;
      ci_95_low: number;
      ci_95_high: number;
    };
    claim_scope: string;
  };
  dataset: {
    users: number;
    items: number;
    train_events: number;
    test_positives: number;
    train_window: string;
    test_window: string;
  };
  baseline: { ndcg_at_10: number; recall_at_10: number; catalogue_coverage: number; creator_gini: number };
  challenger: { ndcg_at_10: number; recall_at_10: number; catalogue_coverage: number; creator_gini: number };
  headline: { ndcg_uplift_percent: number; interval_excludes_zero: boolean };
};

export type LoadEvidence = {
  generated_at: string;
  requests: number;
  concurrency: number;
  measured: string;
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  throughput_rps: number;
  errors: number;
};

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "evidence", file), "utf8")) as T;
}

export function readEvidence() {
  return {
    backtest: readJson<BacktestEvidence>("backtest.json"),
    load: readJson<LoadEvidence>("loadtest.json"),
  };
}
