import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

const workspace = {
  generatedAt: "2026-09-04",
  users: [
    {
      id: "usr_maya",
      name: "Maya",
      descriptor: "Senior data engineer",
      preferredLevel: "Advanced",
    },
  ],
  experiments: [
    {
      id: "exp_1",
      name: "Hybrid scorer",
      status: "Ready for review",
      owner: "P",
      dataset: "temporal",
      model: "ranker",
      ndcg: 0.31,
      delta: 27,
      interval: "+24 to +30%",
      coverage: 100,
      latency: 42.8,
    },
  ],
  models: [
    {
      version: "ranker-2.4.0",
      alias: "challenger",
      family: "Hybrid linear scorer",
      status: "Gates passed",
      trained: "2 Sep",
      features: "learning-v7",
      hash: "abc",
    },
  ],
  features: [
    {
      name: "creator_exposure_24h",
      view: "policy",
      freshness: "18 min",
      health: "Watching",
      drift: 0.18,
      nulls: 0.3,
      owner: "Trust",
    },
  ],
  summary: {
    champion: "ranker-2.3.2",
    challenger: "ranker-2.4.0",
    ndcg: 0.3103,
    uplift: 27,
    coverage: 100,
    p95: 42.8,
    events: 31680,
    creatorGini: 0.0943,
    baselineCreatorGini: 0.1358,
  },
  scenario: "Synthetic learning marketplace",
  evidence: {
    requests: 5000,
    concurrency: 25,
    throughputRps: 5048.9,
    p50: 3.86,
    p99: 11.81,
    scope: "Synthetic learning marketplace; offline association, not causal uplift.",
    generatedOn: "2026-09-04",
    evaluationUsers: 720,
    bootstrapResamples: 1000,
    baselineNdcg: 0.2443,
    baselineRecall: 0.2455,
    challengerRecall: 0.2521,
    ciLow: 0.0594,
    ciHigh: 0.0732,
  },
  releaseState: {
    champion: "ranker-2.3.2",
    challenger: "ranker-2.4.0",
    storage: "in-memory demo store",
    audit: [],
  },
};

beforeEach(() => {
  window.history.replaceState(null, "", "#overview");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => workspace })),
  );
});
describe("operator application", () => {
  it("loads the decision view and navigates to experiments", async () => {
    render(<App />);
    expect(await screen.findByText("Challenger 2.4.0 passes the committed demo checks.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Review evidence/i }));
    expect(screen.getByRole("heading", { name: /Compare evidence/i })).toBeInTheDocument();
  });
  it("opens the command menu with the keyboard", async () => {
    render(<App />);
    await screen.findByText("Challenger 2.4.0 passes the committed demo checks.");
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByPlaceholderText(/Search pages/i)).toBeInTheDocument();
  });
  it("exposes a skip link and labelled navigation", async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByText("Skip to content")).toHaveAttribute("href", "#main");
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  });
});
