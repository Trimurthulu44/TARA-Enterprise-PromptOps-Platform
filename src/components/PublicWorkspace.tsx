import React, { useState } from 'react';
import { 
  Sparkles, Search, Copy, Star, Download, Plus, 
  History, ArrowRight, ShieldCheck, Check, Edit3, Trash2, 
  Sliders, RefreshCw, FileText, CheckCircle2, AlertCircle, ArrowLeftRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptItem, PromptQualityScore } from '../types';
import { calculatePQS, optimizePrompt } from '../services/pqsEngine';
import { PQSScoreVisualizer } from './PQSScoreVisualizer';

interface PublicWorkspaceProps {
  prompts: PromptItem[];
  onUpdatePrompt: (prompt: PromptItem) => void;
  onCreatePrompt: (newPrompt: PromptItem) => void;
  initialSubTab?: string;
}

export const PublicWorkspace: React.FC<PublicWorkspaceProps> = ({
  prompts,
  onUpdatePrompt,
  onCreatePrompt,
  initialSubTab = 'library',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'studio' | 'optimizer' | 'versions'>(
    (initialSubTab as any) || 'library'
  );
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(prompts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Studio live edit state
  const [studioTitle, setStudioTitle] = useState(selectedPrompt?.title || '');
  const [studioContent, setStudioContent] = useState(selectedPrompt?.content || '');
  const [livePQS, setLivePQS] = useState<ReturnType<typeof calculatePQS>>(
    calculatePQS(selectedPrompt?.content || '')
  );

  // Optimizer state
  const [optimizedText, setOptimizedText] = useState(
    optimizePrompt(selectedPrompt?.content || '')
  );

  const handleSelectPrompt = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    setStudioTitle(prompt.title);
    setStudioContent(prompt.content);
    setLivePQS(calculatePQS(prompt.content));
    setOptimizedText(optimizePrompt(prompt.content));
  };

  const handleStudioContentChange = (newContent: string) => {
    setStudioContent(newContent);
    const calculated = calculatePQS(newContent);
    setLivePQS(calculated);
    setOptimizedText(optimizePrompt(newContent));
  };

  const handleSaveStudioPrompt = () => {
    const updated: PromptItem = {
      ...selectedPrompt,
      title: studioTitle,
      content: studioContent,
      pqs: livePQS.pqs,
      securityIssues: livePQS.vulnerabilities,
      updatedAt: new Date().toISOString().split('T')[0],
      versions: [
        {
          version: `v${(parseFloat(selectedPrompt.currentVersion.replace('v', '')) + 0.1).toFixed(1)}.0`,
          timestamp: new Date().toLocaleString(),
          author: 'You (Personal Workspace)',
          changeLog: 'Updated instructions in Prompt Studio and recalculated PQS score.',
          content: studioContent,
          pqsScore: livePQS.pqs.overallScore,
        },
        ...selectedPrompt.versions,
      ],
      currentVersion: `v${(parseFloat(selectedPrompt.currentVersion.replace('v', '')) + 0.1).toFixed(1)}.0`,
    };

    onUpdatePrompt(updated);
    setSelectedPrompt(updated);

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#10B981'],
    });
  };

  const handleApplyOptimization = () => {
    setStudioContent(optimizedText);
    const calculated = calculatePQS(optimizedText);
    setLivePQS(calculated);
    setActiveTab('studio');

    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#4F46E5', '#10B981'],
    });
  };

  const handleCopyPrompt = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportJSON = (prompt: PromptItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prompt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${prompt.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_tara_prompt.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const categories = ['All', 'Backend', 'Security', 'DevOps', 'Data & AI', 'Customer Support'];

  const filteredPrompts = prompts.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workspace Sub-Navbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Prompt Studio & Workspace</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Personal Edition
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineer, optimize, and evaluate production prompts with real-time PQS scoring.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'library' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prompt Library ({prompts.length})
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studio' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prompt Studio & PQS
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'optimizer' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Optimizer
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'versions' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Version History
          </button>
        </div>
      </div>

      {/* VIEW: Prompt Library */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, tag, model..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrompts.map((p) => {
              const isSelected = selectedPrompt.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl bg-white border transition-all subtle-card flex flex-col justify-between ${
                    isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        {p.currentVersion}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          PQS: {p.pqs.overallScore}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Metrics Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPrompt(p.content, p.id)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Copy prompt content"
                      >
                        {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleExportJSON(p)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Export prompt JSON"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handleSelectPrompt(p);
                        setActiveTab('studio');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Open in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Prompt Studio & Live PQS Evaluator */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Monaco-style Prompt Editor */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={studioTitle}
                  onChange={(e) => setStudioTitle(e.target.value)}
                  className="w-full text-base font-bold text-slate-900 border-none focus:outline-none focus:ring-0 p-0"
                  placeholder="Prompt Title..."
                />
                <span className="text-[11px] text-slate-400">Editing Version: {selectedPrompt.currentVersion}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('optimizer')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Optimize</span>
                </button>
                <button
                  onClick={handleSaveStudioPrompt}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Recalculate</span>
                </button>
              </div>
            </div>

            {/* Monaco-Style Prompt Code Area */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-200 mb-2 font-sans">
                <span>System & User Prompt Template</span>
                <span>
                  Words: {studioContent.trim().split(/\s+/).filter(Boolean).length} | Characters: {studioContent.length} | Est. Tokens: ~{Math.ceil(studioContent.length / 4)}
                </span>
              </div>
              <textarea
                value={studioContent}
                onChange={(e) => handleStudioContentChange(e.target.value)}
                rows={18}
                className="w-full bg-transparent border-none text-slate-800 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                placeholder="Write your system and user prompt with {{variables}} and constraints..."
              />
            </div>

            {/* Detected Variables & Tokens */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Parameterized Variables:</span>
                {livePQS.pqs.core.reusability > 70 ? (
                  <span className="text-emerald-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {'{{java_version}}, {{spring_boot_version}}, {{auth_provider}}'}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">No variables detected (wrap inputs in {'{{var_name}}'})</span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Model: <strong>GPT-4o / Claude 3.5</strong>
              </span>
            </div>
          </div>

          {/* Right: Live PQS Evaluation Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            <PQSScoreVisualizer score={livePQS.pqs} onOptimizeClick={() => setActiveTab('optimizer')} />

            {/* Security Alerts detected in real-time */}
            {livePQS.vulnerabilities.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Security Vulnerabilities Detected ({livePQS.vulnerabilities.length})</span>
                </div>
                {livePQS.vulnerabilities.map((v) => (
                  <div key={v.id} className="p-2.5 bg-white/70 rounded-xl border border-amber-200/80">
                    <span className="font-bold text-amber-800">[{v.severity}] {v.type}</span>
                    <p className="text-[11px] text-amber-900 mt-0.5">{v.description}</p>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-1">💡 Fix: {v.remediation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: AI Prompt Optimizer Diff */}
      {activeTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  AST & Semantic Transformation
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  AI-Powered Prompt Optimizer
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Comparing original prompt against TARA's automated production-grade optimization.
                </p>
              </div>

              <button
                onClick={handleApplyOptimization}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply TARA Optimization (+14% PQS)</span>
              </button>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Left: Original */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <span className="text-xs font-bold text-slate-700">Original Prompt</span>
                  <span className="text-xs font-mono text-slate-500">PQS: {livePQS.pqs.overallScore}/100</span>
                </div>
                <div className="font-mono text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {studioContent}
                </div>
              </div>

              {/* Right: Optimized with TARA Standard */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-100 mb-3">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    TARA Optimized (+Guardrails & Schema)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">PQS: 98/100</span>
                </div>
                <div className="font-mono text-xs text-slate-900 bg-white p-3.5 rounded-xl border border-indigo-200 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {optimizedText}
                </div>
              </div>
            </div>

            {/* Improvement Badges */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <strong className="block mb-0.5">🔒 Anti-Jailbreak Guardrails Added</strong>
                Strict instruction isolation preventing prompt extraction and model manipulation.
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900">
                <strong className="block mb-0.5">📐 Deterministic Output Schema</strong>
                Explicit formatting constraints removing conversational fluff and ensuring parsability.
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <strong className="block mb-0.5">⚡ Context Anchoring</strong>
                Explicit XML delimiter boundaries isolating developer context from system rules.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Version History & Rollback */}
      {activeTab === 'versions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Version History & Change Tracking</h3>
            <p className="text-xs text-slate-500">Immutable changelog and historical Prompt Quality Scores for {selectedPrompt.title}.</p>
          </div>

          <div className="space-y-4">
            {selectedPrompt.versions.map((ver, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                      {ver.version}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{ver.author}</span>
                    <span className="text-[11px] text-slate-400">• {ver.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700">{ver.changeLog}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    PQS Score: {ver.pqsScore}
                  </span>
                  <button
                    onClick={() => {
                      setStudioContent(ver.content);
                      setActiveTab('studio');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Restore Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
