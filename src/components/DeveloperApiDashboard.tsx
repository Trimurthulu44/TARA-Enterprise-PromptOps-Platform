import React, { useState } from 'react';
import { 
  Key, Terminal, Code2, Copy, Check, Plus, 
  Trash2, ShieldCheck, Zap, Activity, ExternalLink, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiKeyItem } from '../types';
import { INITIAL_API_KEYS, INITIAL_PROMPTS } from '../services/mockData';
import { recommendPrompts } from '../services/recommendationEngine';
import { calculatePQS, optimizePrompt } from '../services/pqsEngine';

export const DeveloperApiDashboard: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [activeTab, setActiveTab] = useState<'playground' | 'keys' | 'sdks'>('playground');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'/v1/prompts/recommend' | '/v1/prompts/evaluate' | '/v1/prompts/optimize'>('/v1/prompts/recommend');
  
  // Playground state
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        query: 'I need a Spring Boot REST API authentication prompt',
        topK: 3,
        minPqsScore: 90,
        targetModels: ['GPT-4o', 'Claude-3-5-Sonnet'],
      },
      null,
      2
    )
  );
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New key form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState('10000');

  const handleExecutePlayground = () => {
    setIsExecutingApi(true);
    setApiLatency(null);

    setTimeout(() => {
      let resultPayload: any = {};
      const start = performance.now();

      try {
        const parsed = JSON.parse(requestBody);

        if (selectedEndpoint === '/v1/prompts/recommend') {
          const recs = recommendPrompts(parsed.query || '', INITIAL_PROMPTS, parsed.topK || 3);
          resultPayload = {
            status: 200,
            message: 'OK',
            timestamp: new Date().toISOString(),
            tenantId: 'infosys-corp',
            recommendations: recs.map((r) => ({
              rank: r.rank,
              id: r.prompt.id,
              title: r.prompt.title,
              pqsScore: r.pqsScore,
              accuracy: r.accuracy,
              securityRating: r.securityRating,
              developerCount: r.developerCount,
              averageRating: r.averageRating,
              content: r.prompt.content,
            })),
          };
        } else if (selectedEndpoint === '/v1/prompts/evaluate') {
          const evalRes = calculatePQS(parsed.prompt || 'Sample prompt content');
          resultPayload = {
            status: 200,
            message: 'Evaluation complete',
            timestamp: new Date().toISOString(),
            pqsScore: evalRes.pqs.overallScore,
            health: evalRes.pqs.health,
            recommendation: evalRes.pqs.recommendation,
            coreMetrics: evalRes.pqs.core,
            enterpriseMetrics: evalRes.pqs.enterprise,
            vulnerabilities: evalRes.vulnerabilities,
          };
        } else {
          const optimized = optimizePrompt(parsed.prompt || 'Sample prompt content');
          resultPayload = {
            status: 200,
            message: 'Prompt successfully optimized with TARA standard',
            timestamp: new Date().toISOString(),
            originalTokens: Math.ceil((parsed.prompt || '').length / 4),
            optimizedTokens: Math.ceil(optimized.length / 4),
            optimizedPrompt: optimized,
          };
        }
      } catch (err) {
        resultPayload = {
          status: 400,
          error: 'BAD_REQUEST',
          message: 'Invalid JSON payload structure.',
        };
      }

      const latency = Math.round(performance.now() - start + Math.floor(Math.random() * 20 + 35));
      setApiLatency(latency);
      setResponseOutput(resultPayload);
      setIsExecutingApi(false);
    }, 450);
  };

  const handleCreateKey = () => {
    if (!newKeyName) return;
    const suffix = Math.random().toString(36).substring(2, 6);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: 'tara_live_custom_',
      maskedKey: `tara_live_custom_••••••••••••••••${suffix}`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsedDate: 'Never',
      scopes: ['prompts:recommend', 'prompts:evaluate', 'prompts:read'],
      rateLimitPerMin: parseInt(newKeyLimit) || 5000,
      status: 'ACTIVE',
    };

    setApiKeys([newKey, ...apiKeys]);
    setShowCreateModal(false);
    setNewKeyName('');

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#4F46E5', '#10B981'],
    });
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map((k) => (k.id === keyId ? { ...k, status: 'REVOKED' } : k)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              TARA REST API v1.0
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              99.98% Uptime SLA
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Developer Platform & Enterprise API Gateway
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Integrate TARA directly into Cursor, GitHub Copilot, Spring Boot services, and custom internal assistants.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'playground' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live API Playground
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'keys' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API Keys ({apiKeys.length})
          </button>
          <button
            onClick={() => setActiveTab('sdks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sdks' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SDK Quickstarts
          </button>
        </div>
      </div>

      {/* Real-time Health Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">P95 Global Latency</span>
          <div className="text-xl font-black text-slate-900 mt-1">42 ms</div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Ultra-low overhead</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">24h API Volume</span>
          <div className="text-xl font-black text-slate-900 mt-1">1,482,900 reqs</div>
          <p className="text-[10px] text-indigo-600 mt-0.5">Infosys + GlobalTech tenants</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Redis Cache Hit Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">94.2%</div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Sub-5ms cached vector retrieval</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Error Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">0.002%</div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Zero unhandled 5xx exceptions</p>
        </div>
      </div>

      {/* VIEW: Live API Playground */}
      {activeTab === 'playground' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Endpoint Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200">
                POST
              </span>
              <select
                value={selectedEndpoint}
                onChange={(e) => {
                  const ep = e.target.value as any;
                  setSelectedEndpoint(ep);
                  if (ep === '/v1/prompts/recommend') {
                    setRequestBody(
                      JSON.stringify(
                        {
                          query: 'I need a Spring Boot REST API authentication prompt',
                          topK: 3,
                          minPqsScore: 90,
                        },
                        null,
                        2
                      )
                    );
                  } else if (ep === '/v1/prompts/evaluate') {
                    setRequestBody(
                      JSON.stringify(
                        {
                          prompt:
                            'You are a senior Java engineer. Generate a Spring Security 6 filter chain with stateless JWT validation.',
                          model: 'GPT-4o',
                        },
                        null,
                        2
                      )
                    );
                  } else {
                    setRequestBody(
                      JSON.stringify(
                        {
                          prompt: 'Write an SQL query to get user details.',
                          enforceJsonSchema: true,
                        },
                        null,
                        2
                      )
                    );
                  }
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="/v1/prompts/recommend">https://api.tara-ops.com/v1/prompts/recommend</option>
                <option value="/v1/prompts/evaluate">https://api.tara-ops.com/v1/prompts/evaluate</option>
                <option value="/v1/prompts/optimize">https://api.tara-ops.com/v1/prompts/optimize</option>
              </select>
            </div>

            <button
              onClick={handleExecutePlayground}
              disabled={isExecutingApi}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isExecutingApi ? 'animate-spin' : ''}`} />
              <span>{isExecutingApi ? 'Sending Request...' : 'Send API Request'}</span>
            </button>
          </div>

          {/* Request / Response Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Request JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Request Payload (JSON)</span>
                <span className="text-[11px] text-slate-400 font-mono">Content-Type: application/json</span>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={14}
                className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            {/* Right: Response JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Response (HTTP 200 OK)</span>
                {apiLatency && (
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⏱ Latency: {apiLatency}ms
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-950 text-indigo-300 font-mono text-xs rounded-2xl p-4 border border-slate-900 min-h-[300px] max-h-[340px] overflow-y-auto leading-relaxed">
                {responseOutput ? (
                  <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
                ) : (
                  <div className="text-slate-500 italic flex flex-col items-center justify-center h-48">
                    <span>Click "Send API Request" to test endpoint response.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: API Keys */}
      {activeTab === 'keys' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Enterprise API Keys</h3>
              <p className="text-xs text-slate-500">
                Generate scoped tokens with strict rate limits for microservices, IDEs, and internal chatbots.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  key.status === 'ACTIVE'
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-slate-200 bg-slate-100/50 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{key.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        key.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {key.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                    <span>{key.maskedKey}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(key.maskedKey);
                        setCopiedKey(key.id);
                        setTimeout(() => setCopiedKey(null), 2000);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] cursor-pointer"
                    >
                      {copiedKey === key.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Rate: {key.rateLimitPerMin.toLocaleString()} req/min</span>
                  <span>Last used: {key.lastUsedDate}</span>
                  {key.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <h4 className="text-base font-bold text-slate-900">Generate New Scoped API Key</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Key Description / Client Name</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. Jenkins CI Deployment Bot"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Rate Limit (Requests / minute)</label>
                    <input
                      type="number"
                      value={newKeyLimit}
                      onChange={(e) => setNewKeyLimit(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Generate Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: SDK Quickstarts */}
      {activeTab === 'sdks' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">Official TARA SDKs</h3>
            <p className="text-xs text-slate-500">
              Drop-in libraries for Java 21 Spring Boot, Python 3.12 FastAPI, and Next.js / TypeScript.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-900 block text-sm">Java Spring Boot 3 Starter</span>
              <p className="text-slate-600 leading-relaxed">
                Includes auto-configured RestClient beans, Spring AI prompt enrichers, and JWT interceptors.
              </p>
              <div className="font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px]">
                implementation 'com.tara:promptops-spring-boot-starter:2.4.0'
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-900 block text-sm">Python / LangChain SDK</span>
              <p className="text-slate-600 leading-relaxed">
                Async client compatible with LangGraph, LiteLLM, FastAPI, and Hugging Face sentence-transformers.
              </p>
              <div className="font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px]">
                pip install tara-promptops
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-900 block text-sm">TypeScript / Next.js SDK</span>
              <p className="text-slate-600 leading-relaxed">
                Zero-dependency client for React 19, Vercel AI SDK, and Node.js environments.
              </p>
              <div className="font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px]">
                npm install @tara-ops/sdk
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
