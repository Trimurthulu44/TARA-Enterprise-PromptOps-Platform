import React, { useState } from 'react';
import { 
  ShieldCheck, Brain, Target, Sparkles, TrendingUp, 
  Clock, DollarSign, Layers, CheckCircle2, AlertTriangle, 
  Award, BarChart3, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { PromptQualityScore } from '../types';

interface PQSScoreVisualizerProps {
  score: PromptQualityScore;
  onOptimizeClick?: () => void;
}

export const PQSScoreVisualizer: React.FC<PQSScoreVisualizerProps> = ({ score, onOptimizeClick }) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'core' | 'enterprise' | 'public'>('core');

  const { overallScore, tier, health, recommendation, core, enterprise, public: pub } = score;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Banner: Overall Score Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Prompt Quality Score (PQS) v2.4</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Overall Prompt Health & Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Deterministic, multi-dimensional AI scoring evaluated across 26 criteria before deployment to LLMs.
            </p>
          </div>

          {/* Master 0 - 100 Score Meter */}
          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{overallScore}</span>
                <span className="text-[10px] text-slate-300 font-medium">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>{health}</span>
              </div>
              <div className="text-sm font-extrabold text-white">
                {tier}
              </div>
              <div className="text-[11px] text-indigo-200 font-medium">
                {recommendation}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Summary Ticker */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
            <div className="text-base font-bold text-white mt-0.5">{core.accuracy}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Security</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{core.security}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">LLM Judge</div>
            <div className="text-base font-bold text-white mt-0.5">{core.llmJudge}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Clarity</div>
            <div className="text-base font-bold text-white mt-0.5">{core.clarity}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Cost Eff.</div>
            <div className="text-base font-bold text-white mt-0.5">{core.costEfficiency}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Predicted Latency</div>
            <div className="text-base font-bold text-indigo-300 mt-0.5">{core.latencyPredictionMs}ms</div>
          </div>
        </div>
      </div>

      {/* Metric Categories Navigation */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMetricTab('core')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetricTab === 'core'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core Metrics (10)
          </button>
          <button
            onClick={() => setActiveMetricTab('enterprise')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetricTab === 'enterprise'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Enterprise Governance (10)
          </button>
          <button
            onClick={() => setActiveMetricTab('public')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetricTab === 'public'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Community & Public (6)
          </button>
        </div>

        {onOptimizeClick && (
          <button
            onClick={onOptimizeClick}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Run Prompt Optimizer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metric Panels */}
      <div className="p-6">
        {activeMetricTab === 'core' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricBar label="🎯 Accuracy Score" value={core.accuracy} detail="Evaluated against strict golden assertion tests" />
            <MetricBar label="🧠 LLM Judge Consensus" value={core.llmJudge} detail="Cross-evaluated by GPT-4o & Claude 3.5 Sonnet judges" />
            <MetricBar label="📏 Instruction Clarity" value={core.clarity} detail="Absence of ambiguity and vague phrasing" />
            <MetricBar label="📚 Reusability Score" value={core.reusability} detail="Presence of typed variables {{variable}} and templates" />
            <MetricBar label="🔒 Security Score" value={core.security} detail="Hardened against injection, extraction, and jailbreaks" isSecure />
            <MetricBar label="💰 Cost Efficiency Score" value={core.costEfficiency} detail="Token economy and brevity without losing context" />
            <MetricBar label="⚡ Latency Prediction" value={core.latencyScore} detail={`Estimated roundtrip time: ${core.latencyPredictionMs}ms`} />
            <MetricBar label="🏗 Prompt Complexity Score" value={core.promptComplexity} detail="Structural sophistication and multi-turn readiness" />
            <MetricBar label="🎭 Context Preservation" value={core.contextPreservation} detail="Explicit delimiters isolating developer inputs" />
            <MetricBar label="📖 Instruction Completeness" value={core.instructionCompleteness} detail="Persona, task, constraints, format schemas covered" />
          </div>
        )}

        {activeMetricTab === 'enterprise' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricBar label="📈 Historical Success Rate" value={enterprise.historicalSuccessRate} detail="Percentage of production runs meeting QA criteria" />
            <MetricBar label="🏢 Organization Approval Score" value={enterprise.organizationApprovalScore} detail="Signed off by Security & Architecture Review boards" />
            <MetricBar label="👨‍💻 Developer Usage Frequency" value={Math.min(100, Math.round(enterprise.developerUsageFrequency / 10))} detail={`${enterprise.developerUsageFrequency} total invocations this quarter`} />
            <MetricBar label="⭐ Internal Developer Rating" value={Math.round(enterprise.internalDeveloperRating * 20)} detail={`${enterprise.internalDeveloperRating} / 5.0 peer developer score`} />
            <MetricBar label="🔄 Regression Stability Score" value={enterprise.regressionStabilityScore} detail="Consistent output across model version updates" />
            <MetricBar label="🧪 Test Coverage Score" value={enterprise.testCoverageScore} detail="Automated unit assertions covering edge cases" />
            <MetricBar label="🛡 Prompt Injection Resistance" value={enterprise.promptInjectionResistance} detail="Zero tolerance for delimiter hijacking" isSecure />
            <MetricBar label="🔐 Data Leakage Risk Score" value={enterprise.dataLeakageRisk === 'Zero' ? 100 : enterprise.dataLeakageRisk === 'Low' ? 85 : 50} detail={`Leakage Risk: ${enterprise.dataLeakageRisk}`} isSecure />
            <MetricBar label="🚨 Hallucination Risk Defense" value={100 - enterprise.hallucinationRiskScore} detail="Grounding constraints against speculative answers" />
            <MetricBar label="📊 Production Reliability Score" value={enterprise.productionReliabilityScore} detail="99.9% uptime SLA compatibility" />
          </div>
        )}

        {activeMetricTab === 'public' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricBar label="👥 Community Rating" value={Math.round(pub.communityRating * 20)} detail={`${pub.communityRating} / 5.0 community review score`} />
            <MetricBar label="❤️ Number of Favorites" value={Math.min(100, Math.round(pub.numberOfFavorites / 2))} detail={`${pub.numberOfFavorites} saved bookmarks`} />
            <MetricBar label="📋 Number of Copies" value={Math.min(100, Math.round(pub.numberOfCopies / 5))} detail={`${pub.numberOfCopies} developer exports`} />
            <MetricBar label="🔥 Trending Score" value={pub.trendingScore} detail="Top 5% most searched prompt patterns this week" />
            <MetricBar label="📈 Usage Growth Rate" value={Math.min(100, Math.round(pub.usageGrowthPercent * 2))} detail={`+${pub.usageGrowthPercent}% month-over-month adoption`} />
            <MetricBar label="🏅 Community Trust Score" value={pub.communityTrustScore} detail="Verified badge by prompt engineering authors" />
          </div>
        )}
      </div>
    </div>
  );
};

const MetricBar: React.FC<{ label: string; value: number; detail: string; isSecure?: boolean }> = ({
  label,
  value,
  detail,
  isSecure = false,
}) => {
  const getBarColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500';
    if (val >= 75) return 'bg-indigo-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <span className="text-xs font-black text-slate-900 font-mono">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 leading-tight">{detail}</p>
    </div>
  );
};
