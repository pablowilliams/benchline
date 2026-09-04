# Benchline: 75-page engineering plan

Recommendation evaluation and release workbench. Engineering plan / Edition 1, 04 September 2026.

> The PDF is the signed page-stable edition. This Markdown source is provided for search, review, and pull-request discussion.

## 01. The operating brief

**Section:** Opening

Benchline is an engineering workbench, not a dashboard wrapped around a notebook. It shows how ambiguous product goals become a recommendation system that product, data, and operations teams can inspect and control.

### Decisions

- Use a fictional learning marketplace so relevance, diversity, freshness, and commercial value can be discussed without copying a consumer brand.
- Build the thin production path end to end before adding sophistication: events to features to candidates to ranking to evidence.
- Treat every displayed number as derived, reproducible, or explicitly labelled simulated.

### Delivery contract

- A public repository with one-command setup, seeded data, architecture records, tests, and a polished operator application.
- A deterministic benchmark pack that can be regenerated on an ordinary laptop.

### Acceptance evidence

- A reviewer can run the stack, request recommendations, inspect why they were chosen, and reproduce the headline metrics.
- No dead navigation, placeholder copy, fabricated customers, or unsupported scale claims.

## 02. How to read this plan

**Section:** Opening

The plan is arranged as a build contract. Product intent comes first, system and experience design follow, and the final third defines proof. Page numbers are stable so pull requests and interview notes can cite a decision precisely.

### Decisions

- Decision statements use imperative language and are binding for the first public release.
- Delivery items describe repository artifacts, not future intentions.
- Evidence items define the test or observable result required for acceptance.

### Delivery contract

- Maintain a traceability matrix linking plan pages to code, tests, screenshots, benchmark files, and architecture decisions.
- Record deliberate deviations in an ADR rather than silently changing scope.

### Acceptance evidence

- Every P0 capability has at least one automated check and one visible product path.
- The final audit reports implemented, partially implemented, and deferred items without marketing language.

## 03. Executive summary

**Section:** Strategy

Most portfolio recommenders stop at model training. Benchline focuses on the expensive part: operating a multi-stage ranking product safely. It combines realistic offline evaluation with a control plane for exploration, comparison, release, and diagnosis.

### Decisions

- Optimize for demonstrable engineering judgment over infrastructure theatre.
- Use a three-stage pipeline: candidate retrieval, learned ranking, and constraint-aware re-ranking.
- Expose model quality, system performance, and product guardrails in the same release decision.

### Delivery contract

- Six coherent surfaces: Command Center, Explorer, Experiments, Registry, Feature Health, and Delivery.
- A typed recommendation API and a Python evaluation package sharing versioned contracts.

### Acceptance evidence

- The challenger must beat a popularity baseline on NDCG@10 with a bootstrap interval reported.
- The serving path must publish measured p50 and p95 latency from a repeatable local load test.

## 04. The product opportunity

**Section:** Strategy

Recommendation teams often split context across notebooks, registry screens, orchestration logs, and BI tools. Benchline compresses the release conversation into a single evidence chain while preserving links to underlying artifacts.

### Decisions

- Design for a small platform team supporting multiple product surfaces.
- Make offline-to-online mismatch and exposure bias first-class risks.
- Prefer decisions and exceptions over charts that merely report activity.

### Delivery contract

- A release gate that joins quality, safety, freshness, and latency checks.
- An investigation path from a metric regression to cohort, feature, model, and request evidence.

### Acceptance evidence

- A reviewer can answer ‘why is this model safe to promote?’ without reading source code.
- Failure states show an owner, consequence, and next action.

## 05. Primary users

**Section:** Strategy

The application serves four users with different questions: the ML engineer improving relevance, the data engineer protecting features, the product analyst assessing impact, and the release owner controlling production risk.

### Decisions

- Default the interface to the release owner’s current decision, then allow technical drill-down.
- Use shared vocabulary across pages: surface, cohort, model, run, gate, and evidence.
- Avoid persona theatre; each user is represented by a concrete workflow.

### Delivery contract

- Role-oriented shortcuts and context-preserving navigation.
- Read access for all seeded roles; promotion and rollback controls visibly permissioned.

### Acceptance evidence

- Each primary workflow completes in under five deliberate interactions after landing.
- Terminology is defined in product copy and the glossary rather than assumed.

## 06. Jobs to be done

**Section:** Strategy

Benchline is useful when a team needs to understand recommendation behaviour, compare a challenger, approve a release, or investigate a quality regression. These jobs define the navigation and the API boundaries.

### Decisions

- Make ‘explain this slate’ the core Explorer job.
- Make ‘compare against the champion’ the core Experiments job.
- Make ‘promote with evidence’ the core Registry job.

### Delivery contract

- Saved cohorts, reproducible request snapshots, experiment comparisons, and signed release records.
- Deep links preserve user, surface, model, and run context.

### Acceptance evidence

- No workflow depends on hidden hover states.
- A fresh reviewer can identify the next action from each page header.

## 07. Product principles

**Section:** Strategy

The product should feel like a tool built by people who operate ranking systems. Calm density, explicit provenance, conservative defaults, and sharp exception handling matter more than decorative animation.

### Decisions

- Evidence before confidence: always show the source, window, and model version behind a metric.
- Progressive disclosure: summaries lead to inspectable rows, then raw evidence.
- Reversible operations: promotions use staged gates and rollback remains adjacent.

### Delivery contract

- A visual system based on ink, warm neutral surfaces, cobalt actions, and signal colours reserved for state.
- Plain-language empty, loading, stale, partial, and failure states.

### Acceptance evidence

- Colour is never the sole carrier of status.
- Motion is restrained and disabled under reduced-motion preferences.

## 08. Success framework

**Section:** Strategy

Success spans ranking quality, catalogue health, serving performance, and operating confidence. A single relevance number cannot justify a production release.

### Decisions

- Primary quality metric: NDCG@10 on a temporal holdout.
- Guardrails: coverage, long-tail exposure, creator concentration, freshness, error rate, and p95 latency.
- Operational metric: time required to explain and safely reverse a release.

### Delivery contract

- Metric definitions include numerator, denominator, exclusions, window, owner, and failure action.
- A release scorecard records values, thresholds, comparison direction, and provenance.

### Acceptance evidence

- All headline metrics are computed by tested functions.
- No percentage is shown without its comparison population or time window.

## 09. Scope and non-goals

**Section:** Strategy

Version one proves the control plane and evaluation discipline on a laptop. It does not pretend to operate internet-scale infrastructure or train a billion-parameter model.

### Decisions

- Include deterministic synthetic marketplace data, baselines, hybrid retrieval, an interpretable scorer, policy re-ranking, and a measured API.
- Model distributed components through explicit interfaces and deployment manifests.
- Exclude payment flows, real identity data, GPU training, and claims of live customer traffic.

### Delivery contract

- A production-shaped monorepo with replaceable local adapters.
- Clear seams for Kafka, warehouse, feature store, vector index, registry, and observability backends.

### Acceptance evidence

- The README states what is real, simulated, and designed for replacement.
- Deferred capabilities appear in the roadmap, never as enabled UI controls.

## 10. Assumptions and constraints

**Section:** Strategy

The build must be impressive on a recruiter’s laptop: no cloud account, proprietary data, or API key should be required for the primary demo. Determinism and bounded dependencies are therefore architectural requirements.

### Decisions

- Seed all randomness and version generated data.
- Keep the default dataset small enough for CI while preserving user, item, time, and exposure structure.
- Make optional infrastructure additive rather than mandatory.

### Delivery contract

- Documented hardware envelope, setup time, and supported runtime versions.
- Graceful fallback when Redis, Kafka, or external telemetry are absent.

### Acceptance evidence

- Cold clone to working demo in under ten minutes on a supported machine.
- Repeated benchmark runs remain within a documented tolerance.

## 11. System context

**Section:** Architecture

Benchline sits between behavioural data producers, offline data systems, model development, and product serving. The web application is an operating surface over these contracts, not the system of record for raw events.

### Decisions

- Separate control-plane state from data-plane inference.
- Treat model artifacts and feature definitions as versioned inputs.
- Represent external systems with ports so local adapters and production adapters share contracts.

### Delivery contract

- A C4 context diagram and a repository-level dependency map.
- Interfaces for event source, offline store, online store, model registry, and telemetry sink.

### Acceptance evidence

- Dependency direction is enforced by tests or lint rules.
- The serving package does not import UI or orchestration modules.

## 12. Reference architecture

**Section:** Architecture

The reference path ingests events, materializes features, builds retrieval indexes, trains and evaluates models, registers candidates, and serves ranked slates through a version-aware API.

### Decisions

- Keep the request path synchronous and bounded; move training, indexing, and reporting off path.
- Load immutable model bundles by alias and retain the previous champion for rollback.
- Attach request, feature-set, candidate-set, and model identifiers to every trace.

### Delivery contract

- Architecture diagram covering batch, stream, control, and serving paths.
- Local compose topology and production-oriented Kubernetes manifests.

### Acceptance evidence

- A contract test follows one event into features and one request through a ranked response.
- A rollback test proves the previous bundle can be restored without rebuilding.

## 13. Bounded contexts

**Section:** Architecture

The monorepo is divided by responsibility: contracts, data generation, features, retrieval, ranking, evaluation, serving, control plane, and web experience. Ownership should be visible from paths and APIs.

### Decisions

- Use shared schema packages only for stable cross-boundary types.
- Keep numerical evaluation code independent of the web framework.
- Do not build a generic platform abstraction before two concrete implementations require it.

### Delivery contract

- Top-level directories with READMEs explaining purpose and allowed dependencies.
- Architecture tests for forbidden imports and schema drift.

### Acceptance evidence

- A new engineer can locate the owner of an endpoint or metric without repository archaeology.
- Circular package dependencies fail CI.

## 14. Behavioural event ingestion

**Section:** Data

Events are the raw material of both features and evaluation. A recommendation impression must be distinguishable from a click, completion, save, and purchase, with enough context to reconstruct exposure.

### Decisions

- Adopt an append-only event envelope with event_id, occurred_at, received_at, actor, session, surface, and schema_version.
- Make impressions first-class and attach slate position and model metadata.
- Reject impossible timestamps and quarantine unknown schema versions.

### Delivery contract

- JSON Schema contracts, fixtures, validation code, and a dead-letter example.
- A deterministic event generator with realistic sessions and delayed feedback.

### Acceptance evidence

- Duplicate event IDs are idempotent.
- Contract tests cover valid, late, duplicate, malformed, and forward-version events.

## 15. Identity and session stitching

**Section:** Data

Ranking features need stable entities without leaking personal identity. The demo uses synthetic opaque identifiers and a documented merge policy for anonymous and signed-in sessions.

### Decisions

- Never store names, emails, or device fingerprints.
- Use an append-only identity link with effective timestamps.
- Prevent future identity merges from rewriting historical training examples.

### Delivery contract

- Synthetic user, anonymous actor, session, and consent-state tables.
- A point-in-time stitching function with test vectors.

### Acceptance evidence

- Historical examples remain unchanged after a later merge.
- Opt-out events remove the actor from future feature materialization.

## 16. Catalogue and taxonomy

**Section:** Data

The fictional catalogue contains learning products with topic, level, duration, format, price, quality, freshness, and creator attributes. These fields support meaningful relevance and policy trade-offs.

### Decisions

- Use a controlled hierarchical taxonomy with stable IDs.
- Separate editorial quality from behavioural popularity.
- Version availability and price so historical evaluation sees the correct state.

### Delivery contract

- Catalogue schema, seed generator, taxonomy file, and slowly changing history.
- Validation for orphaned categories, invalid prices, unavailable items, and duplicate slugs.

### Acceptance evidence

- Every recommended item is eligible at request time.
- The catalogue generator produces a documented distribution, not uniform noise.

## 17. Offline feature store

**Section:** Data

Offline features support reproducible training and analysis. Every feature value carries entity keys, event timestamp, creation timestamp, and feature-view version.

### Decisions

- Store columnar snapshots locally and define a warehouse adapter contract.
- Partition by event date without encoding business logic in paths.
- Treat feature definitions as code reviewed alongside tests.

### Delivery contract

- User affinity, item quality, popularity, novelty, price sensitivity, and cross features.
- A feature catalogue describing owners, freshness, null policy, and leakage risk.

### Acceptance evidence

- Rebuilding a snapshot from the same inputs yields identical hashes.
- Null, range, uniqueness, and freshness expectations run before training.

## 18. Online feature access

**Section:** Data

Serving requires a small, bounded set of fresh features. The local implementation uses an in-process cache adapter while keeping key and freshness semantics compatible with Redis.

### Decisions

- Fetch features in bulk by entity and version.
- Return freshness metadata and distinguish missing from zero.
- Enforce a strict deadline with a documented fallback feature vector.

### Delivery contract

- OnlineStore protocol, memory adapter, optional Redis adapter, and metrics.
- Warm-up and cache invalidation hooks tied to feature-set releases.

### Acceptance evidence

- Missing features trigger fallback without a 500 response.
- Feature retrieval time appears separately in request traces.

## 19. Point-in-time training joins

**Section:** Data

Training rows may use only information available before the prediction timestamp. Point-in-time correctness is essential because popularity, price, availability, and user affinity all change.

### Decisions

- Use as-of joins by entity and event timestamp.
- Apply a feature availability delay where ingestion latency matters.
- Fail closed when a feature lacks temporal semantics.

### Delivery contract

- A reusable point-in-time join module and leakage test dataset.
- Documentation showing a naive join failure beside the correct result.

### Acceptance evidence

- A deliberately planted future value never appears in historical features.
- Training manifests record source and feature snapshot hashes.

## 20. Popularity baseline

**Section:** Models

A credible evaluation begins with simple baselines. Popularity by surface and recent window provides an interpretable floor and a robust fallback when personalization signals are unavailable.

### Decisions

- Compute decayed engagement from impressions, clicks, saves, and completions.
- Exclude future and ineligible interactions.
- Maintain global and taxonomy-conditioned variants.

### Delivery contract

- A deterministic baseline model with serialized parameters.
- Baseline metrics by overall population, cold users, and sparse categories.

### Acceptance evidence

- The baseline is reproducible and served through the same model interface.
- Every learned model comparison names its exact baseline version.

## 21. Collaborative retrieval

**Section:** Models

Implicit-feedback matrix factorization provides a strong, inspectable retrieval baseline without requiring GPU infrastructure. Confidence weights reflect action strength and recency.

### Decisions

- Train on exposure-aware implicit feedback.
- Tune factors and regularization using a temporal validation window.
- Filter previously completed and currently unavailable items after retrieval.

### Delivery contract

- A lightweight matrix-factorization implementation or pinned library wrapper.
- Saved user and item factors plus training metadata.

### Acceptance evidence

- Recall@100 and catalogue coverage beat the popularity candidate set for warm users.
- Unknown users fall back predictably.

## 22. Two-tower retrieval design

**Section:** Models

The advanced retrieval path maps users and items into a shared embedding space. It demonstrates architecture and evaluation discipline without overstating production scale.

### Decisions

- Use categorical embeddings and compact numerical towers.
- Train with sampled negatives drawn from exposed but unengaged items plus hard category negatives.
- Normalize vectors and score by dot product.

### Delivery contract

- A PyTorch design specification, training CLI contract, and optional implementation milestone.
- Exported item embeddings with schema and model fingerprints.

### Acceptance evidence

- Retrieval metrics are compared at equal candidate budgets.
- The public demo remains functional if the optional neural model is not trained.

## 23. Candidate index

**Section:** Models

The candidate index turns item vectors into bounded retrieval. The default adapter uses exact search for deterministic CI; an approximate-nearest-neighbour port documents production substitution.

### Decisions

- Version indexes independently but require model compatibility metadata.
- Build indexes offline and swap atomically.
- Over-fetch before eligibility and diversity filters.

### Delivery contract

- Exact cosine index, manifest format, health check, and ANN adapter interface.
- Index build and query benchmarks.

### Acceptance evidence

- A mismatched model/index fingerprint fails startup.
- Recall against exact search is measurable for future ANN adapters.

## 24. Candidate blending

**Section:** Models

No single retriever handles warm users, exploration, trends, and cold start. Candidate blending combines collaborative, content, popular, and fresh pools before ranking.

### Decisions

- Record source and source rank for every candidate.
- Allocate per-source budgets by request context.
- Deduplicate by item ID while retaining all provenance.

### Delivery contract

- Configurable blend policy and diagnostic contribution report.
- A candidate-set snapshot available from Explorer.

### Acceptance evidence

- The final set reaches its requested size when eligible catalogue supply allows.
- Source starvation and dominance are surfaced as diagnostics.

## 25. Learning-to-rank model

**Section:** Models

The ranker estimates engagement utility from user, item, context, and retrieval features. Gradient-boosted trees provide strong tabular performance, explainability, and fast CPU inference.

### Decisions

- Train a pairwise or list-aware objective where library support is stable.
- Group examples by request or session to preserve ranking structure.
- Calibrate scores only when an interface requires probability semantics.

### Delivery contract

- Feature matrix builder, model wrapper, feature manifest, and training report.
- Global and per-request explanation contributions.

### Acceptance evidence

- Model serialization is deterministic within pinned versions.
- No feature used in training is absent or semantically different at serving.

## 26. Policy-aware re-ranking

**Section:** Models

The final slate balances predicted utility with diversity, freshness, creator concentration, and business eligibility. Policy is explicit so product choices are not hidden inside model weights.

### Decisions

- Apply hard eligibility filters before soft objectives.
- Use a greedy maximal-marginal-relevance style objective with configurable weights.
- Record every position change and the policy responsible.

### Delivery contract

- Re-ranker module, policy configuration schema, and counterfactual slate view.
- Constraint tests for category repetition, creator caps, and freshness floors.

### Acceptance evidence

- Every output item has a traceable pre-rank and post-rank position.
- Impossible constraints return a degraded-but-valid slate with warnings.

## 27. Cold-start strategy

**Section:** Models

Cold start is not one case. New users, new items, anonymous sessions, sparse categories, and empty contexts need distinct behaviours that remain useful and honest.

### Decisions

- Classify cold-start state explicitly in the request context.
- Blend editorial quality, contextual popularity, content similarity, and measured exploration.
- Protect new-item exposure with quality and eligibility thresholds.

### Delivery contract

- Cold-start decision table and seeded scenarios.
- Dedicated evaluation slices and Explorer labels.

### Acceptance evidence

- A brand-new user receives a diverse eligible slate.
- Cold-item exposure can be audited without lowering global safety constraints.

## 28. Feedback loops and bias

**Section:** Models

Logged interactions reflect what prior models exposed, not unrestricted preference. Benchline must state this limitation and reduce obvious bias in training and evaluation.

### Decisions

- Log propensities for simulated policies.
- Weight or stratify analyses by exposure where justified.
- Separate observed engagement from causal impact claims.

### Delivery contract

- Exposure diagnostics, position-bias chart, and methodology note.
- A simulation comparing naive and propensity-aware estimates.

### Acceptance evidence

- The UI never labels offline uplift as causal revenue impact.
- Known bias sources appear beside experiment conclusions.

## 29. Canonical data model

**Section:** Contracts

Stable entities anchor the product: users, sessions, items, creators, events, impressions, feature values, datasets, experiments, models, aliases, deployments, and release decisions.

### Decisions

- Use opaque string IDs with readable prefixes.
- Carry created_at and updated_at where mutation exists; use effective intervals for temporal state.
- Represent provenance through foreign keys and immutable hashes.

### Delivery contract

- Entity relationship diagram and SQL migrations.
- Seed fixtures that exercise every relationship.

### Acceptance evidence

- Foreign-key and uniqueness constraints are tested.
- Deleting control-plane records cannot orphan evidence.

## 30. Event contract

**Section:** Contracts

The event schema is a public boundary and receives stricter governance than internal tables. Producers can evolve additive fields while consumers reject ambiguous breaking changes.

### Decisions

- Version the envelope and payload independently only when needed.
- Use UTC ISO timestamps and validated enums.
- Include request_id and recommendation metadata on exposed actions.

### Delivery contract

- Machine-readable schemas, generated TypeScript/Python types, and compatibility tests.
- Examples for impression, click, save, completion, and purchase.

### Acceptance evidence

- Examples validate in both languages.
- A breaking fixture demonstrably fails compatibility CI.

## 31. Feature definitions

**Section:** Contracts

A feature is more than a column name. Each definition includes entity, dtype, computation, source, timestamp semantics, default, freshness target, owner, and leakage classification.

### Decisions

- Give feature sets semantic versions.
- Deprecate through dual-read windows rather than silent replacement.
- Allow request-time context features only through a separate namespace.

### Delivery contract

- Feature registry file and rendered catalogue in the UI.
- Validation and drift rules generated from definitions where practical.

### Acceptance evidence

- Training and serving fingerprints match before promotion.
- Unused, undocumented, or expired features fail a governance check.

## 32. API conventions

**Section:** Contracts

The HTTP API should read like a dependable internal platform: explicit versions, typed errors, idempotent mutations, request correlation, bounded pagination, and stable timestamps.

### Decisions

- Prefix public contracts with /api/v1.
- Use problem-details style errors with code, message, request_id, and safe details.
- Require idempotency keys for promotion and rollback operations.

### Delivery contract

- OpenAPI document, generated examples, and a small typed client.
- Consistent pagination and filtering vocabulary.

### Acceptance evidence

- Contract tests validate representative responses against schemas.
- Errors never expose stack traces or filesystem paths.

## 33. Recommendation endpoint

**Section:** Contracts

POST /api/v1/recommendations returns a ranked slate plus bounded evidence suitable for product rendering and operational debugging.

### Decisions

- Accept user, session, surface, limit, context, and optional model alias.
- Return item, rank, score, reason codes, policy adjustments, model version, feature version, and request ID.
- Keep deep feature contributions behind a debug permission.

### Delivery contract

- Serving handler with validation, deadlines, fallback, and trace spans.
- Golden requests covering warm, anonymous, cold, sparse, and degraded paths.

### Acceptance evidence

- The same request and bundle produce the same ordered result.
- Latency and fallback state are observable without leaking sensitive features.

## 34. Experiment endpoints

**Section:** Contracts

Experiment APIs expose immutable run metadata and computed evidence. The browser never calculates authoritative metrics from raw arrays.

### Decisions

- Separate experiment definition, execution, and result resources.
- Treat completed run metrics as immutable.
- Support comparisons only when evaluation protocol and dataset compatibility checks pass.

### Delivery contract

- List, detail, compare, and evidence-export endpoints.
- Typed filters for status, model family, dataset, owner, and date.

### Acceptance evidence

- Incompatible experiments return a clear reason instead of a misleading delta.
- Evidence export hashes match displayed run identifiers.

## 35. Registry and release endpoints

**Section:** Contracts

Model aliases are operational pointers. Promotion changes the champion only after gates pass and a release record captures who, what, why, and how to reverse it.

### Decisions

- Represent champion and challenger as aliases, not copied artifacts.
- Use compare-and-swap semantics to prevent concurrent promotion races.
- Require a human release note even in the demo.

### Delivery contract

- Registry list/detail, gate evaluation, promote, rollback, and audit endpoints.
- Immutable release decision and alias history tables.

### Acceptance evidence

- A stale expected champion version causes a conflict.
- Rollback restores the previous version and appends an audit event.

## 36. Authentication and authorization

**Section:** Security

The public demo uses a clearly labelled local identity, while the architecture supports external OIDC. Authorization is enforced in the service, not only by hidden buttons.

### Decisions

- Define viewer, analyst, release-manager, and administrator roles.
- Keep debug features and mutations permissioned.
- Use secure-by-default cookie and token guidance for deployed adapters.

### Delivery contract

- Policy module, route guards, UI capability map, and authorization tests.
- A demo identity switcher that never implies real enterprise SSO.

### Acceptance evidence

- Direct API calls cannot bypass role restrictions.
- Audit events record actor and decision for privileged operations.

## 37. Information architecture

**Section:** Experience

The interface is organised around operating decisions rather than technical layers. The sidebar names user jobs; secondary navigation appears only within a selected object.

### Decisions

- Command Center summarises current health and decisions.
- Explorer explains individual slates.
- Experiments, Registry, Feature Health, and Delivery own their respective operating workflows.

### Delivery contract

- Desktop sidebar, mobile drawer, command menu, breadcrumbs, and stable deep links.
- A route map documented beside the component hierarchy.

### Acceptance evidence

- All primary pages are reachable by keyboard.
- Refreshing a detail route preserves its state.

## 38. Command Center

**Section:** Experience

The landing page answers three questions: is serving healthy, is a release waiting, and where does attention belong. It avoids a collage of generic KPI cards.

### Decisions

- Lead with one operational sentence and the current champion.
- Group evidence into Quality, Delivery, and Data lanes.
- Use an attention queue ordered by consequence and recency.

### Delivery contract

- A measured request-volume/latency figure, quality trend, release-gate summary, and recent decisions.
- Contextual links into the exact failing cohort, feature, or deployment.

### Acceptance evidence

- Every warning names an owner and action.
- Healthy states remain compact so anomalies dominate attention.

## 39. Recommendation Explorer

**Section:** Experience

Explorer is the signature demo. It lets a reviewer choose a user archetype and surface, generate a slate, and inspect the chain from candidate sources through ranking and policy changes.

### Decisions

- Show results as a human-readable product slate, not a database table.
- Pair each result with concise reason codes and provenance.
- Provide before/after ordering and feature contributions on demand.

### Delivery contract

- Scenario presets, search, request controls, ranked cards, evidence drawer, and raw JSON copy.
- A compare mode for champion versus challenger.

### Acceptance evidence

- All displayed reasons derive from response fields.
- Empty and degraded scenarios remain explainable.

## 40. Experiments workspace

**Section:** Experience

Experiments turns model evaluation into a reviewable decision. It prioritises comparison validity, uncertainty, and slices over leaderboard theatre.

### Decisions

- Require a common protocol before showing direct deltas.
- Display confidence intervals beside point estimates.
- Keep guardrail regressions visible even when the primary metric improves.

### Delivery contract

- Run list, comparison canvas, metric definitions, slice table, and evidence export.
- An ablation view connecting feature groups to quality and latency.

### Acceptance evidence

- A reviewer can identify the winning model and its caveats in under one minute.
- Statistically uncertain changes are labelled inconclusive.

## 41. Model Registry

**Section:** Experience

Registry presents models as deployable bundles with lineage, not filenames. The release path is deliberate, reviewable, and reversible.

### Decisions

- Show alias, model family, dataset, feature set, code revision, metrics, and signature together.
- Keep promotion in a side panel with gates and release note.
- Place rollback history beside the active champion.

### Delivery contract

- Model inventory, bundle detail, lineage graph, gate evaluation, promotion dialog, and audit timeline.
- Permission and concurrency failure states.

### Acceptance evidence

- Promotion is impossible while a blocking gate fails.
- The visible champion always matches the serving alias returned by the API.

## 42. Feature Health

**Section:** Experience

Feature Health joins contract status, freshness, distribution shift, nulls, and training-serving consistency. It should help an engineer diagnose a model problem before retraining blindly.

### Decisions

- Organise by feature view and entity.
- Show freshness and quality expectations before distribution charts.
- Link incidents to affected models and surfaces.

### Delivery contract

- Health summary, feature table, drift detail, lineage, and ownership information.
- A point-in-time correctness check and materialisation run history.

### Acceptance evidence

- Stale and missing are visually and semantically distinct.
- A feature incident identifies blast radius and fallback behaviour.

## 43. Delivery

**Section:** Experience

Delivery shows whether the recommendation path is meeting its operational contract. It combines deployment history, SLOs, traces, and bounded logs without impersonating a full observability vendor.

### Decisions

- Anchor the page on service level objectives.
- Correlate deployments with latency and error changes.
- Sample request traces with redacted payloads.

### Delivery contract

- SLO scorecard, latency distribution, deployment timeline, trace waterfall, and structured log viewer.
- A rollback drill with recorded recovery time.

### Acceptance evidence

- Figures distinguish measured local evidence from illustrative production targets.
- Sensitive user and feature data never appears in logs.

## 44. Visual language

**Section:** Experience

Benchline should feel editorial and operational: warm off-white canvas, charcoal navigation, cobalt actions, compact typography, and diagrams that resemble engineering documents rather than neon AI concept art.

### Decisions

- Use a single sans family with tabular numerals and a restrained display weight.
- Reserve gradients for data encoding only, not page decoration.
- Use borders, spacing, and typography before shadows.

### Delivery contract

- Design tokens for colour, type, spacing, radius, elevation, motion, and chart palettes.
- A small icon set with consistent stroke weight.

### Acceptance evidence

- No glassmorphism, floating blobs, excessive pills, or rainbow status treatments.
- Screens remain legible when printed or viewed in grayscale.

## 45. Accessibility

**Section:** Experience

Accessibility is a release requirement. Dense technical software must remain navigable without a mouse, understandable without colour, and usable at enlarged text sizes.

### Decisions

- Target WCAG 2.2 AA for authored UI.
- Use native controls and semantic landmarks before ARIA.
- Provide focus return for dialogs and drawers.

### Delivery contract

- Skip link, logical headings, visible focus, labelled charts, live regions, and reduced motion.
- Automated axe checks plus keyboard walkthroughs.

### Acceptance evidence

- Zero serious automated accessibility violations on primary views.
- Command menu, filters, dialogs, tabs, and tables complete a keyboard test script.

## 46. Responsive behaviour

**Section:** Experience

The mobile layout is not a compressed desktop dashboard. It prioritises status, current decision, and essential controls while moving detail into drawers and stacked disclosures.

### Decisions

- Define intentional layouts at 390, 768, 1024, and 1440 pixels.
- Convert wide tables to labelled record cards or horizontal regions with explicit affordance.
- Keep primary actions reachable without covering content.

### Delivery contract

- Responsive navigation, chart resizing, card ordering, drawers, and touch targets.
- Visual regression references for one mobile and one desktop viewport.

### Acceptance evidence

- No horizontal document overflow at supported widths.
- Tap targets meet minimum size and sticky elements do not trap content.

## 47. Application states

**Section:** Experience

Credible software spends substantial time loading, empty, stale, partial, degraded, or failed. Each state should explain what remains trustworthy and what the user can do next.

### Decisions

- Use skeletons only when shape is predictable.
- Preserve last-known-good evidence with a stale marker when appropriate.
- Differentiate no data, filtered-out data, permission denial, and upstream failure.

### Delivery contract

- State matrix for every primary surface.
- Reusable inline notice, empty state, error boundary, and retry patterns.

### Acceptance evidence

- No uncaught promise rejection leaves a blank page.
- Errors include a safe request ID and recovery action.

## 48. Observability model

**Section:** Reliability

Observability follows a recommendation request across gateway, feature fetch, retrieval, ranking, re-ranking, and response serialization. Model and data versions are attributes, not inferred later.

### Decisions

- Adopt OpenTelemetry-compatible trace and metric names.
- Control label cardinality; never use user IDs as metric labels.
- Emit structured events for model fallback and policy degradation.

### Delivery contract

- Span map, metric catalogue, log schema, and local telemetry fixtures.
- A trace detail view driven by the same schema.

### Acceptance evidence

- One seeded request can be reconstructed across all stages.
- Telemetry tests reject prohibited high-cardinality or sensitive attributes.

## 49. Service-level objectives

**Section:** Reliability

SLOs translate infrastructure behaviour into product risk. The demo distinguishes target objectives from measured local performance and avoids fake uptime history.

### Decisions

- Define availability, latency, recommendation completeness, and freshness SLOs.
- Use percentile latency, not averages.
- Attach error-budget policy to risky releases.

### Delivery contract

- SLO catalogue with indicator, target, window, owner, and escalation.
- Local load-test evidence mapped to the same indicators.

### Acceptance evidence

- The UI labels targets, measurements, and simulations distinctly.
- A failing error budget blocks automatic promotion in the design.

## 50. Tracing and logging

**Section:** Reliability

Traces explain time and decisions; logs record bounded events. Neither should become an ungoverned copy of feature vectors or behavioural payloads.

### Decisions

- Sample healthy traces and retain all errors in the production design.
- Redact request context by allowlist.
- Log reason codes and fingerprints instead of raw sensitive values.

### Delivery contract

- Trace waterfall, structured logger, redaction tests, and example queries.
- Correlation IDs included in API responses and error bodies.

### Acceptance evidence

- A seeded slow-feature scenario attributes latency to the correct span.
- Secrets and synthetic user attributes are absent from captured logs.

## 51. Model and data drift

**Section:** Reliability

Drift is diagnostic evidence, not proof of model failure. Benchline tracks feature distribution changes, prediction shifts, catalogue mix, and realised quality when labels arrive.

### Decisions

- Use stable reference windows and minimum sample thresholds.
- Report effect size alongside alert thresholds.
- Separate covariate, prediction, and performance drift.

### Delivery contract

- PSI or Jensen-Shannon checks for selected features, score drift, and slice trends.
- Alert records linked to feature definitions and affected model bundles.

### Acceptance evidence

- Small samples remain ‘insufficient evidence’ rather than green.
- Synthetic drift fixtures trigger and clear expected alerts.

## 52. Threat model

**Section:** Security

The relevant threats include unauthorised promotion, model artifact substitution, poisoned events, enumeration, debug-data leakage, dependency compromise, and denial of service.

### Decisions

- Protect release mutations with authorization, idempotency, and audit trails.
- Verify artifact and dataset hashes before loading.
- Bound request size, limit, filter complexity, and expensive debug modes.

### Delivery contract

- STRIDE-style threat register with assets, boundaries, mitigations, and residual risk.
- Security-focused tests and dependency scanning in CI.

### Acceptance evidence

- No high-risk threat lacks an owner or mitigation plan.
- Tampered model and oversized request fixtures fail safely.

## 53. Privacy and responsible personalization

**Section:** Security

The demo avoids personal data, but the design demonstrates data minimisation, consent awareness, retention, access control, and understandable recommendation reasons.

### Decisions

- Collect only events required for declared ranking purposes.
- Keep sensitive attributes out of ranking features and logs.
- Support deletion and opt-out as data-pipeline requirements.

### Delivery contract

- Data inventory, retention schedule, consent-state propagation, and deletion workflow design.
- A model card section describing intended use and affected groups.

### Acceptance evidence

- Opted-out actors do not appear in future training snapshots.
- Explanations use safe reason categories rather than exposing inferred sensitive traits.

## 54. Abuse and integrity controls

**Section:** Security

Recommendation signals can be gamed by bots, creators, or coordinated activity. The platform needs bounded integrity checks even when fraud detection is not its primary purpose.

### Decisions

- Down-weight suspicious burst activity in offline features.
- Cap single-creator exposure and contribution to trend signals.
- Quarantine schema-valid but behaviourally implausible events for review.

### Delivery contract

- Synthetic abuse scenarios, integrity flags, and a guarded trend feature.
- Operational notes connecting an alert to affected recommendations.

### Acceptance evidence

- A burst attack cannot dominate the trending slate in the seeded test.
- Integrity interventions remain traceable in candidate provenance.

## 55. Infrastructure topology

**Section:** Platform

The local topology minimises prerequisites while preserving production boundaries. Web, API, worker, database, cache, and telemetry can run together; heavyweight substitutes are optional profiles.

### Decisions

- Use containers for reproducibility but keep core tests runnable outside containers.
- Persist only control-plane data by default.
- Make environment configuration explicit and validated at startup.

### Delivery contract

- Dockerfiles, compose file, health checks, resource limits, and example environment file.
- Production-oriented deployment manifests kept separate from local defaults.

### Acceptance evidence

- Services start in dependency order and become healthy without manual seeding.
- Missing required configuration fails with a precise message.

## 56. Local developer experience

**Section:** Platform

A senior project respects the reviewer’s time. Setup should be discoverable, errors actionable, and common commands memorable.

### Decisions

- Provide make targets or package scripts for setup, seed, dev, test, benchmark, load-test, and evidence.
- Pin runtime and dependency versions.
- Use pre-commit checks only when they remain fast.

### Delivery contract

- Quickstart, troubleshooting matrix, architecture tour, and sample curl requests.
- A doctor command that checks versions, ports, files, and optional services.

### Acceptance evidence

- A clean checkout reaches the seeded application by following one documented path.
- No command assumes the author’s absolute filesystem paths.

## 57. Continuous integration and delivery

**Section:** Platform

CI protects contracts, numerical correctness, application quality, and supply-chain hygiene. Expensive optional checks are separated from the fast pull-request path.

### Decisions

- Run formatting, lint, type checks, unit tests, contract tests, UI tests, and build on pull requests.
- Run deterministic benchmark smoke tests with regression tolerances.
- Generate attestable evidence artifacts on tagged releases.

### Delivery contract

- GitHub Actions workflows with caching, least-privilege permissions, and concurrency cancellation.
- Release checklist and semantic versioning policy.

### Acceptance evidence

- The workflow succeeds from the public repository without secrets for core checks.
- Protected mutations are absent from pull-request workflows.

## 58. Testing strategy

**Section:** Quality

Testing follows risk: numerical functions and contracts receive exact unit tests; boundaries receive integration tests; critical workflows receive browser tests; deployment assumptions receive smoke tests.

### Decisions

- Prefer deterministic fixtures to broad mocks.
- Test fallbacks and failures as seriously as the happy path.
- Keep end-to-end tests few, legible, and business-oriented.

### Delivery contract

- Test matrix by package and risk, shared factories, golden requests, and coverage reporting.
- Mutation or property-based tests for selected metric and ranking invariants.

### Acceptance evidence

- Every release gate has a direct test.
- Flaky tests are quarantined with an owner and deadline, never silently retried forever.

## 59. Data-quality controls

**Section:** Quality

Bad data can improve an offline metric while destroying real behaviour. Controls cover schema, completeness, uniqueness, timeliness, range, distribution, referential integrity, and temporal leakage.

### Decisions

- Run checks at ingestion, materialisation, and training snapshot boundaries.
- Classify expectations as blocking or diagnostic.
- Store result history and sample only safe failing rows.

### Delivery contract

- Executable expectation suite and a data-quality report in the evidence pack.
- Fixtures for duplicates, late data, missing catalogue rows, skew, and leakage.

### Acceptance evidence

- Blocking failures prevent training and registration.
- The UI shows affected assets and the last known successful run.

## 60. Offline evaluation protocol

**Section:** Evaluation

Evaluation uses a temporal split that mirrors the next-item decision. Training precedes validation, and validation precedes a locked test window. Candidate generation and ranking are evaluated both separately and end to end.

### Decisions

- Use impression-aware positives and sampled negatives without crossing time boundaries.
- Tune only on validation; report the test set once per candidate version.
- Fix K values and eligibility rules in a versioned protocol.

### Delivery contract

- Protocol manifest, dataset hashes, seeds, windows, exclusions, and metric configuration.
- A CLI that rebuilds the complete report from versioned inputs.

### Acceptance evidence

- Repeated execution produces matching rows and metrics within strict tolerance.
- The test report records code and environment versions.

## 61. Metric definitions

**Section:** Evaluation

Metric names are insufficient without semantics. Benchline calculates retrieval, ranking, coverage, diversity, novelty, concentration, calibration where relevant, and operational cost measures.

### Decisions

- Report Recall@100 for retrieval and NDCG@10 as the primary ranking metric.
- Include MAP@10, MRR@10, hit rate, catalogue coverage, intra-list diversity, novelty, and creator Gini.
- Report inference latency and slate completeness alongside quality.

### Delivery contract

- Pure tested metric functions and a human-readable metric dictionary.
- Worked examples small enough to verify by hand.

### Acceptance evidence

- Metric tests cover empty, duplicate, tied, truncated, and all-relevant cases.
- Displayed rounding never changes gate evaluation.

## 62. Baseline suite

**Section:** Evaluation

The suite includes random eligible, global popularity, contextual popularity, and collaborative retrieval. Each baseline uses the same eligibility and evaluation protocol as the challenger.

### Decisions

- Keep random deterministic and clearly weak.
- Do not allow the challenger privileged catalogue or future information.
- Report cost and complexity beside quality.

### Delivery contract

- Baseline implementations, versioned parameters, and comparison table.
- A failure analysis showing where each baseline remains competitive.

### Acceptance evidence

- At least one simple baseline is served in Explorer for honest comparison.
- Headline improvement always states the named baseline and metric.

## 63. Primary backtest

**Section:** Evaluation

The primary backtest compares the hybrid retrieval plus learned ranker and policy re-ranker against contextual popularity on the locked temporal test window.

### Decisions

- Pre-register NDCG@10 as primary and coverage, diversity, concentration, and latency as guardrails.
- Evaluate warm, cold-user, cold-item, low-activity, and taxonomy slices.
- Treat the result as portfolio evidence, not a claim about a real business.

### Delivery contract

- CSV and JSON metrics, an HTML/Markdown report, and charts generated from the same data.
- A concise benchmark card used by the web application.

### Acceptance evidence

- The exact command, seed, dataset hash, and runtime are committed.
- If the challenger loses, the product reports the loss and the plan changes rather than inventing uplift.

## 64. Uncertainty and bootstrap intervals

**Section:** Evaluation

Point estimates hide sample variation. User- or session-level bootstrap intervals quantify uncertainty while preserving within-group dependence.

### Decisions

- Resample the evaluation unit, not individual recommendation rows.
- Use a fixed seed and at least 1,000 resamples for published evidence.
- Compute intervals for the paired challenger-minus-baseline delta.

### Delivery contract

- Bootstrap implementation, convergence check, and interval table.
- Visual intervals with zero-delta reference.

### Acceptance evidence

- Synthetic identical models produce an interval centred on zero.
- Claims use ‘improved’ only when the chosen interval excludes zero.

## 65. Slice analysis

**Section:** Evaluation

Average quality can conceal failures for sparse users, new catalogue, price bands, or minority topics. Slices are defined before reading results and include sample sizes.

### Decisions

- Use behavioural and catalogue slices, not sensitive demographic inference.
- Apply minimum sample rules and multiple-comparison caution.
- Investigate large regressions even when not statistically conclusive.

### Delivery contract

- Slice definition registry, metric table, and worst-slice attention queue.
- Explorer presets for representative failure cases.

### Acceptance evidence

- Every slice result includes N and evaluation window.
- Small slices are labelled exploratory rather than silently dropped.

## 66. Ablation plan

**Section:** Evaluation

Ablations prove which system components earn their complexity. Candidate blending, affinity features, quality features, recency, and policy re-ranking are removed one at a time.

### Decisions

- Run ablations from the same trained/evaluation protocol where methodologically valid.
- Report both relevance and guardrail changes.
- Include serving cost when a feature group affects latency.

### Delivery contract

- Ablation configuration and ranked contribution table.
- Narrative explaining retained and rejected components.

### Acceptance evidence

- A component with no measurable value is removed or explicitly justified.
- The UI does not confuse feature importance with causal impact.

## 67. Simulated online experiment

**Section:** Evaluation

A transparent replay simulation demonstrates experiment mechanics without pretending to be real user traffic. It covers assignment, exposure, outcome generation, guardrails, and sequential peeking risk.

### Decisions

- Hash users into stable control and treatment groups.
- State all response-model assumptions.
- Label outputs ‘simulation’ at every presentation layer.

### Delivery contract

- Simulation notebook or script, sample-ratio-mismatch check, effect estimate, interval, and guardrails.
- An experiment-readout view using the resulting artifact.

### Acceptance evidence

- Assignment is stable and approximately balanced.
- Changing the assumed treatment effect changes outcomes in the expected direction.

## 68. Performance and load testing

**Section:** Evaluation

The serving claim must be measured under a declared machine, concurrency, request mix, and warm-up. The goal is honest engineering evidence, not a borrowed hyperscale number.

### Decisions

- Measure p50, p95, p99, throughput, error rate, and fallback rate.
- Use a warm and cold-cache scenario.
- Keep test duration sufficient for stable percentiles but practical for local reruns.

### Delivery contract

- Load generator, environment manifest, raw samples, summary JSON, and chart.
- Budget breakdown for feature, retrieval, rank, policy, and serialization stages.

### Acceptance evidence

- The README reports hardware and exact command beside latency figures.
- Performance regression thresholds run in a controlled optional CI job.

## 69. Failure and recovery design

**Section:** Reliability

The recommendation path should degrade usefully when online features, an index, a ranker, or telemetry becomes unavailable. Recovery behaviour is part of product quality.

### Decisions

- Define a fallback ladder: champion, previous champion, contextual popularity, global eligible popularity.
- Set timeouts and circuit-breaking at dependency boundaries.
- Return reason codes and degraded status without exposing internals.

### Delivery contract

- Failure matrix, injected-fault fixtures, recovery metrics, and operator runbooks.
- A visible degraded-state example in Explorer and Delivery.

### Acceptance evidence

- Every single dependency failure has a bounded response path.
- Recovery tests assert slate validity and audit emission.

## 70. Promotion and rollback

**Section:** Delivery

A release is a state transition backed by evidence. Promotion requires compatible contracts, passing gates, an expected champion version, and a human note; rollback is always available.

### Decisions

- Use champion/challenger aliases and immutable bundles.
- Warm and health-check a candidate before alias change.
- Retain release evidence and the previous alias target.

### Delivery contract

- Gate engine, signed release record, atomic alias update, rollback endpoint, and drill.
- UI confirmation that summarises consequence without theatrical warnings.

### Acceptance evidence

- Concurrent promotions cannot overwrite one another silently.
- The rollback drill records a measured recovery time and restored version.

## 71. Phase 1 - credible vertical slice

**Section:** Roadmap

Phase 1 establishes the full contract with simple algorithms: seeded events, point-in-time features, popularity and collaborative candidates, deterministic scoring, API serving, Explorer, and baseline evidence.

### Decisions

- Prioritise correctness and explainability over model sophistication.
- Build shared contracts before parallel UI and analytics work.
- Ship one polished path rather than six disconnected screens.

### Delivery contract

- Repository foundation, generator, feature pipeline, baseline models, recommendation endpoint, Explorer, tests, and CI.
- A first evidence pack with real computed metrics.

### Acceptance evidence

- A reviewer can complete the signature demo from a clean clone.
- All claims on the landing page link to generated evidence.

## 72. Phase 2 - evaluation and operations

**Section:** Roadmap

Phase 2 adds learned ranking, policy re-ranking, experiment comparisons, registry workflows, feature health, delivery evidence, and browser-grade application states.

### Decisions

- Add complexity only behind stable interfaces from Phase 1.
- Promote the challenger only after quality and guardrail gates pass.
- Use incident fixtures to prove diagnosis workflows.

### Delivery contract

- Experiments, Registry, Feature Health, Delivery, release gates, telemetry, and expanded tests.
- Ablations, bootstrap intervals, slices, and load-test evidence.

### Acceptance evidence

- The traceability matrix is at least 90 percent complete for P0 requirements.
- All primary routes pass responsive and accessibility QA.

## 73. Phase 3 - production substitutions

**Section:** Roadmap

Phase 3 documents and optionally demonstrates replacements for local adapters: streaming ingestion, distributed materialisation, managed feature storage, ANN search, model registry, telemetry backend, and orchestration.

### Decisions

- Preserve domain contracts while replacing infrastructure adapters.
- Do not make optional services prerequisites for interview review.
- Benchmark each substitution against the local reference.

### Delivery contract

- Adapter implementations or design spikes, compose profiles, Kubernetes manifests, and migration notes.
- Cost, reliability, and operational trade-off records.

### Acceptance evidence

- The core test suite runs against at least one alternate adapter where feasible.
- Production diagrams match actual ports in code.

## 74. Plan-to-code traceability

**Section:** Delivery

The final product must prove alignment with this document. Traceability links each P0 requirement to implementation, tests, evidence, and status, making omissions visible.

### Decisions

- Use stable requirement IDs derived from page and item number.
- Allow one artifact to satisfy multiple requirements but never leave proof implicit.
- Mark deferred items with rationale and roadmap destination.

### Delivery contract

- A machine-readable traceability file and rendered Markdown table.
- A validation script that fails on missing P0 evidence.

### Acceptance evidence

- All P0 rows are implemented or explicitly accepted as deviations before release.
- Links resolve in the public repository.

## 75. Source references and final mandate

**Section:** Appendix

The design is grounded in current role expectations and primary technical guidance. Spotify’s current personalization roles emphasise end-to-end ML systems, evaluation, experimentation, distributed data, and operational excellence. Google documents multi-stage recommendation architectures; Feast documents point-in-time joins; MLflow documents alias-based registry workflows; Evidently documents ranking metrics.

### Decisions

- Primary references: lifeatspotify.com/jobs; developers.google.com/machine-learning/recommendation; docs.cloud.google.com/architecture/implement-two-tower-retrieval-large-scale-candidate-generation; docs.feast.dev/master/getting-started/concepts/point-in-time-joins; mlflow.org/docs/latest/ml/model-registry/workflow; docs.evidentlyai.com/metrics/all_metrics.
- Treat external patterns as guidance, not copied interface or code.
- Update dated assumptions when the implementation materially changes.

### Delivery contract

- Build the smallest complete system that proves every critical claim, then deepen it without breaking reproducibility.
- Publish only after the plan-to-code audit, numerical validation, browser QA, and clean-clone check pass.

### Acceptance evidence

- The final repository is honest about synthetic data and local measurements.
- The product earns credibility through connected evidence, not visual polish alone.
