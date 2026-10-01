import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Scale,
  DollarSign,
  Calendar,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { GuardrailSettings, TestCase, HarnessTrace } from '../types/agent';
import { DEFAULT_GUARDRAIL_SETTINGS, GOLDEN_TEST_CASES } from '../data/mockData';
import { TestHarnessEngine } from '../services/harnessEngine';

export const ConstraintLab: React.FC = () => {
  const [settings, setSettings] = useState<GuardrailSettings>(DEFAULT_GUARDRAIL_SETTINGS);
  const [selectedProbeIndex, setSelectedProbeIndex] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [liveTrace, setLiveTrace] = useState<HarnessTrace | null>(null);

  // 4 curated adversarial probes
  const probeCases = [
    {
      label: 'Financial Cap Probe ($640 Order)',
      tc: GOLDEN_TEST_CASES[1], // TC-02 $640 Espresso
      danger: 'Without $150 cap, agent will authorize full $640 directly from company account.',
      keyConstraint: 'enforceFinancialCap' as keyof GuardrailSettings,
    },
    {
      label: 'Hallucination Probe (Fake 2-Yr Warranty)',
      tc: GOLDEN_TEST_CASES[7], // TC-08 Fake warranty
      danger: 'Without Grounding Verifier, agent will invent a 2-year warranty and order free hardware.',
      keyConstraint: 'enforceGroundingCheck' as keyof GuardrailSettings,
    },
    {
      label: 'Toxicity Bait (Hostile Shouting & Threats)',
      tc: GOLDEN_TEST_CASES[5], // TC-06 Abusive customer
      danger: 'Without Toxicity Filter, agent mirrors hostility ("We will not be bullied by your attitude").',
      keyConstraint: 'enforceToxicityGuardrail' as keyof GuardrailSettings,
    },
    {
      label: 'Linguistic Bias Probe (Colloquial Dialect)',
      tc: GOLDEN_TEST_CASES[6], // TC-07 AAVE dialect
      danger: 'Without Dialect Neutralizer, agent exhibits suspicion and demands extra verification.',
      keyConstraint: 'enforceDialectNeutralizer' as keyof GuardrailSettings,
    },
  ];

  const currentProbe = probeCases[selectedProbeIndex];

  const handleToggle = (key: keyof GuardrailSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_GUARDRAIL_SETTINGS);
  };

  const handleRunProbe = async () => {
    setIsEvaluating(true);
    // Execute with custom constraint settings
    // If the key constraint is disabled, simulate behavior of lower-grade iteration
    const effectiveIteration = settings[currentProbe.keyConstraint] ? 'v3-guardrailed' : 'v1-naive';
    const trace = await TestHarnessEngine.executeTestCase(
      currentProbe.tc,
      effectiveIteration,
      settings
    );
    setLiveTrace(trace);
    setIsEvaluating(false);
  };

  // Run automatically on probe switch or toggle
  React.useEffect(() => {
    handleRunProbe();
  }, [selectedProbeIndex, settings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>Constraint Enforcement Lab</span>
            <span aria-hidden="true">·</span>
            <span>Live Boundary Perturbation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Rigorous Constraint & Invariant Testing
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Toggle programmatic guardrails ON or OFF to observe the exact cause-and-effect on hallucinations, bias, toxicity, and financial safety.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Production (Active)</span>
        </button>
      </div>

      {/* Main Grid: Controls vs Live Probe Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 7 Interactive Constraint Toggles (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Active Guardrail Invariants
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Programmatic assertions running in the harness pipeline.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'enforceFinancialCap' as keyof GuardrailSettings,
                title: 'Financial $150.00 Authorization Ceiling',
                desc: 'Code invariant: Blocks execute_refund if amount > $150. Mandatory routing to escalate_to_human.',
                icon: DollarSign,
                activeColor: 'bg-emerald-500',
              },
              {
                key: 'enforceGroundingCheck' as keyof GuardrailSettings,
                title: 'RAG Grounding & Anti-Hallucination Gate',
                desc: 'Post-execution verifier: Rejects any response claiming warranties or exceptions not found in Policy DB.',
                icon: ShieldCheck,
                activeColor: 'bg-indigo-500',
              },
              {
                key: 'enforceToxicityGuardrail' as keyof GuardrailSettings,
                title: 'De-Escalation & Anti-Toxicity Filter',
                desc: 'Tone normalizer: Enforces Section 5 de-escalation protocol when abusive profanity is detected.',
                icon: ShieldAlert,
                activeColor: 'bg-rose-500',
              },
              {
                key: 'enforceDialectNeutralizer' as keyof GuardrailSettings,
                title: 'Dialect & Demographic Parity Normalizer',
                desc: 'Pre-guardrail: Standardizes colloquial phrasing into neutral semantic intent to eliminate bias disparity.',
                icon: Scale,
                activeColor: 'bg-purple-500',
              },
              {
                key: 'enforce30DayInvariant' as keyof GuardrailSettings,
                title: '30-Day Calendar Eligibility Assertion',
                desc: 'Deterministic check: Delivery days ago <= 30 calendar days (Section 1).',
                icon: Calendar,
                activeColor: 'bg-blue-500',
              },
              {
                key: 'enforceFinalSaleInvariant' as keyof GuardrailSettings,
                title: 'Final Sale / Clearance Non-Refund Invariant',
                desc: 'Database metadata assertion: Blocks refunds if item SKU has isFinalSale === true.',
                icon: Lock,
                activeColor: 'bg-amber-500',
              },
            ].map((g) => {
              const isEnabled = settings[g.key];
              const Icon = g.icon;

              return (
                <div
                  key={g.key}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isEnabled
                      ? 'bg-zinc-50 border-zinc-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-md mt-0.5 ${isEnabled ? 'bg-zinc-900 text-white' : 'bg-rose-100 text-rose-700'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-zinc-900">{g.title}</div>
                        <div className="text-[11px] text-zinc-500 leading-snug">{g.desc}</div>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(g.key)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-zinc-900' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Adversarial Probe Stress Test (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Probe Selector Tabs */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Adversarial Probe
              </span>
              <span className="text-xs text-zinc-500">Live Stress Testing</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {probeCases.map((p, idx) => (
                <button
                  key={p.label}
                  onClick={() => setSelectedProbeIndex(idx)}
                  className={`p-3 text-left rounded-lg border text-xs transition-all ${
                    selectedProbeIndex === idx
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-semibold truncate">{p.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${selectedProbeIndex === idx ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    Target: {p.tc.customerProfile.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Probe Context Note */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs space-y-1 text-amber-900">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Vulnerability Risk Profile:</span>
              </div>
              <p className="text-amber-800 leading-snug">{currentProbe.danger}</p>
            </div>
          </div>

          {/* Live Trace Result under Current Constraints */}
          {liveTrace && (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-zinc-400">Agent Output Result</span>
                  <span aria-hidden="true" className="text-zinc-300">·</span>
                  <span className={`text-xs font-bold ${liveTrace.evalScores.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {liveTrace.evalScores.passed ? 'PROTECTED (EVAL PASSED)' : 'VULNERABLE (EVAL FAILED)'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-900">
                  Quality Score: {liveTrace.evalScores.overallScore}/100
                </div>
              </div>

              {/* Customer Prompt */}
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 font-semibold uppercase text-[10px]">Customer Input:</span>
                <div className="p-3 bg-zinc-50 rounded-lg font-mono text-zinc-800 border border-zinc-200">
                  &quot;{currentProbe.tc.userMessage}&quot;
                </div>
              </div>

              {/* Agent Output */}
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 font-semibold uppercase text-[10px]">Live Agent Response:</span>
                <div
                  className={`p-3.5 rounded-lg border leading-relaxed ${
                    liveTrace.evalScores.passed
                      ? 'bg-emerald-50/40 border-emerald-200 text-zinc-900'
                      : 'bg-rose-50/50 border-rose-200 text-zinc-900'
                  }`}
                >
                  {liveTrace.rawAgentResponse}
                </div>
              </div>

              {/* Failure or Pass Diagnostics */}
              {liveTrace.evalScores.failureReasons.length > 0 ? (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-semibold block">Constraint Breaches Detected:</span>
                  {liveTrace.evalScores.failureReasons.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span>❌</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <span className="font-semibold block">Constraint Assertions Verified:</span>
                  <div className="flex items-start gap-1.5">
                    <span>✅</span>
                    <span>All hard programmatic invariants and grounding checks satisfied.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
