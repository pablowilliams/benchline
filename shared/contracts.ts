import { z } from "zod";

export const Surface = z.enum(["home", "continue_learning", "topic_detail"]);
export type Surface = z.infer<typeof Surface>;

export const RecommendationRequest = z.object({
  userId: z.string().min(1),
  surface: Surface.default("home"),
  limit: z.number().int().min(3).max(20).default(8),
  modelAlias: z.enum(["champion", "challenger"]).default("champion"),
});
export type RecommendationRequest = z.infer<typeof RecommendationRequest>;

export type Recommendation = {
  itemId: string;
  title: string;
  topic: string;
  level: string;
  durationMinutes: number;
  creator: string;
  score: number;
  rank: number;
  prePolicyRank: number;
  sources: string[];
  reasons: string[];
  policyAdjustment: string | null;
  accent: string;
};

export type RecommendationResponse = {
  requestId: string;
  generatedAt: string;
  modelVersion: string;
  featureVersion: string;
  degraded: boolean;
  latencyMs: number;
  recommendations: Recommendation[];
  stageTimings: { features: number; retrieval: number; ranking: number; policy: number };
};

export const PromotionRequest = z.object({
  expectedChampion: z.string().min(1),
  challenger: z.string().min(1),
  releaseNote: z.string().trim().min(12).max(500),
});
export type PromotionRequest = z.infer<typeof PromotionRequest>;

export const RollbackRequest = z.object({
  expectedChampion: z.string().min(1),
  releaseNote: z.string().trim().min(12).max(500),
});
export type RollbackRequest = z.infer<typeof RollbackRequest>;
