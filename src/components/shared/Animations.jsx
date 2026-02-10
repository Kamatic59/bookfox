import { useState, useEffect } from 'react';

/**
 * FadeIn animation wrapper - fades in on mount with optional delay
 */
export function FadeIn({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Glass card component with optional glow effect
 */
export function GlassCard({ children, className = '', glow = false }) {
  return (
    <div className={`
      relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 
      shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
      ${glow ? 'shadow-[0_0_40px_rgba(249,115,22,0.15)]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * Glowing CTA button
 */
export function CTAButton({ children, onClick, className = '', full = true, disabled = false, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative block overflow-hidden
        bg-gradient-to-r from-primary-500 to-primary-600 
        hover:from-primary-400 hover:to-primary-500
        disabled:from-stone-400 disabled:to-stone-500
        text-white font-bold text-lg px-8 py-4 rounded-2xl text-center 
        transition-all duration-300 active:scale-[0.98]
        shadow-[0_8px_32px_rgba(249,115,22,0.4)]
        hover:shadow-[0_12px_48px_rgba(249,115,22,0.5)]
        hover:-translate-y-0.5
        disabled:shadow-none disabled:cursor-not-allowed
        ${full ? 'w-full' : ''} 
        ${className}
      `}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      <span className="relative flex items-center justify-center gap-2">
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
 * Progress bar
 */
export function Progress({ step, total }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-3 bg-stone-200/60 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 shadow-lg shadow-primary-500/30" 
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <span className="text-sm text-stone-600 font-semibold whitespace-nowrap">
        {step} of {total}
      </span>
    </div>
  );
}
