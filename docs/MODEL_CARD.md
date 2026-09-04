# Model card: hybrid policy ranker 2.4.0

## Intended use

Rank learning products for an eligible user and surface after candidate generation. The model analogue combines inferred topic affinity, global momentum, item quality, freshness and novelty, followed by a creator-aware re-ranking policy.

## Evaluation

The locked temporal backtest uses NDCG@10 as the primary metric and contextual popularity as the baseline. The committed run produced:

| Metric             | Baseline | Challenger |
| ------------------ | -------: | ---------: |
| NDCG@10            |   0.2443 |     0.3103 |
| Recall@10          |   0.2455 |     0.2521 |
| Catalogue coverage |    98.3% |     100.0% |
| Creator Gini       |   0.1358 |     0.0943 |

The paired absolute NDCG delta is `+0.0660`; its user-level 95% bootstrap interval is `[+0.0594, +0.0732]` across 1,000 resamples.

## Serving requirements

- Catalogue eligibility and user profile inputs compatible with the shared contract.
- Feature set `learning-v7` in the full production design.
- Policy configuration `balanced-v3`.
- Bounded CPU inference; p95 target below 60 ms.

## Limitations

This repository implements the hybrid linear scorer it describes; it does not claim to train or serialize a tree-based learning-to-rank model. The synthetic evaluation favours well-estimated topic affinity and does not establish causal impact. Sensitive traits are neither generated nor used.

## Rollback conditions

Roll back on contract mismatch, artifact hash failure, sustained p95 above budget, incomplete slates, material creator-concentration regression, or offline/online ranking skew outside tolerance.
