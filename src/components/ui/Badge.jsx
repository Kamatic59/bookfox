const variants = {
  default: 'bg-[#2E4036]/5 text-[#1A1A1A]/60 border-[#2E4036]/10',
  primary: 'bg-[#2E4036]/10 text-[#2E4036] border-[#2E4036]/15',
  success: 'bg-[#2E4036]/10 text-[#2E4036] border-[#2E4036]/15',
  warning: 'bg-[#CC5833]/10 text-[#CC5833] border-[#CC5833]/15',
  danger: 'bg-[#CC5833]/10 text-[#CC5833] border-[#CC5833]/15',
  purple: 'bg-[#2E4036]/15 text-[#2E4036] border-[#2E4036]/20',

  'solid-primary': 'bg-[#2E4036] text-[#F2F0E9] border-transparent',
  'solid-success': 'bg-[#2E4036] text-[#F2F0E9] border-transparent',
  'solid-warning': 'bg-[#CC5833] text-[#F2F0E9] border-transparent',
  'solid-danger': 'bg-[#CC5833] text-[#F2F0E9] border-transparent',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'md', icon, dot = false, className = '', ...props }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border font-['IBM_Plex_Mono']
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant.includes('danger') || variant.includes('warning') ? 'bg-[#CC5833]' :
            variant.includes('success') || variant.includes('primary') ? 'bg-[#2E4036]' :
              'bg-[#2E4036]/40'
          }`} />
      )}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const statusConfig = {
    new: { variant: 'primary', label: 'New', dot: true },
    contacted: { variant: 'warning', label: 'Contacted' },
    qualified: { variant: 'success', label: 'Qualified' },
    converted: { variant: 'purple', label: 'Converted' },
    lost: { variant: 'default', label: 'Lost' },
    active: { variant: 'success', label: 'Active', dot: true },
    closed: { variant: 'default', label: 'Closed' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };
  return <Badge variant={config.variant} dot={config.dot}>{config.label}</Badge>;
}

export function SourceBadge({ source }) {
  const sourceConfig = {
    missed_call: { icon: '📞', label: 'Missed Call', variant: 'danger' },
    sms: { icon: '💬', label: 'SMS', variant: 'primary' },
    manual: { icon: '✏️', label: 'Manual', variant: 'default' },
    website: { icon: '🌐', label: 'Website', variant: 'primary' },
    referral: { icon: '👥', label: 'Referral', variant: 'success' },
  };

  const config = sourceConfig[source] || { icon: '📋', label: source || 'Unknown', variant: 'default' };
  return <Badge variant={config.variant} icon={config.icon} size="sm">{config.label}</Badge>;
}

export function UrgencyBadge({ urgency }) {
  const urgencyConfig = {
    emergency: { variant: 'solid-danger', label: '🚨 Emergency' },
    urgent: { variant: 'warning', label: 'Urgent' },
    normal: { variant: 'default', label: 'Normal' },
    low: { variant: 'default', label: 'Low' },
  };

  const config = urgencyConfig[urgency] || { variant: 'default', label: urgency };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ModeBadge({ mode }) {
  return mode === 'ai' ? (
    <Badge variant="primary" icon="🤖" size="sm">AI</Badge>
  ) : (
    <Badge variant="success" icon="👤" size="sm">Human</Badge>
  );
}
