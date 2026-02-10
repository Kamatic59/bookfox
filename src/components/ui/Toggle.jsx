// Glowing toggle switch component
export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-primary-500/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked 
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/50' 
          : 'bg-stone-300'
        }
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-6 w-6 transform rounded-full 
          bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out
          ${checked 
            ? 'translate-x-[22px] shadow-primary-500/30' 
            : 'translate-x-0.5'
          }
        `}
        style={{ marginTop: '2px' }}
      />
      {/* Glow effect when on */}
      {checked && (
        <span className="absolute inset-0 rounded-full bg-primary-400/20 animate-pulse" />
      )}
    </button>
  );
}
