import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';
import { HISTORICAL_ITERATION_METRICS, ITERATION_CONFIGS } from '../data/mockData';
import { IterationVersion } from '../types/agent';

export const MetricsDashboard: React.FC = () => {
  const [selectedMetricView, setSelectedMetricView] = useState<'pass_rate' | 'hallucination' | 'safety' | 'bias'>('pass_rate');
  const [reportExported, setReportExported] = useState<boolean>(false);

  const metrics = HISTORICAL_ITERATION_METRICS;

  const handleExportReport = () => {
    const reportData = {
      title: 'Agent Harness & Evaluation Audit Report - NovaStore Case Study',
      exportedAt: new Date().toISOString(),
      summary: 'Demonstrating continuous improvement via test harnesses, multi-tier evals, and programmatic invariants.',
      iterations: metrics,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-harness-eval-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <span>Continuous Improvement Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Iterative Cycle Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Performance Metrics Over Time
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Visualizing how systematic harness invariants and multi-tier evals eliminated hallucinations, bias, and unauthorized financial payouts.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{reportExported ? 'Audit Report Exported!' : 'Export Eval Audit Report'}</span>
        </button>
      </div>

      {/* KPI High-Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass Rate KPI */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Overall Pass Rate</span>
            <span className="flex items-center text-emerald-600 font-semibold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +63% overall
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">98%</span>
            <span className="text-xs text-zinc-500">up from 35% in v1</span>
          </div>
          <p className="text-xs text-zinc-500">
            Comprehensive golden benchmark test suite compliance.
          </p>
        </div>

        {/* Hallucination Rate KPI */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Hallucination Rate</span>
            <span className="flex items-center text-emerald-600 font-semibold text-xs">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -45% to ZERO
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">0.0%</span>
            <span className="text-xs text-zinc-500">down from 45% in v1</span>
          </div>
          <p className="text-xs text-zinc-500">
            Enforced by post-execution RAG Faithfulness Verifier.
          </p>
        </div>

        {/* Financial Invariant Pass Rate */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Financial Safety Invariant</span>
            <span className="flex items-center text-emerald-600 font-semibold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 100% compliant
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">100%</span>
            <span className="text-xs text-zinc-500">up from 20% in v1</span>
          </div>
          <p className="text-xs text-zinc-500">
            Programmatic $150 cap blocks unauthorized tool refunds.
          </p>
        </div>

        {/* Bias Disparity Gap */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Linguistic Bias Disparity</span>
            <span className="flex items-center text-emerald-600 font-semibold text-xs">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Disparity closed
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">2%</span>
            <span className="text-xs text-zinc-500">down from 60% in v1</span>
          </div>
          <p className="text-xs text-zinc-500">
            Identical favorable return outcome regardless of dialect.
          </p>
        </div>
      </div>

      {/* Main Interactive Visual Charts Section */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 lg:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Iterative Feedback Loop Progression Trends
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tracking core evaluation dimensions across 3 engineering iteration cycles.
            </p>
          </div>

          {/* Metric View Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedMetricView('pass_rate')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedMetricView === 'pass_rate'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Pass Rate (%)
            </button>
            <button
              onClick={() => setSelectedMetricView('hallucination')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedMetricView === 'hallucination'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Hallucinations (%)
            </button>
            <button
              onClick={() => setSelectedMetricView('safety')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedMetricView === 'safety'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Financial Safety (%)
            </button>
            <button
              onClick={() => setSelectedMetricView('bias')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedMetricView === 'bias'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Bias Disparity (%)
            </button>
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div className="relative h-64 sm:h-72 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="155" x2="580" y2="155" stroke="#e2e8f0" strokeWidth="1" />

            {/* Y-axis labels */}
            <text x="30" y="24" fontSize="10" fill="#94a3b8" textAnchor="end">100%</text>
            <text x="30" y="69" fontSize="10" fill="#94a3b8" textAnchor="end">75%</text>
            <text x="30" y="114" fontSize="10" fill="#94a3b8" textAnchor="end">50%</text>
            <text x="30" y="159" fontSize="10" fill="#94a3b8" textAnchor="end">0%</text>

            {/* Data Points */}
            {selectedMetricView === 'pass_rate' && (
              <>
                {/* Area Gradient */}
                <defs>
                  <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 108 L 340 63 L 520 22 L 520 155 L 120 155 Z"
                  fill="url(#passGrad)"
                />
                <path
                  d="M 120 108 L 340 63 L 520 22"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Dots */}
                <circle cx="120" cy="108" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="340" cy="63" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="520" cy="22" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                {/* Value labels */}
                <text x="120" y="98" fontSize="11" fontWeight="bold" fill="#312e81" textAnchor="middle">35%</text>
                <text x="340" y="53" fontSize="11" fontWeight="bold" fill="#312e81" textAnchor="middle">68%</text>
                <text x="520" y="14" fontSize="11" fontWeight="bold" fill="#312e81" textAnchor="middle">98%</text>
              </>
            )}

            {selectedMetricView === 'hallucination' && (
              <>
                <defs>
                  <linearGradient id="halGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 94 L 340 130 L 520 155 L 520 155 L 120 155 Z"
                  fill="url(#halGrad)"
                />
                <path
                  d="M 120 94 L 340 130 L 520 155"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="94" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="340" cy="130" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="520" cy="155" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <text x="120" y="84" fontSize="11" fontWeight="bold" fill="#991b1b" textAnchor="middle">45%</text>
                <text x="340" y="120" fontSize="11" fontWeight="bold" fill="#991b1b" textAnchor="middle">18%</text>
                <text x="520" y="145" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">0.0% (Zero)</text>
              </>
            )}

            {selectedMetricView === 'safety' && (
              <>
                <defs>
                  <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 128 L 340 74 L 520 20 L 520 155 L 120 155 Z"
                  fill="url(#safeGrad)"
                />
                <path
                  d="M 120 128 L 340 74 L 520 20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="128" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="340" cy="74" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="520" cy="20" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <text x="120" y="118" fontSize="11" fontWeight="bold" fill="#991b1b" textAnchor="middle">20%</text>
                <text x="340" y="64" fontSize="11" fontWeight="bold" fill="#92400e" textAnchor="middle">60%</text>
                <text x="520" y="12" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">100%</text>
              </>
            )}

            {selectedMetricView === 'bias' && (
              <>
                <defs>
                  <linearGradient id="biasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 74 L 340 108 L 520 152 L 520 155 L 120 155 Z"
                  fill="url(#biasGrad)"
                />
                <path
                  d="M 120 74 L 340 108 L 520 152"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="74" r="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="340" cy="108" r="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="520" cy="152" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <text x="120" y="64" fontSize="11" fontWeight="bold" fill="#5b21b6" textAnchor="middle">60% disparity</text>
                <text x="340" y="98" fontSize="11" fontWeight="bold" fill="#5b21b6" textAnchor="middle">35% disparity</text>
                <text x="520" y="142" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">2% parity</text>
              </>
            )}

            {/* X-axis labels */}
            <text x="120" y="175" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">
              Cycle 1: Naive Base
            </text>
            <text x="340" y="175" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">
              Cycle 2: Prompt Engineered
            </text>
            <text x="520" y="175" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">
              Cycle 3: Guardrailed Harness
            </text>
          </svg>
        </div>
      </div>

      {/* Root-Cause Failure Pareto Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-900">
              Root-Cause Pareto Triage: Why v1 Failed
            </h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            In Iteration 1, 65% of test runs failed. Evals categorized failures into 4 distinct architectural flaws:
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                cause: 'Unauthorized Financial Tool Execution',
                pct: 35,
                color: 'bg-rose-500',
                fix: 'Fixed in v3 via Programmatic Tool Invariant (assert amount <= $150).',
              },
              {
                cause: 'Policy Hallucination & Fake Warranties',
                pct: 30,
                color: 'bg-amber-500',
                fix: 'Fixed in v3 via Post-Execution Grounding Verifier against Policy DB.',
              },
              {
                cause: 'Toxic / Defensive Tone Mirroring',
                pct: 20,
                color: 'bg-purple-500',
                fix: 'Fixed in v3 via Section 5 De-escalation Wrapper template.',
              },
              {
                cause: 'Linguistic / Dialect Disparity',
                pct: 15,
                color: 'bg-blue-500',
                fix: 'Fixed in v3 via Pre-Guardrail semantic intent normalization.',
              },
            ].map((item) => (
              <div key={item.cause} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-zinc-800">
                  <span className="font-medium">{item.cause}</span>
                  <span className="font-semibold">{item.pct}% of failures</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct * 2.8}%` }} />
                </div>
                <div className="text-[11px] text-zinc-500">{item.fix}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Iteration Version Comparative Table */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-semibold text-zinc-900">
              Cycle-Over-Cycle Architectural Evolution
            </h3>
          </div>
          <p className="text-xs text-zinc-600">
            A side-by-side comparison of the 3 iterations along key operational dimensions:
          </p>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="pb-2">Dimension</th>
                  <th className="pb-2">v1.0 Naive</th>
                  <th className="pb-2">v2.0 Prompted</th>
                  <th className="pb-2">v3.0 Guardrailed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="py-2.5 font-medium text-zinc-700">Prompt Strategy</td>
                  <td className="py-2.5 text-zinc-600">Zero-shot</td>
                  <td className="py-2.5 text-zinc-600">500-word prompt</td>
                  <td className="py-2.5 text-zinc-900 font-semibold">Structured + Policies</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-zinc-700">Financial Cap</td>
                  <td className="py-2.5 text-rose-600 font-medium">None (Breached)</td>
                  <td className="py-2.5 text-amber-600">Prompt instruction only</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Hard Code Assertion</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-zinc-700">Grounding Verifier</td>
                  <td className="py-2.5 text-rose-600 font-medium">Disabled (45% hal)</td>
                  <td className="py-2.5 text-amber-600">Partial (18% hal)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Active (0.0% hal)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-zinc-700">Adversarial Defense</td>
                  <td className="py-2.5 text-rose-600 font-medium">Vulnerable ($500 grant)</td>
                  <td className="py-2.5 text-amber-600">Weak ($50 gift card)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Pre-guardrail blocked</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-zinc-700">Latency & Tokens</td>
                  <td className="py-2.5 text-zinc-600">380ms · 210 toks</td>
                  <td className="py-2.5 text-zinc-600">510ms · 480 toks</td>
                  <td className="py-2.5 text-zinc-900 font-semibold">640ms · 520 toks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
