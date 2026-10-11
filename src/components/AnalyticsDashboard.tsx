import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, ShieldCheck, Zap, Award, Users } from 'lucide-react';
import { PromptItem } from '../types';

interface AnalyticsDashboardProps {
  prompts: PromptItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ prompts }) => {
  // PQS Distribution data
  const scoreDistributionData = [
    { range: '95-100', count: 18, tier: 'Enterprise Gold' },
    { range: '90-94', count: 24, tier: 'Production Ready' },
    { range: '80-89', count: 12, tier: 'Good' },
    { range: '70-79', count: 5, tier: 'Needs Optimization' },
    { range: '< 70', count: 1, tier: 'Quarantined' },
  ];

  // Token savings over months
  const monthlySavingsData = [
    { month: 'May', savingsUsd: 18400, tokensPrevented: 4200000 },
    { month: 'Jun', savingsUsd: 26800, tokensPrevented: 6100000 },
    { month: 'Jul', savingsUsd: 38200, tokensPrevented: 8900000 },
    { month: 'Aug', savingsUsd: 54100, tokensPrevented: 12400000 },
    { month: 'Sep', savingsUsd: 82500, tokensPrevented: 18900000 },
    { month: 'Oct', savingsUsd: 148200, tokensPrevented: 34200000 },
  ];

  // Model Latency benchmarks
  const latencyData = [
    { model: 'GPT-4o', p50: 190, p95: 380, pqsAligned: 96 },
    { model: 'Claude 3.5 Sonnet', p50: 210, p95: 410, pqsAligned: 97 },
    { model: 'Gemini 1.5 Pro', p50: 165, p95: 340, pqsAligned: 94 },
    { model: 'Llama 3 70B', p50: 140, p95: 290, pqsAligned: 91 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Aggregate Prompt Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Enterprise PromptOps & PQS Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry measuring accuracy gains, token cost reductions, and model latency benchmarks.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Organization PQS</span>
          <div className="text-3xl font-black text-emerald-600">95.4 / 100</div>
          <span className="text-[11px] text-slate-400">★★★★★ Enterprise Certified</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Cumulative Cloud LLM Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">$148,200</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">+34% vs last quarter</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Production Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">98.6%</div>
          <p className="text-[11px] text-slate-500 mt-1">Based on 1.48M API runs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Hallucination Prevention</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">99.8%</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">&lt; 0.2% variance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Developer Users</span>
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">1,840</div>
          <p className="text-[11px] text-slate-500 mt-1">Across 14 enterprise teams</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Token Cost Savings Curve */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">LLM Cost Savings via Prompt Optimization ($)</h3>
              <p className="text-xs text-slate-500">Tokens eliminated through brevity & structured JSON schemas</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Cumulative: $368K
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySavingsData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cost Saved']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="savingsUsd" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: PQS Score Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organization Prompt Quality Score Distribution</h3>
              <p className="text-xs text-slate-500">Number of prompts grouped by PQS certification band</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Total Prompts: 60
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} Prompts`, 'Count']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Benchmark Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Multi-Model Latency & Alignment Benchmarks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latencyData.map((m) => (
            <div key={m.model} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">{m.model}</span>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>P50 Latency:</span>
                <span className="font-mono font-bold">{m.p50}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>P95 Latency:</span>
                <span className="font-mono font-bold">{m.p95}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">
                <span>PQS Alignment:</span>
                <span>{m.pqsAligned}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
