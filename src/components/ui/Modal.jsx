import { useEffect, useState, Fragment } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  footer,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isAnimating && !isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-white rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-stone-100">
            <div>
              {title && <h3 className="text-xl font-bold text-stone-800">{title}</h3>}
              {description && <p className="text-stone-500 mt-1">{description}</p>}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 -m-2 ml-4 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-stone-100 bg-stone-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation modal
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, warning, info
  loading = false,
}) {
  const icons = {
    danger: { emoji: '⚠️', color: 'text-red-600' },
    warning: { emoji: '⚡', color: 'text-amber-600' },
    info: { emoji: 'ℹ️', color: 'text-primary-600' },
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
    info: 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/20',
  };

  const icon = icons[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
    >
      <div className="text-center">
        <div className={`text-5xl mb-4 ${icon.color}`}>{icon.emoji}</div>
        <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
        {message && <p className="text-stone-600 mb-6">{message}</p>}
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50 ${buttonColors[variant]}`}
          >
            {loading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
