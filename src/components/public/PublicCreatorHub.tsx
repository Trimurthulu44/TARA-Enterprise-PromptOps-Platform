import React, { useState } from 'react';
import { 
  User, Sparkles, Search, Copy, Download, Star, 
  Layers, Code2, Sliders, ChevronLeft, ChevronRight, LogOut, 
  ExternalLink, Check, Flame, ArrowRight, Zap, RefreshCw, BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptItem, UserSession } from '../../types';
import { INITIAL_PROMPTS } from '../../services/mockData';
import { calculatePQS, optimizePrompt } from '../../services/pqsEngine';
import { TaraLogo } from '../common/TaraLogo';
import { PQSScoreVisualizer } from '../PQSScoreVisualizer';

interface PublicCreatorHubProps {
  currentUser: UserSession;
  onLogout: () => void;
  onSwitchToEnterprise: () => void;
}

export const PublicCreatorHub: React.FC<PublicCreatorHubProps> = ({
  currentUser,
  onLogout,
  onSwitchToEnterprise,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'optimizer' | 'library' | 'community' | 'analytics'>('studio');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(prompts[0]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleStudioContentChange = (text: string) => {
    setStudioContent(text);
    const calculated = calculatePQS(text);
    setLivePQS(calculated);
    setOptimizedText(optimizePrompt(text));
  };

  const handleApplyOptimization = () => {
    setStudioContent(optimizedText);
    const calculated = calculatePQS(optimizedText);
    setLivePQS(calculated);
    setActiveTab('studio');

    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#10B981', '#6366F1'],
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = (p: PromptItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(p, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${p.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* 1. FLEXIBLE PUBLIC STUDIO SIDEBAR */}
      <aside
        className={`bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Top: Big highlighted TARA Logo */}
        <div className="p-4 border-b border-slate-200/80 bg-white">
          <div className="flex items-center justify-between">
            <div className={`overflow-hidden transition-all ${sidebarCollapsed ? 'w-10' : 'w-auto'}`}>
              <TaraLogo
                size={sidebarCollapsed ? 'sm' : 'md'}
                showText={!sidebarCollapsed}
                subtitle="Creator Hub"
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
            <div className="mt-4 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Personal Studio</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Community Pro
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Free Cloud Storage</span>
                <span className="text-emerald-600 font-bold">● Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Creator Studio
          </div>

          <button
            onClick={() => setActiveTab('studio')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title="Prompt Studio"
          >
            <Code2 className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Prompt Studio & PQS</span>}
          </button>

          <button
            onClick={() => setActiveTab('optimizer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'optimizer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title="AI Optimizer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>AI Prompt Optimizer</span>}
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title="Personal Library"
          >
            <Layers className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>My Prompt Library</span>}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title="Community Trending"
          >
            <Flame className="w-4 h-4 shrink-0 text-amber-500" />
            {!sidebarCollapsed && (
              <span className="flex items-center gap-1.5">
                <span>Community Trending</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Hot</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title="Analytics"
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Prompt Score Analytics</span>}
          </button>
        </div>

        {/* User Profile Card & Sign out */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-white">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-300 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={onSwitchToEnterprise}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 text-[11px] font-bold cursor-pointer transition-colors"
              title="Switch to Enterprise Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Switch to Enterprise Portal</span>}
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

      {/* 2. MAIN CREATOR CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Public Creator Hub</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {activeTab === 'studio' && 'Prompt Studio & Live PQS'}
              {activeTab === 'optimizer' && 'AI Prompt Optimizer'}
              {activeTab === 'library' && 'Personal Collections'}
              {activeTab === 'community' && 'Community Trending'}
              {activeTab === 'analytics' && 'Prompt Quality Metrics'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Connected:</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {currentUser.email}
            </span>
          </div>
        </header>

        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* TAB: PROMPT STUDIO */}
          {activeTab === 'studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Editor */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <input
                    type="text"
                    value={studioTitle}
                    onChange={(e) => setStudioTitle(e.target.value)}
                    className="text-base font-black text-slate-900 border-none focus:outline-none w-full mr-2"
                    placeholder="Enter prompt title..."
                  />
                  <button
                    onClick={() => setActiveTab('optimizer')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Optimizer</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
                  <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-200 mb-2 flex justify-between font-sans">
                    <span>Template Workspace</span>
                    <span>Tokens: ~{Math.ceil(studioContent.length / 4)}</span>
                  </div>
                  <textarea
                    value={studioContent}
                    onChange={(e) => handleStudioContentChange(e.target.value)}
                    rows={16}
                    className="w-full bg-transparent border-none text-slate-800 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Right: Live PQS Evaluation */}
              <div className="lg:col-span-5">
                <PQSScoreVisualizer score={livePQS.pqs} onOptimizeClick={() => setActiveTab('optimizer')} />
              </div>
            </div>
          )}

          {/* TAB: AI OPTIMIZER */}
          {activeTab === 'optimizer' && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">AI Prompt Optimizer</h3>
                  <p className="text-xs text-slate-500">Side-by-side AST restructuring, inserting guardrails and schema anchors.</p>
                </div>
                <button
                  onClick={handleApplyOptimization}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Optimization (+14% PQS)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 mb-2 pb-1 border-b border-slate-200">Original Prompt</div>
                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto">{studioContent}</pre>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-200">
                  <div className="text-xs font-bold text-indigo-900 mb-2 pb-1 border-b border-indigo-200 flex items-center justify-between">
                    <span>TARA Optimized Prompt</span>
                    <span className="text-emerald-600 font-black">PQS: 98/100</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-900 whitespace-pre-wrap max-h-96 overflow-y-auto">{optimizedText}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERSONAL LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Personal Prompt Library</h3>
                  <p className="text-xs text-slate-500">Save, search, copy, and export your personal collection.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {prompts.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{p.currentVersion}</span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">PQS: {p.pqs.overallScore}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleCopy(p.content, p.id)} className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                          {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleExportJSON(p)} className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPrompt(p);
                          setStudioTitle(p.title);
                          setStudioContent(p.content);
                          setLivePQS(calculatePQS(p.content));
                          setActiveTab('studio');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
                      >
                        Edit in Studio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COMMUNITY TRENDING */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
                    <span>Trending Community Prompts</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">Top-rated prompts created and tested by global prompt engineering peers.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {prompts.map((p, idx) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Trending #{idx + 1}</span>
                      <span className="text-xs font-black text-slate-900">⭐ 4.9 / 5.0</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">By {p.author.name}</span>
                      <button
                        onClick={() => handleCopy(p.content, p.id)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold cursor-pointer transition-colors"
                      >
                        {copiedId === p.id ? 'Copied!' : 'Copy to My Studio'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-slate-900">Personal Prompt Health & Telemetry</h3>
              <p className="text-xs text-slate-500">Track token efficiency gains and Prompt Quality Score improvements.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Average PQS</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">94.8 / 100</div>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="text-xs font-bold text-indigo-800 uppercase">Tokens Saved</div>
                  <div className="text-2xl font-black text-indigo-950 mt-1">42,800</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 uppercase">Prompts Created</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{prompts.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
