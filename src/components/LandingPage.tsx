import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2, 
  Terminal, Cpu, Database, Layers, Lock, Star, ChevronDown, 
  Building2, Users, Code2, Zap, BarChart3, HelpCircle, ExternalLink, Play
} from 'lucide-react';
import { PromptAssistantSimulator } from './PromptAssistantSimulator';
import { PQSScoreVisualizer } from './PQSScoreVisualizer';
import { INITIAL_PROMPTS } from '../services/mockData';
import { TaraLogo } from './common/TaraLogo';

interface LandingPageProps {
  onNavigate: (view: string, subTab?: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [activeCodeLang, setActiveCodeLang] = useState<'java' | 'python' | 'curl'>('java');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  const topSamplePrompt = INITIAL_PROMPTS[0];

  const codeSnippets = {
    java: `// Enterprise Java Spring Boot 3 Client for TARA
@Service
public class PromptOpsService {
    private final RestClient restClient;

    public PromptOpsService(@Value("\${tara.api-key}") String apiKey) {
        this.restClient = RestClient.builder()
            .baseUrl("https://api.tara-ops.com/v1")
            .defaultHeader("Authorization", "Bearer " + apiKey)
            .defaultHeader("X-Tenant-Id", "infosys-corp")
            .build();
    }

    public PromptRecommendation recommendPrompt(String developerQuery) {
        return restClient.post()
            .uri("/prompts/recommend")
            .body(Map.of(
                "query", developerQuery,
                "targetModel", "GPT_4O",
                "minPqsScore", 90
            ))
            .retrieve()
            .body(PromptRecommendation.class);
    }
}`,
    python: `# Python FastAPI / LangChain AI Service Integration
import requests
from pydantic import BaseModel

class TaraClient:
    def __init__(self, api_key: str, tenant_id: str = "infosys-corp"):
        self.base_url = "https://api.tara-ops.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "X-Tenant-Id": tenant_id
        }

    def recommend(self, developer_query: str):
        payload = {
            "query": developer_query,
            "min_pqs_score": 90,
            "include_security_audit": True
        }
        res = requests.post(f"{self.base_url}/prompts/recommend", json=payload, headers=self.headers)
        return res.json()`,
    curl: `curl -X POST "https://api.tara-ops.com/v1/prompts/recommend" \\
  -H "Authorization: Bearer tara_live_infy_94b2" \\
  -H "X-Tenant-Id: infosys-corp" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "I need a Spring Boot REST API authentication prompt",
    "topK": 3,
    "requireApproval": true
  }'`,
  };

  const faqs = [
    {
      q: "Is TARA another AI chatbot?",
      a: "No! TARA is never a chatbot. TARA is an Enterprise PromptOps Platform that manages, analyzes, evaluates, optimizes, secures, versions, scores, and governs prompts before they are ever sent to any LLM. You keep your existing chatbots (ChatGPT, Claude, Cursor, internal enterprise bots) and TARA acts as the engineering intelligence layer.",
    },
    {
      q: "How does TARA integrate with internal corporate AI assistants like Infosys?",
      a: "Through our low-latency REST API and SDKs! When a developer clicks the '✨ Prompt Assistant' button inside their chatbot, TARA executes semantic vector search over the company's private repository and returns the Top 3 battle-tested, security-cleared prompts with PQS scores. With one click, the prompt is injected right into the chatbot.",
    },
    {
      q: "What is the Prompt Quality Score (PQS)?",
      a: "PQS is our proprietary 0–100 quality metric computed using 26 AI-driven indicators. It rigorously scores Accuracy, Security, LLM Judge consensus, Instruction Clarity, Cost Efficiency, Latency, Regression Stability, and Organization Approvals.",
    },
    {
      q: "Can other companies access our organization's prompts?",
      a: "Never. Every enterprise receives an isolated multi-tenant workspace with separate database schema, dedicated pgvector partitions, row-level security (RLS), and strict role-based access control (RBAC).",
    },
    {
      q: "Does TARA support public workspaces for students and freelancers?",
      a: "Yes! TARA includes a Personal Public Workspace where individual developers, researchers, and prompt engineers can author, optimize, version, test, and export prompts for free.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-200/60">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                The PromptOps Standard for the AI-First Era
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1" onClick={() => onNavigate('simulator')}>
                Live Chatbot Demo <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Prompts Are the <span className="brand-text-gradient">New Source Code.</span> Govern Them with TARA.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Artificial Intelligence will not replace everyone. People who know how to engineer prompts effectively will. TARA manages, analyzes, evaluates, optimizes, and scores prompts across your organization <em>before</em> they are sent to any LLM.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('workspace')}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Prompt Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('simulator')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Experience Prompt Assistant</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Book Enterprise Demo
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Prompt Injection Vulnerability</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>26-Metric Prompt Quality Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>SOC2 & HIPAA Compliant Guardrails</span>
              </div>
            </div>
          </div>

          {/* Interactive Chatbot Integration Demo Embed */}
          <div className="mt-14" id="chatbot-simulator-section">
            <div className="text-center mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Interactive Live Demonstration
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                How TARA Integrates into Enterprise Chatbots
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
                Try searching below: TARA scans the private repository, calculates PQS, and injects the top-ranked prompt into the chatbot.
              </p>
            </div>
            <PromptAssistantSimulator />
          </div>
        </div>
      </section>

      {/* PQS Engine Deep Dive Section */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Deterministic AI Evaluation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Prompt Quality Score (PQS) Engine
            </h2>
            <p className="text-sm text-slate-600">
              Never guess if your prompt will work. TARA mathematically verifies prompts against 26 comprehensive indicators across accuracy, security, and enterprise regression.
            </p>
          </div>

          <PQSScoreVisualizer 
            score={topSamplePrompt.pqs} 
            onOptimizeClick={() => onNavigate('workspace', 'optimizer')}
          />
        </div>
      </section>

      {/* 4-Step PromptOps Lifecycle Flow */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Enterprise PromptOps Lifecycle
            </h2>
            <p className="text-sm text-slate-600">
              From developer conception to production AI invocation, here is how TARA standardizes prompt engineering across organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white subtle-card relative">
              <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Semantic Discovery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Developers search in natural language. TARA's pgvector engine searches private repositories to prevent duplicating already solved prompts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white subtle-card relative">
              <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">PQS & LLM Judging</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The prompt is evaluated across 26 metrics. Multi-model LLM judges cross-examine outputs for accuracy, hallucination risks, and latency.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white subtle-card relative">
              <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Security & Optimization</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Heuristic scanners detect prompt injections, PII leakage, and token bloat. One-click optimizer injects strict guardrails and JSON schemas.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white subtle-card relative">
              <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Governance & Deployment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review boards approve prompts to the gold-standard repository. Audit logs track every version, and prompts are injected via SDK or API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer API & SDK Showcase */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Developer Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Integrate TARA into Any AI System in Minutes
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you're developing inside Cursor, building Spring Boot enterprise microservices, or powering internal enterprise AI bots, TARA exposes high-performance REST APIs.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sub-50ms Latency API</h4>
                    <p className="text-xs text-slate-500">Global edge caching and Redis token bucket rate limiting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Native Spring Boot 3 & Python SDKs</h4>
                    <p className="text-xs text-slate-500">Fully typed models, interceptors, and Spring AI beans.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Multi-Model LLM Compatibility</h4>
                    <p className="text-xs text-slate-500">Compatible with OpenAI GPT-4o, Anthropic Claude 3.5, and Google Gemini.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('developer')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Open Interactive API Playground</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">TARA SDK Code Preview</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveCodeLang('java')}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        activeCodeLang === 'java' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Java (Spring Boot 3)
                    </button>
                    <button
                      onClick={() => setActiveCodeLang('python')}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        activeCodeLang === 'python' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Python
                    </button>
                    <button
                      onClick={() => setActiveCodeLang('curl')}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        activeCodeLang === 'curl' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      cURL
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto max-h-[380px]">
                  <pre className="whitespace-pre">{codeSnippets[activeCodeLang]}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public vs Enterprise Comparison Table */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Workspace Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Public Workspace vs. Enterprise Platform
            </h2>
            <p className="text-sm text-slate-600">
              TARA empowers individual developers as well as Fortune 500 enterprises with appropriate security isolation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-900">Feature Capability</th>
                  <th className="p-4 font-bold text-slate-700">Public / Personal</th>
                  <th className="p-4 font-bold text-indigo-700 bg-indigo-50/50">Enterprise Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Database & Tenancy</td>
                  <td className="p-4 text-slate-600">Shared community cloud</td>
                  <td className="p-4 text-slate-900 font-bold bg-indigo-50/30">Dedicated isolated schema + pgvector</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Prompt Quality Score (PQS)</td>
                  <td className="p-4 text-slate-600">Core + Public Metrics</td>
                  <td className="p-4 text-slate-900 font-bold bg-indigo-50/30">Full 26 Enterprise Metrics & Regression</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Governance & RBAC</td>
                  <td className="p-4 text-slate-400">Not included</td>
                  <td className="p-4 text-emerald-700 font-bold bg-indigo-50/30">Multi-department approval workflows</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Prompt Injection Scanner</td>
                  <td className="p-4 text-slate-600">Basic heuristic scan</td>
                  <td className="p-4 text-emerald-700 font-bold bg-indigo-50/30">Real-time AST & Jailbreak defense</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Audit Logs & Compliance</td>
                  <td className="p-4 text-slate-400">None</td>
                  <td className="p-4 text-slate-900 font-bold bg-indigo-50/30">Immutable SOC2 & HIPAA audit trails</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Enterprise Chatbot Gateway API</td>
                  <td className="p-4 text-slate-600">Personal rate limit (60/min)</td>
                  <td className="p-4 text-slate-900 font-bold bg-indigo-50/30">Unlimited rate limit + Spring Boot SDK</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-20 bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Invest in Prompt Quality, Save Millions on LLMs
            </h2>
            <p className="text-sm text-slate-600">
              Prevent hallucinations, token bloat, and security incidents with proactive prompt intelligence.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 rounded-full bg-indigo-600 p-1 flex items-center transition-colors cursor-pointer"
              >
                <span className={`w-4 h-4 rounded-full bg-white transition-transform ${billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs font-bold ${billingPeriod === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Community Free */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white subtle-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Community Free</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">Individual</span>
                </div>
                <p className="text-xs text-slate-500">For students, researchers, and solo prompt engineers.</p>
                <div className="text-3xl font-black text-slate-900">$0 <span className="text-xs text-slate-500 font-normal">/ forever</span></div>
                
                <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ Personal Prompt Library</li>
                  <li className="flex items-center gap-2">✓ AI Prompt Optimizer</li>
                  <li className="flex items-center gap-2">✓ Prompt Quality Score (PQS)</li>
                  <li className="flex items-center gap-2">✓ Export to JSON/YAML</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('workspace')}
                className="mt-8 w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Open Personal Workspace
              </button>
            </div>

            {/* Team Pro */}
            <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-white shadow-xl flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Team Pro</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Fast Scaling</span>
                </div>
                <p className="text-xs text-slate-500">For engineering teams building AI-powered features.</p>
                <div className="text-3xl font-black text-slate-900">
                  {billingPeriod === 'annual' ? '$79' : '$99'}
                  <span className="text-xs text-slate-500 font-normal"> / dev / month</span>
                </div>
                
                <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ Up to 50 Developers</li>
                  <li className="flex items-center gap-2">✓ Semantic pgvector Prompt Search</li>
                  <li className="flex items-center gap-2">✓ Regression Testing Suite</li>
                  <li className="flex items-center gap-2">✓ Prompt Injection Security Scanner</li>
                  <li className="flex items-center gap-2">✓ 500,000 API calls / month</li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise Custom */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white subtle-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Enterprise Custom</h3>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">Infosys Standard</span>
                </div>
                <p className="text-xs text-slate-500">For Fortune 500 organizations with rigorous compliance.</p>
                <div className="text-3xl font-black text-slate-900">Custom <span className="text-xs text-slate-500 font-normal">/ annual contract</span></div>
                
                <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ Dedicated Database & pgvector Partition</li>
                  <li className="flex items-center gap-2">✓ Multi-Department RBAC & Governance</li>
                  <li className="flex items-center gap-2">✓ Immutable SOC2 & HIPAA Audit Logs</li>
                  <li className="flex items-center gap-2">✓ Custom SSO (Okta, Keycloak, Azure AD)</li>
                  <li className="flex items-center gap-2">✓ Dedicated SLA & PromptOps Architect</li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Talk to Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Trusted by Engineering Leaders
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Architects Say About TARA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Prompts were floating around Slack channels, Notion documents, and local scratchpads. TARA gave our 1,200 developers a single source of truth. Our production hallucination rate dropped by 84% in three months."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  VK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Vikram Krishnamurthy</div>
                  <div className="text-[11px] text-slate-500">VP of Engineering, GlobalTech Systems</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "The Prompt Quality Score (PQS) is revolutionary. Our security review board won't approve any prompt into production unless it achieves a 90+ PQS score with zero injection vulnerability. It's as essential as SonarQube."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  SD
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sneha Deshmukh</div>
                  <div className="text-[11px] text-slate-500">Chief Information Security Officer</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "The ✨ Prompt Assistant button inside our internal chatbot transformed developer workflows. Developers simply state their intent, and TARA delivers the audited, top-ranked prompt with 96% accuracy."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Anand Radhakrishnan</div>
                  <div className="text-[11px] text-slate-500">Head of Enterprise AI Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Everything You Need to Know About TARA
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden subtle-card"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer with Creator Attribution */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <TaraLogo size="md" subtitle="Enterprise PromptOps Platform" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <button onClick={() => onNavigate('landing')} className="hover:text-slate-900">Showcase</button>
              <button onClick={() => onNavigate('workspace')} className="hover:text-slate-900">Prompt Studio</button>
              <button onClick={() => onNavigate('enterprise')} className="hover:text-slate-900">Governance</button>
              <button onClick={() => onNavigate('developer')} className="hover:text-slate-900">API Documentation</button>
              <button onClick={() => onNavigate('analytics')} className="hover:text-slate-900">Analytics</button>
              <button onClick={onOpenAuth} className="hover:text-slate-900">Sign In</button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 TARA Platforms Inc. All rights reserved. Enterprise Prompt Engineering & Governance.</p>
            <p className="font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              Created by Valteti Trimurthulu
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
