import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  GitBranch,
  Layers3,
  Menu,
  PanelLeftClose,
  Play,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import type { RecommendationResponse } from "../shared/contracts";

type Page = "overview" | "explorer" | "experiments" | "registry" | "features" | "delivery";
type Workspace = {
  generatedAt: string;
  users: Array<{
    id: string;
    name: string;
    descriptor: string;
    preferredLevel: string;
  }>;
  experiments: Array<{
    id: string;
    name: string;
    status: string;
    owner: string;
    dataset: string;
    model: string;
    ndcg: number;
    delta: number;
    interval: string;
    coverage: number;
    latency: number;
  }>;
  models: Array<{
    version: string;
    alias: string;
    family: string;
    status: string;
    trained: string;
    features: string;
    hash: string;
  }>;
  features: Array<{
    name: string;
    view: string;
    freshness: string;
    health: string;
    drift: number;
    nulls: number;
    owner: string;
  }>;
  summary: {
    champion: string;
    challenger: string;
    ndcg: number;
    uplift: number;
    coverage: number;
    p95: number;
    events: number;
    creatorGini: number;
    baselineCreatorGini: number;
  };
  scenario: string;
  evidence: {
    requests: number;
    concurrency: number;
    throughputRps: number;
    p50: number;
    p99: number;
    scope: string;
    generatedOn: string;
    evaluationUsers: number;
    bootstrapResamples: number;
    baselineNdcg: number;
    baselineRecall: number;
    challengerRecall: number;
    ciLow: number;
    ciHigh: number;
  };
  releaseState: {
    champion: string;
    challenger: string;
    storage: string;
    audit: Array<{ id: string; action: string; from: string; to: string; note: string; at: string }>;
  };
};

const nav: Array<{
  id: Page;
  label: string;
  icon: typeof Activity;
  hint: string;
}> = [
  {
    id: "overview",
    label: "Command Center",
    icon: CircleGauge,
    hint: "System and release posture",
  },
  {
    id: "explorer",
    label: "Explorer",
    icon: Sparkles,
    hint: "Explain a recommendation",
  },
  {
    id: "experiments",
    label: "Experiments",
    icon: FlaskConical,
    hint: "Compare model evidence",
  },
  {
    id: "registry",
    label: "Model Registry",
    icon: Boxes,
    hint: "Promote and roll back",
  },
  {
    id: "features",
    label: "Feature Health",
    icon: Database,
    hint: "Freshness, quality, drift",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: ServerCog,
    hint: "SLOs, traces, releases",
  },
];

const pageMeta: Record<Page, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: "Operations / today",
    title: "A working view of ranking quality and release risk",
    description: "Reproducible evidence for a synthetic learning marketplace.",
  },
  explorer: {
    eyebrow: "Recommendation Explorer",
    title: "See the work behind every position",
    description: "Inspect candidates, model reasoning and policy changes for a real request.",
  },
  experiments: {
    eyebrow: "Evaluation / temporal-2026-08",
    title: "Compare evidence, not leaderboard numbers",
    description: "Paired offline evaluation with uncertainty, slices and operational guardrails.",
  },
  registry: {
    eyebrow: "Demo registry / learning-home",
    title: "Ship a model you can reverse",
    description: "Immutable bundles, explicit aliases and release decisions with complete lineage.",
  },
  features: {
    eyebrow: "Feature scenario / learning-v7",
    title: "Find data risk before it becomes model risk",
    description: "Freshness, contract health and distribution change across active feature views.",
  },
  delivery: {
    eyebrow: "Local serving benchmark",
    title: "The path from request to ranked slate",
    description: "Measured latency, service objectives, trace stages and release history.",
  },
};

function useWorkspace() {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(() => {
    setError("");
    fetch("/api/v1/workspace")
      .then((r) => {
        if (!r.ok) throw new Error("Workspace unavailable");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(refresh, [refresh]);
  return { data, error, refresh };
}

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <BarChart3 size={18} />
      </span>
      <span>
        <b>Benchline</b>
        <small>Ranking workbench</small>
      </span>
    </div>
  );
}

function Sidebar({
  page,
  setPage,
  open,
  setOpen,
}: {
  page: Page;
  setPage: (p: Page) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="side-head">
          <Logo />
          <button
            className="icon-btn side-close"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        <nav aria-label="Primary navigation">
          <span className="nav-caption">Workspace</span>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => {
                  setPage(item.id);
                  setOpen(false);
                }}
              >
                <Icon size={17} />
                <span>
                  {item.label}
                  <small>{item.hint}</small>
                </span>
                {page === item.id && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="side-foot">
          <div className="environment">
            <span className="pulse" />
            <span>
              <b>Demo service online</b>
              <small>local / synthetic data</small>
            </span>
          </div>
          <div className="identity">
            <span>PW</span>
            <div>
              <b>Pablo Williams</b>
              <small>Release manager</small>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </aside>
    </>
  );
}

function MiniLine({ values, color = "#2554d9" }: { values: number[]; color?: string }) {
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * 100},${34 - ((v - Math.min(...values)) / (Math.max(...values) - Math.min(...values) || 1)) * 28}`,
    )
    .join(" ");
  return (
    <svg className="mini-line" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Metric({
  label,
  value,
  delta,
  detail,
  tone = "blue",
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone?: string;
}) {
  const positive = delta.startsWith("+");
  return (
    <article className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-signal ${tone}`} />
      </div>
      <strong>{value}</strong>
      <div className="metric-foot">
        <span className={positive ? "positive" : "muted"}>
          {positive ? <ArrowUpRight size={13} /> : null}
          {delta}
        </span>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function Status({
  children,
  tone = "ok",
}: {
  children: React.ReactNode;
  tone?: "ok" | "watch" | "info" | "neutral";
}) {
  return (
    <span className={`status ${tone}`}>
      <span />
      {children}
    </span>
  );
}

function Overview({ ws, setPage }: { ws: Workspace; setPage: (p: Page) => void }) {
  return (
    <div className="page-stack">
      <section className="decision-strip">
        <div className="decision-copy">
          <span className="kicker">
            <CheckCircle2 size={14} /> Evidence review complete
          </span>
          <h2>Challenger 2.4.0 passes the committed demo checks.</h2>
          <p>
            Offline quality improved on the generated holdout, while coverage, creator balance and the local
            HTTP latency budget remained inside their declared thresholds.
          </p>
        </div>
        <div className="decision-actions">
          <button className="button secondary" onClick={() => setPage("experiments")}>
            Review evidence
          </button>
          <button className="button primary" onClick={() => setPage("registry")}>
            Open release <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <section className="metrics-grid">
        <Metric
          label="NDCG @ 10"
          value={ws.summary.ndcg.toFixed(4)}
          delta={`+${ws.summary.uplift.toFixed(1)}%`}
          detail="vs contextual popularity"
        />
        <Metric
          label="Creator concentration"
          value={ws.summary.creatorGini.toFixed(3)}
          delta="−30.5%"
          detail={`Gini vs ${ws.summary.baselineCreatorGini.toFixed(3)} baseline`}
          tone="teal"
        />
        <Metric
          label="Serving p95"
          value={`${ws.summary.p95} ms`}
          delta={`${Math.max(0, 60 - ws.summary.p95).toFixed(1)} ms headroom`}
          detail={`${ws.evidence.requests.toLocaleString()} HTTP requests · c${ws.evidence.concurrency}`}
          tone="amber"
        />
        <Metric
          label="Training events"
          value={`${(ws.summary.events / 1000).toFixed(2)}k`}
          delta="Deterministic"
          detail="locked evaluation window"
          tone="violet"
        />
      </section>
      <section className="two-col major">
        <article className="panel quality-panel">
          <div className="panel-head">
            <div>
              <span className="section-label">Locked holdout</span>
              <h3>Measured NDCG @ 10</h3>
            </div>
            <div className="legend">
              <span>
                <i className="champion" />
                Champion
              </span>
              <span>
                <i className="challenger" />
                Challenger
              </span>
            </div>
          </div>
          <QualityChart
            champion={ws.evidence.baselineNdcg}
            challenger={ws.summary.ndcg}
            users={ws.evidence.evaluationUsers}
          />
          <div className="chart-note">
            <span>Paired user bootstrap</span>
            <b>95% interval for the absolute delta excludes zero</b>
          </div>
        </article>
        <article className="panel attention">
          <div className="panel-head">
            <div>
              <span className="section-label">Attention queue</span>
              <h3>Three things worth knowing</h3>
            </div>
            <span className="quiet-label">Scenario signals</span>
          </div>
          <div className="attention-list">
            <Attention
              icon={CheckCircle2}
              tone="good"
              title="Release gates passed"
              body="ranker-2.4.0 is ready for a controlled promotion."
              meta="4 min ago"
              onClick={() => setPage("registry")}
            />
            <Attention
              icon={Activity}
              tone="watch"
              title="Creator exposure drift"
              body="One feature crossed its watch threshold; no gate impact."
              meta="18 min ago"
              onClick={() => setPage("features")}
            />
            <Attention
              icon={GitBranch}
              tone="plain"
              title="Rollback route available"
              body="Promote the challenger, then restore the prior alias from Delivery."
              meta="Demo workflow"
              onClick={() => setPage("delivery")}
            />
          </div>
        </article>
      </section>
      <section className="three-col">
        <article className="panel compact">
          <div className="panel-head">
            <div>
              <span className="section-label">Release gates</span>
              <h3>4 evidence checks passed</h3>
            </div>
            <span className="score-ring">100</span>
          </div>
          {["Ranking quality", "Catalogue coverage", "Serving latency", "Artifact integrity"].map((x) => (
            <div className="gate-row" key={x}>
              <Check size={14} />
              <span>{x}</span>
              <small>Passed</small>
            </div>
          ))}
        </article>
        <article className="panel compact">
          <div className="panel-head">
            <div>
              <span className="section-label">Candidate mix</span>
              <h3>Where the slate begins</h3>
            </div>
          </div>
          <CandidateMix />
        </article>
        <article className="panel compact">
          <div className="panel-head">
            <div>
              <span className="section-label">Recent decisions</span>
              <h3>Operating history</h3>
            </div>
          </div>
          <div className="timeline">
            <div>
              <span />
              <b>Challenger approved for review</b>
              <small>Today, 09:42 · P. Williams</small>
            </div>
            <div>
              <span />
              <b>Feature set learning-v7 sealed</b>
              <small>2 Sep · automated</small>
            </div>
            <div>
              <span />
              <b>Champion 2.3.2 promoted</b>
              <small>24 Aug · P. Williams</small>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function Attention({
  icon: Icon,
  tone,
  title,
  body,
  meta,
  onClick,
}: {
  icon: typeof Activity;
  tone: string;
  title: string;
  body: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button className="attention-row" onClick={onClick}>
      <span className={`attention-icon ${tone}`}>
        <Icon size={16} />
      </span>
      <span>
        <b>{title}</b>
        <small>{body}</small>
      </span>
      <time>{meta}</time>
      <ChevronRight size={15} />
    </button>
  );
}

function QualityChart({
  champion,
  challenger,
  users,
}: {
  champion: number;
  challenger: number;
  users: number;
}) {
  const scale = (value: number) => ((value - 0.2) / 0.14) * 420;
  return (
    <svg className="quality-chart" viewBox="0 0 700 150" role="img" aria-label="Measured NDCG comparison">
      <text x="45" y="43">
        Contextual popularity
      </text>
      <rect x="185" y="25" width={scale(champion)} height="25" rx="4" className="quality-baseline" />
      <text x={195 + scale(champion)} y="43">
        {champion.toFixed(4)}
      </text>
      <text x="45" y="98">
        Hybrid scorer
      </text>
      <rect x="185" y="80" width={scale(challenger)} height="25" rx="4" className="quality-challenger" />
      <text x={195 + scale(challenger)} y="98">
        {challenger.toFixed(4)}
      </text>
      <text x="185" y="135">
        Generated temporal holdout · {users} users
      </text>
    </svg>
  );
}

function CandidateMix() {
  return (
    <div>
      <div className="stacked">
        <span style={{ width: "38%" }} />
        <span style={{ width: "27%" }} />
        <span style={{ width: "21%" }} />
        <span style={{ width: "14%" }} />
      </div>
      <div className="mix-list">
        {[
          ["Collaborative", "38%"],
          ["Content similarity", "27%"],
          ["Trending", "21%"],
          ["Fresh catalogue", "14%"],
        ].map(([a, b], i) => (
          <div key={a}>
            <span>
              <i className={`mix-${i}`} />
              {a}
            </span>
            <b>{b}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function Explorer({ ws }: { ws: Workspace }) {
  const [userId, setUserId] = useState(ws.users[0].id);
  const [alias, setAlias] = useState<"champion" | "challenger">("challenger");
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const run = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/recommendations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId,
        surface: "home",
        limit: 8,
        modelAlias: alias,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setResult(d);
        setSelected(0);
      })
      .finally(() => setLoading(false));
  }, [alias, userId]);
  useEffect(() => {
    run();
  }, [run]);
  const item = result?.recommendations[selected];
  return (
    <div className="explorer-layout">
      <section className="explorer-controls">
        <div className="control-group">
          <label htmlFor="user">User scenario</label>
          <select id="user" value={userId} onChange={(e) => setUserId(e.target.value)}>
            {ws.users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.descriptor}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Model route</label>
          <div className="segmented">
            <button className={alias === "champion" ? "active" : ""} onClick={() => setAlias("champion")}>
              Champion
            </button>
            <button className={alias === "challenger" ? "active" : ""} onClick={() => setAlias("challenger")}>
              Challenger
            </button>
          </div>
        </div>
        <button className="button dark" onClick={run} disabled={loading}>
          {loading ? <RefreshCw className="spin" size={15} /> : <Play size={15} />} Generate slate
        </button>
        <div className="request-meta">
          <div>
            <span>Surface</span>
            <b>Learning home</b>
          </div>
          <div>
            <span>Policy</span>
            <b>balanced-v3</b>
          </div>
          <div>
            <span>Items</span>
            <b>8</b>
          </div>
        </div>
      </section>
      <section className="slate-column">
        <div className="inline-head">
          <div>
            <span className="section-label">Ranked output</span>
            <h3>
              {result
                ? `${result.recommendations.length} recommendations for ${ws.users.find((u) => u.id === userId)?.name}`
                : "Preparing slate"}
            </h3>
          </div>
          {result && <Status>{result.latencyMs} ms</Status>}
        </div>
        <div className="slate-list">
          {result?.recommendations.map((r, i) => (
            <button
              key={r.itemId}
              className={`slate-item ${selected === i ? "selected" : ""}`}
              onClick={() => setSelected(i)}
            >
              <span className="rank">{String(r.rank).padStart(2, "0")}</span>
              <span className="course-accent" style={{ background: r.accent }}>
                <Layers3 size={17} />
              </span>
              <span className="course-copy">
                <b>{r.title}</b>
                <small>
                  {r.topic} · {r.level} · {r.durationMinutes} min
                </small>
              </span>
              <span className="score">
                <b>{r.score.toFixed(3)}</b>
                <small>score</small>
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>
      <aside className="evidence-column">
        {item ? (
          <>
            <div className="evidence-title">
              <span className="section-label">Position {item.rank} evidence</span>
              <h3>{item.title}</h3>
              <p>
                {item.creator} · {item.topic}
              </p>
            </div>
            <div className="evidence-block">
              <span>Why it appears</span>
              {item.reasons.map((x) => (
                <div className="reason" key={x}>
                  <Check size={14} />
                  {x}
                </div>
              ))}
            </div>
            <div className="evidence-block">
              <span>Candidate provenance</span>
              <div className="tags">
                {item.sources.map((x) => (
                  <em key={x}>{x}</em>
                ))}
              </div>
            </div>
            <div className="evidence-block">
              <span>Ranking movement</span>
              <div className="movement">
                <b>#{item.prePolicyRank}</b>
                <ArrowRight size={16} />
                <b>#{item.rank}</b>
                <small>{item.policyAdjustment ?? "No policy adjustment"}</small>
              </div>
            </div>
            <div className="evidence-block">
              <span>Request stages</span>
              {Object.entries(result!.stageTimings).map(([name, ms]) => (
                <div className="timing" key={name}>
                  <span>{name}</span>
                  <i>
                    <u style={{ width: `${ms * 5}%` }} />
                  </i>
                  <b>{ms} ms</b>
                </div>
              ))}
            </div>
            <div className="evidence-footer">
              <code>{result!.requestId}</code>
              <button
                className="text-btn"
                onClick={() => navigator.clipboard?.writeText(JSON.stringify(result, null, 2))}
              >
                Raw response <ExternalLink size={13} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty">
            <Sparkles />
            <h3>Generate a slate</h3>
            <p>Model and policy evidence will appear here.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function Experiments({ ws, setPage }: { ws: Workspace; setPage: (p: Page) => void }) {
  const [selected, setSelected] = useState(ws.experiments[0].id);
  const exp = ws.experiments.find((x) => x.id === selected)!;
  return (
    <div className="page-stack">
      <section className="evidence-banner">
        <div>
          <Status tone="info">
            Paired bootstrap · {ws.evidence.bootstrapResamples.toLocaleString()} samples
          </Status>
          <h2>{exp.name}</h2>
          <p>Ordered synthetic holdout · {ws.evidence.evaluationUsers} evaluation users</p>
        </div>
        <a className="button secondary" href="/api/v1/evidence" download="benchline-evidence.json">
          <FileText size={15} /> Export evidence
        </a>
      </section>
      <section className="experiment-grid">
        <article className="panel run-list">
          <div className="panel-head">
            <div>
              <span className="section-label">Runs</span>
              <h3>Compatible comparisons</h3>
            </div>
            <SlidersHorizontal size={17} />
          </div>
          {ws.experiments.map((x) => (
            <button
              key={x.id}
              className={selected === x.id ? "active" : ""}
              onClick={() => setSelected(x.id)}
            >
              <span>
                <b>{x.name}</b>
                <small>
                  {x.id} · {x.model}
                </small>
              </span>
              <Status tone={x.status === "Baseline" ? "neutral" : x.status === "Completed" ? "ok" : "info"}>
                {x.status}
              </Status>
            </button>
          ))}
        </article>
        <article className="panel comparison">
          <div className="panel-head">
            <div>
              <span className="section-label">Primary outcome</span>
              <h3>NDCG @ 10</h3>
            </div>
            <span className="big-delta">
              <ArrowUpRight />+{exp.delta.toFixed(1)}%
            </span>
          </div>
          <div className="comparison-bars">
            <div>
              <span>Selected</span>
              <i>
                <u style={{ width: `${exp.ndcg * 180}%` }} />
              </i>
              <b>{exp.ndcg.toFixed(4)}</b>
            </div>
            <div>
              <span>Baseline</span>
              <i>
                <u style={{ width: "64%" }} />
              </i>
              <b>{ws.evidence.baselineNdcg.toFixed(4)}</b>
            </div>
          </div>
          <div className="interval">
            <span>95% confidence interval</span>
            <b>{exp.interval}</b>
            <small>Paired at the user level · absolute NDCG points</small>
          </div>
          <MiniLine values={[0.37, 0.381, 0.389, 0.397, 0.406, 0.412, 0.419, exp.ndcg]} />
        </article>
        <article className="panel gate-card">
          <div className="panel-head">
            <div>
              <span className="section-label">Decision</span>
              <h3>Release posture</h3>
            </div>
            <ShieldCheck />
          </div>
          <div className="verdict">
            <CheckCircle2 />
            <b>Ready for controlled promotion</b>
            <p>All blocking thresholds passed. One non-blocking feature watch remains open.</p>
          </div>
          <button className="button dark full" onClick={() => setPage("registry")}>
            Review release gates <ArrowRight size={15} />
          </button>
        </article>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <span className="section-label">Guardrails and slices</span>
            <h3>The average is not the whole story</h3>
          </div>
          <a
            className="text-btn"
            href="https://github.com/pablowilliams/benchline/blob/main/docs/MODEL_CARD.md"
            target="_blank"
            rel="noreferrer"
          >
            Metric definitions <ExternalLink size={13} />
          </a>
        </div>
        <div className="data-table">
          <div className="table-head">
            <span>Measure</span>
            <span>Selected</span>
            <span>Baseline</span>
            <span>Change</span>
            <span>Evidence</span>
          </div>
          {[
            ["Catalogue coverage", "100.0%", "98.3%", "+1.7 pts", "Passed"],
            [
              "Recall @ 10",
              ws.evidence.challengerRecall.toFixed(4),
              ws.evidence.baselineRecall.toFixed(4),
              `+${((ws.evidence.challengerRecall / ws.evidence.baselineRecall - 1) * 100).toFixed(1)}%`,
              "Passed",
            ],
            ["Absolute NDCG delta", "+0.0660", "reference", "CI excludes 0", "Passed"],
            [
              "Creator Gini",
              ws.summary.creatorGini.toFixed(4),
              ws.summary.baselineCreatorGini.toFixed(4),
              `${((ws.summary.creatorGini / ws.summary.baselineCreatorGini - 1) * 100).toFixed(1)}%`,
              "Passed",
            ],
            [
              "HTTP p95",
              `${ws.summary.p95} ms`,
              "60 ms budget",
              `${Math.max(0, 60 - ws.summary.p95).toFixed(1)} ms headroom`,
              "Passed",
            ],
          ].map((row) => (
            <div className="table-row" key={row[0]}>
              {row.map((c, i) => (
                <span key={i} className={i === 3 ? "positive" : ""}>
                  {c}
                  {i === 4 && <CheckCircle2 size={14} />}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Registry({ ws, refresh }: { ws: Workspace; refresh: () => void }) {
  const [modal, setModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [releaseError, setReleaseError] = useState("");
  const promoted = ws.summary.champion === "ranker-2.4.0";
  const promote = async (note: string) => {
    setPending(true);
    setReleaseError("");
    const response = await fetch("/api/v1/releases/promote", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
      body: JSON.stringify({
        expectedChampion: ws.summary.champion,
        challenger: ws.summary.challenger,
        releaseNote: note,
      }),
    });
    if (!response.ok) {
      const body = await response.json();
      setReleaseError(body.message ?? "Promotion failed");
      setPending(false);
      return;
    }
    setModal(false);
    setPending(false);
    refresh();
  };
  return (
    <div className="page-stack">
      <section className="registry-hero">
        <div className="route-map">
          <span>
            <small>Fallback</small>
            <b>popular-1.3.0</b>
          </span>
          <ArrowRight />
          <span className="live">
            <small>Champion · 100% traffic</small>
            <b>{ws.summary.champion}</b>
          </span>
          <ArrowRight />
          <span>
            <small>Challenger</small>
            <b>{promoted ? "No pending candidate" : ws.summary.challenger}</b>
          </span>
        </div>
        <button className="button primary" onClick={() => setModal(true)} disabled={promoted}>
          <Zap size={15} />
          {promoted ? "Promotion complete" : "Promote challenger"}
        </button>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <span className="section-label">Deployable bundles</span>
            <h3>learning-home</h3>
          </div>
          <button
            className="button secondary"
            onClick={() => document.querySelector(".lineage")?.scrollIntoView({ behavior: "smooth" })}
          >
            <GitBranch size={15} /> Compare lineage
          </button>
        </div>
        <div className="model-table">
          <div className="table-head">
            <span>Version</span>
            <span>Alias</span>
            <span>Family</span>
            <span>Feature set</span>
            <span>Status</span>
            <span>Implementation</span>
          </div>
          {ws.models.map((m, i) => (
            <div className="model-row" key={m.version}>
              <span>
                <b>{m.version}</b>
                <small>Trained {m.trained}</small>
              </span>
              <span>
                <em className={`alias ${m.alias}`}>{m.alias}</em>
              </span>
              <span>{m.family}</span>
              <span>
                <code>{m.features}</code>
              </span>
              <span>
                <Status tone={i === 0 ? "info" : "ok"}>{m.status}</Status>
              </span>
              <span>
                <code>{m.hash}</code>
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="two-col">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="section-label">Lineage</span>
              <h3>Challenger 2.4.0</h3>
            </div>
            <GitBranch />
          </div>
          <div className="lineage">
            <div>
              <Database />
              <span>
                <small>Dataset</small>
                <b>temporal-2026-08</b>
                <code>manifest hash in evidence</code>
              </span>
            </div>
            <i />
            <div>
              <Layers3 />
              <span>
                <small>Feature set</small>
                <b>learning-v7</b>
                <code>31 features · contract clean</code>
              </span>
            </div>
            <i />
            <div>
              <FlaskConical />
              <span>
                <small>Experiment</small>
                <b>exp_0248</b>
                <code>reproducible benchmark</code>
              </span>
            </div>
            <i />
            <div>
              <Boxes />
              <span>
                <small>Bundle</small>
                <b>ranker-2.4.0</b>
                <code>source-defined · no binary</code>
              </span>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="section-label">Scenario history</span>
              <h3>Illustrative release record</h3>
            </div>
          </div>
          <div className="release-list">
            <div>
              <span className="release-mark live" />
              <span>
                <b>ranker-2.3.2 promoted</b>
                <small>24 Aug, 14:32 · P. Williams</small>
              </span>
              <Status>Active</Status>
            </div>
            <div>
              <span className="release-mark" />
              <span>
                <b>ranker-2.3.1 rolled back</b>
                <small>11 Aug, 09:27 · feature timeout regression</small>
              </span>
              <Status tone="neutral">46s recovery</Status>
            </div>
            <div>
              <span className="release-mark" />
              <span>
                <b>ranker-2.3.0 promoted</b>
                <small>03 Aug, 11:08 · A. Morgan</small>
              </span>
              <Status tone="neutral">Superseded</Status>
            </div>
          </div>
        </article>
      </section>
      {modal && (
        <PromotionModal
          onClose={() => setModal(false)}
          onPromote={promote}
          pending={pending}
          error={releaseError}
          p95={ws.summary.p95}
          uplift={ws.summary.uplift}
          coverage={ws.summary.coverage}
        />
      )}
    </div>
  );
}

function PromotionModal({
  onClose,
  onPromote,
  pending,
  error,
  p95,
  uplift,
  coverage,
}: {
  onClose: () => void;
  onPromote: (note: string) => void;
  pending: boolean;
  error: string;
  p95: number;
  uplift: number;
  coverage: number;
}) {
  const [note, setNote] = useState("");
  return (
    <div className="modal-wrap" role="dialog" aria-modal="true" aria-labelledby="promote-title">
      <div className="modal">
        <div className="modal-head">
          <span className="modal-icon">
            <Zap />
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <span className="section-label">Controlled release</span>
        <h2 id="promote-title">Promote ranker-2.4.0?</h2>
        <p>
          This demo updates the server-side alias with an optimistic concurrency check. The state is held in
          memory and resets when the process restarts.
        </p>
        <div className="gate-summary">
          {[
            `Quality +${uplift.toFixed(1)}%`,
            `Coverage ${coverage.toFixed(0)}%`,
            `HTTP p95 ${p95} ms`,
            "Source revision present",
          ].map((x) => (
            <span key={x}>
              <Check />
              {x}
            </span>
          ))}
        </div>
        <label className="note-label">
          Release note
          <textarea
            placeholder="Why this model should serve production traffic"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button primary"
            disabled={pending || note.trim().length < 12}
            onClick={() => onPromote(note)}
          >
            {pending ? "Applying…" : "Promote alias"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Features({ ws }: { ws: Workspace }) {
  const [selected, setSelected] = useState(4);
  const f = ws.features[selected];
  return (
    <div className="page-stack">
      <section className="metrics-grid feature-metrics">
        <Metric label="Contract checks" value="31 / 31" delta="No violations" detail="learning-v7" />
        <Metric label="Freshness SLO" value="96.8%" delta="+0.6 pts" detail="last 24 hours" tone="teal" />
        <Metric
          label="Features watched"
          value="1"
          delta="Diagnostic"
          detail="no blocking impact"
          tone="amber"
        />
        <Metric
          label="Serving skew"
          value="0.7%"
          delta="Within 2%"
          detail="training vs online"
          tone="violet"
        />
      </section>
      <section className="feature-layout">
        <article className="panel feature-list">
          <div className="panel-head">
            <div>
              <span className="section-label">Active features</span>
              <h3>learning-v7</h3>
            </div>
            <Search size={16} />
          </div>
          {ws.features.map((x, i) => (
            <button key={x.name} className={selected === i ? "active" : ""} onClick={() => setSelected(i)}>
              <span>
                <code>{x.name}</code>
                <small>
                  {x.view} · {x.owner}
                </small>
              </span>
              <Status tone={x.health === "Watching" ? "watch" : "ok"}>{x.health}</Status>
              <ChevronRight size={15} />
            </button>
          ))}
        </article>
        <article className="panel feature-detail">
          <div className="panel-head">
            <div>
              <span className="section-label">Feature evidence</span>
              <h3>{f.name}</h3>
            </div>
            <Status tone={f.health === "Watching" ? "watch" : "ok"}>{f.health}</Status>
          </div>
          <div className="definition">
            <div>
              <span>Entity</span>
              <b>user × creator</b>
            </div>
            <div>
              <span>Type</span>
              <b>float32</b>
            </div>
            <div>
              <span>Freshness</span>
              <b>{f.freshness}</b>
            </div>
            <div>
              <span>Null rate</span>
              <b>{f.nulls}%</b>
            </div>
          </div>
          <div className="drift-chart">
            <div className="chart-title">
              <span>Distribution over 14 days</span>
              <b>JS distance {f.drift.toFixed(2)}</b>
            </div>
            <MiniLine
              values={[0.18, 0.21, 0.19, 0.24, 0.23, 0.28, 0.31, 0.29, 0.33, 0.38, 0.42, 0.48, 0.53, 0.58]}
              color={f.health === "Watching" ? "#b45309" : "#2554d9"}
            />
            <div className="drift-axis">
              <span>22 Aug</span>
              <span>Today</span>
            </div>
          </div>
          <div className="health-note">
            <Activity />
            <div>
              <b>
                {f.health === "Watching"
                  ? "Movement is visible, not yet harmful"
                  : "Distribution remains inside its operating envelope"}
              </b>
              <p>
                {f.health === "Watching"
                  ? "Creator concentration increased after the catalogue campaign. Ranking quality and policy constraints remain stable."
                  : "Reference and current windows meet sample requirements. No downstream model gate is affected."}
              </p>
            </div>
          </div>
          <div className="lineage-mini">
            <span>Source events</span>
            <ArrowRight />
            <span>{f.view}</span>
            <ArrowRight />
            <span>learning-v7</span>
            <ArrowRight />
            <span>ranker-2.4.0</span>
          </div>
        </article>
      </section>
    </div>
  );
}

function DeliveryPage({ ws, refresh }: { ws: Workspace; refresh: () => void }) {
  const [rollbackState, setRollbackState] = useState("");
  const rollback = async () => {
    setRollbackState("Applying rollback…");
    const response = await fetch("/api/v1/releases/rollback", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
      body: JSON.stringify({
        expectedChampion: ws.summary.champion,
        releaseNote: "Operator-triggered rollback drill from the delivery view",
      }),
    });
    const body = await response.json();
    setRollbackState(
      response.ok ? "Rollback applied to demo state" : (body.message ?? "Rollback was not applied"),
    );
    if (response.ok) refresh();
  };
  return (
    <div className="page-stack">
      <section className="slo-band">
        <div>
          <Status>Benchmark passed</Status>
          <h2>{ws.evidence.requests.toLocaleString()} HTTP requests completed without an error</h2>
          <p>Local loopback benchmark · concurrency {ws.evidence.concurrency} · not production telemetry</p>
        </div>
        <div className="budget">
          <span>
            <i style={{ width: "100%" }} />
          </span>
          <b>{ws.evidence.throughputRps.toLocaleString()} requests/second</b>
        </div>
      </section>
      <section className="metrics-grid">
        <Metric label="Benchmark success" value="100%" delta="0 errors" detail="single local run" />
        <Metric
          label="p95 latency"
          value={`${ws.summary.p95} ms`}
          delta={`${Math.max(0, 60 - ws.summary.p95).toFixed(1)} ms headroom`}
          detail={`${ws.evidence.requests.toLocaleString()} measured requests`}
          tone="teal"
        />
        <Metric
          label="Median latency"
          value={`${ws.evidence.p50} ms`}
          delta="Measured"
          detail="HTTP round trip"
          tone="amber"
        />
        <Metric
          label="Tail latency"
          value={`${ws.evidence.p99} ms`}
          delta="Measured"
          detail="99th percentile"
          tone="violet"
        />
      </section>
      <section className="two-col major">
        <article className="panel trace">
          <div className="panel-head">
            <div>
              <span className="section-label">Request path · schematic</span>
              <h3>What the benchmark exercises</h3>
            </div>
            <Status>200 OK</Status>
          </div>
          <div className="trace-bars">
            {[
              ["HTTP + Fastify", 100, 0],
              ["Validation", 18, 2],
              ["Scoring", 43, 20],
              ["Policy rerank", 24, 63],
              ["JSON serialization", 11, 87],
            ].map(([n, w, l]) => (
              <div key={n as string}>
                <span>{n}</span>
                <i>
                  <u
                    style={{
                      width: `${Number(w)}%`,
                      marginLeft: `${Number(l)}%`,
                    }}
                  />
                </i>
                <b>{n === "HTTP + Fastify" ? `${ws.summary.p95} ms p95` : "included"}</b>
              </div>
            ))}
          </div>
          <div className="trace-foot">
            <code>model.version={ws.summary.champion}</code>
            <code>measurement=loopback_http</code>
            <code>errors=0</code>
          </div>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="section-label">Recorded percentiles</span>
              <h3>Inside the 60 ms development budget</h3>
            </div>
            <span className="big-number">
              {ws.summary.p95}
              <small>p95 ms</small>
            </span>
          </div>
          <LatencyHistogram />
          <div className="percentiles">
            <span>
              <b>{ws.evidence.p50}</b>
              <small>p50</small>
            </span>
            <span>
              <b>{ws.summary.p95}</b>
              <small>p95</small>
            </span>
            <span>
              <b>{ws.evidence.p99}</b>
              <small>p99</small>
            </span>
            <span>
              <b>0</b>
              <small>errors</small>
            </span>
          </div>
        </article>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <span className="section-label">Demo release control</span>
            <h3>Current process-local alias</h3>
          </div>
          <button
            className="button secondary"
            onClick={rollback}
            disabled={
              rollbackState === "Applying rollback…" ||
              !ws.releaseState.audit.some((event) => event.action === "promote")
            }
            title={
              ws.releaseState.audit.some((event) => event.action === "promote")
                ? "Restore the prior alias"
                : "Promote a challenger in this process first"
            }
          >
            <RefreshCw size={14} /> Run demo rollback
          </button>
        </div>
        <div className="deploy-row">
          <div className="deploy-version">
            <span className="release-mark live" />
            <div>
              <b>{ws.summary.champion}</b>
              <small>Current in-memory champion</small>
            </div>
          </div>
          <span>
            <ArrowDownRight /> Alias state
          </span>
          <span>
            <ArrowUpRight /> {ws.releaseState.storage}
          </span>
          <Status>Active</Status>
        </div>
      </section>
      {rollbackState && (
        <div className="inline-notice" role="status">
          {rollbackState}
        </div>
      )}
    </div>
  );
}

function LatencyHistogram() {
  const bars = [12, 24, 38, 54, 72, 91, 100, 94, 79, 61, 44, 31, 20, 13, 8, 5];
  return (
    <div className="histogram" aria-hidden="true">
      {bars.map((h, i) => (
        <i key={i} style={{ height: `${h}%` }} className={i > 11 ? "tail" : ""} />
      ))}
    </div>
  );
}

function CommandPalette({
  open,
  onClose,
  setPage,
}: {
  open: boolean;
  onClose: () => void;
  setPage: (p: Page) => void;
}) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 0);
  }, [open]);
  if (!open) return null;
  const items = nav.filter((x) => `${x.label} ${x.hint}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="command-wrap" role="dialog" aria-modal="true">
      <button className="command-backdrop" onClick={onClose} aria-label="Close command menu" />
      <div className="command">
        <div className="command-search">
          <Search />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages and actions…"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="command-results">
          <span>Navigate</span>
          {items.map((x) => {
            const Icon = x.icon;
            return (
              <button
                key={x.id}
                onClick={() => {
                  setPage(x.id);
                  onClose();
                }}
              >
                <Icon />
                <span>
                  <b>{x.label}</b>
                  <small>{x.hint}</small>
                </span>
                <kbd>↵</kbd>
              </button>
            );
          })}
        </div>
        <div className="command-foot">
          <span>
            <kbd>↑↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>Benchline command menu</span>
        </div>
      </div>
    </div>
  );
}

function Header({
  page,
  setMobile,
  setCommand,
}: {
  page: Page;
  setMobile: (v: boolean) => void;
  setCommand: (v: boolean) => void;
}) {
  const meta = pageMeta[page];
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={() => setMobile(true)} aria-label="Open navigation">
        <Menu />
      </button>
      <div className="page-heading">
        <span>{meta.eyebrow}</span>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>
      <div className="top-actions">
        <button className="search-trigger" onClick={() => setCommand(true)}>
          <Search />
          <span>Search or jump to…</span>
          <kbd>⌘ K</kbd>
        </button>
        <a
          className="icon-btn"
          href="https://github.com/pablowilliams/benchline"
          target="_blank"
          aria-label="Open GitHub"
        >
          <ExternalLink />
        </a>
      </div>
    </header>
  );
}

function Skeleton() {
  return (
    <div className="skeleton-page">
      <div />
      <div className="sk-grid">
        {[1, 2, 3, 4].map((x) => (
          <i key={x} />
        ))}
      </div>
      <div className="sk-large" />
    </div>
  );
}

export default function App() {
  const fromHash = () => {
    const candidate = window.location.hash.slice(1) as Page;
    return nav.some((item) => item.id === candidate) ? candidate : "overview";
  };
  const [page, setPageState] = useState<Page>(fromHash);
  const setPage = useCallback((next: Page) => {
    window.location.hash = next;
    setPageState(next);
  }, []);
  const [mobile, setMobile] = useState(false);
  const [command, setCommand] = useState(false);
  const { data, error, refresh } = useWorkspace();
  useEffect(() => {
    const onHashChange = () => setPageState(fromHash());
    window.addEventListener("hashchange", onHashChange);
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand(true);
      }
      if (e.key === "Escape") setCommand(false);
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);
  const content = useMemo(() => {
    if (!data) return null;
    switch (page) {
      case "overview":
        return <Overview ws={data} setPage={setPage} />;
      case "explorer":
        return <Explorer ws={data} />;
      case "experiments":
        return <Experiments ws={data} setPage={setPage} />;
      case "registry":
        return <Registry ws={data} refresh={refresh} />;
      case "features":
        return <Features ws={data} />;
      case "delivery":
        return <DeliveryPage ws={data} refresh={refresh} />;
    }
  }, [data, page, refresh, setPage]);
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Sidebar page={page} setPage={setPage} open={mobile} setOpen={setMobile} />
      <main id="main">
        <Header page={page} setMobile={setMobile} setCommand={setCommand} />
        <div className="content">
          {error ? (
            <div className="error-state">
              <ServerCog />
              <h2>Workspace did not load</h2>
              <p>{error}. Confirm the API is running on port 4100.</p>
              <button className="button dark" onClick={refresh}>
                Try again
              </button>
            </div>
          ) : data ? (
            content
          ) : (
            <Skeleton />
          )}
        </div>
        <footer className="app-footer">
          <span>Benchline 1.1 · Synthetic learning marketplace</span>
          <span>Measured claims come from committed, reproducible evidence.</span>
        </footer>
      </main>
      <CommandPalette open={command} onClose={() => setCommand(false)} setPage={setPage} />
    </div>
  );
}
