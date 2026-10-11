import React from 'react';
import { 
  Building2, User, Search, Bell, Sparkles, 
  ChevronDown, ShieldCheck, Terminal, Layers, ArrowUpRight, LogIn
} from 'lucide-react';
import { TaraLogo } from './common/TaraLogo';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isEnterpriseMode: boolean;
  onToggleEnterpriseMode: () => void;
  onOpenAuthModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  isEnterpriseMode,
  onToggleEnterpriseMode,
  onOpenAuthModal,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectView('landing')}
            className="flex items-center text-left cursor-pointer group"
          >
            <TaraLogo size="md" subtitle="Enterprise PromptOps" animated={false} />
          </button>

          {/* Workspace Switcher Badge */}
          <button
            onClick={onToggleEnterpriseMode}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            title="Click to toggle between Enterprise and Public workspace"
          >
            {isEnterpriseMode ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold">Infosys Corp Workspace</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                  Enterprise
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personal Library</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono">
                  Public
                </span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectView('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'landing'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Showcase
          </button>

          <button
            onClick={() => onSelectView('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'workspace'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Prompt Studio
          </button>

          <button
            onClick={() => onSelectView('enterprise')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'enterprise'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Enterprise Governance
          </button>

          <button
            onClick={() => onSelectView('developer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'developer'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            API & SDKs
          </button>

          <button
            onClick={() => onSelectView('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'analytics'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Analytics & PQS
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search prompts...</span>
            <kbd className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Demo Simulator CTA */}
          <button
            onClick={() => onSelectView('simulator')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Chatbot</span> Demo
          </button>

          {/* Sign In / Profile */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-indigo-600 text-white shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};
