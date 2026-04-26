export interface Note {
  slug: string
  title: string
  date: string
  readTime: string
  tags: string[]
  description: string
  body: string
}

export const NOTES: Note[] = [
  {
    slug: "prompt-governance-regulated-environments",
    title: "Prompt governance in regulated AI environments",
    date: "2025-12-10",
    readTime: "8 min",
    tags: ["AI", "Governance"],
    description:
      "How to version, audit, and control prompts in financial and legal systems where every model interaction is a liability. Covers prompt registries, change gates, and evaluation pipelines.",
    body: `Prompt governance is the discipline of treating prompts as production artifacts — versioned, tested, audited, and attributable. In regulated environments this is not optional.

**Why prompts are liabilities**

Every prompt that reaches a model in a financial or legal system is a decision-making input. Regulators increasingly require that AI-assisted decisions be explainable and reproducible. A prompt that changed last Tuesday and produced a different answer today is an audit failure.

The standard response — "we'll add logging" — is insufficient. Logging records what happened. Governance controls what can happen.

**The four layers of prompt governance**

---

**1. Registry**

Every prompt in production lives in a versioned registry. Schema:

- id: canonical identifier (snake_case, stable across versions)
- version: semver
- status: draft | review | approved | deprecated
- owner: team or individual
- hash: content hash (detects silent mutations)
- created_at / approved_at / deprecated_at

No prompt executes in production without a registry entry in approved status.

**2. Change gates**

Promotion from draft to approved requires:

- Diff review by a designated reviewer (not the author)
- Passing the evaluation suite with defined acceptance thresholds
- Sign-off captured in the registry (who, when, which evaluation run)

Emergency overrides exist but create an incident record.

**3. Evaluation pipelines**

Each prompt version has an associated evaluation set: input-output pairs that define expected behavior. Pipeline runs on every promotion attempt:

- Correctness (task-specific metrics)
- Refusal rate (for safety-relevant prompts)
- Consistency (same input → same output class across N runs)
- Latency (p50, p95, p99)

Thresholds are set at the prompt level, not globally — a legal extraction prompt and a summary prompt have different acceptance criteria.

**4. Runtime attribution**

Every model call in production carries:

- prompt_id + prompt_version in the request context
- outcome_hash in the response log
- caller_id (which system or user triggered the call)

This creates a complete causal chain from decision to prompt version to evaluation state at the time of approval.

**What this prevents**

- Silent prompt drift (hash comparison catches it at registry write time)
- Unapproved changes reaching production (gating)
- "We don't know which version produced this" (attribution)
- Inability to reproduce a past decision (version + evaluation history preserved)

**Implementation starting point**

The minimal viable governance stack: a Postgres table as the registry, a CI/CD step that runs the evaluation pipeline on PR, and a middleware layer that rejects calls to non-approved prompt IDs.

More sophisticated implementations add a dedicated governance API (Prompt-Maker pattern), evaluation dashboards, and automated deprecation when successor versions are approved.

The infrastructure cost is low. The cost of not having it is measured in audit findings.`,
  },
  {
    slug: "agentic-runtimes-orchestration-to-control",
    title: "Agentic runtimes: from orchestration to control",
    date: "2025-10-22",
    readTime: "10 min",
    tags: ["AI", "Architecture"],
    description:
      "Orchestration frameworks give agents capability. Control planes give operators confidence. The gap between them is where production incidents live. A framework for thinking about runtime control in agentic systems.",
    body: `The dominant framing of agentic systems focuses on capability: what can the agent do, how many tools does it have, how does it plan. This framing is useful for demos and insufficient for production.

Production agentic systems require a second framing: what can the operator see, interrupt, and constrain at runtime.

**Orchestration vs. control**

Orchestration is the internal logic of an agent: how it selects tools, sequences steps, manages context, and recovers from failures. Most frameworks (LangGraph, CrewAI, AutoGen) are primarily orchestration frameworks.

Control is the external capacity to observe, constrain, and intervene in agent execution from outside the agent's own logic. This is almost always an afterthought.

The distinction matters because agent failures in production are rarely failures of orchestration (the agent didn't pick the right tool). They are failures of control: the agent did something unexpected and nobody could stop it before it propagated.

**Four control plane primitives**

---

**1. Execution visibility**

At any moment, an operator should be able to answer:
- What is the agent currently doing?
- What has it done in the last N steps?
- What tool calls are pending or in flight?

This requires structured emission of execution events — not free-text logs, but typed events with step identifiers, tool call parameters, and outcome records.

**2. Interrupt conditions**

Rules evaluated at each step that can pause or terminate execution:

- Budget limits (token spend, API call count, wall time)
- Anomaly conditions (unexpected tool call sequence, out-of-distribution inputs)
- Policy violations (tool call to restricted endpoint)

Interrupts should be declarative — defined in configuration, not hardcoded in agent logic — so they can be updated without deploying new agent code.

**3. Approval gates**

For high-stakes actions (writes, external API calls, irreversible operations), require explicit human or automated approval before execution:

- Gate triggers defined per tool or action type
- Approval captured as a signed record (who approved, when, with what context)
- Timeout behavior (auto-reject or auto-approve after N seconds, based on action risk level)

**4. Replay and attribution**

Every completed execution should be replayable: given the same initial state, inputs, and tool outputs, the agent should produce the same trajectory. This requires:

- Deterministic prompt construction (no random context injection)
- Recorded tool outputs at the time of execution
- Captured model responses before any post-processing

Replayability is the foundation of post-incident analysis. Without it, "what happened" is a narrative reconstruction, not a verified trace.

**The operational contract**

A production-grade agentic runtime should expose a contract to operators: these are the things you can observe, these are the things you can constrain, these are the conditions under which the system will stop itself, and these are the records that prove what happened.

Building this contract after the fact is expensive. The frameworks make it easy to build capable agents. Building the control plane alongside, from the start, is the discipline that separates deployed systems from demos.`,
  },
  {
    slug: "vector-search-compliance",
    title: "Vector search in compliance-sensitive retrieval",
    date: "2025-08-15",
    readTime: "7 min",
    tags: ["AI", "Infrastructure"],
    description:
      "pgvector and ParadeDB for RAG in financial environments. What changes when retrieval results are evidence, not suggestions — and how to build systems that satisfy both relevance and auditability requirements.",
    body: `Retrieval-augmented generation treats search as infrastructure. In compliance-sensitive environments, search results are evidence — and evidence has requirements that relevance scores alone do not satisfy.

**What changes when results are evidence**

Standard information retrieval optimizes for relevance: return the documents most likely to be useful to this query. Evidence retrieval must also optimize for:

- Attributability: every retrieved chunk traceable to its source document, version, and access record
- Stability: the same query against the same corpus returns the same ranked results (or the difference is explainable)
- Completeness: the retrieval system can demonstrate that it searched the full authorized corpus

In financial and legal RAG systems, a failure to retrieve relevant documents is a different kind of failure than a precision failure. "The model didn't know" is not acceptable if the document was in the corpus and retrieval missed it.

**pgvector and ParadeDB**

pgvector provides approximate nearest neighbor search inside Postgres. Its primary advantage in compliance contexts: everything is in one database, transactions apply, and the access log is the same access log used for every other table.

ParadeDB extends Postgres with BM25 (full-text) indexing alongside vector search, enabling hybrid retrieval without a separate Elasticsearch cluster. Hybrid retrieval matters for compliance documents: vector search captures semantic similarity, BM25 captures exact term matches for regulatory identifiers, clause numbers, and defined terms.

The architecture choice — keeping retrieval inside Postgres — is not primarily a performance choice. It is an audit architecture choice. One database, one access log, one permission model.

**Schema design for attributable retrieval**

Minimum viable schema for an attributable chunk store:

- chunk_id: stable identifier
- source_document_id: FK to document registry
- source_document_version: at ingestion time
- chunk_index: position within document
- chunk_text: original text
- embedding: vector representation
- ingested_at: timestamp
- ingestion_run_id: FK to ingestion audit log

Every retrieval query is logged with: query_id, query_embedding, top_k requested, chunk_ids returned, scores, and the caller context (user/system/agent).

This schema answers the audit question: "For this decision, which documents were retrieved, from which version of the corpus, and who or what requested them?"

**Latency vs. auditability tradeoffs**

Approximate nearest neighbor (ANN) indexes (HNSW, IVFFlat) trade accuracy for speed. In compliance contexts, this tradeoff needs an explicit policy decision: is it acceptable to miss relevant documents in exchange for p99 latency targets?

For many financial retrieval use cases, exact search at the scale of internal document corpora (typically tens of millions of chunks, not billions) is feasible within acceptable latency budgets. The default should be exact search with ANN as an explicit, documented choice when scale requires it.

**The retrieval evaluation problem**

Vector search quality is typically measured by recall@k on a benchmark set. Compliance retrieval quality also requires:

- Measuring retrieval gaps: documents that should have been retrieved but were not
- Monitoring embedding drift: as the model changes, does retrieval quality degrade for existing queries
- Testing against regulatory update cycles: when new regulations are issued, can the system retrieve them accurately for queries that predate the update

These are operational requirements, not one-time evaluation tasks. The retrieval system needs ongoing evaluation infrastructure, not just an initial benchmark.`,
  },
  {
    slug: "ai-governance-financial-systems",
    title: "AI governance for financial systems: a practitioner view",
    date: "2025-06-03",
    readTime: "9 min",
    tags: ["AI", "Governance"],
    description:
      "What AI governance actually means at the implementation layer — not the policy layer. Covers model risk management, evaluation gates, observability requirements, and the organizational structures that make governance real rather than nominal.",
    body: `AI governance in financial services is increasingly a regulatory requirement and decreasingly a vague aspiration. The gap between policy-level governance documents and implemented governance controls is where auditors are now spending their time.

This note covers the implementation layer — what governance looks like in running systems, not in compliance frameworks.

**Model risk management extended to LLMs**

SR 11-7, the Fed's model risk management guidance, defines a model as a system that applies statistical or mathematical methods to estimate outcomes. Large language models are models under this definition. SR 11-7 compliance requires:

- Model inventory entry with intended use, limitations, and owner
- Validation by a party independent of development
- Ongoing monitoring with defined performance thresholds and escalation triggers
- Documentation of material changes (including prompt changes, retrieval corpus updates, and model version upgrades)

The challenge: SR 11-7 was written for quantitative models with numeric outputs and measurable error rates. LLMs produce text. Adapting the framework requires defining what "performance" means for each LLM application, and what constitutes a "material change."

**Evaluation gates in practice**

Evaluation gates are automated checks that block deployment when a model or prompt change fails defined quality thresholds. In practice, the hard part is not running the evaluations — it is defining the acceptance criteria.

For a legal document extraction system, acceptance criteria might include:
- Extraction accuracy on a held-out validation set: ≥ 94%
- Refusal rate on out-of-scope queries: ≥ 98%
- Consistency: same document, same query, same result class across 10 runs: ≥ 99%

These numbers are not industry standards. They are negotiated with risk, compliance, and the business unit based on the downstream consequences of extraction errors. Setting them requires understanding how the model output is used, not just how accurate it is in the abstract.

**Observability requirements**

Production AI systems in financial services need observability at three layers:

Infrastructure layer: standard — latency, error rates, throughput, resource utilization.

Application layer: request volume by model and prompt version, token consumption, cost per operation, cache hit rates.

Governance layer: this is the layer most systems lack. Required metrics:
- Prompt version distribution across production requests (are outdated prompts still being called?)
- Evaluation coverage: what percentage of production input patterns are covered by the evaluation set?
- Anomaly rate: requests that fall outside the distribution of the training/evaluation data
- Human review rate: for systems with human-in-the-loop gates, what percentage of outputs are being reviewed vs. auto-approved?

Governance layer metrics require instrumentation decisions made at system design time. They cannot be added reliably after the fact.

**Organizational structures**

Governance controls are implemented by humans and can be circumvented by humans. The organizational questions matter as much as the technical ones:

- Who owns the model inventory, and how is it kept current?
- Who has authority to approve production deployments of new model versions?
- Who has authority to emergency-override evaluation gates, and is that override logged?
- Who reviews governance metrics, and at what frequency?
- What is the escalation path when a governance metric breaches threshold?

The answers need to be written down, owned by specific roles, and tested. Governance that has never been tested under pressure is governance that may not function under pressure.

**The documentation standard**

For each AI system in production, governance documentation should cover:

1. System card: intended use, known limitations, risk classification
2. Model provenance: which model version, from which provider, accessed via which API version
3. Prompt registry: all prompts in production, with version history and approval records
4. Evaluation report: most recent evaluation run results against current acceptance criteria
5. Change log: all material changes since last validation, with approvals
6. Monitoring report: current governance layer metrics vs. thresholds
7. Incident log: any triggered alerts or override events since last review

This documentation does not need to be comprehensive to be useful. It needs to be current and accurate. A 10-page document that is 6 months out of date is worse than a 2-page document updated last week.`,
  },
  {
    slug: "mlops-pipelines-high-reliability",
    title: "MLOps for high-reliability environments",
    date: "2025-04-18",
    readTime: "6 min",
    tags: ["AI", "Infrastructure"],
    description:
      "Kubeflow, ArgoCD, and GitOps patterns for ML pipelines where model failures have downstream consequences. Covers training pipeline design, deployment gating, and rollback mechanisms.",
    body: `High-reliability ML deployments differ from standard MLOps in one key dimension: the cost of a bad model reaching production is not a degraded user experience but a downstream decision error with measurable consequence.

This changes the design priorities.

**Pipeline architecture**

The training pipeline is a production system, not a data science artifact. It runs on the same infrastructure standards as any other production workload: versioned, reproducible, auditable.

Minimum requirements:
- Parameterized runs: all hyperparameters, dataset versions, and preprocessing configurations are input parameters, not hardcoded values
- Artifact versioning: model weights, preprocessors, evaluation reports, and training data snapshots are stored with content-addressed identifiers
- Reproducible execution: given the same parameters and dataset version, the pipeline produces the same trained model (or the difference is documented and acceptable)

Kubeflow Pipelines provides the orchestration layer. The critical configuration: each pipeline step runs in an isolated container with pinned dependencies, and intermediate artifacts are stored in a content-addressed store (MinIO or S3) before the next step begins. No in-memory artifact passing between steps.

**Deployment gating**

The transition from "trained model" to "deployed model" is a gate, not a promotion. The gate checks:

1. Evaluation results vs. acceptance thresholds (automated)
2. Comparison to current production model on held-out test set (automated)
3. Changelog review: what changed since the last approved model (manual or semi-automated)
4. Approval record: who approved deployment, when, based on which evaluation run ID

In ArgoCD + GitOps terms: the evaluation pipeline writes evaluation results to a model registry. A promotion step checks results against configured thresholds and, if passing, opens a PR to the deployment repository with the new model reference. The PR is the approval gate — merge is deployment.

This pattern makes deployments auditable by default. Every deployment is a git commit with a PR review and an attached evaluation report.

**Rollback mechanisms**

For model deployments, rollback is not "redeploy the previous version" — it is "identify and restore the exact artifact that was previously in production."

Requirements:
- Every deployment records the model artifact ID (content hash), not just a version label
- The deployment system can restore a previous artifact in under 5 minutes without requiring a new training run
- Rollback is tested regularly on non-production environments

The common failure mode: rollback procedures exist in documentation but have not been tested. When a rollback is needed under pressure, the procedure fails because a dependency has changed, a storage path has moved, or the restore process requires permissions that are not configured.

**Monitoring for model-specific failures**

Standard infrastructure monitoring (latency, error rate) is necessary but not sufficient. Model-specific monitoring:

- Prediction distribution: is the model producing outputs in the expected distribution? Sudden shifts in output class distribution indicate input distribution shift or model behavior change.
- Feature distribution: are the input features within the distribution seen during training? Out-of-distribution inputs produce unreliable outputs.
- Business metric correlation: for models connected to downstream business processes, monitor the business metric alongside the model metric. A model with high technical accuracy that is causing downstream process failures has a problem that technical metrics won't surface.

Monitoring infrastructure is defined at deployment time. The question to answer before deploying: "If this model starts failing silently, what metric will tell us, how long will it take to tell us, and who will see the alert?"

If that question doesn't have a clear answer, the model is not ready to deploy.`,
  },
]

export function getNoteBySlug(slug: string): Note | undefined {
  return NOTES.find((n) => n.slug === slug)
}
