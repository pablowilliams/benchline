# Seven-minute interview walkthrough

## 0:00 - Frame the problem

Recommendation teams rarely fail because they cannot train a model. They fail at the joins between events, temporal features, evaluation, policy, releases and diagnosis. Benchline makes that evidence chain inspectable.

## 0:45 - Command Center

Point out that the decision sentence comes before metrics. Explain the locked temporal result, creator-concentration guardrail, measured latency budget and attention queue. Distinguish real local evidence from illustrative operating state.

## 1:45 - Explorer

Choose Maya and generate the challenger slate. Open the top item. Walk through source blending, reason codes, the pre-policy position, any creator-cap movement and the request-stage timings. Switch to the new learner to show explicit cold start.

## 3:00 - Experiments

Explain why sessions/users are the bootstrap unit and why the interval is paired. Show NDCG@10, recall, coverage and creator Gini together. State that offline improvement is not causal business uplift.

## 4:10 - Registry

Trace dataset to feature set to experiment to bundle. Open promotion, show that a release note is required, and explain compare-and-swap plus rollback in the production design.

## 5:15 - Feature Health and Delivery

Inspect the watched creator-exposure feature and its downstream model. Then connect the committed loopback HTTP benchmark to the 60 ms development budget, while stating why it is not production telemetry.

## 6:15 - Code and evidence

Open `server/recommender.ts`, `shared/contracts.ts`, and `ml/backtest.py`. Run:

```bash
npm run benchmark
npm run loadtest
npm run validate
```

Close with the two honest substitutions still deferred: durable OIDC-backed control state and a distributed ANN/feature-store adapter.
