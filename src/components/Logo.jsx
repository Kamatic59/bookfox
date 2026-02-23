// BookFox Logo Component — Organic Tech

export function FoxIcon({ size = 40, className = '' }) {
  return (
    <img src="/logo.png" alt="BookFox" width={size} height={size} className={`object-contain ${className}`} />
  );
}

export function FoxIconMinimal({ size = 32, className = '' }) {
  return (
    <img src="/logo.png" alt="BookFox" width={size} height={size} className={`object-contain ${className}`} />
  );
}

export function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = { sm: { icon: 32, text: 'text-lg' }, md: { icon: 40, text: 'text-xl' }, lg: { icon: 56, text: 'text-2xl' }, xl: { icon: 72, text: 'text-3xl' } };
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="BookFox" width={icon} height={icon} className="object-contain flex-shrink-0" />
      {showText && (
        <span className={`font-bold text-[#1A1A1A] ${text} font-['Plus_Jakarta_Sans']`}>
          Book<span className="text-[#CC5833]">Fox</span>
        </span>
      )}
    </div>
  );
}

export function LogoAnimated({ size = 48 }) {
  return (
    <div className="relative">
      <img src="/logo.png" alt="BookFox" width={size} height={size} className="object-contain animate-pulse" />
    </div>
  );
}

export function LogoLight({ size = 'md', showText = true, className = '' }) {
  const sizes = { sm: { icon: 32, text: 'text-lg' }, md: { icon: 40, text: 'text-xl' }, lg: { icon: 56, text: 'text-2xl' }, xl: { icon: 72, text: 'text-3xl' } };
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="BookFox" width={icon} height={icon} className="object-contain flex-shrink-0" />
      {showText && (
        <span className={`font-bold text-[#F2F0E9] ${text} font-['Plus_Jakarta_Sans']`}>
          Book<span className="text-[#CC5833]">Fox</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
