// Skeleton loading components for smooth loading states

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-stone-200 rounded ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 rounded"
          style={{ width: i === lines - 1 && lines > 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return <Skeleton className={`${sizes[size]} rounded-full`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex gap-4">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-stone-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 flex items-center gap-4">
            <SkeletonAvatar />
            {[...Array(cols - 1)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonConversationList({ count = 5 }) {
  return (
    <div className="divide-y divide-stone-100">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-3">
          <SkeletonAvatar size="lg" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChat({ messages = 4 }) {
  return (
    <div className="space-y-4 p-6">
      {[...Array(messages)].map((_, i) => {
        const isOwn = i % 2 === 1;
        return (
          <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
              <Skeleton 
                className={`h-20 rounded-2xl ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}
                style={{ width: `${150 + Math.random() * 100}px` }}
              />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
