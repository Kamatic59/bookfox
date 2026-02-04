// BookFox Logo Component
// Modern, clean fox icon with optional text

export function FoxIcon({ size = 40, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#foxGradient)" />
      
      {/* Fox face */}
      <g transform="translate(15, 20)">
        {/* Left ear */}
        <path 
          d="M10 35 L0 5 L25 25 Z" 
          fill="#FFF" 
          opacity="0.95"
        />
        {/* Right ear */}
        <path 
          d="M60 35 L70 5 L45 25 Z" 
          fill="#FFF" 
          opacity="0.95"
        />
        
        {/* Face */}
        <ellipse cx="35" cy="40" rx="30" ry="25" fill="#FFF" opacity="0.95" />
        
        {/* Snout */}
        <ellipse cx="35" cy="50" rx="12" ry="10" fill="#FFF" />
        
        {/* Left eye */}
        <circle cx="22" cy="38" r="5" fill="#1e3a5f" />
        <circle cx="23" cy="37" r="1.5" fill="#FFF" />
        
        {/* Right eye */}
        <circle cx="48" cy="38" r="5" fill="#1e3a5f" />
        <circle cx="49" cy="37" r="1.5" fill="#FFF" />
        
        {/* Nose */}
        <ellipse cx="35" cy="48" rx="4" ry="3" fill="#1e3a5f" />
        
        {/* Mouth */}
        <path 
          d="M35 51 L35 55 M32 54 Q35 58 38 54" 
          stroke="#1e3a5f" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          fill="none"
        />
      </g>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="foxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Minimal fox icon (for favicons, small spaces)
export function FoxIconMinimal({ size = 32, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="url(#foxGradientMini)" />
      <g transform="translate(4, 5)">
        {/* Ears */}
        <path d="M4 12 L1 2 L9 9 Z" fill="#FFF" opacity="0.95" />
        <path d="M20 12 L23 2 L15 9 Z" fill="#FFF" opacity="0.95" />
        {/* Face */}
        <ellipse cx="12" cy="14" rx="9" ry="8" fill="#FFF" opacity="0.95" />
        {/* Eyes */}
        <circle cx="9" cy="13" r="1.5" fill="#1e3a5f" />
        <circle cx="15" cy="13" r="1.5" fill="#1e3a5f" />
        {/* Nose */}
        <ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#1e3a5f" />
      </g>
      <defs>
        <linearGradient id="foxGradientMini" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Full logo with text
export function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  };
  
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FoxIconMinimal size={icon} className="flex-shrink-0" />
      {showText && (
        <span className={`font-bold text-stone-800 ${text}`}>
          Book<span className="text-blue-600">Fox</span>
        </span>
      )}
    </div>
  );
}

// Animated logo for loading states
export function LogoAnimated({ size = 48 }) {
  return (
    <div className="relative">
      <FoxIconMinimal size={size} className="animate-pulse" />
      <div className="absolute inset-0 animate-ping opacity-20">
        <FoxIconMinimal size={size} />
      </div>
    </div>
  );
}

// Logo for dark backgrounds
export function LogoLight({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  };
  
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FoxIconMinimal size={icon} className="flex-shrink-0" />
      {showText && (
        <span className={`font-bold text-white ${text}`}>
          Book<span className="text-blue-300">Fox</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
