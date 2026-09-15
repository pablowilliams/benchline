import { PromotionRequest, RecommendationRequest, RollbackRequest } from "../../../../shared/contracts";
import { experiments, features, models, users } from "../../../../server/data";
import { readEvidence } from "../../../../server/evidence";
import { recommend } from "../../../../server/recommender";
import { createReleaseStore, ReleaseConflict, ReleaseRejected } from "../../../../server/releases";

const releases = createReleaseStore();

function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}

function workspace() {
  const evidence = readEvidence();
  const state = releases.snapshot();
  return {
    generatedAt: new Date().toISOString(),
    scenario: "Synthetic learning marketplace",
    users,
    experiments: experiments.map((experiment, index) =>
      index === 0
        ? {
            ...experiment,
            ndcg: evidence.backtest.challenger.ndcg_at_10,
            delta: evidence.backtest.headline.ndcg_uplift_percent,
            interval: `${(evidence.backtest.methodology.bootstrap.ci_95_low * 100).toFixed(1)} to ${(evidence.backtest.methodology.bootstrap.ci_95_high * 100).toFixed(1)} pts`,
            coverage: evidence.backtest.challenger.catalogue_coverage * 100,
            latency: evidence.load.p95_ms,
          }
        : experiment,
    ),
    models: models.map((model) => ({
      ...model,
      alias:
        model.version === state.champion
          ? "champion"
          : model.version === state.challenger && state.challenger !== state.champion
            ? "challenger"
            : model.alias === "fallback"
              ? "fallback"
              : "previous",
      status:
        model.version === state.champion
          ? "Serving"
          : model.alias === "fallback"
            ? model.status
            : "Available",
    })),
    features,
    releaseState: state,
    evidence: {
      scope: evidence.backtest.methodology.claim_scope,
      generatedOn: evidence.backtest.generated_on,
      requests: evidence.load.requests,
      concurrency: evidence.load.concurrency,
      throughputRps: evidence.load.throughput_rps,
      p50: evidence.load.p50_ms,
      p99: evidence.load.p99_ms,
      evaluationUsers: evidence.backtest.dataset.users,
      bootstrapResamples: evidence.backtest.methodology.bootstrap.resamples,
      baselineNdcg: evidence.backtest.baseline.ndcg_at_10,
      baselineRecall: evidence.backtest.baseline.recall_at_10,
      challengerRecall: evidence.backtest.challenger.recall_at_10,
      ciLow: evidence.backtest.methodology.bootstrap.ci_95_low,
      ciHigh: evidence.backtest.methodology.bootstrap.ci_95_high,
    },
    summary: {
      champion: state.champion,
      challenger: state.challenger,
      ndcg: evidence.backtest.challenger.ndcg_at_10,
      uplift: evidence.backtest.headline.ndcg_uplift_percent,
      coverage: evidence.backtest.challenger.catalogue_coverage * 100,
      creatorGini: evidence.backtest.challenger.creator_gini,
      baselineCreatorGini: evidence.backtest.baseline.creator_gini,
      p95: evidence.load.p95_ms,
      events: evidence.backtest.dataset.train_events,
    },
  };
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  const path = (await context.params).path.join("/");
  const evidence = readEvidence();
  if (path === "health") return json({ status: "ok", version: "1.1.0" });
  if (path === "workspace") return json(workspace());
  if (path === "experiments") return json({ data: workspace().experiments });
  if (path === "evidence") return json(evidence);
  if (path === "models") return json({ data: models, state: releases.snapshot() });
  if (path === "features") return json({ data: features });
  if (path === "delivery") {
    return json({
      source: "local loopback benchmark",
      measuredAt: evidence.load.generated_at,
      load: evidence.load,
    });
  }
  return json({ message: "Not found" }, 404);
}

export async function POST(request: Request, context: RouteContext) {
  const path = (await context.params).path.join("/");
  const body = await request.json().catch(() => null);
  if (path === "recommendations") {
    const parsed = RecommendationRequest.safeParse(body);
    if (!parsed.success) return json({ type: "validation_error", issues: parsed.error.issues }, 400);
    return json(recommend(parsed.data));
  }
  if (path !== "releases/promote" && path !== "releases/rollback") {
    return json({ message: "Not found" }, 404);
  }
  const key = request.headers.get("idempotency-key");
  if (!key || key.length < 8)
    return json({ type: "validation_error", message: "A valid Idempotency-Key header is required." }, 400);
  try {
    if (path === "releases/promote") {
      const parsed = PromotionRequest.safeParse(body);
      if (!parsed.success) return json({ type: "validation_error", issues: parsed.error.issues }, 400);
      return json(releases.promote(parsed.data, key));
    }
    const parsed = RollbackRequest.safeParse(body);
    if (!parsed.success) return json({ type: "validation_error", issues: parsed.error.issues }, 400);
    return json(releases.rollback(parsed.data, key));
  } catch (error) {
    if (error instanceof ReleaseConflict)
      return json(
        { type: "release_conflict", message: error.message, currentChampion: error.currentChampion },
        409,
      );
    if (error instanceof ReleaseRejected)
      return json({ type: "release_rejected", message: error.message }, 422);
    throw error;
  }
}
