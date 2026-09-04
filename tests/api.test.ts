import { afterEach, describe, expect, it } from "vitest";
import { buildServer } from "../server/index";

const servers: ReturnType<typeof buildServer>[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()));
});

describe("HTTP API", () => {
  it("publishes a versioned health contract with security headers", async () => {
    const server = buildServer();
    servers.push(server);
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/health",
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok", version: "1.1.0" });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["content-security-policy"]).toContain("default-src 'self'");
  });

  it("serves JavaScript assets instead of the SPA fallback", async () => {
    const server = buildServer({ logger: false, serveStatic: true });
    servers.push(server);
    const root = await server.inject({ method: "GET", url: "/" });
    const asset = root.body.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
    expect(asset).toBeTruthy();
    const script = await server.inject({ method: "GET", url: asset! });
    expect(script.headers["content-type"]).toContain("javascript");
    expect(script.body).not.toContain("<!doctype html>");
  });

  it("promotes with compare-and-swap semantics and idempotent replay", async () => {
    const server = buildServer({ logger: false });
    servers.push(server);
    const payload = {
      expectedChampion: "ranker-2.3.2",
      challenger: "ranker-2.4.0",
      releaseNote: "Promote after the evidence review passed",
    };
    const first = await server.inject({
      method: "POST",
      url: "/api/v1/releases/promote",
      headers: { "idempotency-key": "promotion-test-1" },
      payload,
    });
    expect(first.statusCode).toBe(200);
    expect(first.json().state.champion).toBe("ranker-2.4.0");
    const replay = await server.inject({
      method: "POST",
      url: "/api/v1/releases/promote",
      headers: { "idempotency-key": "promotion-test-1" },
      payload,
    });
    expect(replay.json().replayed).toBe(true);
  });

  it("rejects a stale release decision", async () => {
    const server = buildServer({ logger: false });
    servers.push(server);
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/releases/promote",
      headers: { "idempotency-key": "promotion-test-2" },
      payload: {
        expectedChampion: "ranker-2.2.0",
        challenger: "ranker-2.4.0",
        releaseNote: "Stale release attempt for conflict test",
      },
    });
    expect(response.statusCode).toBe(409);
    expect(response.json().currentChampion).toBe("ranker-2.3.2");
  });

  it("validates recommendation requests at the boundary", async () => {
    const server = buildServer();
    servers.push(server);
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/recommendations",
      payload: { userId: "", limit: 99 },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().type).toBe("validation_error");
    expect(response.json().requestId).toBeTruthy();
  });

  it("returns model and feature provenance on a successful request", async () => {
    const server = buildServer();
    servers.push(server);
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/recommendations",
      payload: {
        userId: "usr_maya",
        surface: "home",
        limit: 8,
        modelAlias: "challenger",
      },
    });
    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.modelVersion).toBe("ranker-2.4.0");
    expect(body.featureVersion).toBe("learning-v7");
    expect(body.recommendations).toHaveLength(8);
  });

  it("serves headline metrics from the committed evidence artifacts", async () => {
    const server = buildServer({ logger: false });
    servers.push(server);
    const [workspace, evidence] = await Promise.all([
      server.inject({ method: "GET", url: "/api/v1/workspace" }),
      server.inject({ method: "GET", url: "/api/v1/evidence" }),
    ]);
    expect(workspace.json().summary.ndcg).toBe(evidence.json().backtest.challenger.ndcg_at_10);
    expect(workspace.json().summary.p95).toBe(evidence.json().load.p95_ms);
    expect(workspace.json().evidence.requests).toBe(evidence.json().load.requests);
  });

  it("rolls a promoted alias back and records both decisions", async () => {
    const server = buildServer({ logger: false });
    servers.push(server);
    await server.inject({
      method: "POST",
      url: "/api/v1/releases/promote",
      headers: { "idempotency-key": "release-rollback-1" },
      payload: {
        expectedChampion: "ranker-2.3.2",
        challenger: "ranker-2.4.0",
        releaseNote: "Promote before exercising rollback behaviour",
      },
    });
    const rollback = await server.inject({
      method: "POST",
      url: "/api/v1/releases/rollback",
      headers: { "idempotency-key": "release-rollback-2" },
      payload: {
        expectedChampion: "ranker-2.4.0",
        releaseNote: "Rollback after the controlled release test",
      },
    });
    expect(rollback.statusCode).toBe(200);
    expect(rollback.json().state.champion).toBe("ranker-2.3.2");
    expect(rollback.json().state.audit).toHaveLength(2);
  });
});
