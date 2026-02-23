import { forwardRef } from 'react';

const variants = {
  primary: 'bg-[#2E4036] text-[#F2F0E9] hover:bg-[#1A1A1A] shadow-lg shadow-[#2E4036]/20 hover:shadow-xl hover:shadow-[#2E4036]/30',
  secondary: 'bg-[#F2F0E9] text-[#1A1A1A] border border-[#2E4036]/20 hover:bg-[#2E4036]/5 hover:border-[#2E4036]/30',
  ghost: 'text-[#2E4036]/60 hover:bg-[#2E4036]/5 hover:text-[#1A1A1A]',
  danger: 'bg-[#CC5833] text-[#F2F0E9] hover:bg-[#CC5833]/90 shadow-lg shadow-[#CC5833]/20',
  success: 'bg-[#2E4036] text-[#F2F0E9] hover:bg-[#1A1A1A] shadow-lg shadow-[#2E4036]/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-lg',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, icon, iconPosition = 'left', fullWidth = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-full font-['Plus_Jakarta_Sans']
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="text-lg">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="text-lg">{icon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;

export function IconButton({ children, variant = 'ghost', size = 'md', className = '', ...props }) {
  const iconSizes = { sm: 'p-1.5', md: 'p-2', lg: 'p-3' };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variant === 'ghost' ? 'hover:bg-[#2E4036]/5 text-[#2E4036]/60 hover:text-[#1A1A1A]' : variants[variant]}
        ${iconSizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
