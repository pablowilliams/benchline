# ADR 0001: explicit three-stage ranking

Status: accepted

Benchline separates candidate generation, scoring and policy-aware re-ranking. This keeps retrieval recall, predicted relevance and product constraints independently measurable. A single opaque score was rejected because it would make diversity and eligibility changes difficult to audit in Explorer.
