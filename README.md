# Agent Harness & Eval Studio

An interactive workbench and educational framework demonstrating how **test harnesses**, **multi-tier evaluations (evals)**, and **iterative feedback loops** are used to build, test, and continuously improve reliable agentic AI applications.

---

## Overview

Deploying Large Language Model (LLM) agents into production business workflows requires moving beyond basic prompt engineering. Because language models are probabilistic, traditional unit testing alone is insufficient to guarantee safety, business policy adherence, and brand alignment.

This project implements an end-to-end testing and evaluation architecture using a concrete business scenario: **The NovaStore E-Commerce Order Resolution & Refund Agent**. It demonstrates how to systematically eliminate:
- **Hallucinations**: Fabricating return policies, warranties, or unauthorized exceptions.
- **Unintended Bias**: Inequitable treatment or disparate friction across colloquial, regional, or demographic dialects (e.g., AAVE vs. formal English).
- **Toxic Outputs & Mirroring**: Becoming defensive, sarcastic, or hostile when dealing with abusive customers.
- **Financial Breaches**: Programmatically preventing unauthorized payouts exceeding company spending limits ($150 limit).

---

## Key Architecture Concepts

### 1. The Test Harness (The Execution Sandbox)
A test harness wraps the agent inside an isolated, instrumented execution environment:
- **Mock Environment & Fixtures**: Injects simulated order records, customer histories, and policy knowledge bases without connecting to production databases.
- **Pre-Execution Guardrails**: Scans incoming inputs for prompt injections, adversarial overrides (`[DEBUG_MODE]`), and abusive language before reaching the model. Normalizes dialect style into standardized semantic intent.
- **Tool Interception & Sandboxing**: Intercepts external tool calls (e.g. `execute_refund`, `lookup_order`) to execute hard deterministic invariants before state changes can occur.
- **Trace Recorder**: Captures microsecond-level telemetry, internal chain-of-thought, token usage, and latency.

### 2. Multi-Tier Evaluations (Evals)
Rather than relying on a single vague score, evals grade the agent's performance across multiple orthogonal dimensions:
- **Tier 1: Deterministic Invariants (Fast, Binary, Code-Level)**
  - *Financial Cap*: Programmatic assertion that refunds never exceed \$150.00.
  - *Return Window*: Deterministic date subtraction ensuring orders $>30$ days are rejected.
  - *Final Sale Rule*: Structural metadata check preventing refunds on clearance items.
- **Tier 2: RAG Grounding Faithfulness (Anti-Hallucination)**
  - Compares every statement in the agent's response against retrieved ground-truth store policy documents. Ungrounded claims or non-existent warranties trigger an eval failure.
- **Tier 3: Demographic & Linguistic Parity (Algorithmic Fairness)**
  - Tests identical return requests phrased in colloquial dialects against formal baselines to ensure zero disparity in policy outcome or customer warmth.
- **Tier 4: De-escalation & Brand Safety**
  - Evaluates whether hostile, profane, or legally threatening prompts are de-escalated calmly while firmly upholding policy.

### 3. The Continuous Iterative Feedback Loop
The studio structures the continuous improvement cycle in 6 phases:
1. **Define Hard Specifications**: Codify policies into unambiguous programmatic contracts.
2. **Curate Golden Benchmark Dataset**: Build edge cases covering adversarial prompts, sob stories, high-value returns, and jailbreaks.
3. **Execute inside Test Harness**: Run agents in the instrumented sandbox.
4. **Run Multi-Tier Evals**: Automatically grade against ground-truth criteria.
5. **Root-Cause Failure Triage**: Categorize failures (Prompt Ambiguity vs. Missing Tool Invariant vs. Retrieval Gap).
6. **Enforce Constraints & Re-evaluate**: Add code assertions and verifiers; re-run suite to prevent regressions.

---

## Evolution of the Agent (Cycle-by-Cycle Metrics)

| Dimension | Cycle 1: Naive Base | Cycle 2: Prompt-Engineered | Cycle 3: Guardrailed Harness |
| :--- | :--- | :--- | :--- |
| **Strategy** | Zero-shot prompt | 500-word detailed prompt | Hard Invariants + Grounding Gate |
| **Overall Pass Rate** | **35%** | **68%** | **98%** |
| **Hallucination Rate** | 45% (makes up policies) | 18% (subtle slips) | **0.0% (Zero)** |
| **Financial Safety** | 20% (refunds $640 directly) | 60% (hesitates/splits) | **100% (Programmatic Limit)** |
| **Dialect Disparity** | 60% disparity | 35% disparity | **2% parity** |
| **Toxicity Resistance** | 30% (mirrors anger) | 70% (polite but defensive) | **100% (De-escalation protocol)** |

---

## Interactive Application Features

1. **Concept Guide**: An interactive primer visually contrasting Test Harnesses vs. Evals, with an explorable diagram of the 6-stage iterative loop.
2. **Test Harness Runner**:
   - 5-stage pipeline animation (Mock Fixtures $\to$ Pre-Guardrails $\to$ Agent Reasoning $\to$ Tool Invariant Sandbox $\to$ Multi-Tier Evals).
   - Side-by-side mode comparing v1.0 Naive vs. v3.0 Guardrailed on identical inputs.
   - Interactive trace inspector for thoughts, sandboxed tool calls, and eval scorecards.
   - Custom scenario creator.
3. **Benchmark Suite**: Batch runner executing 10 golden benchmark edge cases with filtering, real-time streaming, and drill-down diagnostics.
4. **Performance Metrics Dashboard**:
   - Custom SVG time-series charts displaying pass rates, hallucination reduction, and financial compliance over time.
   - Root-cause Pareto failure triage analysis.
   - One-click JSON audit report exporter.
5. **Constraint Enforcement Lab**: Live interactive toggles for 6 core invariants, allowing developers to see the immediate impact of disabling or enabling specific guardrails.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend / Dev Server**: Node.js, Express, Vite, tsx
- **AI / SDK**: `@google/genai` (Gemini 2.5 Flash server proxy with fallback deterministic evaluation simulation)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start on `http://localhost:3000`.

### Environment Variables
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Note: If no API key is provided, the application runs in high-fidelity deterministic evaluation engine mode).*

---

## Pushing to your GitHub Repository

To push this codebase to your own GitHub repository:

```bash
# 1. Initialize git in the project root
git init

# 2. Add all project files
git add .

# 3. Create your first commit
git commit -m "feat: complete Agent Harness & Eval Studio application"

# 4. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Rename default branch to main and push
git branch -M main
git push -u origin main
```
