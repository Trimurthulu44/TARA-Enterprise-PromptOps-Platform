import React, { useState, useEffect } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { DedicatedLoginPage } from './components/auth/DedicatedLoginPage';
import { EnterpriseCommandCenter } from './components/enterprise/EnterpriseCommandCenter';
import { PublicCreatorHub } from './components/public/PublicCreatorHub';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { TaraChatbot } from './components/TaraChatbot';
import { UserSession } from './types';

export function App() {
  // Navigation State: 'intro' | 'auth' | 'app' | 'showcase'
  const [screen, setScreen] = useState<'intro' | 'auth' | 'app' | 'showcase'>('intro');

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('tara_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // If user is already logged in on reload, jump straight to their dedicated portal
  useEffect(() => {
    if (currentUser) {
      setScreen('app');
    }
  }, []);

  const handleReadyToCook = () => {
    setScreen('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    try {
      localStorage.setItem('tara_user_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
    setScreen('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tara_user_session');
    } catch (e) {
      console.error(e);
    }
    setScreen('auth');
  };

  const handleSwitchToEnterprise = () => {
    if (currentUser) {
      const updated: UserSession = {
        ...currentUser,
        userType: 'ENTERPRISE',
        role: 'Principal Security Architect',
        organization: {
          id: 'infosys-corp',
          name: 'Infosys Global Systems',
          domain: 'infosys.com',
          department: 'Engineering',
          tier: 'Enterprise Custom',
        },
      };
      setCurrentUser(updated);
      localStorage.setItem('tara_user_session', JSON.stringify(updated));
    }
  };

  const handleSwitchToPublic = () => {
    if (currentUser) {
      const updated: UserSession = {
        ...currentUser,
        userType: 'PUBLIC',
        role: 'Community Prompt Engineer',
        organization: undefined,
      };
      setCurrentUser(updated);
      localStorage.setItem('tara_user_session', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. CINEMATIC INTRO SCREEN (Logo moving from left to right + surprise "Ready to Cook" button) */}
      {screen === 'intro' && !currentUser && (
        <CinematicIntro onReadyToCook={handleReadyToCook} />
      )}

      {/* 2. DEDICATED LOGIN WEBPAGE (Distinct Enterprise vs Public portals with real Google OAuth) */}
      {screen === 'auth' && !currentUser && (
        <DedicatedLoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToIntro={() => setScreen('intro')}
        />
      )}

      {/* 3. AUTHENTICATED WEBPAGES BASED ON USER TYPE */}
      {screen === 'app' && currentUser && (
        <>
          {currentUser.userType === 'ENTERPRISE' ? (
            /* ENTERPRISE COMMAND CENTER (Collapsible Left Sidebar & Corporate Tools) */
            <EnterpriseCommandCenter
              currentUser={currentUser}
              onLogout={handleLogout}
              onSwitchToPublic={handleSwitchToPublic}
            />
          ) : (
            /* PUBLIC CREATOR HUB (Collapsible Left Sidebar & Studio Playground) */
            <PublicCreatorHub
              currentUser={currentUser}
              onLogout={handleLogout}
              onSwitchToEnterprise={handleSwitchToEnterprise}
            />
          )}
        </>
      )}

      {/* 4. SHOWCASE LANDING PAGE (Alternative marketing showcase if accessed) */}
      {screen === 'showcase' && (
        <>
          <Navbar
            currentView="landing"
            onSelectView={() => {}}
            isEnterpriseMode={true}
            onToggleEnterpriseMode={() => {}}
            currentUser={currentUser}
            onOpenAuthModal={() => setScreen('auth')}
            onLogout={handleLogout}
            onOpenSearch={() => {}}
          />
          <LandingPage
            onNavigate={() => setScreen('auth')}
            onOpenAuth={() => setScreen('auth')}
          />
        </>
      )}

      {/* "Tara your friend" Persistent AI Assistant Companion */}
      <TaraChatbot
        onNavigateTab={(view) => {
          if (view === 'landing') setScreen('showcase');
          else if (!currentUser) setScreen('auth');
        }}
      />
    </div>
  );
}

export default App;
