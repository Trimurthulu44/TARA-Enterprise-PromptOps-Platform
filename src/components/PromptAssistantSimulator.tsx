import React, { useState } from 'react';
import { 
  Sparkles, Search, Check, Copy, ArrowRight, ShieldCheck, 
  Star, Users, DollarSign, Bot, Terminal, Code2, RefreshCw, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_PROMPTS } from '../services/mockData';
import { recommendPrompts } from '../services/recommendationEngine';
import { TaraLogo } from './common/TaraLogo';

export const PromptAssistantSimulator: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('I need a Spring Boot REST API authentication prompt');
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [chatInputText, setChatInputText] = useState('');
  const [insertedSuccess, setInsertedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'metrics'>('preview');

  // Query results from recommendation engine
  const recommendations = recommendPrompts(searchQuery, INITIAL_PROMPTS, 3);
  const currentSelected = recommendations[selectedPromptIndex] || recommendations[0];

  const handleSelectAndInsert = (recommendation: typeof recommendations[0]) => {
    setChatInputText(recommendation.prompt.content);
    setInsertedSuccess(true);
    setIsAssistantOpen(false);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366F1', '#4F46E5', '#10B981'],
    });

    setTimeout(() => {
      setInsertedSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
      {/* Enterprise Chatbot Chrome Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Global Enterprise AI Assistant</span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
              Infosys Corp Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            TARA PromptOps Gateway v2.4 Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Side: Enterprise Chatbot Environment */}
        <div className="lg:col-span-5 p-6 border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Infosys Engineering Assistant</h4>
                <p className="text-xs text-slate-500">Internal AI Platform • Connected to Claude 3.5 & GPT-4o</p>
              </div>
            </div>

            {/* Chatbot conversation bubble */}
            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-700 leading-relaxed">
                👋 Hello! How can I assist you with your backend microservices today? You can write a query or use the <strong>TARA Prompt Assistant</strong> to discover vetted enterprise prompts.
              </div>

              {insertedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold">Vetted Enterprise Prompt Injected!</span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Ready to execute with 96% accuracy and audited security guardrails.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Prompt Input Box */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {/* The Famous "✨ Prompt Assistant" button */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Prompt Input</span>
              <button
                onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs hover:shadow-md hover:scale-102 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{isAssistantOpen ? 'Hide Prompt Assistant' : '✨ Prompt Assistant'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Insert prompt here or write instructions..."
                rows={4}
                className="w-full text-xs bg-white rounded-xl border border-slate-200 p-3 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
              />
              {chatInputText && (
                <button
                  onClick={() => setChatInputText('')}
                  className="absolute top-2 right-2 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Tokens: ~{Math.ceil(chatInputText.length / 4)}</span>
              <button
                disabled={!chatInputText}
                onClick={() => {
                  alert("TARA has provided the verified prompt to your internal AI model. The prompt is now ready for production compilation!");
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Execute with LLM
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: TARA Embedded Intelligence Layer */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-white">
          <div>
            {/* Header with TARA official logo */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                  <img src="/tara-logo.png" alt="TARA Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">TARA Prompt Assistant</h3>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded uppercase">
                      Enterprise Layer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Semantic pgvector search across private enterprise repository</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">Prompt Quality Score (PQS)</span>
                <p className="text-[11px] text-emerald-600 font-semibold">100% Pre-Execution Guard</p>
              </div>
            </div>

            {/* Developer Search Query Input */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Developer Natural Query
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. I need a Spring Boot REST API authentication prompt"
                  className="w-full pl-9 pr-24 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
                <button
                  onClick={() => setSearchQuery('I need a Spring Boot REST API authentication prompt')}
                  className="absolute right-2 top-1.5 text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md font-medium cursor-pointer"
                >
                  Reset Demo
                </button>
              </div>
            </div>

            {/* Top 3 Vetted Prompt Suggestions */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Top 3 Ranked Prompts (by Historical Performance & PQS)
                </span>
                <span className="text-[11px] text-slate-500">TARA never hallucinates new code</span>
              </div>

              <div className="space-y-2.5">
                {recommendations.map((item, idx) => {
                  const isSelected = selectedPromptIndex === idx;
                  return (
                    <div
                      key={item.prompt.id}
                      onClick={() => setSelectedPromptIndex(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/30 shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                            idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            #{idx + 1}
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                            {item.prompt.title}
                          </h5>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Accuracy: {item.accuracy}%
                          </span>
                        </div>
                      </div>

                      {/* Prompt Metrics Row */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Security: <strong className="text-slate-900">{item.securityRating}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Cost: <strong className="text-slate-900">{item.costTier}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>Used by: <strong className="text-slate-900">{item.developerCount} developers</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Rating: <strong className="text-slate-900">{item.averageRating}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Prompt Preview Tabs */}
            {currentSelected && (
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2">
                  <span className="font-semibold text-slate-700">Preview: {currentSelected.prompt.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                      {currentSelected.prompt.currentVersion}
                    </span>
                  </div>
                </div>

                <div className="max-h-28 overflow-y-auto font-mono text-[11px] text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                  <pre className="whitespace-pre-wrap">{currentSelected.prompt.content.slice(0, 320)}...</pre>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Selected: <strong className="text-slate-800">Suggestion #{selectedPromptIndex + 1}</strong>
            </div>

            <button
              onClick={() => handleSelectAndInsert(currentSelected)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Insert into Chatbot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
