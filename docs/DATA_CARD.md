# Data card: synthetic learning marketplace v1

## Purpose

The dataset exists to test recommendation retrieval, ranking, re-ranking and evaluation workflows without collecting personal or scraped behavioural data.

## Contents

- 720 synthetic users with primary and secondary topic preferences.
- 120 synthetic learning items across eight topics and 24 creators.
- 31,680 generated training interactions.
- 2,880 held-out positive interactions in a later temporal window.
- Item quality, popularity and freshness variables with declared generation ranges.

## Generation

`ml/backtest.py` uses seed `240926`. User actions are sampled from a preference-weighted distribution with quality, popularity and freshness contributions. Held-out positives exclude items already seen in training. The committed manifest hash is written into `evidence/backtest.json`.

## Intended uses

- Reproducible recommender evaluation examples.
- Ranking metric and bootstrap validation.
- User, item, creator and temporal pipeline tests.
- Demonstration of honest evidence presentation.

## Prohibited interpretations

The dataset does not represent actual learners, commercial demand, protected groups, real conversion, or causal treatment response. Results must not be generalized to a live marketplace.

## Known limitations

Generated preferences are simpler than human behaviour. Exposure and position effects are only partially modelled. Topic labels are clean, identity is stable, item text is not used, and creator integrity events are not represented in the primary backtest.
