import { Link } from 'react-router-dom';

function EmptyStateWrapper({ children, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {children}
    </div>
  );
}

export function NoLeadsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2E4036]/10 rounded-full opacity-50" />
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#CC5833]/10 rounded-full opacity-50" />
        <div className="relative z-10 w-32 h-32 bg-[#2E4036] rounded-3xl flex items-center justify-center shadow-xl shadow-[#2E4036]/30">
          <span className="text-6xl">👥</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">No leads yet</h3>
      <p className="text-[#2E4036]/60 max-w-md mb-6 font-['Outfit']">
        When customers call your BookFox number and miss you, they'll automatically appear here as leads.
      </p>
      <div className="flex gap-3">
        <Link to="/dashboard/settings" className="px-5 py-2.5 bg-[#2E4036] text-[#F2F0E9] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors shadow-lg shadow-[#2E4036]/20 font-['Plus_Jakarta_Sans']">
          Complete Setup
        </Link>
        <button className="px-5 py-2.5 text-[#2E4036]/60 font-medium hover:bg-[#2E4036]/5 rounded-full transition-colors font-['Plus_Jakarta_Sans']">
          Learn More
        </button>
      </div>
    </EmptyStateWrapper>
  );
}

export function NoConversationsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#2E4036]/10 rounded-full opacity-50" />
        <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-[#CC5833]/10 rounded-full opacity-50" />
        <div className="relative z-10 w-32 h-32 bg-[#2E4036] rounded-3xl flex items-center justify-center shadow-xl shadow-[#2E4036]/30">
          <span className="text-6xl">💬</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">No conversations yet</h3>
      <p className="text-[#2E4036]/60 max-w-md mb-6 font-['Outfit']">
        When customers text your BookFox number, their conversations will appear here. You can view AI responses and take over anytime.
      </p>
    </EmptyStateWrapper>
  );
}

export function NoAppointmentsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute -top-2 -left-4 w-18 h-18 bg-[#CC5833]/10 rounded-full opacity-50" />
        <div className="relative z-10 w-28 h-28 bg-[#CC5833] rounded-3xl flex items-center justify-center shadow-xl shadow-[#CC5833]/30">
          <span className="text-5xl">📅</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">No appointments</h3>
      <p className="text-[#2E4036]/60 max-w-sm font-['Outfit']">
        No appointments scheduled for this day. BookFox will help customers book directly into your calendar.
      </p>
    </EmptyStateWrapper>
  );
}

export function NoSearchResults({ query }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">🔍</span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 font-['Plus_Jakarta_Sans']">No results found</h3>
      <p className="text-[#2E4036]/60 font-['Outfit']">
        We couldn't find anything matching "{query}". Try a different search term.
      </p>
    </EmptyStateWrapper>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-[#CC5833]/10 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">😵</span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 font-['Plus_Jakarta_Sans']">{title}</h3>
      <p className="text-[#2E4036]/60 mb-4 font-['Outfit']">{message || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-[#2E4036] text-[#F2F0E9] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors font-['Plus_Jakarta_Sans']">
          Try Again
        </button>
      )}
    </EmptyStateWrapper>
  );
}

export function OfflineState() {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">📡</span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 font-['Plus_Jakarta_Sans']">You're offline</h3>
      <p className="text-[#2E4036]/60 font-['Outfit']">Check your internet connection and try again.</p>
    </EmptyStateWrapper>
  );
}

export function ComingSoonState({ feature = 'This feature' }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">🚀</span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 font-['Plus_Jakarta_Sans']">Coming Soon!</h3>
      <p className="text-[#2E4036]/60 font-['Outfit']">{feature} is coming soon. We're working hard to bring this to you!</p>
    </EmptyStateWrapper>
  );
}

export function InboxZeroState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#2E4036]/10 rounded-full animate-ping opacity-20" />
        <div className="relative w-24 h-24 bg-[#2E4036] rounded-full flex items-center justify-center shadow-lg shadow-[#2E4036]/30">
          <span className="text-5xl">✨</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">You're all caught up!</h3>
      <p className="text-[#2E4036]/60 font-['Outfit']">No new conversations to review. Great job staying on top of your leads!</p>
    </EmptyStateWrapper>
  );
}
