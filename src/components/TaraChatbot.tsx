import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, Zap, Database, Terminal, CheckCircle2, ChevronDown
} from 'lucide-react';
import { TaraLogo } from './common/TaraLogo';

interface TaraChatbotProps {
  onNavigateTab?: (view: string, subTab?: string) => void;
  activeView?: string;
}

interface ChatMessage {
  id: string;
  sender: 'tara' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    view: string;
    subTab?: string;
  };
  pills?: string[];
}

export const TaraChatbot: React.FC<TaraChatbotProps> = ({ onNavigateTab, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'tara',
      text: "Hello! I'm **Tara your friend** 👋 I'm here to help you navigate your workspace, understand Prompt Quality Scores (PQS), test enterprise prompts, and connect TARA to your chatbots and IDEs.",
      timestamp: 'Just now',
      pills: [
        'How does PQS scoring work?',
        'Show me Infosys Chatbot demo',
        'How do I optimize a prompt?',
        'Where are API keys & Spring Boot SDK?',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate intelligent response
    setTimeout(() => {
      const q = userText.toLowerCase();
      let replyText = "I'm here to help! TARA acts as the intelligent prompt engineering layer between your developers and LLMs like GPT-4o, Claude 3.5, and Gemini.";
      let action: ChatMessage['action'] | undefined = undefined;

      if (q.includes('pqs') || q.includes('score') || q.includes('quality') || q.includes('metric')) {
        replyText = "The **Prompt Quality Score (PQS)** is our composite 0-100 metric calculated using 26 AI-driven indicators. It weighs Accuracy (🎯 97%), LLM Judge (🧠 96%), Security (🔒 100%), Cost Efficiency (💰 92%), and Regression Stability (🔄 97%). It guarantees high-performance output before sending prompts to any LLM!";
        action = { label: 'Explore PQS in Prompt Studio', view: 'workspace', subTab: 'studio' };
      } else if (q.includes('infosys') || q.includes('chatbot') || q.includes('assistant') || q.includes('demo')) {
        replyText = "In enterprise setups like Infosys, developers don't write prompts from scratch in their chatbot. When they click **'✨ Prompt Assistant'**, TARA runs semantic pgvector search, ranks the Top 3 battle-tested prompts, and inserts the winner with 1 click!";
        action = { label: 'Test Live Chatbot Simulator', view: 'landing', subTab: 'simulator' };
      } else if (q.includes('optimize') || q.includes('impro') || q.includes('studio')) {
        replyText = "Our **Prompt Optimizer** performs side-by-side AST and semantic analysis: it injects persona anchors, adds JSON schema guardrails, removes redundant fluff, and protects against jailbreaks.";
        action = { label: 'Open Prompt Optimizer', view: 'workspace', subTab: 'optimizer' };
      } else if (q.includes('api') || q.includes('spring') || q.includes('sdk') || q.includes('developer')) {
        replyText = "TARA provides enterprise REST APIs (`/v1/prompts/recommend`, `/v1/prompts/evaluate`) with pre-built SDKs for Java Spring Boot 3, Python FastAPI, and TypeScript. You can generate API keys with custom rate limits in the API Dashboard!";
        action = { label: 'Open API & SDK Dashboard', view: 'developer', subTab: 'playground' };
      } else if (q.includes('enterprise') || q.includes('governance') || q.includes('audit') || q.includes('team')) {
        replyText = "The **Enterprise Governance Dashboard** manages team access (Engineering, FinTech, Legal), multi-stage approval workflows, prompt injection scanners, and immutable audit logs.";
        action = { label: 'Go to Enterprise Governance', view: 'enterprise', subTab: 'governance' };
      } else if (q.includes('regression') || q.includes('test')) {
        replyText = "TARA's **Regression Testing Suite** runs golden test cases against prompts to verify output assertions and latency bounds across GPT-4o, Claude, and Gemini.";
        action = { label: 'View Regression Suite', view: 'enterprise', subTab: 'regression' };
      } else {
        replyText = `Great question! As your friend Tara, I recommend checking our dashboards. You can explore our **Prompt Studio** to write and test prompts, or the **Enterprise Platform** to inspect security scans and audit trails.`;
        action = { label: 'Explore Prompt Library', view: 'workspace', subTab: 'library' };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `tara-${Date.now()}`,
          sender: 'tara',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: { label: string; view: string; subTab?: string }) => {
    if (onNavigateTab) {
      onNavigateTab(action.view, action.subTab);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-full border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-xs group-hover:scale-110 transition-transform">
                <img src="/tara-logo.png" alt="Tara" className="w-full h-full object-contain" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Tara your friend</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-indigo-50 text-indigo-700 font-semibold rounded">AI</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">How can I help you today?</div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Dialog Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 sm:w-[420px] max-h-[620px] h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 shadow-xs flex items-center justify-center">
                  <img src="/tara-logo.png" alt="Tara" className="w-full h-full object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Tara your friend</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded border border-emerald-200">
                    Online Guide
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Enterprise PromptOps Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text.split('**').map((chunk, idx) =>
                      idx % 2 === 1 ? <strong key={idx} className="font-semibold">{chunk}</strong> : chunk
                    )}
                  </div>

                  {/* Contextual Action Button */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex">
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick suggestion pills */}
                {msg.pills && (
                  <div className="mt-3 flex flex-wrap gap-1.5 max-w-full">
                    {msg.pills.map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(pill)}
                        className="text-[11px] text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 px-2.5 py-1 rounded-full transition-all text-left shadow-2xs cursor-pointer"
                      >
                        ✨ {pill}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 p-0.5 flex items-center justify-center">
                  <img src="/tara-logo.png" alt="Tara" className="w-full h-full object-contain animate-spin-slow" />
                </div>
                <span className="italic">Tara your friend is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick shortcuts row */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500 whitespace-nowrap">
            <span className="font-medium text-slate-400">Quick:</span>
            <button
              onClick={() => handleSendMessage('What is Prompt Quality Score?')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              PQS Score
            </button>
            <button
              onClick={() => handleSendMessage('How does the Infosys chatbot integration work?')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Chatbot Integration
            </button>
            <button
              onClick={() => handleSendMessage('Where are API keys?')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              API Keys
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder="Ask Tara anything about the platform..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
