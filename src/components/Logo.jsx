// BookFox Logo Component
// Fox with headset - AI receptionist branding

// Main logo using the new image
export function FoxIcon({ size = 40, className = '' }) {
  return (
    <img 
      src="/logo.png" 
      alt="BookFox" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

// Minimal fox icon (SVG fallback for favicons, small spaces)
export function FoxIconMinimal({ size = 32, className = '' }) {
  return (
    <img 
      src="/logo.png" 
      alt="BookFox" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

// Full logo with text
export function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 72, text: 'text-3xl' },
  };
  
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="BookFox" 
        width={icon} 
        height={icon}
        className="object-contain flex-shrink-0"
      />
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
      <img 
        src="/logo.png" 
        alt="BookFox" 
        width={size} 
        height={size}
        className="object-contain animate-pulse"
      />
    </div>
  );
}

// Logo for dark backgrounds
export function LogoLight({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 72, text: 'text-3xl' },
  };
  
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="BookFox" 
        width={icon} 
        height={icon}
        className="object-contain flex-shrink-0"
      />
      {showText && (
        <span className={`font-bold text-white ${text}`}>
          Book<span className="text-blue-300">Fox</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
