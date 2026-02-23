import { useEffect, useState, Fragment } from 'react';

export default function Modal({
  isOpen, onClose, title, description, children, size = 'md', showClose = true, closeOnOverlay = true, footer,
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
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isAnimating && !isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={closeOnOverlay ? onClose : undefined} />
      <div className={`relative w-full ${sizes[size]} bg-[#F2F0E9] rounded-[2rem] shadow-2xl transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-[#2E4036]/10">
            <div>
              {title && <h3 className="text-xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{title}</h3>}
              {description && <p className="text-[#2E4036]/60 mt-1 font-['Outfit']">{description}</p>}
            </div>
            {showClose && (
              <button onClick={onClose} className="p-2 -m-2 ml-4 text-[#2E4036]/40 hover:text-[#2E4036] hover:bg-[#2E4036]/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2E4036]/10 bg-[#2E4036]/5 rounded-b-[2rem]">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', loading = false }) {
  const icons = {
    danger: { emoji: '⚠️', color: 'text-[#CC5833]' },
    warning: { emoji: '⚡', color: 'text-[#CC5833]' },
    info: { emoji: 'ℹ️', color: 'text-[#2E4036]' },
  };

  const buttonColors = {
    danger: 'bg-[#CC5833] hover:bg-[#CC5833]/90 shadow-[#CC5833]/20',
    warning: 'bg-[#CC5833] hover:bg-[#CC5833]/90 shadow-[#CC5833]/20',
    info: 'bg-[#2E4036] hover:bg-[#1A1A1A] shadow-[#2E4036]/20',
  };

  const icon = icons[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className={`text-5xl mb-4 ${icon.color}`}>{icon.emoji}</div>
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{title}</h3>
        {message && <p className="text-[#2E4036]/70 mb-6 font-['Outfit']">{message}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 bg-[#F2F0E9] border border-[#2E4036]/20 text-[#1A1A1A] font-medium rounded-full hover:bg-[#2E4036]/5 transition-colors disabled:opacity-50 font-['Plus_Jakarta_Sans']">{cancelText}</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 px-4 py-2.5 text-[#F2F0E9] font-medium rounded-full shadow-lg transition-all disabled:opacity-50 font-['Plus_Jakarta_Sans'] ${buttonColors[variant]}`}>{loading ? 'Loading...' : confirmText}</button>
        </div>
      </div>
    </Modal>
  );
}
