import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Filter,
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TestCase, IterationVersion, HarnessTrace, EvalCategory } from '../types/agent';
import { GOLDEN_TEST_CASES, ITERATION_CONFIGS } from '../data/mockData';
import { TestHarnessEngine } from '../services/harnessEngine';

interface BenchmarkSuiteProps {
  selectedIteration: IterationVersion;
  setSelectedIteration: (iter: IterationVersion) => void;
  onInspectTestCase: (tcId: string) => void;
}

export const BenchmarkSuite: React.FC<BenchmarkSuiteProps> = ({
  selectedIteration,
  setSelectedIteration,
  onInspectTestCase,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [resultsMap, setResultsMap] = useState<Record<string, HarnessTrace>>({});
  const [inspectedTrace, setInspectedTrace] = useState<HarnessTrace | null>(null);

  // Filter test cases
  const filteredCases = GOLDEN_TEST_CASES.filter((tc) => {
    if (categoryFilter === 'all') return true;
    return tc.category === categoryFilter;
  });

  // Run all benchmark cases in batch
  const handleRunAll = async () => {
    setIsRunningAll(true);
    setCompletedCount(0);
    const newResults: Record<string, HarnessTrace> = {};

    for (let i = 0; i < GOLDEN_TEST_CASES.length; i++) {
      const tc = GOLDEN_TEST_CASES[i];
      const trace = await TestHarnessEngine.executeTestCase(tc, selectedIteration);
      newResults[tc.id] = trace;
      setCompletedCount(i + 1);
      // Small pause for realistic execution streaming
      await new Promise((r) => setTimeout(r, 60));
    }

    setResultsMap(newResults);
    setIsRunningAll(false);
  };

  // Run automatically when iteration changes
  useEffect(() => {
    handleRunAll();
  }, [selectedIteration]);

  // Aggregate stats
  const totalCompleted = Object.keys(resultsMap).length;
  const passedCount = Object.values(resultsMap).filter((t) => t.evalScores.passed).length;
  const passRate = totalCompleted > 0 ? Math.round((passedCount / totalCompleted) * 100) : 0;
  const avgOverallScore = totalCompleted > 0
    ? Math.round(Object.values(resultsMap).reduce((acc, t) => acc + t.evalScores.overallScore, 0) / totalCompleted)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span>Regression & Invariant Testing</span>
            <span aria-hidden="true">·</span>
            <span>Continuous Eval Harness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Golden Benchmark Evaluation Suite
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Execute the complete battery of 10 ground-truth edge cases against the current agent architecture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Iteration Selector */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
            {(['v1-naive', 'v2-prompted', 'v3-guardrailed'] as IterationVersion[]).map((iter) => (
              <button
                key={iter}
                onClick={() => setSelectedIteration(iter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedIteration === iter
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {iter === 'v1-naive' ? 'v1.0 Naive' : iter === 'v2-prompted' ? 'v2.0 Prompted' : 'v3.0 Guardrailed'}
              </button>
            ))}
          </div>

          {/* Run All Button */}
          <button
            disabled={isRunningAll}
            onClick={handleRunAll}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isRunningAll ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Suite ({completedCount}/10)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Benchmark Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aggregate Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Test Suite Pass Rate</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-zinc-900">{passRate}%</span>
            <span className="text-xs text-zinc-500">({passedCount}/{totalCompleted} passed)</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all ${passRate >= 80 ? 'bg-emerald-500' : passRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${passRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Average Quality Score</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{avgOverallScore}/100</div>
          <div className="text-[11px] text-zinc-500 mt-1">Multi-tier weighted score</div>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Current Architecture</div>
          <div className="text-sm font-semibold text-zinc-900 mt-1 truncate">
            {ITERATION_CONFIGS[selectedIteration].name.split(':')[1] || ITERATION_CONFIGS[selectedIteration].name}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">{ITERATION_CONFIGS[selectedIteration].badge}</div>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Failure Invariant Protection</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">
            {selectedIteration === 'v3-guardrailed' ? '100%' : selectedIteration === 'v2-prompted' ? '60%' : '20%'}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Programmatic assertion rate</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-lg w-fit border border-zinc-200">
        {[
          { id: 'all', label: 'All Test Cases (10)' },
          { id: 'safety_financial', label: 'Financial Safety' },
          { id: 'hallucination', label: 'Anti-Hallucination' },
          { id: 'bias_fairness', label: 'Bias & Fairness' },
          { id: 'toxicity_deescalation', label: 'Toxicity & De-escalation' },
          { id: 'policy_logic', label: 'Policy & Arithmetic' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              categoryFilter === cat.id
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Benchmark Matrix Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Code / Test Case</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Customer Input Summary</th>
                <th className="py-3.5 px-4">Expected Ground Truth</th>
                <th className="py-3.5 px-4">Status & Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredCases.map((tc) => {
                const trace = resultsMap[tc.id];
                const isPassed = trace?.evalScores.passed;
                const score = trace?.evalScores.overallScore ?? 0;

                return (
                  <tr
                    key={tc.id}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer"
                    onClick={() => trace && setInspectedTrace(trace)}
                  >
                    <td className="py-4 px-4 font-medium text-zinc-900">
                      <div className="font-semibold text-zinc-900">{tc.code}</div>
                      <div className="text-[11px] text-zinc-500 font-normal">{tc.title}</div>
                    </td>

                    <td className="py-4 px-4 text-zinc-600">
                      <span className="font-medium">
                        {tc.category === 'safety_financial'
                          ? 'Financial Safety'
                          : tc.category === 'hallucination'
                          ? 'Anti-Hallucination'
                          : tc.category === 'bias_fairness'
                          ? 'Bias Parity'
                          : tc.category === 'toxicity_deescalation'
                          ? 'De-escalation'
                          : 'Policy Rules'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-zinc-600 max-w-xs">
                      <div className="line-clamp-2 italic text-zinc-700">
                        &quot;{tc.userMessage}&quot;
                      </div>
                    </td>

                    <td className="py-4 px-4 text-zinc-600 max-w-xs">
                      <div className="line-clamp-2">
                        {tc.groundTruth.expectedAction === 'approve_refund' && 'Approve full refund under Section 1'}
                        {tc.groundTruth.expectedAction === 'partial_refund_restock' && 'Apply 15% restocking fee (Section 2)'}
                        {tc.groundTruth.expectedAction === 'decline_policy' && 'Politely decline outside return window / Final sale'}
                        {tc.groundTruth.expectedAction === 'escalate_human' && 'Escalate to human (Amount exceeds $150 cap)'}
                        {tc.groundTruth.expectedAction === 'request_clarification' && 'Request valid Order ID'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {trace ? (
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <div>
                            <span className={`font-semibold ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {isPassed ? 'PASSED' : 'FAILED'}
                            </span>
                            <span className="text-[11px] text-zinc-500 ml-1.5">({score}/100)</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">Pending execution...</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectTestCase(tc.id);
                        }}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <span>Open in Runner</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Drawer / Inspection Modal */}
      {inspectedTrace && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-zinc-200 shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase">Test Case Evaluation Detail</span>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {GOLDEN_TEST_CASES.find((t) => t.id === inspectedTrace.testCaseId)?.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectedTrace(null)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <div>
                  <span className="text-zinc-500">Evaluation Outcome:</span>
                  <span className={`font-semibold ml-2 ${inspectedTrace.evalScores.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {inspectedTrace.evalScores.passed ? 'PASSED (Meets All Specifications)' : 'FAILED (Specification Breached)'}
                  </span>
                </div>
                <div className="font-semibold text-zinc-900">Score: {inspectedTrace.evalScores.overallScore}/100</div>
              </div>

              <div>
                <span className="font-semibold text-zinc-700 block mb-1">Agent Response:</span>
                <div className="p-3 bg-zinc-50 rounded-lg text-zinc-800 leading-relaxed border border-zinc-200">
                  {inspectedTrace.rawAgentResponse}
                </div>
              </div>

              {inspectedTrace.evalScores.failureReasons.length > 0 && (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 space-y-1">
                  <span className="font-semibold block">Failure Diagnostics:</span>
                  {inspectedTrace.evalScores.failureReasons.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {inspectedTrace.evalScores.passedTestCriteria.length > 0 && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 space-y-1">
                  <span className="font-semibold block">Passed Criteria:</span>
                  {inspectedTrace.evalScores.passedTestCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedTrace(null)}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
