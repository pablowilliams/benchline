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
    expect(response.json()).toEqual({ status: "ok", version: "1.0.0" });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
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
});
