import React from 'react';

interface TaraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  animated?: boolean;
}

export const TaraLogo: React.FC<TaraLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = 'PromptOps Platform',
  className = '',
  animated = false,
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6', img: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', img: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', img: 'w-10 h-10', text: 'text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-13 h-13', img: 'w-13 h-13', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-18 h-18', img: 'w-18 h-18', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Logo container with micro-interaction */}
      <div className={`relative flex items-center justify-center rounded-xl bg-white p-1 border border-slate-200/90 shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:border-indigo-300 group-hover:scale-105 ${currentSize.box}`}>
        {/* Subtle radial glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* The user's uploaded official emblem */}
        <img
          src="/tara-logo.png"
          alt="TARA Official Logo"
          className={`object-contain transition-transform duration-700 ease-out group-hover:rotate-45 ${currentSize.img} ${animated ? 'animate-spin-slow' : ''}`}
        />
        
        {/* Active status pip for AI connectivity */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors ${currentSize.text}`}>
              TARA
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Ops
            </span>
          </div>
          {subtitle && (
            <span className={`font-medium text-slate-500 tracking-tight leading-none ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
