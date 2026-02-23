import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helpText, icon, iconPosition = 'left', className = '', containerClassName = '', ...props }, ref) => {
  const hasIcon = !!icon;
  return (
    <div className={containerClassName}>
      {label && (<label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{label}</label>)}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E4036]/40">{icon}</div>)}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200
            placeholder:text-[#2E4036]/40 font-['Outfit']
            focus:outline-none focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40
            disabled:bg-[#F2F0E9] disabled:text-[#2E4036]/50 disabled:cursor-not-allowed
            ${error ? 'border-[#CC5833]/40 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/40' : 'border-[#2E4036]/20'}
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (<div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2E4036]/40">{icon}</div>)}
      </div>
      {error && (<p className="mt-2 text-sm text-[#CC5833] flex items-center gap-1 font-['Outfit']"><span>⚠️</span> {error}</p>)}
      {helpText && !error && (<p className="mt-2 text-xs text-[#2E4036]/50 font-['IBM_Plex_Mono']">{helpText}</p>)}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export const Textarea = forwardRef(({ label, error, helpText, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={containerClassName}>
      {label && (<label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{label}</label>)}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200
          placeholder:text-[#2E4036]/40 resize-none font-['Outfit']
          focus:outline-none focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40
          disabled:bg-[#F2F0E9] disabled:text-[#2E4036]/50 disabled:cursor-not-allowed
          ${error ? 'border-[#CC5833]/40 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/40' : 'border-[#2E4036]/20'}
          ${className}
        `}
        {...props}
      />
      {error && (<p className="mt-2 text-sm text-[#CC5833] flex items-center gap-1 font-['Outfit']"><span>⚠️</span> {error}</p>)}
      {helpText && !error && (<p className="mt-2 text-xs text-[#2E4036]/50 font-['IBM_Plex_Mono']">{helpText}</p>)}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, helpText, options = [], placeholder, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={containerClassName}>
      {label && (<label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{label}</label>)}
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 font-['Outfit']
          focus:outline-none focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40
          disabled:bg-[#F2F0E9] disabled:text-[#2E4036]/50 disabled:cursor-not-allowed
          ${error ? 'border-[#CC5833]/40 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/40' : 'border-[#2E4036]/20'}
          ${className}
        `}
        {...props}
      >
        {placeholder && (<option value="" disabled>{placeholder}</option>)}
        {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
      {error && (<p className="mt-2 text-sm text-[#CC5833] flex items-center gap-1 font-['Outfit']"><span>⚠️</span> {error}</p>)}
      {helpText && !error && (<p className="mt-2 text-xs text-[#2E4036]/50 font-['IBM_Plex_Mono']">{helpText}</p>)}
    </div>
  );
});

Select.displayName = 'Select';

export function SearchInput({ className = '', ...props }) {
  return (
    <Input
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      placeholder="Search..."
      className={`bg-[#2E4036]/5 border-transparent focus:bg-white focus:border-[#2E4036]/30 ${className}`}
      {...props}
    />
  );
}
