# Benchline

Benchline is a small recommendation operations workbench for a fictional learning marketplace. It connects the work usually scattered across notebooks, registry screens, orchestration logs, and dashboards: inspect a slate, compare a candidate, review feature risk, apply a reversible alias change, and examine the serving path.

The product is intentionally honest. The dataset is deterministic and synthetic; quality metrics come from a reproducible temporal backtest; latency figures come from a declared local benchmark; the online experiment is designed as a simulation rather than presented as customer traffic.

## What is implemented

- A three-stage recommendation path: hybrid candidates, learned-score analogue, and creator-aware policy re-ranking.
- A typed Fastify API with boundary validation, unique correlation IDs, security headers, rate limiting, and production static serving.
- Six complete operator workflows: Command Center, Explorer, Experiments, Model Registry, Feature Health, and Delivery.
- Warm-user and cold-start scenarios with per-item reasons, candidate provenance, ranking movement, and stage timings.
- Deterministic temporal evaluation over 720 users, 120 items, 31,680 training events, and 2,880 held-out positives.
- Paired user-level bootstrap intervals with 1,000 resamples.
- Server-backed promotion and rollback with human release notes, optimistic concurrency, idempotency, and an in-memory audit trail.
- Responsive layouts, keyboard command menu, focusable controls, reduced-motion support, and explicit failure states.
- Unit, contract, component, and numerical tests plus CI, container, security, and evidence-validation scaffolding.

## Measured result

On the committed synthetic temporal holdout, the hybrid policy improved **NDCG@10 by 27.0%** over contextual popularity (`0.3103` vs `0.2443`). The paired absolute delta was `+0.0660`, with a 95% bootstrap interval from `+0.0594` to `+0.0732`. Creator concentration, measured as Gini, fell from `0.1358` to `0.0943`.

These are offline results on generated data. They demonstrate evaluation and engineering methodology; they are not a claim of causal or commercial uplift.

The committed local loopback benchmark sends 5,000 real HTTP requests at concurrency 25 through Fastify, Zod validation, ranking, policy re-ranking, and JSON serialization. On the recorded run it completed with **0 errors**, **8.34 ms p95**, **11.81 ms p99**, and **5,048.9 requests/second**. This is a single-machine development benchmark, not production capacity or availability.

Reproduce them:

```bash
npm run benchmark
npm run validate:evidence
```

## Run locally

Requirements: Node.js 20+ and Python 3.10+.

```bash
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100). The API listens on `4100` and is proxied by Vite.

Production-shaped local run:

```bash
npm run build
npm start
```

Open [http://localhost:4100](http://localhost:4100).

## Repository map

```text
src/              React operator experience
server/           Fastify API, evidence adapter, release store and ranking path
shared/           Runtime-validated cross-boundary contracts
ml/               Synthetic data, metrics, backtest and numerical tests
evidence/         Generated evaluation artifacts
docs/             75-page plan, architecture and decision records
scripts/          Evidence and performance validation
.github/workflows Continuous integration and security checks
```

## Signature interview walkthrough

1. Start in Command Center and explain why the challenger is release-ready.
2. Open Explorer, choose Maya, and compare champion and challenger slates.
3. Select a result and inspect its sources, reasons, policy movement, and request stages.
4. Open Experiments and review paired uncertainty plus non-relevance guardrails.
5. Follow the source-defined scorer through dataset, feature set, run, and evidence manifest.
6. Open Delivery and connect the measured HTTP percentiles to the exact benchmark method.
7. Show the backtest JSON and rerun the evidence validation.

## Design and engineering record

- [75-page engineering plan](docs/ENGINEERING_PLAN.md)
- [Page-stable PDF edition](output/pdf/Benchline_75_Page_Engineering_Plan.pdf)
- [System architecture](docs/ARCHITECTURE.md)
- [Data card](docs/DATA_CARD.md)
- [Model card](docs/MODEL_CARD.md)
- [Plan traceability](docs/TRACEABILITY.md)
- [Security policy](SECURITY.md)
- [Credibility audit](docs/CREDIBILITY_AUDIT.md)

## Validation

```bash
npm run validate
npm audit --omit=dev
npm run loadtest
```

The UI does not require an API key, cloud account, or proprietary dataset. Release state is deliberately process-local and resets on restart; the interface labels that limitation. Optional distributed substitutions are documented in the engineering plan rather than made mandatory for reviewers.

## Licence

MIT. See [LICENSE](LICENSE).
