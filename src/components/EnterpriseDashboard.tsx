import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, AlertTriangle, 
  Clock, Users, FileText, Search, Filter, Lock, 
  RotateCcw, Play, Check, X, ArrowRight, ShieldAlert, Cpu, Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptItem, AuditLog, RegressionTestCase, Department } from '../types';
import { INITIAL_AUDIT_LOGS, INITIAL_REGRESSION_TESTS } from '../services/mockData';

interface EnterpriseDashboardProps {
  prompts: PromptItem[];
  onApprovePrompt: (promptId: string) => void;
  onDeprecatePrompt: (promptId: string) => void;
  initialSubTab?: string;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  prompts,
  onApprovePrompt,
  onDeprecatePrompt,
  initialSubTab = 'governance',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'governance' | 'security' | 'regression' | 'audit'>(
    (initialSubTab as any) || 'governance'
  );
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [regressionTests, setRegressionTests] = useState<RegressionTestCase[]>(INITIAL_REGRESSION_TESTS);
  const [isRunningRegression, setIsRunningRegression] = useState(false);
  const [searchAudit, setSearchAudit] = useState('');

  const departments: (Department | 'All')[] = [
    'All',
    'Engineering',
    'FinTech',
    'Security & Compliance',
    'Customer Experience',
    'Legal',
  ];

  const filteredPrompts = prompts.filter((p) => {
    return selectedDept === 'All' || p.department === selectedDept;
  });

  const handleRunAllRegression = () => {
    setIsRunningRegression(true);
    setTimeout(() => {
      setRegressionTests((prev) =>
        prev.map((t) => ({ ...t, actualStatus: 'PASSED', executionTimeMs: Math.floor(Math.random() * 200 + 250) }))
      );
      setIsRunningRegression(false);

      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#10B981', '#6366F1'],
      });
    }, 1500);
  };

  const handleApproveWithLog = (prompt: PromptItem) => {
    onApprovePrompt(prompt.id);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Aditya Sharma',
      actorRole: 'Enterprise Architecture Lead',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Enterprise Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              Enterprise Tenant: Infosys Global
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SOC2 Type II Certified
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Enterprise Prompt Governance & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enforce role-based access control, cryptographic audit logs, and pre-release security validation.
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('governance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'governance'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approval Pipeline
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Injection Scanner
          </button>
          <button
            onClick={() => setActiveSubTab('regression')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'regression'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regression Suite
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Approval Pipeline */}
      {activeSubTab === 'governance' && (
        <div className="space-y-6">
          {/* Department Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 mr-1">Department:</span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedDept === dept
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredPrompts.length} organizational prompts
            </div>
          </div>

          {/* Board Grid: Pending vs Approved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Pending Governance Review */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Pending Review & Validation</h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {filteredPrompts.filter((p) => p.status === 'PENDING_REVIEW').length}
                </span>
              </div>

              {filteredPrompts
                .filter((p) => p.status === 'PENDING_REVIEW')
                .map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-amber-200/90 bg-white subtle-card space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                          {p.department}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        PQS: {p.pqs.overallScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Author: {p.author.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveWithLog(p)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve for Prod</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {filteredPrompts.filter((p) => p.status === 'PENDING_REVIEW').length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                  All prompts in this department have been approved! 🎉
                </div>
              )}
            </div>

            {/* Column 2: Approved Production Gold Standard */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900">Approved Production Gold Standard</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {filteredPrompts.filter((p) => p.status === 'APPROVED').length}
                </span>
              </div>

              {filteredPrompts
                .filter((p) => p.status === 'APPROVED')
                .map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-white subtle-card space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                          {p.department} • {p.currentVersion}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        PQS: {p.pqs.overallScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <span>Used by {p.pqs.enterprise.developerUsageFrequency} devs</span>
                        <span>• Success {p.pqs.enterprise.historicalSuccessRate}%</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active in Gateway API</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Security & Prompt Injection Scanner */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Enterprise Prompt Injection & Leakage Scanner</h3>
              <p className="text-xs text-slate-500">
                Continuous heuristic & semantic AST validation to prevent jailbreaks, PII exposure, and system prompt extraction.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Scanner Active: 0 Critical Breaches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
              <span className="text-xs font-bold uppercase text-emerald-800">Direct Injection Resistance</span>
              <div className="text-2xl font-black mt-1">99.8%</div>
              <p className="text-[11px] text-emerald-800 mt-1">Delimiter isolation prevents instruction hijacking.</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-indigo-950">
              <span className="text-xs font-bold uppercase text-indigo-800">PII / Credential Leakage Risk</span>
              <div className="text-2xl font-black mt-1">Zero (Redacted)</div>
              <p className="text-[11px] text-indigo-800 mt-1">Automated masking of API keys, tokens, and SSNs.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
              <span className="text-xs font-bold uppercase text-slate-600">Model Jailbreak Protection</span>
              <div className="text-2xl font-black mt-1">100% Tested</div>
              <p className="text-[11px] text-slate-500 mt-1">Validated against OWASP Top 10 for LLMs.</p>
            </div>
          </div>

          {/* Vulnerability Report Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Target Prompt</th>
                  <th className="p-3.5 font-bold">Threat Vector</th>
                  <th className="p-3.5 font-bold">Severity</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Automated Patch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Spring Boot REST API Security & JWT Authentication</td>
                  <td className="p-3.5 text-slate-600">Indirect prompt injection via user parameters</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">LOW</span></td>
                  <td className="p-3.5"><span className="text-emerald-700 font-bold">Patched (v2.4.0)</span></td>
                  <td className="p-3.5 text-right font-mono text-[11px] text-indigo-600">&lt;developer_context&gt; isolation</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Enterprise Customer Complaint De-escalation</td>
                  <td className="p-3.5 text-slate-600">Potential customer phone / account leakage</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">MEDIUM</span></td>
                  <td className="p-3.5"><span className="text-emerald-700 font-bold">Redaction Enforced</span></td>
                  <td className="p-3.5 text-right font-mono text-[11px] text-indigo-600">PII Masking Filter Applied</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Zero-Trust Kubernetes Ingress Generator</td>
                  <td className="p-3.5 text-slate-600">Unbounded container privilege escalation</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">LOW</span></td>
                  <td className="p-3.5"><span className="text-emerald-700 font-bold">Secured</span></td>
                  <td className="p-3.5 text-right font-mono text-[11px] text-indigo-600">readOnlyRootFilesystem: true</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Regression Testing Suite */}
      {activeSubTab === 'regression' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Prompt Regression Testing Suite</h3>
              <p className="text-xs text-slate-500">
                Execute automated assertion test suites across model version updates (GPT-4o, Claude 3.5, Gemini 1.5).
              </p>
            </div>

            <button
              onClick={handleRunAllRegression}
              disabled={isRunningRegression}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningRegression ? 'animate-spin' : ''}`} />
              <span>{isRunningRegression ? 'Executing Test Harness...' : 'Run All Regression Tests'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {regressionTests.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.name}</span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                      {t.modelTested}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
                    <span>Assertions:</span>
                    {t.expectedAssertions.map((a, idx) => (
                      <span key={idx} className="font-mono bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono text-slate-500">{t.executionTimeMs}ms</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {t.actualStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Immutable Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Cryptographic Enterprise Audit Logs</h3>
              <p className="text-xs text-slate-500">
                Immutable, tamper-evident log of all prompt approvals, API key rotations, and governance events.
              </p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Filter by actor or event..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Timestamp</th>
                  <th className="p-3.5 font-bold">Actor</th>
                  <th className="p-3.5 font-bold">Action Event</th>
                  <th className="p-3.5 font-bold">Target Prompt</th>
                  <th className="p-3.5 font-bold">Details</th>
                  <th className="p-3.5 font-bold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs
                  .filter(
                    (l) =>
                      searchAudit === '' ||
                      l.actor.toLowerCase().includes(searchAudit.toLowerCase()) ||
                      l.action.toLowerCase().includes(searchAudit.toLowerCase())
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{log.actor}</div>
                        <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{log.promptTitle}</td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">{log.details}</td>
                      <td className="p-3.5 text-right font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
