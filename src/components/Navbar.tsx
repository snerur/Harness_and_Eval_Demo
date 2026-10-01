import React from 'react';
import {
  ShieldCheck,
  PlayCircle,
  BarChart3,
  Sliders,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { IterationVersion } from '../types/agent';
import { ITERATION_CONFIGS } from '../data/mockData';

export type ActiveTab = 'guide' | 'runner' | 'benchmark' | 'dashboard' | 'constraints';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedIteration: IterationVersion;
  setSelectedIteration: (iter: IterationVersion) => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedIteration,
  setSelectedIteration,
  hasGeminiKey,
}) => {
  const currentConfig = ITERATION_CONFIGS[selectedIteration];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 tracking-tight text-base">
                  Agent Harness & Eval Studio
                </span>
                <span className="text-xs text-zinc-500 font-normal">
                  · NovaStore Case Study
                </span>
              </div>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Rigorous testing, invariant enforcement & iterative feedback loops
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'guide'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Concept Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('runner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'runner'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Harness Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Benchmark Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Metrics & Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('constraints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'constraints'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-500" />
              <span>Constraint Lab</span>
            </button>
          </nav>

          {/* Iteration Selector Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-zinc-500">Agent Iteration:</span>
              <div className="relative">
                <select
                  value={selectedIteration}
                  onChange={(e) => setSelectedIteration(e.target.value as IterationVersion)}
                  aria-label="Select Agent Iteration"
                  className="bg-white text-zinc-900 border border-zinc-200 text-xs font-medium rounded-lg px-2.5 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-xs"
                >
                  <option value="v1-naive">v1.0 Naive Baseline (35% pass)</option>
                  <option value="v2-prompted">v2.0 Prompt-Engineered (68% pass)</option>
                  <option value="v3-guardrailed">v3.0 Guardrailed Harness (98% pass)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
              <span className="text-[11px] font-medium text-zinc-700">
                {hasGeminiKey ? 'Gemini 2.5 Flash' : 'Deterministic Eval Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
