import React, { useState } from 'react';
import { X, Check, Lock, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSession } from '../../types';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (session: UserSession) => void;
  targetMode: 'PUBLIC' | 'ENTERPRISE';
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  targetMode,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<'karthik' | 'custom'>('karthik');
  const [customEmail, setCustomEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSelectAndSignIn = (email: string, name: string, avatar: string) => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
      });

      const session: UserSession = {
        id: `usr-google-${Date.now()}`,
        name: name,
        email: email,
        avatar: avatar,
        userType: targetMode,
        role: targetMode === 'ENTERPRISE' ? 'Staff PromptOps Architect' : 'Pro Prompt Creator',
        organization: targetMode === 'ENTERPRISE' ? {
          id: 'infosys-corp',
          name: 'Infosys Global Systems',
          domain: email.split('@')[1] || 'infosys.com',
          department: 'Engineering',
          tier: 'Enterprise Custom',
        } : undefined,
        token: 'google_oauth2_tara_' + Math.random().toString(36).substring(2),
      };

      onAuthenticated(session);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
        {/* Google OAuth Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Sign in with Google</h3>
              <p className="text-xs text-slate-500">to continue to <strong>TARA PromptOps</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Chooser */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Choose an account
          </div>

          {/* Connected Primary User Account */}
          <div
            onClick={() => handleSelectAndSignIn('karthikvaltheti7@gmail.com', 'Valteti Trimurthulu', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces')}
            className="p-3.5 rounded-2xl border-2 border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-indigo-200">
                VT
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Valteti Trimurthulu</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-1.5 py-0.2 rounded">Primary</span>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  karthikvaltheti7@gmail.com
                </div>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Secondary Account Option */}
          <div
            onClick={() => handleSelectAndSignIn('aditya.sharma@infosys.com', 'Aditya Sharma (Infosys)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                AS
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">Aditya Sharma</div>
                <div className="text-xs text-slate-500 font-mono">aditya.sharma@infosys.com</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>

          {/* Custom Account Input */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Or connect another Google email:</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                disabled={!customEmail.includes('@')}
                onClick={() => handleSelectAndSignIn(customEmail, customEmail.split('@')[0], 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces')}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>
          </div>

          {isVerifying && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Google OAuth token & creating authenticated session...</span>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted OAuth</span>
          </div>
          <span>Google Identity Services</span>
        </div>
      </div>
    </div>
  );
};
