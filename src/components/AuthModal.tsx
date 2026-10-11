import React, { useState } from 'react';
import { 
  X, Lock, Mail, Building2, KeyRound, 
  ArrowRight, CheckCircle2, ShieldCheck, User, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaraLogo } from './common/TaraLogo';
import { UserSession, UserType, Department } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
  initialType?: UserType;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialType = 'ENTERPRISE'
}) => {
  const [userType, setUserType] = useState<UserType>(initialType);
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>('login');
  
  // Enterprise fields
  const [workEmail, setWorkEmail] = useState('aditya.sharma@infosys.com');
  const [orgId, setOrgId] = useState('infosys-corp');
  const [department, setDepartment] = useState<Department>('Engineering');
  
  // Public user fields
  const [personalEmail, setPersonalEmail] = useState('karthik.developer@gmail.com');
  const [fullName, setFullName] = useState('Karthik Valteti');
  const [password, setPassword] = useState('••••••••••••');
  
  // OTP state
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '7']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const createEnterpriseSession = (): UserSession => ({
    id: 'usr-infy-901',
    name: 'Aditya Sharma',
    email: workEmail,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    userType: 'ENTERPRISE',
    role: 'Principal Security Architect',
    organization: {
      id: orgId || 'infosys-corp',
      name: 'Infosys Global Systems',
      domain: 'infosys.com',
      department: department,
      tier: 'Enterprise Custom',
    },
    token: 'tara_jwt_live_enterprise_' + Math.random().toString(36).substring(2),
  });

  const createPublicSession = (): UserSession => ({
    id: 'usr-pub-101',
    name: fullName || 'Community Developer',
    email: personalEmail,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    userType: 'PUBLIC',
    role: 'Community Prompt Engineer',
    token: 'tara_jwt_live_public_' + Math.random().toString(36).substring(2),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login' || mode === 'register') {
        if (userType === 'ENTERPRISE') {
          // Enterprise requires 2FA OTP verification
          setMode('otp');
        } else {
          // Public user completes login immediately
          const session = createPublicSession();
          confetti({
            particleCount: 70,
            spread: 60,
            colors: ['#4F46E5', '#10B981'],
          });
          onSuccess(session);
          onClose();
        }
      } else if (mode === 'otp') {
        // Complete Enterprise login
        const session = createEnterpriseSession();
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ['#4F46E5', '#10B981'],
        });
        onSuccess(session);
        onClose();
      } else {
        setMode('login');
      }
    }, 600);
  };

  // Instant 1-click Demo Quick Login
  const handleQuickDemoLogin = (type: UserType) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const session = type === 'ENTERPRISE' ? createEnterpriseSession() : createPublicSession();
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#6366F1', '#10B981'],
      });
      onSuccess(session);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <TaraLogo size="md" subtitle="" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {mode === 'otp' ? 'Enterprise 2FA Verification' : 'Welcome to TARA'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'otp'
              ? `Enter the 6-digit cryptographic security code sent to ${workEmail}`
              : 'Choose your workspace category to sign in to your verified account.'}
          </p>
        </div>

        {/* PROMINENT SEPARATION: Enterprise vs Public Workspace Switcher */}
        {mode !== 'otp' && (
          <div className="mb-6 p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setUserType('ENTERPRISE');
                setMode('login');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                userType === 'ENTERPRISE'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Enterprise / Organization</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUserType('PUBLIC');
                setMode('login');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                userType === 'PUBLIC'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Public / Personal User</span>
            </button>
          </div>
        )}

        {/* Quick Demo 1-Click Buttons */}
        {mode !== 'otp' && (
          <div className="mb-5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase text-indigo-700 block">Instant Evaluation</span>
              <span className="text-xs font-semibold text-slate-800">
                {userType === 'ENTERPRISE' ? 'Log in as Infosys Enterprise Lead' : 'Log in as Public Developer'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(userType)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Login</span>
            </button>
          </div>
        )}

        {/* Enterprise Specific SSO (Okta / Azure AD / SAML) */}
        {mode !== 'otp' && userType === 'ENTERPRISE' && (
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ENTERPRISE')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Sign In with Corporate SAML / Okta SSO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ENTERPRISE')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Sign In with Microsoft Azure AD</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or Organization Credentials</span>
              </div>
            </div>
          </div>
        )}

        {/* Public Specific SSO (Google / GitHub) */}
        {mode !== 'otp' && userType === 'PUBLIC' && (
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('PUBLIC')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('PUBLIC')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or Email & Password</span>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode !== 'otp' && (
            <>
              {/* Enterprise Form Fields */}
              {userType === 'ENTERPRISE' ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Corporate Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="e.g. aditya.sharma@infosys.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Organization ID</label>
                      <input
                        type="text"
                        required
                        value={orgId}
                        onChange={(e) => setOrgId(e.target.value)}
                        placeholder="infosys-corp"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value as Department)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
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
                    <label className="block text-slate-700 font-semibold mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Public User Form Fields */
                <>
                  {mode === 'register' && (
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Karthik Valteti"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Personal Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* OTP Step */}
          {mode === 'otp' && (
            <div className="space-y-4 py-2">
              <div className="flex justify-center gap-2">
                {otp.map((digit: string, idx: number) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-10 h-12 text-center text-lg font-black font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Code expires in 4:58 • Click Submit to verify session
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? 'Authenticating...'
                : mode === 'login'
                ? userType === 'ENTERPRISE'
                  ? 'Sign In to Enterprise Workspace'
                  : 'Sign In to Personal Workspace'
                : mode === 'register'
                ? 'Create Personal Account'
                : 'Verify & Enter Workspace'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer toggles */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' && userType === 'PUBLIC' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Sign Up for Free
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === 'otp' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
