# Plan-to-code traceability

| Plan area                           | Implementation                            | Proof                             | Status                             |
| ----------------------------------- | ----------------------------------------- | --------------------------------- | ---------------------------------- |
| Events and catalogue                | `server/data.ts`, `ml/backtest.py`        | numerical tests, data card        | Implemented                        |
| Candidate retrieval and blending    | `server/recommender.ts`                   | deterministic contract tests      | Implemented                        |
| Learned ranking analogue            | `server/recommender.ts`, `ml/backtest.py` | temporal backtest                 | Implemented with documented scope  |
| Policy re-ranking                   | `server/recommender.ts`                   | movement/provenance test          | Implemented                        |
| Recommendation API                  | `server/index.ts`, `shared/contracts.ts`  | build and contract tests          | Implemented                        |
| Command Center                      | `src/App.tsx`                             | component and browser QA          | Implemented                        |
| Recommendation Explorer             | `src/App.tsx`                             | live API walkthrough              | Implemented                        |
| Experiments                         | `src/App.tsx`, `evidence/backtest.json`   | evidence validator                | Implemented                        |
| Registry and release UX             | `src/App.tsx`                             | gated promotion interaction       | Implemented as local control state |
| Feature Health                      | `src/App.tsx`                             | responsive browser QA             | Implemented with seeded telemetry  |
| Delivery and traces                 | `src/App.tsx`, `scripts/load-test.ts`     | measured local load result        | Implemented                        |
| Bootstrap uncertainty               | `ml/backtest.py`                          | 1,000 deterministic resamples     | Implemented                        |
| Accessibility and responsive design | `src/styles.css`, `tests/app.test.tsx`    | keyboard/component/browser checks | Implemented                        |
| Distributed feature store and ANN   | architecture ports in 75-page plan        | migration design                  | Deferred production substitution   |
| OIDC and durable registry           | architecture contract in 75-page plan     | security design                   | Deferred production substitution   |

The release is honest about the final two substitutions: they are not represented as enabled product capabilities.
