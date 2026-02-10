import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs last week',
  icon: Icon,
  color = 'blue' 
}) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
          {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
          {!isPositive && !isNegative && <Minus className="w-4 h-4 text-stone-400" />}
          
          <span className={
            isPositive ? 'text-green-600 font-medium' : 
            isNegative ? 'text-red-600 font-medium' : 
            'text-stone-500'
          }>
            {isPositive && '+'}{change}%
          </span>
          <span className="text-stone-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
