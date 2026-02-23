import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { FadeIn, OrganicCard } from '../components/shared/Animations';

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    new: 'bg-[#2E4036]/10 text-[#2E4036]',
    contacted: 'bg-[#CC5833]/10 text-[#CC5833]',
    qualified: 'bg-[#2E4036]/15 text-[#2E4036]',
    converted: 'bg-[#2E4036]/20 text-[#2E4036]',
    lost: 'bg-[#1A1A1A]/10 text-[#1A1A1A]/60',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium font-['IBM_Plex_Mono'] ${styles[status] || styles.new}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

// Source badge
function SourceBadge({ source }) {
  const styles = {
    missed_call: { bg: 'bg-[#CC5833]/10 text-[#CC5833]', icon: '📞' },
    sms: { bg: 'bg-[#2E4036]/10 text-[#2E4036]', icon: '💬' },
    manual: { bg: 'bg-[#1A1A1A]/10 text-[#1A1A1A]/70', icon: '✏️' },
    website: { bg: 'bg-[#2E4036]/10 text-[#2E4036]', icon: '🌐' },
  };

  const style = styles[source] || styles.manual;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-['IBM_Plex_Mono'] ${style.bg}`}>
      <span>{style.icon}</span>
      <span className="hidden sm:inline">{source?.replace('_', ' ') || 'unknown'}</span>
    </span>
  );
}

// Mobile lead card
function LeadCard({ lead, onSelect, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <button
        onClick={() => onSelect(lead)}
        className="w-full bg-[#F2F0E9]/90 rounded-[2rem] border border-[#2E4036]/10 p-4 text-left hover:shadow-md active:shadow-sm transition-all duration-200 active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2E4036] flex items-center justify-center text-[#F2F0E9] font-bold shadow-md shadow-[#2E4036]/20 flex-shrink-0">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">{lead.name || 'Unknown'}</p>
                <p className="text-[#2E4036]/60 text-sm font-['IBM_Plex_Mono']">{lead.phone}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <SourceBadge source={lead.source} />
              {lead.urgency && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium font-['IBM_Plex_Mono'] ${lead.urgency === 'emergency' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                    lead.urgency === 'urgent' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                      'bg-[#2E4036]/10 text-[#2E4036]/60'
                  }`}>
                  {lead.urgency}
                </span>
              )}
              <span className="text-[#2E4036]/40 text-xs ml-auto font-['IBM_Plex_Mono']">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>

            {lead.service_needed && (
              <p className="text-[#2E4036]/70 text-sm mt-2 line-clamp-1 font-['Outfit']">{lead.service_needed}</p>
            )}
          </div>
        </div>
      </button>
    </FadeIn>
  );
}

// Desktop lead row
function LeadRow({ lead, onSelect }) {
  return (
    <tr
      className="hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 cursor-pointer transition-colors"
      onClick={() => onSelect(lead)}
    >
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2E4036] flex items-center justify-center text-[#F2F0E9] font-bold text-sm shadow-md shadow-[#2E4036]/20">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">{lead.name || 'Unknown'}</p>
            <p className="text-[#2E4036]/60 text-sm truncate font-['IBM_Plex_Mono']">{lead.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
        <SourceBadge source={lead.source} />
      </td>
      <td className="px-4 lg:px-6 py-4 hidden xl:table-cell">
        <p className="text-[#2E4036]/70 text-sm max-w-xs truncate font-['Outfit']">
          {lead.service_needed || '—'}
        </p>
      </td>
      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
        {lead.urgency && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium font-['IBM_Plex_Mono'] ${lead.urgency === 'emergency' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
              lead.urgency === 'urgent' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                'bg-[#2E4036]/10 text-[#2E4036]/60'
            }`}>
            {lead.urgency}
          </span>
        )}
      </td>
      <td className="px-4 lg:px-6 py-4 text-[#2E4036]/60 text-sm whitespace-nowrap font-['IBM_Plex_Mono']">
        {new Date(lead.created_at).toLocaleDateString()}
      </td>
    </tr>
  );
}

// Lead detail sheet (mobile-friendly)
function LeadDetailSheet({ lead, onClose }) {
  if (!lead) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#F2F0E9] rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-in-up safe-area-bottom lg:inset-y-0 lg:right-0 lg:left-auto lg:w-full lg:max-w-md lg:rounded-none lg:rounded-l-3xl lg:animate-slide-in-left">
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#2E4036]/20 rounded-full" />
        </div>

        <div className="p-4 sm:p-6 border-b border-[#2E4036]/10 flex items-center justify-between sticky top-0 bg-[#F2F0E9] z-10">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Lead Details</h3>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-[#2E4036]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)] lg:max-h-[calc(100vh-4rem)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#2E4036] flex items-center justify-center text-[#F2F0E9] font-bold text-xl shadow-xl shadow-[#2E4036]/20">
              {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-xl font-bold text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">{lead.name || 'Unknown'}</h4>
              <p className="text-[#2E4036]/60 font-['IBM_Plex_Mono']">{lead.phone}</p>
              {lead.email && <p className="text-[#2E4036]/60 text-sm truncate font-['IBM_Plex_Mono']">{lead.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-[#2E4036]/5 hover:bg-[#2E4036]/10 active:bg-[#2E4036]/15 rounded-xl transition-colors">
              <span className="text-xl">💬</span>
              <span className="text-xs sm:text-sm text-[#2E4036]/70 font-['Plus_Jakarta_Sans']">Message</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-[#2E4036]/5 hover:bg-[#2E4036]/10 active:bg-[#2E4036]/15 rounded-xl transition-colors">
              <span className="text-xl">📞</span>
              <span className="text-xs sm:text-sm text-[#2E4036]/70 font-['Plus_Jakarta_Sans']">Call</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-[#2E4036]/5 hover:bg-[#2E4036]/10 active:bg-[#2E4036]/15 rounded-xl transition-colors">
              <span className="text-xl">📅</span>
              <span className="text-xs sm:text-sm text-[#2E4036]/70 font-['Plus_Jakarta_Sans']">Schedule</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Status</label>
            <select className="w-full px-4 py-3 border border-[#2E4036]/20 rounded-xl bg-white text-base focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40 outline-none transition-all font-['Outfit']">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#2E4036]/10">
              <span className="text-[#2E4036]/60 text-sm font-['Plus_Jakarta_Sans']">Source</span>
              <SourceBadge source={lead.source} />
            </div>
            {lead.service_needed && (
              <div className="py-3 border-b border-[#2E4036]/10">
                <span className="text-[#2E4036]/60 text-sm block mb-1 font-['Plus_Jakarta_Sans']">Service Needed</span>
                <p className="text-[#1A1A1A] font-['Outfit']">{lead.service_needed}</p>
              </div>
            )}
            {lead.urgency && (
              <div className="flex items-center justify-between py-3 border-b border-[#2E4036]/10">
                <span className="text-[#2E4036]/60 text-sm font-['Plus_Jakarta_Sans']">Urgency</span>
                <span className="text-[#1A1A1A] capitalize font-['Outfit']">{lead.urgency}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-b border-[#2E4036]/10">
              <span className="text-[#2E4036]/60 text-sm font-['Plus_Jakarta_Sans']">Created</span>
              <span className="text-[#1A1A1A] font-['IBM_Plex_Mono']">{new Date(lead.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Notes</label>
            <textarea className="w-full px-4 py-3 border border-[#2E4036]/20 rounded-xl resize-none h-24 text-base focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40 outline-none transition-all font-['Outfit']" placeholder="Add notes..." />
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-[#2E4036]/10 bg-[#2E4036]/5 flex gap-3">
          <button className="flex-1 py-3 px-4 bg-[#2E4036] text-[#F2F0E9] font-semibold rounded-full hover:bg-[#1A1A1A] active:bg-[#1A1A1A] transition-colors shadow-md shadow-[#2E4036]/20 font-['Plus_Jakarta_Sans']">
            Save Changes
          </button>
          <button className="py-3 px-4 text-[#CC5833] font-medium hover:bg-[#CC5833]/5 active:bg-[#CC5833]/10 rounded-full transition-colors font-['Plus_Jakarta_Sans']">
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default function Leads() {
  const { leads, loading } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.service_needed?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.status === 'new').length || 0,
    qualified: leads?.filter(l => l.status === 'qualified').length || 0,
    converted: leads?.filter(l => l.status === 'converted').length || 0,
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 animate-bounce-soft">🦊</div>
          <p className="text-[#2E4036]/60 font-['Outfit']">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Leads</h1>
            <p className="text-[#2E4036]/60 mt-1 text-sm sm:text-base font-['Outfit']">Manage and track all your leads</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E4036] text-[#F2F0E9] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors shadow-md shadow-[#2E4036]/20 sm:w-auto w-full font-['Plus_Jakarta_Sans']">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </button>
        </div>
      </FadeIn>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 scrollbar-hide">
        {[
          { label: 'Total', value: stats.total },
          { label: 'New', value: stats.new },
          { label: 'Qualified', value: stats.qualified },
          { label: 'Converted', value: stats.converted },
        ].map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 50}>
            <div className="bg-[#F2F0E9]/90 rounded-[2rem] p-4 border border-[#2E4036]/10 min-w-[120px] sm:min-w-0 shadow-sm">
              <p className="text-[#2E4036]/60 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{stat.value}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={100}>
        <OrganicCard className="p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E4036]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2E4036]/5 border border-transparent rounded-xl text-base focus:bg-white focus:border-[#2E4036]/30 focus:ring-2 focus:ring-[#2E4036]/10 outline-none transition-all font-['Outfit']"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#2E4036]/5 border border-transparent rounded-xl text-base focus:bg-white focus:border-[#2E4036]/30 outline-none sm:w-auto font-['Outfit']"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </OrganicCard>
      </FadeIn>

      {filteredLeads.length === 0 ? (
        <FadeIn delay={150}>
          <OrganicCard className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2E4036] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#2E4036]/20">
              <span className="text-3xl sm:text-4xl">👥</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">No leads yet</h3>
            <p className="text-[#2E4036]/60 max-w-md mx-auto text-sm sm:text-base font-['Outfit']">
              When customers call your BookFox number, their information will appear here automatically.
            </p>
          </OrganicCard>
        </FadeIn>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredLeads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} onSelect={setSelectedLead} delay={i * 30} />
            ))}
          </div>

          <FadeIn delay={150} className="hidden lg:block">
            <OrganicCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2E4036]/5 border-b border-[#2E4036]/10">
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider font-['IBM_Plex_Mono']">Contact</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider font-['IBM_Plex_Mono']">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider hidden lg:table-cell font-['IBM_Plex_Mono']">Source</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider hidden xl:table-cell font-['IBM_Plex_Mono']">Service</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider hidden lg:table-cell font-['IBM_Plex_Mono']">Urgency</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[#2E4036]/60 uppercase tracking-wider font-['IBM_Plex_Mono']">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E4036]/5">
                    {filteredLeads.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} onSelect={setSelectedLead} />
                    ))}
                  </tbody>
                </table>
              </div>
            </OrganicCard>
          </FadeIn>
        </>
      )}

      {selectedLead && (
        <LeadDetailSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
