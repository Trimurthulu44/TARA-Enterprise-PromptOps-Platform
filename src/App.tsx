import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PublicWorkspace } from './components/PublicWorkspace';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { DeveloperApiDashboard } from './components/DeveloperApiDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PromptAssistantSimulator } from './components/PromptAssistantSimulator';
import { AuthModal } from './components/AuthModal';
import { TaraChatbot } from './components/TaraChatbot';
import { INITIAL_PROMPTS } from './services/mockData';
import { PromptItem, UserSession, UserType } from './types';
import { Search, X, Sparkles } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'enterprise' | 'developer' | 'analytics' | 'simulator'>('landing');
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);
  const [isEnterpriseMode, setIsEnterpriseMode] = useState(true);
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialType, setAuthInitialType] = useState<UserType>('ENTERPRISE');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Persistent User Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('tara_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep enterprise mode in sync with user session if available
  useEffect(() => {
    if (currentUser) {
      setIsEnterpriseMode(currentUser.userType === 'ENTERPRISE');
    }
  }, [currentUser]);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, subTab?: string) => {
    setCurrentView(view as any);
    setCurrentSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (preferredType: UserType = 'ENTERPRISE') => {
    setAuthInitialType(preferredType);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (userSession: UserSession) => {
    setCurrentUser(userSession);
    try {
      localStorage.setItem('tara_user_session', JSON.stringify(userSession));
    } catch (e) {
      console.error('Failed to store session in localStorage', e);
    }

    if (userSession.userType === 'ENTERPRISE') {
      setIsEnterpriseMode(true);
      handleNavigate('enterprise');
    } else {
      setIsEnterpriseMode(false);
      handleNavigate('workspace');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tara_user_session');
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  const handleUpdatePrompt = (updated: PromptItem) => {
    setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreatePrompt = (newPrompt: PromptItem) => {
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const handleApprovePrompt = (promptId: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, status: 'APPROVED' } : p))
    );
  };

  const handleDeprecatePrompt = (promptId: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, status: 'DEPRECATED' } : p))
    );
  };

  const filteredSearchResults = prompts.filter(
    (p) =>
      searchFilter === '' ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => handleNavigate(v)}
        isEnterpriseMode={isEnterpriseMode}
        onToggleEnterpriseMode={() => setIsEnterpriseMode(!isEnterpriseMode)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenAuth={() => handleOpenAuth('ENTERPRISE')}
          />
        )}

        {currentView === 'workspace' && (
          <PublicWorkspace
            prompts={prompts}
            onUpdatePrompt={handleUpdatePrompt}
            onCreatePrompt={handleCreatePrompt}
            initialSubTab={currentSubTab}
          />
        )}

        {currentView === 'enterprise' && (
          <EnterpriseDashboard
            prompts={prompts}
            onApprovePrompt={handleApprovePrompt}
            onDeprecatePrompt={handleDeprecatePrompt}
            initialSubTab={currentSubTab}
          />
        )}

        {currentView === 'developer' && <DeveloperApiDashboard />}

        {currentView === 'analytics' && <AnalyticsDashboard prompts={prompts} />}

        {currentView === 'simulator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Interactive Standalone Simulation
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Enterprise AI Chatbot + TARA ✨ Prompt Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Experience how developers at Infosys and Fortune 500 organizations search, rank, and inject high-PQS prompts directly inside their corporate AI assistants.
              </p>
            </div>
            <PromptAssistantSimulator />
          </div>
        )}
      </main>

      {/* "Tara your friend" Floating AI Assistant */}
      <TaraChatbot onNavigateTab={handleNavigate} activeView={currentView} />

      {/* Auth Modal with explicit Enterprise vs Public separation */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
        initialType={authInitialType}
      />

      {/* Cmd+K Quick Search Command Palette */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search vetted prompts, categories, tags..."
                className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
              {filteredSearchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    handleNavigate('workspace');
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{p.title}</h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                      <span>{p.category}</span>
                      <span>•</span>
                      <span>{p.department}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    PQS: {p.pqs.overallScore}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press ESC to close</span>
              <span>Semantic pgvector indexed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
