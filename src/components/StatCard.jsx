import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, change, changeLabel = 'vs last week', icon: Icon }) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="bg-[#F2F0E9]/90 rounded-[2rem] p-6 shadow-sm border border-[#2E4036]/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#2E4036]/60 text-sm font-medium font-['Plus_Jakarta_Sans']">{title}</p>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-1 font-['Plus_Jakarta_Sans']">{value}</p>
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-[#2E4036]/10 text-[#2E4036]">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3 text-sm font-['Outfit']">
          {isPositive && <TrendingUp className="w-4 h-4 text-[#2E4036]" />}
          {isNegative && <TrendingDown className="w-4 h-4 text-[#CC5833]" />}
          {!isPositive && !isNegative && <Minus className="w-4 h-4 text-[#2E4036]/40" />}
          <span className={isPositive ? 'text-[#2E4036] font-medium' : isNegative ? 'text-[#CC5833] font-medium' : 'text-[#2E4036]/60'}>
            {isPositive && '+'}{change}%
          </span>
          <span className="text-[#2E4036]/40 font-['IBM_Plex_Mono']">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
