#!/usr/bin/env python3
"""Deterministic temporal recommender backtest used by RankForge evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import platform
import random
import statistics
import time
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from datetime import date
from pathlib import Path

SEED = 240926
TOPICS = ["data-engineering", "machine-learning", "data-science", "mlops", "backend", "product-analytics", "security", "systems"]
N_USERS = 720
N_ITEMS = 120
TRAIN_EVENTS_PER_USER = 44
TEST_POSITIVES_PER_USER = 4
K = 10


@dataclass(frozen=True)
class Item:
    id: int
    topic: int
    creator: int
    quality: float
    popularity: float
    freshness: float


def dcg(recommended: list[int], relevant: set[int], k: int = K) -> float:
    return sum((1.0 / math.log2(rank + 2)) for rank, item in enumerate(recommended[:k]) if item in relevant)


def ndcg(recommended: list[int], relevant: set[int], k: int = K) -> float:
    ideal = sum(1.0 / math.log2(rank + 2) for rank in range(min(len(relevant), k)))
    return dcg(recommended, relevant, k) / ideal if ideal else 0.0


def recall(recommended: list[int], relevant: set[int], k: int = K) -> float:
    return len(set(recommended[:k]) & relevant) / len(relevant) if relevant else 0.0


def creator_gini(recommendations: list[list[int]], items: list[Item]) -> float:
    counts = Counter(items[item].creator for row in recommendations for item in row[:K])
    values = sorted(counts.get(i, 0) for i in range(24))
    total = sum(values)
    if not total:
        return 0.0
    weighted = sum((index + 1) * value for index, value in enumerate(values))
    return (2 * weighted) / (len(values) * total) - (len(values) + 1) / len(values)


def build_world(rng: random.Random):
    items = [Item(i, i % len(TOPICS), i % 24, rng.uniform(.68, 1), rng.betavariate(2.2, 4.0), rng.random()) for i in range(N_ITEMS)]
    users = []
    for user_id in range(N_USERS):
        primary = rng.randrange(len(TOPICS))
        secondary = (primary + rng.randrange(1, len(TOPICS))) % len(TOPICS)
        preferences = [rng.uniform(.02, .12) for _ in TOPICS]
        preferences[primary] = rng.uniform(.82, 1)
        preferences[secondary] = rng.uniform(.46, .7)
        users.append((user_id, preferences))
    return items, users


def weighted_choice(rng: random.Random, items: list[Item], preferences: list[float], novelty: float = 0.0) -> int:
    weights = []
    for item in items:
        score = preferences[item.topic] * .69 + item.quality * .18 + item.popularity * .10 + item.freshness * novelty * .03
        weights.append(max(score, .001) ** 3.6)
    return rng.choices(range(len(items)), weights=weights, k=1)[0]


def generate_dataset():
    rng = random.Random(SEED)
    items, users = build_world(rng)
    train: dict[int, list[int]] = defaultdict(list)
    test: dict[int, set[int]] = defaultdict(set)
    for user_id, preferences in users:
        seen = set()
        for _ in range(TRAIN_EVENTS_PER_USER):
            item_id = weighted_choice(rng, items, preferences, novelty=.2)
            train[user_id].append(item_id)
            seen.add(item_id)
        attempts = 0
        while len(test[user_id]) < TEST_POSITIVES_PER_USER and attempts < 500:
            item_id = weighted_choice(rng, items, preferences, novelty=.7)
            if item_id not in seen:
                test[user_id].add(item_id)
            attempts += 1
    return items, users, train, test


def popularity_ranking(items: list[Item], train: dict[int, list[int]]) -> list[int]:
    counts = Counter(item for rows in train.values() for item in rows)
    return sorted(range(len(items)), key=lambda item: (counts[item], items[item].quality), reverse=True)


def contextual_popularity_ranking(user_id: int, items: list[Item], train: dict[int, list[int]]) -> list[int]:
    """A credible production baseline: dominant user topic plus global momentum."""
    global_counts = Counter(item for rows in train.values() for item in rows)
    max_pop = max(global_counts.values())
    topic_counts = Counter(items[item].topic for item in train[user_id])
    primary_topic = topic_counts.most_common(1)[0][0]
    seen = set(train[user_id])
    return sorted(
        range(len(items)),
        key=lambda item: (
            .46 * (items[item].topic == primary_topic)
            + .27 * global_counts[item] / max_pop
            + .20 * items[item].quality
            + .07 * items[item].freshness
            - .08 * (item in seen)
        ),
        reverse=True,
    )


def hybrid_ranking(user_id: int, items: list[Item], train: dict[int, list[int]]) -> list[int]:
    interactions = Counter(train[user_id])
    topic_counts = Counter(items[item].topic for item in train[user_id])
    max_topic = max(topic_counts.values())
    primary_topic = topic_counts.most_common(1)[0][0]
    global_counts = Counter(item for rows in train.values() for item in rows)
    max_pop = max(global_counts.values())
    seen = set(interactions)
    scored = []
    for item in items:
        affinity = topic_counts[item.topic] / max_topic
        popularity = global_counts[item.id] / max_pop
        novelty = 1.0 - item.popularity
        score = .40 * (item.topic == primary_topic) + .13 * affinity + .23 * popularity + .17 * item.quality + .04 * item.freshness + .03 * novelty
        if item.id in seen:
            score -= .18
        scored.append((score, item.id))
    base = [item for _, item in sorted(scored, reverse=True)]
    # Greedy creator-aware rerank mirrors the serving policy.
    output, creator_count = [], Counter()
    pool = base[:35]
    while pool:
        best = max(pool, key=lambda item: scored_lookup(scored, item) - creator_count[items[item].creator] * .055)
        output.append(best)
        creator_count[items[best].creator] += 1
        pool.remove(best)
    return output + base[35:]


def scored_lookup(scored: list[tuple[float, int]], item_id: int) -> float:
    return next(score for score, item in scored if item == item_id)


def evaluate(rankings: dict[int, list[int]], test: dict[int, set[int]], items: list[Item]):
    users = sorted(test)
    ndcgs = [ndcg(rankings[user], test[user]) for user in users]
    recalls = [recall(rankings[user], test[user]) for user in users]
    coverage = len({item for row in rankings.values() for item in row[:K]}) / len(items)
    diversity = statistics.mean(len({items[item].topic for item in rankings[user][:K]}) / min(K, len(TOPICS)) for user in users)
    return {"ndcg_at_10": statistics.mean(ndcgs), "recall_at_10": statistics.mean(recalls), "catalogue_coverage": coverage, "topic_diversity": diversity, "creator_gini": creator_gini(list(rankings.values()), items)}, ndcgs


def bootstrap_delta(challenger: list[float], baseline: list[float], n: int = 1000):
    rng = random.Random(SEED + 1)
    deltas = []
    for _ in range(n):
        sample = [rng.randrange(len(challenger)) for _ in challenger]
        deltas.append(statistics.mean(challenger[i] - baseline[i] for i in sample))
    deltas.sort()
    return {"resamples": n, "unit": "user", "absolute_delta": statistics.mean(challenger) - statistics.mean(baseline), "ci_95_low": deltas[int(.025 * n)], "ci_95_high": deltas[int(.975 * n)]}


def main(output: Path):
    started = time.perf_counter()
    items, users, train, test = generate_dataset()
    baseline_rankings = {user_id: contextual_popularity_ranking(user_id, items, train) for user_id, _ in users}
    hybrid_rankings = {user_id: hybrid_ranking(user_id, items, train) for user_id, _ in users}
    baseline, baseline_rows = evaluate(baseline_rankings, test, items)
    challenger, challenger_rows = evaluate(hybrid_rankings, test, items)
    interval = bootstrap_delta(challenger_rows, baseline_rows)
    uplift = (challenger["ndcg_at_10"] / baseline["ndcg_at_10"] - 1) * 100
    dataset_manifest = {"seed": SEED, "users": N_USERS, "items": N_ITEMS, "train_events": sum(map(len, train.values())), "test_positives": sum(map(len, test.values())), "split":"temporal holdout", "topics":TOPICS}
    dataset_hash = hashlib.sha256(json.dumps(dataset_manifest, sort_keys=True).encode()).hexdigest()
    result = {
        "title":"RankForge primary offline backtest",
        "generated_on":str(date.today()),
        "methodology":{"primary_metric":"NDCG@10", "baseline":"contextual popularity", "challenger":"hybrid affinity + quality + policy rerank", "bootstrap":interval, "claim_scope":"Synthetic learning marketplace; offline association, not causal uplift."},
        "dataset":{**dataset_manifest, "manifest_sha256":dataset_hash},
        "baseline":baseline,
        "challenger":challenger,
        "headline":{"ndcg_uplift_percent":uplift, "coverage_change_points":(challenger["catalogue_coverage"]-baseline["catalogue_coverage"])*100, "interval_excludes_zero":interval["ci_95_low"]>0},
        "runtime":{"seconds":time.perf_counter()-started, "python":platform.python_version(), "platform":platform.platform()},
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2)+"\n")
    print(json.dumps(result["headline"], indent=2))


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",type=Path,required=True)
    main(parser.parse_args().output)
