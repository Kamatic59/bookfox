import { formatDistanceToNow } from 'date-fns';
import { Phone, Clock, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-[#2E4036]/10 text-[#2E4036]', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-[#CC5833]/10 text-[#CC5833]', icon: MessageSquare },
  qualified: { label: 'Qualified', color: 'bg-[#2E4036]/15 text-[#2E4036]', icon: CheckCircle },
  appointment_set: { label: 'Appointment Set', color: 'bg-[#2E4036]/10 text-[#2E4036]', icon: Clock },
  converted: { label: 'Converted', color: 'bg-[#2E4036]/10 text-[#2E4036]', icon: CheckCircle },
  lost: { label: 'Lost', color: 'bg-[#1A1A1A]/10 text-[#1A1A1A]/50', icon: null },
};

const URGENCY_CONFIG = {
  low: { label: 'Low', color: 'text-[#2E4036]/60' },
  medium: { label: 'Medium', color: 'text-[#CC5833]' },
  high: { label: 'High', color: 'text-[#CC5833]' },
  emergency: { label: 'Emergency', color: 'text-[#CC5833] font-semibold' },
};

export default function LeadCard({ lead, onClick }) {
  const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
  const urgency = URGENCY_CONFIG[lead.urgency];
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onClick}
      className="bg-[#F2F0E9]/90 rounded-[2rem] p-4 shadow-sm border border-[#2E4036]/10 hover:border-[#2E4036]/20 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">{lead.name || 'Unknown'}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-['IBM_Plex_Mono'] ${status.color}`}>{status.label}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-[#2E4036]/60 font-['Outfit']">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{lead.phone}</span>
            {urgency && (<span className={`flex items-center gap-1 ${urgency.color}`}>{urgency.label} urgency</span>)}
          </div>
          {lead.service_needed && (<p className="mt-2 text-sm text-[#2E4036]/70 line-clamp-1 font-['Outfit']">{lead.service_needed}</p>)}
        </div>
        {StatusIcon && (<StatusIcon className={`w-5 h-5 ${status.color.split(' ')[1]} flex-shrink-0`} />)}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2E4036]/5 text-xs text-[#2E4036]/40 font-['IBM_Plex_Mono']">
        <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
        <span className="capitalize">{lead.source?.replace('_', ' ')}</span>
      </div>
    </div>
  );
}
