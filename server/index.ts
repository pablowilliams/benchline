import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { RecommendationRequest } from "../shared/contracts.js";
import { experiments, features, models, users } from "./data.js";
import { recommend } from "./recommender.js";

export function buildServer() {
  const app = Fastify({ logger: true, requestIdHeader: "x-request-id" });
  app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(",") ?? false,
  });
  app.register(helmet, { contentSecurityPolicy: false });
  app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  app.get("/api/v1/health", async () => ({ status: "ok", version: "1.0.0" }));
  app.get("/api/v1/workspace", async () => ({
    generatedAt: new Date().toISOString(),
    users,
    experiments,
    models,
    features,
    summary: {
      champion: "ranker-2.3.2",
      challenger: "ranker-2.4.0",
      ndcg: 0.3103,
      uplift: 27.0,
      coverage: 100,
      p95: 42.8,
      events: 31680,
    },
  }));
  app.post("/api/v1/recommendations", async (request, reply) => {
    const parsed = RecommendationRequest.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({
        type: "validation_error",
        message: "The recommendation request is invalid.",
        requestId: request.id,
        issues: parsed.error.issues,
      });
    return recommend(parsed.data);
  });
  app.get("/api/v1/experiments", async () => ({ data: experiments }));
  app.get("/api/v1/models", async () => ({ data: models }));
  app.get("/api/v1/features", async () => ({ data: features }));
  app.get("/api/v1/delivery", async () => ({
    slo: { availability: 99.98, p95: 42.6, completeness: 99.94, freshness: 11 },
    stages: [
      { name: "Features", ms: 7.8 },
      { name: "Retrieval", ms: 11.6 },
      { name: "Ranking", ms: 14.2 },
      { name: "Policy", ms: 4.8 },
      { name: "Serialize", ms: 4.2 },
    ],
    deployments: [
      { version: "ranker-2.3.2", at: "24 Aug, 14:32", status: "Healthy" },
      { version: "ranker-2.3.1", at: "11 Aug, 09:18", status: "Rolled back" },
    ],
  }));

  const dist = join(process.cwd(), "dist");
  if (process.argv.includes("--production") && existsSync(dist)) {
    app.register(fastifyStatic, { root: dist, wildcard: false });
    app.setNotFoundHandler((request, reply) => {
      if (request.raw.url?.startsWith("/api/")) return reply.code(404).send({ message: "Not found" });
      return reply.sendFile("index.html");
    });
  }
  return app;
}

if (!process.env.VITEST) {
  const app = buildServer();
  app.listen({ port: Number(process.env.PORT ?? 4100), host: "0.0.0.0" }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
