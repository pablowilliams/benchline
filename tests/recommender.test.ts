import { describe, expect, it } from "vitest";
import { recommend } from "../server/recommender";

describe("recommendation contract", () => {
  it("returns a deterministic, complete and uniquely ranked slate", () => {
    const request = {
      userId: "usr_maya",
      surface: "home" as const,
      limit: 8,
      modelAlias: "challenger" as const,
    };
    const first = recommend(request);
    const second = recommend(request);
    expect(first.recommendations).toHaveLength(8);
    expect(new Set(first.recommendations.map((x) => x.itemId)).size).toBe(8);
    expect(first.recommendations.map((x) => x.itemId)).toEqual(second.recommendations.map((x) => x.itemId));
    expect(first.requestId).not.toBe(second.requestId);
    expect(first.requestId).toMatch(/^req_/);
    expect(first.recommendations.map((x) => x.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it("supports cold start without degrading", () => {
    const result = recommend({ userId: "usr_new", surface: "home", limit: 8, modelAlias: "champion" });
    expect(result.degraded).toBe(false);
    expect(result.recommendations.every((x) => x.reasons.length > 0)).toBe(true);
  });
  it("records policy movement and candidate provenance", () => {
    const result = recommend({ userId: "usr_amina", surface: "home", limit: 12, modelAlias: "challenger" });
    expect(result.recommendations.some((x) => x.policyAdjustment)).toBe(true);
    expect(result.recommendations.every((x) => x.sources.length >= 2)).toBe(true);
  });
});
