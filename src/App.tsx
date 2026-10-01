/**
 * Agent Harness & Eval Studio - Main Application Component
 */
import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ConceptGuide } from './components/ConceptGuide';
import { HarnessRunner } from './components/HarnessRunner';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ConstraintLab } from './components/ConstraintLab';
import { IterationVersion } from './types/agent';
import { Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guide');
  const [selectedIteration, setSelectedIteration] = useState<IterationVersion>('v3-guardrailed');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [inspectedTestCaseId, setInspectedTestCaseId] = useState<string>('tc-02');

  // Check backend server status for Gemini API presence
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Deterministic engine is default
        setHasGeminiKey(false);
      });
  }, []);

  const handleInspectTestCase = (tcId: string) => {
    setInspectedTestCaseId(tcId);
    setActiveTab('runner');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedIteration={selectedIteration}
        setSelectedIteration={setSelectedIteration}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'guide' && (
          <ConceptGuide onStartTesting={() => setActiveTab('runner')} />
        )}

        {activeTab === 'runner' && (
          <HarnessRunner
            selectedIteration={selectedIteration}
            setSelectedIteration={setSelectedIteration}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkSuite
            selectedIteration={selectedIteration}
            setSelectedIteration={setSelectedIteration}
            onInspectTestCase={handleInspectTestCase}
          />
        )}

        {activeTab === 'dashboard' && <MetricsDashboard />}

        {activeTab === 'constraints' && <ConstraintLab />}
      </main>

      {/* Editorial Footer (Strict anti-slop, clean typography) */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-700" />
            <span className="font-semibold text-zinc-900">Agent Harness & Eval Studio</span>
            <span aria-hidden="true">·</span>
            <span>NovaStore Case Study</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-zinc-900 transition-colors"
            >
              Harness vs. Evals Primer
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-zinc-900 transition-colors"
            >
              Feedback Loop Metrics
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('constraints')}
              className="hover:text-zinc-900 transition-colors"
            >
              Constraint Enforcement
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
