const variants = {
  // Status badges
  default: 'bg-stone-100 text-stone-700 border-stone-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  
  // Solid variants
  'solid-primary': 'bg-primary-600 text-white border-transparent',
  'solid-success': 'bg-green-600 text-white border-transparent',
  'solid-warning': 'bg-amber-500 text-white border-transparent',
  'solid-danger': 'bg-red-600 text-white border-transparent',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant.includes('success') ? 'bg-green-500' :
          variant.includes('warning') ? 'bg-amber-500' :
          variant.includes('danger') ? 'bg-red-500' :
          variant.includes('primary') ? 'bg-primary-500' :
          'bg-stone-500'
        }`} />
      )}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

// Predefined status badges for leads
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

  return (
    <Badge variant={config.variant} dot={config.dot}>
      {config.label}
    </Badge>
  );
}

// Source badge
export function SourceBadge({ source }) {
  const sourceConfig = {
    missed_call: { icon: '📞', label: 'Missed Call', variant: 'danger' },
    sms: { icon: '💬', label: 'SMS', variant: 'primary' },
    manual: { icon: '✏️', label: 'Manual', variant: 'default' },
    website: { icon: '🌐', label: 'Website', variant: 'purple' },
    referral: { icon: '👥', label: 'Referral', variant: 'success' },
  };

  const config = sourceConfig[source] || { icon: '📋', label: source || 'Unknown', variant: 'default' };

  return (
    <Badge variant={config.variant} icon={config.icon} size="sm">
      {config.label}
    </Badge>
  );
}

// Urgency badge
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

// AI/Human mode badge
export function ModeBadge({ mode }) {
  return mode === 'ai' ? (
    <Badge variant="primary" icon="🤖" size="sm">AI</Badge>
  ) : (
    <Badge variant="success" icon="👤" size="sm">Human</Badge>
  );
}
