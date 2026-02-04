import { Link } from 'react-router-dom';

// Reusable empty state wrapper
function EmptyStateWrapper({ children, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {children}
    </div>
  );
}

// No leads empty state
export function NoLeadsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        {/* Decorative circles */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50" />
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-amber-100 rounded-full opacity-50" />
        
        {/* Main icon */}
        <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
          <span className="text-6xl">👥</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-stone-800 mb-2">No leads yet</h3>
      <p className="text-stone-500 max-w-md mb-6">
        When customers call your BookFox number and miss you, they'll automatically appear here as leads.
      </p>
      
      <div className="flex gap-3">
        <Link
          to="/dashboard/settings"
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          Complete Setup
        </Link>
        <button className="px-5 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors">
          Learn More
        </button>
      </div>
    </EmptyStateWrapper>
  );
}

// No conversations empty state
export function NoConversationsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-emerald-100 rounded-full opacity-50" />
        <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-purple-100 rounded-full opacity-50" />
        
        <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <span className="text-6xl">💬</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-stone-800 mb-2">No conversations yet</h3>
      <p className="text-stone-500 max-w-md mb-6">
        When customers text your BookFox number, their conversations will appear here. You can view AI responses and take over anytime.
      </p>
    </EmptyStateWrapper>
  );
}

// No appointments empty state
export function NoAppointmentsEmptyState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute -top-2 -left-4 w-18 h-18 bg-amber-100 rounded-full opacity-50" />
        
        <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-500/30">
          <span className="text-5xl">📅</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-stone-800 mb-2">No appointments</h3>
      <p className="text-stone-500 max-w-sm">
        No appointments scheduled for this day. BookFox will help customers book directly into your calendar.
      </p>
    </EmptyStateWrapper>
  );
}

// Search no results
export function NoSearchResults({ query }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">🔍</span>
      </div>
      
      <h3 className="text-lg font-bold text-stone-800 mb-1">No results found</h3>
      <p className="text-stone-500">
        We couldn't find anything matching "{query}". Try a different search term.
      </p>
    </EmptyStateWrapper>
  );
}

// Error state
export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">😵</span>
      </div>
      
      <h3 className="text-lg font-bold text-stone-800 mb-1">{title}</h3>
      <p className="text-stone-500 mb-4">{message || 'An unexpected error occurred. Please try again.'}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </EmptyStateWrapper>
  );
}

// Offline state
export function OfflineState() {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">📡</span>
      </div>
      
      <h3 className="text-lg font-bold text-stone-800 mb-1">You're offline</h3>
      <p className="text-stone-500">
        Check your internet connection and try again.
      </p>
    </EmptyStateWrapper>
  );
}

// Feature coming soon
export function ComingSoonState({ feature = 'This feature' }) {
  return (
    <EmptyStateWrapper>
      <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-4xl">🚀</span>
      </div>
      
      <h3 className="text-lg font-bold text-stone-800 mb-1">Coming Soon!</h3>
      <p className="text-stone-500">
        {feature} is coming soon. We're working hard to bring this to you!
      </p>
    </EmptyStateWrapper>
  );
}

// Inbox zero state (all caught up)
export function InboxZeroState() {
  return (
    <EmptyStateWrapper>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <span className="text-5xl">✨</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-stone-800 mb-2">You're all caught up!</h3>
      <p className="text-stone-500">
        No new conversations to review. Great job staying on top of your leads!
      </p>
    </EmptyStateWrapper>
  );
}
