# Credibility audit

Date: 4 September 2026

This audit reconciles the public interface, API behaviour, committed evidence, and documentation. It is intentionally direct: a portfolio system is only useful when a reviewer can distinguish implemented behaviour from design intent and synthetic evidence from production evidence.

## Findings and corrections

| Finding                                                                                         | Risk                                                             | Correction                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The previous load script added 34–43 ms to every in-process sample.                             | Published latency was manufactured.                              | Replaced with 5,000 loopback HTTP requests at concurrency 25 through Fastify, validation, ranking, policy, and serialization. UI values now load from `evidence/loadtest.json`.                    |
| Recommendation IDs were deterministic hashes of request bodies.                                 | Separate requests shared a correlation ID.                       | Each API request now uses Fastify's unique request ID; direct calls receive a UUID. Ordering remains deterministic.                                                                                |
| Promotion only changed React state.                                                             | The control-plane claim did not match the implementation.        | Added server-side promotion and rollback, optimistic concurrency, idempotency keys, release-note validation, and audit events. State is explicitly labelled process-local.                         |
| The registry called the scorer LambdaMART.                                                      | The displayed model family overstated the implementation.        | Renamed it to “hybrid linear scorer” everywhere.                                                                                                                                                   |
| Workspace metrics were duplicated as literals.                                                  | Evidence and product copy could drift.                           | The workspace endpoint now reads committed backtest and load-test artifacts.                                                                                                                       |
| The UI showed invented 30-day availability, production-region, trace, and weekly-cohort claims. | A reviewer could mistake scenario copy for observations.         | Removed the claims or replaced them with benchmark method, synthetic-scenario, and in-memory-state labels.                                                                                         |
| Several prominent controls had no effect.                                                       | The interface looked complete but failed under review.           | Evidence export, metric documentation, release-gate navigation, raw-response copy, lineage jump, promotion, and rollback now perform concrete actions. The inert notification control was removed. |
| Browser navigation had no URL state.                                                            | Pages could not be linked or refreshed reliably.                 | Added hash-based deep links for all six workbench views.                                                                                                                                           |
| External Google Fonts required a relaxed content security policy.                               | Offline rendering and CSP were weaker than necessary.            | Removed the external font request and restored Helmet's default CSP.                                                                                                                               |
| Importing the server could start a listener.                                                    | Tests and benchmarks could create a second process unexpectedly. | Server startup now occurs only when `server/index.ts` is the entry point.                                                                                                                          |

## Remaining boundaries

- The dataset and operational scenarios are synthetic.
- Offline uplift is associative evidence, not a causal business result.
- The HTTP benchmark is a single local-machine run, not a production capacity study.
- Release state is in memory and resets with the process; a production design would use a transactional database and external deployment controller.
- Feature-health and historical release records are fixtures used to demonstrate operator workflows.

These boundaries are visible in the product and README, not hidden in fine print.
