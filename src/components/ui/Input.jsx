import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helpText,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const hasIcon = !!icon;
  
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            bg-white border rounded-xl
            transition-all duration-200
            placeholder:text-stone-400
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-stone-300'}
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-2 text-xs text-stone-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Textarea variant
export const Textarea = forwardRef(({
  label,
  error,
  helpText,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-white border rounded-xl
          transition-all duration-200
          placeholder:text-stone-400
          resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-stone-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-2 text-xs text-stone-500">{helpText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select variant
export const Select = forwardRef(({
  label,
  error,
  helpText,
  options = [],
  placeholder,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-white border rounded-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-stone-300'}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-2 text-xs text-stone-500">{helpText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Search input with icon
export function SearchInput({ className = '', ...props }) {
  return (
    <Input
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      placeholder="Search..."
      className={`bg-stone-100 border-transparent focus:bg-white focus:border-primary-300 ${className}`}
      {...props}
    />
  );
}
