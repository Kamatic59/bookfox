// Card component with various styles

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-stone-200 
        ${paddingSizes[padding]}
        ${hover ? 'hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Card with header
export function CardWithHeader({
  title,
  description,
  action,
  children,
  className = '',
  ...props
}) {
  return (
    <Card padding="none" className={className} {...props}>
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-800">{title}</h3>
          {description && <p className="text-stone-500 text-sm mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

// Stat card
export function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color = 'blue',
  className = '',
}) {
  const colorClasses = {
    blue: 'from-primary-500 to-primary-600 shadow-primary-500/20',
    green: 'from-green-500 to-green-600 shadow-green-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
    red: 'from-red-500 to-red-600 shadow-red-500/20',
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center text-xl text-white`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trendUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-stone-800">{value}</p>
        <p className="text-stone-500 text-sm mt-1">{label}</p>
      </div>
    </Card>
  );
}

// Feature card (for landing page)
export function FeatureCard({
  icon,
  title,
  description,
  className = '',
}) {
  return (
    <Card hover className={`group ${className}`}>
      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </Card>
  );
}

// Empty state card
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </Card>
  );
}
