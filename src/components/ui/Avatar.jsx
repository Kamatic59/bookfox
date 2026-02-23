// Avatar component — Organic Tech

function getInitials(name, fallback = '?') {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

export default function Avatar({ src, name, size = 'md', className = '', showStatus, status = 'offline' }) {
  const initials = getInitials(name);

  const statusColors = {
    online: 'bg-[#2E4036]',
    offline: 'bg-[#2E4036]/30',
    busy: 'bg-[#CC5833]',
    away: 'bg-[#CC5833]/60',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-4 h-4 border-2',
    '2xl': 'w-5 h-5 border-2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className={`${sizes[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-[#2E4036] flex items-center justify-center text-[#F2F0E9] font-bold shadow-sm`}>
          {initials}
        </div>
      )}
      {showStatus && (
        <span className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-[#F2F0E9]`} />
      )}
    </div>
  );
}

export function AvatarGroup({ users = [], max = 4, size = 'md', className = '' }) {
  const displayed = users.slice(0, max);
  const remaining = users.length - max;

  const overlapSizes = { xs: '-ml-1.5', sm: '-ml-2', md: '-ml-2.5', lg: '-ml-3', xl: '-ml-4', '2xl': '-ml-5' };

  return (
    <div className={`flex items-center ${className}`}>
      {displayed.map((user, i) => (
        <div key={user.id || i} className={`${i > 0 ? overlapSizes[size] : ''} ring-2 ring-[#F2F0E9] rounded-full`}>
          <Avatar src={user.avatar} name={user.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${overlapSizes[size]} ${sizes[size]} rounded-full bg-[#2E4036]/10 text-[#2E4036] flex items-center justify-center font-medium ring-2 ring-[#F2F0E9] font-['IBM_Plex_Mono']`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
