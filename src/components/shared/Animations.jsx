import { useState, useEffect } from 'react';

/**
 * FadeIn animation wrapper - transitions with a soft cubic-bezier
 */
export function FadeIn({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-12'
        } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * OrganicCard - Soft, earthy card with heavily rounded corners
 */
export function OrganicCard({ children, className = '', glow = false }) {
  return (
    <div className={`
      relative bg-[#F2F0E9]/90 backdrop-blur-xl rounded-[2rem] border border-[#2E4036]/10
      shadow-[0_16px_40px_-12px_rgba(46,64,54,0.15)] 
      ${glow ? 'shadow-[0_0_40px_rgba(204,88,51,0.15)] ring-1 ring-[#CC5833]/20' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * MagneticButton - Pill-shaped button with a sliding hover effect
 */
export function MagneticButton({ children, onClick, className = '', full = true, disabled = false, loading = false, secondary = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden group rounded-full px-8 py-4 font-semibold text-lg
        transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${full ? 'w-full' : ''}
        ${secondary
          ? 'bg-[#F2F0E9] text-[#2E4036] border-2 border-[#2E4036] hover:bg-[#2E4036] hover:text-[#F2F0E9]'
          : 'bg-[#2E4036] text-[#F2F0E9] shadow-[0_8px_24px_rgba(46,64,54,0.3)] hover:shadow-[0_16px_32px_rgba(46,64,54,0.4)] hover:-translate-y-1'
        }
        ${className}
      `}
    >
      {/* Sliding background accent layer (only on primary) */}
      {!secondary && !disabled && (
        <span className="absolute inset-0 bg-[#CC5833] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] rounded-full -z-10" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
}

/**
 * Progress bar - Earthy tracking
 */
export function Progress({ step, total }) {
  return (
    <div className="flex items-center gap-4 mb-10 w-full px-1">
      <div className="flex-1 h-2 bg-[#2E4036]/10 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 left-0 bottom-0 bg-[#CC5833] transition-all duration-700 ease-out rounded-full"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <span className="text-sm font-['IBM_Plex_Mono'] font-medium text-[#2E4036] tracking-tight">
        {step}/{total}
      </span>
    </div>
  );
}

// Backwards-compatible alias
export const GlassCard = OrganicCard;
