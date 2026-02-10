import { formatDistanceToNow } from 'date-fns';
import { Phone, Clock, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-primary-100 text-primary-700', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700', icon: MessageSquare },
  qualified: { label: 'Qualified', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  appointment_set: { label: 'Appointment Set', color: 'bg-green-100 text-green-700', icon: Clock },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  lost: { label: 'Lost', color: 'bg-stone-100 text-stone-500', icon: null },
};

const URGENCY_CONFIG = {
  low: { label: 'Low', color: 'text-stone-500' },
  medium: { label: 'Medium', color: 'text-amber-600' },
  high: { label: 'High', color: 'text-orange-600' },
  emergency: { label: 'Emergency', color: 'text-red-600 font-semibold' },
};

export default function LeadCard({ lead, onClick }) {
  const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
  const urgency = URGENCY_CONFIG[lead.urgency];
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:border-primary-200 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-800 truncate">
              {lead.name || 'Unknown'}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {lead.phone}
            </span>
            {urgency && (
              <span className={`flex items-center gap-1 ${urgency.color}`}>
                {urgency.label} urgency
              </span>
            )}
          </div>
          
          {lead.service_needed && (
            <p className="mt-2 text-sm text-stone-600 line-clamp-1">
              {lead.service_needed}
            </p>
          )}
        </div>
        
        {StatusIcon && (
          <StatusIcon className={`w-5 h-5 ${status.color.split(' ')[1]} flex-shrink-0`} />
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-50 text-xs text-stone-400">
        <span>
          {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
        </span>
        <span className="capitalize">{lead.source?.replace('_', ' ')}</span>
      </div>
    </div>
  );
}
