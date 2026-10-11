import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CinematicIntroProps {
  onReadyToCook: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onReadyToCook }) => {
  const [animationStage, setAnimationStage] = useState<'moving' | 'settled' | 'revealed'>('moving');

  useEffect(() => {
    // Stage 1: Moving from left to right (0 - 2.5s)
    const moveTimer = setTimeout(() => {
      setAnimationStage('settled');
    }, 2400);

    // Stage 2: Settle and reveal surprise "Ready to Cook" button (after 3.2s)
    const revealTimer = setTimeout(() => {
      setAnimationStage('revealed');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#6366F1', '#4F46E5', '#10B981', '#F59E0B'],
      });
    }, 3200);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const handleCookClick = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF5722', '#6366F1', '#10B981'],
    });
    onReadyToCook();
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background Subtle Tech Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Skip Button Top Right */}
      <button
        onClick={onReadyToCook}
        className="absolute top-6 right-6 text-xs font-semibold text-slate-400 hover:text-slate-800 bg-white/80 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer z-30"
      >
        Skip Intro →
      </button>

      {/* Center Cinematic Stage */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
        
        {/* Animated Moving Logo Track */}
        <div className="relative w-full h-36 flex items-center justify-center overflow-visible mb-6">
          {/* Constellation Motion Track */}
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Logo container animating from left to right then centering */}
          <div
            className={`transition-all duration-1000 ease-out flex flex-col items-center justify-center ${
              animationStage === 'moving'
                ? 'animate-[moveLeftRight_2.4s_cubic-bezier(0.25,1,0.5,1)_forwards]'
                : 'transform scale-125'
            }`}
          >
            <div className="relative p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xl hover:scale-105 transition-transform group">
              {/* Radial Glowing Aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 via-violet-500/30 to-amber-500/20 rounded-3xl blur-xl opacity-80 animate-pulse" />

              {/* Big High-Visibility TARA Official Emblem */}
              <img
                src="/tara-logo.png"
                alt="TARA Official Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 animate-spin-slow"
              />

              {/* Live Connectivity Indicator */}
              <span className="absolute top-2 right-2 flex h-3.5 w-3.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Brand Reveal Text */}
        <div
          className={`space-y-4 transition-all duration-700 ${
            animationStage !== 'moving'
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-6 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Enterprise PromptOps</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            TARA <span className="brand-text-gradient">Intelligence</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Prompts are becoming the new source code. Manage, evaluate, secure, and govern your prompts with deterministic AI precision before they ever reach an LLM.
          </p>
        </div>

        {/* SURPRISE "READY TO COOK" BUTTON */}
        <div
          className={`mt-10 transition-all duration-700 ${
            animationStage === 'revealed'
              ? 'opacity-100 transform scale-100'
              : 'opacity-0 transform scale-75 pointer-events-none'
          }`}
        >
          <button
            onClick={handleCookClick}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white font-extrabold text-base sm:text-lg shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-500/40 cursor-pointer overflow-hidden"
          >
            {/* Glowing Shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out" />

            <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="tracking-wide">Ready to Cook</span>
            <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            Click to launch the dedicated login portal
          </p>
        </div>

      </div>

      {/* Inline Keyframe Animation Styles */}
      <style>{`
        @keyframes moveLeftRight {
          0% {
            transform: translateX(-240px) scale(0.85);
            opacity: 0;
          }
          40% {
            transform: translateX(120px) scale(1.1);
            opacity: 1;
          }
          70% {
            transform: translateX(-40px) scale(1);
          }
          100% {
            transform: translateX(0px) scale(1.25);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
