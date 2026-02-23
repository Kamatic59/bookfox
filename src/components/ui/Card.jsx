// Card component — Organic Tech

export default function Card({ children, className = '', padding = 'md', hover = false, onClick, ...props }) {
  const paddingSizes = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <div
      onClick={onClick}
      className={`
        bg-[#F2F0E9]/90 rounded-[2rem] border border-[#2E4036]/10 
        ${paddingSizes[padding]}
        ${hover ? 'hover:shadow-lg hover:border-[#2E4036]/20 transition-all cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardWithHeader({ title, description, action, children, className = '', ...props }) {
  return (
    <Card padding="none" className={className} {...props}>
      <div className="px-6 py-4 border-b border-[#2E4036]/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{title}</h3>
          {description && <p className="text-[#2E4036]/60 text-sm mt-0.5 font-['Outfit']">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

export function StatCard({ icon, label, value, trend, trendUp, className = '' }) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-[#2E4036] shadow-md shadow-[#2E4036]/20 flex items-center justify-center text-xl">{icon}</div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full font-['IBM_Plex_Mono'] ${trendUp ? 'text-[#2E4036] bg-[#2E4036]/10' : 'text-[#CC5833] bg-[#CC5833]/10'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{value}</p>
        <p className="text-[#2E4036]/60 text-sm mt-1 font-['Outfit']">{label}</p>
      </div>
    </Card>
  );
}

export function FeatureCard({ icon, title, description, className = '' }) {
  return (
    <Card hover className={`group ${className}`}>
      <div className="w-14 h-14 bg-[#2E4036] rounded-xl flex items-center justify-center text-2xl mb-5 shadow-md shadow-[#2E4036]/20 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 font-['Plus_Jakarta_Sans']">{title}</h3>
      <p className="text-[#2E4036]/70 leading-relaxed font-['Outfit']">{description}</p>
    </Card>
  );
}

export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{title}</h3>
      <p className="text-[#2E4036]/60 max-w-md mx-auto mb-6 font-['Outfit']">{description}</p>
      {action}
    </Card>
  );
}
