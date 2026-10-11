import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, AlertTriangle, 
  Search, Key, Terminal, BarChart3, Users, FileText, 
  Layers, Lock, Play, Bot, Sparkles, LogOut, ChevronLeft, ChevronRight,
  Sliders, ArrowUpRight, Check, Plus, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptItem, AuditLog, RegressionTestCase, Department, UserSession } from '../../types';
import { INITIAL_PROMPTS, INITIAL_AUDIT_LOGS, INITIAL_REGRESSION_TESTS } from '../../services/mockData';
import { TaraLogo } from '../common/TaraLogo';
import { PromptAssistantSimulator } from '../PromptAssistantSimulator';
import { DeveloperApiDashboard } from '../DeveloperApiDashboard';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { PQSScoreVisualizer } from '../PQSScoreVisualizer';

interface EnterpriseCommandCenterProps {
  currentUser: UserSession;
  onLogout: () => void;
  onSwitchToPublic: () => void;
}

export const EnterpriseCommandCenter: React.FC<EnterpriseCommandCenterProps> = ({
  currentUser,
  onLogout,
  onSwitchToPublic,
}) => {
  const [activeNav, setActiveNav] = useState<'repo' | 'governance' | 'security' | 'chatbot' | 'regression' | 'audit' | 'api' | 'analytics'>('governance');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [regressionTests, setRegressionTests] = useState<RegressionTestCase[]>(INITIAL_REGRESSION_TESTS);
  const [isRunningRegression, setIsRunningRegression] = useState(false);
  const [selectedPromptDetail, setSelectedPromptDetail] = useState<PromptItem | null>(null);

  const departments: (Department | 'All')[] = [
    'All',
    'Engineering',
    'FinTech',
    'Security & Compliance',
    'Customer Experience',
    'Legal',
  ];

  const handleApprovePrompt = (prompt: PromptItem) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === prompt.id ? { ...p, status: 'APPROVED' } : p))
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'PROMPT_APPROVED',
      promptTitle: prompt.title,
      department: prompt.department,
      ipAddress: '10.24.4.19',
      details: `Approved for production release after PQS validation (${prompt.pqs.overallScore}/100).`,
    };
    setAuditLogs([newLog, ...auditLogs]);

    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#10B981', '#4F46E5'],
    });
  };

  const handleRunRegression = () => {
    setIsRunningRegression(true);
    setTimeout(() => {
      setRegressionTests((prev) =>
        prev.map((t) => ({ ...t, actualStatus: 'PASSED', executionTimeMs: Math.floor(Math.random() * 150 + 260) }))
      );
      setIsRunningRegression(false);
      confetti({ particleCount: 50, spread: 60, colors: ['#10B981', '#6366F1'] });
    }, 1200);
  };

  const filteredPrompts = prompts.filter((p) => selectedDept === 'All' || p.department === selectedDept);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* 1. FLEXIBLE ENTERPRISE SIDEBAR (Handle side navigation) */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Top Sidebar: Big highlighted TARA Logo */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className={`overflow-hidden transition-all ${sidebarCollapsed ? 'w-10' : 'w-auto'}`}>
              <TaraLogo
                size={sidebarCollapsed ? 'sm' : 'md'}
                showText={!sidebarCollapsed}
                subtitle="Enterprise Ops"
              />
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 p-2.5 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Infosys Global</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                  infy-corp
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Tier: Enterprise Gold</span>
                <span className="text-emerald-600 font-bold">● SOC2 Ready</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Sidebar Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Command Center
          </div>

          <button
            onClick={() => setActiveNav('governance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'governance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Approval Workflows"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Governance & Approvals</span>}
          </button>

          <button
            onClick={() => setActiveNav('repo')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'repo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Org Prompt Repository"
          >
            <Layers className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Prompt Repository ({prompts.length})</span>}
          </button>

          <button
            onClick={() => setActiveNav('security')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'security'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Injection & Leakage Radar"
          >
            <Lock className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Threat & Injection Radar</span>}
          </button>

          <button
            onClick={() => setActiveNav('chatbot')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'chatbot'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Internal Chatbot Gateway"
          >
            <Bot className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && (
              <span className="flex items-center gap-1.5">
                <span>Chatbot Gateway</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-amber-100 text-amber-800 rounded font-semibold">Demo</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('regression')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'regression'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Regression Test Harness"
          >
            <Play className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Regression Suite</span>}
          </button>

          <button
            onClick={() => setActiveNav('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Audit Vault"
          >
            <FileText className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>SOC2 Audit Vault</span>}
          </button>

          <div className={`pt-4 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Developer Ops
          </div>

          <button
            onClick={() => setActiveNav('api')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'api'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="API Keys & Playground"
          >
            <Key className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Enterprise API & SDK</span>}
          </button>

          <button
            onClick={() => setActiveNav('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Analytics"
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>PQS Analytics</span>}
          </button>
        </div>

        {/* Bottom Sidebar: Authenticated User & Portal Switch */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/60">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={onSwitchToPublic}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 text-[11px] font-bold cursor-pointer transition-colors"
              title="Switch to Public Hub"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Switch to Public Hub</span>}
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-[11px] font-bold cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ENTERPRISE CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header Breadcrumb Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Enterprise</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/80">
              {activeNav === 'governance' && 'Governance & Approvals'}
              {activeNav === 'repo' && 'Organization Prompt Repository'}
              {activeNav === 'security' && 'Security Threat & Injection Radar'}
              {activeNav === 'chatbot' && 'Infosys Chatbot Simulator'}
              {activeNav === 'regression' && 'Multi-Model Regression Test Suite'}
              {activeNav === 'audit' && 'Cryptographic SOC2 Audit Vault'}
              {activeNav === 'api' && 'Enterprise API Gateway'}
              {activeNav === 'analytics' && 'PQS & Cost Analytics'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Dynamic Nav Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* TAB: GOVERNANCE & APPROVALS */}
          {activeNav === 'governance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Enterprise Release Gate
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    Prompt Governance & Approval Pipeline
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    No prompt reaches corporate AI assistants without verification by department leads and 90+ PQS scores.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    Pending Review: {filteredPrompts.filter((p) => p.status === 'PENDING_REVIEW').length}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                    Gold Standard: {filteredPrompts.filter((p) => p.status === 'APPROVED').length}
                  </div>
                </div>
              </div>

              {/* Kanban Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Awaiting Lead Approval & Cryptosign</span>
                  </h3>

                  {filteredPrompts.filter((p) => p.status === 'PENDING_REVIEW').map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                            {p.department}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                        </div>
                        <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          PQS: {p.pqs.overallScore}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{p.description}</p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Author: {p.author.name}</span>
                        <button
                          onClick={() => handleApprovePrompt(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve for Production</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredPrompts.filter((p) => p.status === 'PENDING_REVIEW').length === 0 && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                      All prompts in this filter are approved!
                    </div>
                  )}
                </div>

                {/* Approved Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Approved Production Standard</span>
                  </h3>

                  {filteredPrompts.filter((p) => p.status === 'APPROVED').map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                            {p.department} • {p.currentVersion}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                        </div>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          PQS: {p.pqs.overallScore}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{p.description}</p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Used by {p.pqs.enterprise.developerUsageFrequency} devs • Success {p.pqs.enterprise.historicalSuccessRate}%
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active in Gateway</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORG REPOSITORY */}
          {activeNav === 'repo' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Organization Prompt Repository</h2>
                  <p className="text-xs text-slate-500">Curated, semantic vector-indexed prompts with version history.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPrompts.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                          {p.currentVersion}
                        </span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          PQS: {p.pqs.overallScore}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Dept: {p.department}</span>
                      <button
                        onClick={() => setSelectedPromptDetail(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs cursor-pointer transition-colors"
                      >
                        Inspect PQS
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPromptDetail && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-base text-slate-900">{selectedPromptDetail.title}</h3>
                      <button onClick={() => setSelectedPromptDetail(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">Close</button>
                    </div>
                    <PQSScoreVisualizer score={selectedPromptDetail.pqs} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: THREAT & INJECTION RADAR */}
          {activeNav === 'security' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  OWASP LLM Top 10 Active Shield
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Prompt Injection & Vulnerability Defense Radar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Real-time AST parsing and heuristic scanners detecting indirect prompt injection, jailbreaks, and PII leakage.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Injection Resistance</span>
                    <div className="text-2xl font-black text-emerald-950 mt-1">99.8%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <span className="text-xs font-bold text-indigo-800 uppercase">PII Redaction</span>
                    <div className="text-2xl font-black text-indigo-950 mt-1">Zero Leaks</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase">Model Jailbreak Shield</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">100% Guarded</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHATBOT GATEWAY SIMULATOR */}
          {activeNav === 'chatbot' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-center justify-between">
                <div>
                  <strong>Infosys Chatbot Integration Live Test:</strong> Developers click ✨ Prompt Assistant to pull from the corporate repository.
                </div>
              </div>
              <PromptAssistantSimulator />
            </div>
          )}

          {/* TAB: REGRESSION HARNESS */}
          {activeNav === 'regression' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Multi-Model Regression Test Suite</h2>
                  <p className="text-xs text-slate-500">Automated assertion evaluation across model upgrades.</p>
                </div>
                <button
                  onClick={handleRunRegression}
                  disabled={isRunningRegression}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningRegression ? 'animate-spin' : ''}`} />
                  <span>{isRunningRegression ? 'Running Harness...' : 'Execute Regression Suite'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {regressionTests.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Target: {t.modelTested} • Latency: {t.executionTimeMs}ms</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.actualStatus}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AUDIT VAULT */}
          {activeNav === 'audit' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Immutable Cryptographic Audit Logs</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="p-3.5 font-bold">Timestamp</th>
                      <th className="p-3.5 font-bold">Actor</th>
                      <th className="p-3.5 font-bold">Action</th>
                      <th className="p-3.5 font-bold">Prompt</th>
                      <th className="p-3.5 font-bold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{l.timestamp}</td>
                        <td className="p-3.5 font-bold text-slate-900">{l.actor}</td>
                        <td className="p-3.5 font-mono text-[11px] font-bold text-indigo-700">{l.action}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{l.promptTitle}</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-400">{l.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: API & SDK */}
          {activeNav === 'api' && <DeveloperApiDashboard />}

          {/* TAB: ANALYTICS */}
          {activeNav === 'analytics' && <AnalyticsDashboard prompts={prompts} />}
        </div>
      </main>
    </div>
  );
};
