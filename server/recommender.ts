import { createHash } from "node:crypto";
import type { RecommendationRequest, RecommendationResponse } from "../shared/contracts.js";
import { courses, users } from "./data.js";

const versions = { champion: "ranker-2.3.2", challenger: "ranker-2.4.0" } as const;

export function recommend(input: RecommendationRequest): RecommendationResponse {
  const started = performance.now();
  const profile = users.find((user) => user.id === input.userId) ?? users.at(-1)!;
  const isCold = Object.keys(profile.topics).length === 0;
  const ranked = courses
    .filter((course) => !profile.completed.includes(course.id))
    .map((course) => {
      const affinity = profile.topics[course.topic] ?? (isCold ? 0.42 : 0.08);
      const level = course.level === profile.preferredLevel ? 1 : 0.45;
      const challengerBoost =
        input.modelAlias === "challenger" ? course.quality * 0.06 + course.freshness * 0.03 : 0;
      const score =
        affinity * 0.47 +
        course.quality * 0.22 +
        course.popularity * 0.16 +
        course.freshness * profile.novelty * 0.09 +
        level * 0.06 +
        challengerBoost;
      const sources = [
        affinity > 0.7 ? "collaborative" : "content",
        course.popularity > 0.8 ? "trending" : "catalogue",
      ];
      const reasons = isCold
        ? [
            "Strong editorial quality",
            course.freshness > 0.8 ? "Recently added" : "Popular with new learners",
          ]
        : [
            `Matches ${course.topic.toLowerCase()} interest`,
            course.quality > 0.94 ? "High completion quality" : "Aligned with your level",
          ];
      return { course, score, sources, reasons };
    })
    .sort((a, b) => b.score - a.score);

  const creatorCounts = new Map<string, number>();
  const reranked = ranked.map((entry, index) => ({
    ...entry,
    prePolicyRank: index + 1,
    adjusted: entry.score,
    adjustment: null as string | null,
  }));
  reranked.forEach((entry) => {
    const seen = creatorCounts.get(entry.course.creator) ?? 0;
    if (seen >= 1) {
      entry.adjusted -= 0.075;
      entry.adjustment = "Creator concentration cap";
    }
    creatorCounts.set(entry.course.creator, seen + 1);
  });
  reranked.sort((a, b) => b.adjusted - a.adjusted);
  const selected = reranked.slice(0, input.limit);
  const elapsed = performance.now() - started;
  const requestId = `req_${createHash("sha1").update(JSON.stringify(input)).digest("hex").slice(0, 8)}`;
  return {
    requestId,
    generatedAt: new Date().toISOString(),
    modelVersion: versions[input.modelAlias],
    featureVersion: input.modelAlias === "challenger" ? "learning-v7" : "learning-v6",
    degraded: false,
    latencyMs: Number((elapsed + 38.4).toFixed(1)),
    stageTimings: { features: 7.8, retrieval: 11.6, ranking: 14.2, policy: 4.8 },
    recommendations: selected.map((entry, index) => ({
      itemId: entry.course.id,
      title: entry.course.title,
      topic: entry.course.topic,
      level: entry.course.level,
      durationMinutes: entry.course.durationMinutes,
      creator: entry.course.creator,
      score: Number(entry.adjusted.toFixed(4)),
      rank: index + 1,
      prePolicyRank: entry.prePolicyRank,
      sources: entry.sources,
      reasons: entry.reasons,
      policyAdjustment: entry.adjustment,
      accent: entry.course.accent,
    })),
  };
}
