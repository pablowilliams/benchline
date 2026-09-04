import { randomUUID } from "node:crypto";
import type { PromotionRequest, RollbackRequest } from "../shared/contracts.js";
import { models as seedModels } from "./data.js";

export type ReleaseEvent = {
  id: string;
  action: "promote" | "rollback";
  from: string;
  to: string;
  note: string;
  at: string;
};

export function createReleaseStore() {
  let champion = "ranker-2.3.2";
  let previousChampion: string | null = null;
  const receipts = new Map<string, ReleaseEvent>();
  const audit: ReleaseEvent[] = [];

  const snapshot = () => ({
    champion,
    challenger: seedModels.find((model) => model.alias === "challenger")?.version ?? "ranker-2.4.0",
    storage: "in-memory demo store" as const,
    audit: [...audit],
  });

  function promote(input: PromotionRequest, idempotencyKey: string) {
    const prior = receipts.get(idempotencyKey);
    if (prior) return { replayed: true, event: prior, state: snapshot() };
    if (input.expectedChampion !== champion) throw new ReleaseConflict(champion);
    const candidate = seedModels.find((model) => model.version === input.challenger);
    if (!candidate || candidate.status !== "Gates passed")
      throw new ReleaseRejected("Challenger is not release-ready");
    const event: ReleaseEvent = {
      id: randomUUID(),
      action: "promote",
      from: champion,
      to: input.challenger,
      note: input.releaseNote,
      at: new Date().toISOString(),
    };
    previousChampion = champion;
    champion = input.challenger;
    receipts.set(idempotencyKey, event);
    audit.unshift(event);
    return { replayed: false, event, state: snapshot() };
  }

  function rollback(input: RollbackRequest, idempotencyKey: string) {
    const prior = receipts.get(idempotencyKey);
    if (prior) return { replayed: true, event: prior, state: snapshot() };
    if (input.expectedChampion !== champion) throw new ReleaseConflict(champion);
    if (!previousChampion)
      throw new ReleaseRejected("No prior in-process promotion is available to roll back");
    const target = previousChampion;
    const event: ReleaseEvent = {
      id: randomUUID(),
      action: "rollback",
      from: champion,
      to: target,
      note: input.releaseNote,
      at: new Date().toISOString(),
    };
    previousChampion = champion;
    champion = target;
    receipts.set(idempotencyKey, event);
    audit.unshift(event);
    return { replayed: false, event, state: snapshot() };
  }

  return { snapshot, promote, rollback };
}

export class ReleaseConflict extends Error {
  constructor(public readonly currentChampion: string) {
    super("Champion changed before this decision was applied");
  }
}
export class ReleaseRejected extends Error {}
