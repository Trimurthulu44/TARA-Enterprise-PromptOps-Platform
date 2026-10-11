import React, { useState } from 'react';
import { 
  Building2, User, Search, Sparkles, 
  ChevronDown, LogIn, LogOut, ShieldCheck, 
  Settings, Key, Layers, ExternalLink, CheckCircle2
} from 'lucide-react';
import { TaraLogo } from './common/TaraLogo';
import { UserSession, UserType } from '../types';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isEnterpriseMode: boolean;
  onToggleEnterpriseMode: () => void;
  currentUser: UserSession | null;
  onOpenAuthModal: (preferredType?: UserType) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  isEnterpriseMode,
  onToggleEnterpriseMode,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenSearch,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Enterprise
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personal Library</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono font-semibold">
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

        {/* Right Action Icons & Auth State */}
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

          {/* AUTHENTICATION STATE */}
          {currentUser ? (
            /* Logged In User Profile with Dropdown Menu */
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-none">
                    {currentUser.userType === 'ENTERPRISE' ? (
                      <span className="text-indigo-600 font-semibold">Infosys Corp</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Public User</span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Drawer */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User info banner */}
                  <div className="px-4 py-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {currentUser.email}
                        </div>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          currentUser.userType === 'ENTERPRISE'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {currentUser.userType === 'ENTERPRISE' ? '🏢 Enterprise Member' : '👤 Community Developer'}
                        </span>
                      </div>
                    </div>

                    {currentUser.organization && (
                      <div className="mt-3 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-0.5 border border-slate-200/60">
                        <div className="font-semibold text-slate-800 flex items-center justify-between">
                          <span>{currentUser.organization.name}</span>
                          <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-mono font-bold">
                            {currentUser.organization.id}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Dept: <strong>{currentUser.organization.department}</strong> • Tier: <strong>{currentUser.organization.tier}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="px-2 py-2 space-y-0.5 text-xs text-slate-700">
                    <button
                      onClick={() => {
                        onSelectView('workspace');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-left cursor-pointer transition-colors"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>My Prompt Studio & Library</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectView('enterprise');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-left cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Enterprise Governance Board</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectView('developer');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-left cursor-pointer transition-colors"
                    >
                      <Key className="w-4 h-4 text-slate-500" />
                      <span>API Keys & Credentials</span>
                    </button>
                  </div>

                  {/* Logout & Switch actions */}
                  <div className="px-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-left text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Separate Organization and Public Sign In options */
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuthModal('ENTERPRISE')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Org Login</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('PUBLIC')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-indigo-600 text-white shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
