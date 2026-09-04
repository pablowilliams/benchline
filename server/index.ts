import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PromotionRequest, RecommendationRequest, RollbackRequest } from "../shared/contracts.js";
import { experiments, features, models, users } from "./data.js";
import { readEvidence } from "./evidence.js";
import { recommend } from "./recommender.js";
import { createReleaseStore, ReleaseConflict, ReleaseRejected } from "./releases.js";

type ServerOptions = { logger?: boolean; rateLimitMax?: number; serveStatic?: boolean };

export function buildServer(options: ServerOptions = {}) {
  const app = Fastify({ logger: options.logger ?? true, requestIdHeader: "x-request-id" });
  const releases = createReleaseStore();
  app.register(cors, { origin: process.env.CORS_ORIGIN?.split(",") ?? false });
  app.register(helmet);
  app.register(rateLimit, { max: options.rateLimitMax ?? 120, timeWindow: "1 minute" });

  app.get("/api/v1/health", async () => ({ status: "ok", version: "1.1.0" }));
  app.get("/api/v1/workspace", async () => {
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
  });

  app.post("/api/v1/recommendations", async (request, reply) => {
    const parsed = RecommendationRequest.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({
        type: "validation_error",
        message: "The recommendation request is invalid.",
        requestId: request.id,
        issues: parsed.error.issues,
      });
    return recommend(parsed.data, request.id);
  });

  app.post("/api/v1/releases/promote", async (request, reply) => {
    const parsed = PromotionRequest.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({ type: "validation_error", issues: parsed.error.issues });
    const key = request.headers["idempotency-key"];
    if (typeof key !== "string" || key.length < 8)
      return reply
        .code(400)
        .send({ type: "validation_error", message: "A valid Idempotency-Key header is required." });
    try {
      return releases.promote(parsed.data, key);
    } catch (error) {
      if (error instanceof ReleaseConflict)
        return reply
          .code(409)
          .send({ type: "release_conflict", message: error.message, currentChampion: error.currentChampion });
      if (error instanceof ReleaseRejected)
        return reply.code(422).send({ type: "release_rejected", message: error.message });
      throw error;
    }
  });

  app.post("/api/v1/releases/rollback", async (request, reply) => {
    const parsed = RollbackRequest.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({ type: "validation_error", issues: parsed.error.issues });
    const key = request.headers["idempotency-key"];
    if (typeof key !== "string" || key.length < 8)
      return reply
        .code(400)
        .send({ type: "validation_error", message: "A valid Idempotency-Key header is required." });
    try {
      return releases.rollback(parsed.data, key);
    } catch (error) {
      if (error instanceof ReleaseConflict)
        return reply
          .code(409)
          .send({ type: "release_conflict", message: error.message, currentChampion: error.currentChampion });
      if (error instanceof ReleaseRejected)
        return reply.code(422).send({ type: "release_rejected", message: error.message });
      throw error;
    }
  });

  app.get("/api/v1/experiments", async () => {
    const evidence = readEvidence();
    return {
      data: experiments.map((experiment, index) =>
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
    };
  });
  app.get("/api/v1/evidence", async () => readEvidence());
  app.get("/api/v1/models", async () => ({ data: models, state: releases.snapshot() }));
  app.get("/api/v1/features", async () => ({ data: features }));
  app.get("/api/v1/delivery", async () => {
    const load = readEvidence().load;
    return { source: "local loopback benchmark", measuredAt: load.generated_at, load };
  });

  const dist = join(process.cwd(), "dist");
  if ((options.serveStatic || process.argv.includes("--production")) && existsSync(dist)) {
    app.register(fastifyStatic, { root: dist });
    app.setNotFoundHandler((request, reply) =>
      request.raw.url?.startsWith("/api/")
        ? reply.code(404).send({ message: "Not found" })
        : reply.sendFile("index.html"),
    );
  }
  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const app = buildServer();
  app.listen({ port: Number(process.env.PORT ?? 4100), host: "0.0.0.0" }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
