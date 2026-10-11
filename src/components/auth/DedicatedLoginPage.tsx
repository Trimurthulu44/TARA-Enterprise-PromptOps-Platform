import React, { useState } from 'react';
import { 
  Building2, User, ShieldCheck, Sparkles, ArrowRight, 
  Lock, Mail, KeyRound, CheckCircle2, ChevronRight, ArrowLeft
} from 'lucide-react';
import { TaraLogo } from '../common/TaraLogo';
import { GoogleOAuthModal } from '../common/GoogleOAuthModal';
import { UserSession, UserType, Department } from '../../types';

interface DedicatedLoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onBackToIntro: () => void;
}

export const DedicatedLoginPage: React.FC<DedicatedLoginPageProps> = ({
  onLoginSuccess,
  onBackToIntro,
}) => {
  const [selectedPortal, setSelectedPortal] = useState<UserType>('ENTERPRISE');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Enterprise form fields
  const [workEmail, setWorkEmail] = useState('aditya.sharma@infosys.com');
  const [tenantId, setTenantId] = useState('infosys-corp');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [enterprisePassword, setEnterprisePassword] = useState('••••••••••••');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '9', '1', '7']);

  // Public form fields
  const [personalEmail, setPersonalEmail] = useState('karthikvaltheti7@gmail.com');
  const [personalPassword, setPersonalPassword] = useState('••••••••••••');

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpScreen(true);
  };

  const handleVerifyEnterpriseOtp = () => {
    const session: UserSession = {
      id: 'usr-infy-901',
      name: 'Aditya Sharma',
      email: workEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      userType: 'ENTERPRISE',
      role: 'Principal Security Architect',
      organization: {
        id: tenantId,
        name: 'Infosys Global Systems',
        domain: workEmail.split('@')[1] || 'infosys.com',
        department: department,
        tier: 'Enterprise Custom',
      },
      token: 'jwt_live_enterprise_infy_' + Math.random().toString(36).substring(2),
    };

    onLoginSuccess(session);
  };

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      id: 'usr-pub-karthik',
      name: 'Valteti Trimurthulu',
      email: personalEmail,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      userType: 'PUBLIC',
      role: 'Staff Prompt Engineer',
      token: 'jwt_live_public_' + Math.random().toString(36).substring(2),
    };

    onLoginSuccess(session);
  };

  const handleQuickDemo = (type: UserType) => {
    if (type === 'ENTERPRISE') {
      const session: UserSession = {
        id: 'usr-infy-901',
        name: 'Aditya Sharma',
        email: 'aditya.sharma@infosys.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        userType: 'ENTERPRISE',
        role: 'Principal Security Architect',
        organization: {
          id: 'infosys-corp',
          name: 'Infosys Global Systems',
          domain: 'infosys.com',
          department: 'Engineering',
          tier: 'Enterprise Custom',
        },
        token: 'jwt_live_enterprise_infy_demo',
      };
      onLoginSuccess(session);
    } else {
      const session: UserSession = {
        id: 'usr-pub-karthik',
        name: 'Valteti Trimurthulu',
        email: 'karthikvaltheti7@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        userType: 'PUBLIC',
        role: 'Community Prompt Architect',
        token: 'jwt_live_public_demo',
      };
      onLoginSuccess(session);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToIntro}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Intro</span>
        </button>

        {/* Big Highlighted TARA Logo */}
        <div className="flex items-center gap-3">
          <TaraLogo size="lg" subtitle="Enterprise PromptOps" animated={false} />
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-slate-800">Secure Access Gateway</span>
          <p className="text-[10px] text-emerald-600 font-semibold">● 256-Bit SSL Guarded</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        {/* Title & Portal Switcher */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Choose Your Destination Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Separate Portals for Organizations & Creators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to access your dedicated command center tailored for your exact workflow.
          </p>

          {/* Big Two-Door Switcher Tabs */}
          <div className="p-1.5 bg-slate-200/80 rounded-2xl grid grid-cols-2 gap-1.5 max-w-md mx-auto mt-4">
            <button
              onClick={() => {
                setSelectedPortal('ENTERPRISE');
                setShowOtpScreen(false);
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedPortal === 'ENTERPRISE'
                  ? 'bg-white text-indigo-700 shadow-md border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>🏢 Enterprise Portal</span>
            </button>

            <button
              onClick={() => {
                setSelectedPortal('PUBLIC');
                setShowOtpScreen(false);
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedPortal === 'PUBLIC'
                  ? 'bg-white text-emerald-700 shadow-md border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>👤 Public Creator Portal</span>
            </button>
          </div>
        </div>

        {/* DOOR 1: ENTERPRISE ORGANIZATION PORTAL */}
        {selectedPortal === 'ENTERPRISE' && (
          <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono uppercase">
                  Infosys & Corporate Tenant
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Enterprise SSO & Command Login</h3>
                <p className="text-xs text-slate-500">Dedicated database schema with pgvector & role governance</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            {/* Quick 1-Click Demo Lead */}
            <div className="p-3.5 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 rounded-2xl border border-indigo-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-900">Quick Test Enterprise Experience</div>
                <div className="text-[11px] text-slate-500">Aditya Sharma (Principal Security Architect)</div>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo('ENTERPRISE')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Enter</span>
              </button>
            </div>

            {/* Enterprise Form */}
            {!showOtpScreen ? (
              <form onSubmit={handleEnterpriseSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Corporate Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="aditya.sharma@infosys.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tenant ID</label>
                    <input
                      type="text"
                      required
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      placeholder="infosys-corp"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as Department)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="FinTech">FinTech</option>
                      <option value="Security & Compliance">Security & Compliance</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Legal">Legal</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Corporate Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={enterprisePassword}
                      onChange={(e) => setEnterprisePassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Authenticate & Request 2FA OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* OTP 2FA Screen */
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-indigo-700">Enterprise 2FA Required</span>
                  <p className="text-xs text-slate-500">Security code sent to {workEmail}</p>
                </div>

                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const next = [...otpCode];
                        next[idx] = e.target.value;
                        setOtpCode(next);
                      }}
                      className="w-10 h-12 text-center text-lg font-black font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyEnterpriseOtp}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Enter Enterprise CommandCenter</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* DOOR 2: PUBLIC CREATOR & DEVELOPER PORTAL */}
        {selectedPortal === 'PUBLIC' && (
          <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono uppercase">
                  Community Developer Edition
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Creator Studio & Prompt Library</h3>
                <p className="text-xs text-slate-500">Free personal workspace for students, researchers, and engineers</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            {/* REAL GOOGLE OAUTH BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google (Connect karthikvaltheti7@gmail.com)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('PUBLIC')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub SSO</span>
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or Email & Password</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handlePublicSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Personal Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={personalPassword}
                    onChange={(e) => setPersonalPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Public Creator Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Interactive Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onAuthenticated={(session) => onLoginSuccess(session)}
        targetMode={selectedPortal}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Created by Valteti Trimurthulu • TARA Enterprise PromptOps Platform
      </footer>
    </div>
  );
};
