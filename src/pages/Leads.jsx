import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { FadeIn } from '../components/Animations';

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    new: 'bg-primary-100 text-primary-700',
    contacted: 'bg-amber-100 text-amber-700',
    qualified: 'bg-green-100 text-green-700',
    converted: 'bg-purple-100 text-purple-700',
    lost: 'bg-stone-100 text-stone-600',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.new}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

// Source badge
function SourceBadge({ source }) {
  const styles = {
    missed_call: { bg: 'bg-red-50 text-red-700', icon: '📞' },
    sms: { bg: 'bg-primary-50 text-primary-700', icon: '💬' },
    manual: { bg: 'bg-stone-50 text-stone-700', icon: '✏️' },
    website: { bg: 'bg-purple-50 text-purple-700', icon: '🌐' },
  };

  const style = styles[source] || styles.manual;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${style.bg}`}>
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
        className="w-full bg-white rounded-xl border border-stone-200 p-4 text-left hover:shadow-md active:shadow-sm transition-all duration-200 active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 flex-shrink-0">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-stone-800 truncate">{lead.name || 'Unknown'}</p>
                <p className="text-stone-500 text-sm">{lead.phone}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <SourceBadge source={lead.source} />
              {lead.urgency && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  lead.urgency === 'emergency' ? 'bg-red-100 text-red-700' :
                  lead.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {lead.urgency}
                </span>
              )}
              <span className="text-stone-400 text-xs ml-auto">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {lead.service_needed && (
              <p className="text-stone-600 text-sm mt-2 line-clamp-1">{lead.service_needed}</p>
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
      className="hover:bg-stone-50 active:bg-stone-100 cursor-pointer transition-colors"
      onClick={() => onSelect(lead)}
    >
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-stone-800 truncate">{lead.name || 'Unknown'}</p>
            <p className="text-stone-500 text-sm truncate">{lead.phone}</p>
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
        <p className="text-stone-600 text-sm max-w-xs truncate">
          {lead.service_needed || '—'}
        </p>
      </td>
      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
        {lead.urgency && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            lead.urgency === 'emergency' ? 'bg-red-100 text-red-700' :
            lead.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' :
            'bg-stone-100 text-stone-600'
          }`}>
            {lead.urgency}
          </span>
        )}
      </td>
      <td className="px-4 lg:px-6 py-4 text-stone-500 text-sm whitespace-nowrap">
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-in-up safe-area-bottom lg:inset-y-0 lg:right-0 lg:left-auto lg:w-full lg:max-w-md lg:rounded-none lg:rounded-l-3xl lg:animate-slide-in-left">
        {/* Handle (mobile) */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-stone-800">Lead Details</h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-stone-100 active:bg-stone-200 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)] lg:max-h-[calc(100vh-4rem)]">
          {/* Contact Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-primary-500/20">
              {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-xl font-bold text-stone-800 truncate">{lead.name || 'Unknown'}</h4>
              <p className="text-stone-500">{lead.phone}</p>
              {lead.email && <p className="text-stone-500 text-sm truncate">{lead.email}</p>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl transition-colors">
              <span className="text-xl">💬</span>
              <span className="text-xs sm:text-sm text-stone-600">Message</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl transition-colors">
              <span className="text-xl">📞</span>
              <span className="text-xs sm:text-sm text-stone-600">Call</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl transition-colors">
              <span className="text-xl">📅</span>
              <span className="text-xs sm:text-sm text-stone-600">Schedule</span>
            </button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">Status</label>
            <select className="w-full px-4 py-3 border border-stone-300 rounded-xl bg-white text-base focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-stone-500 text-sm">Source</span>
              <SourceBadge source={lead.source} />
            </div>
            
            {lead.service_needed && (
              <div className="py-3 border-b border-stone-100">
                <span className="text-stone-500 text-sm block mb-1">Service Needed</span>
                <p className="text-stone-800">{lead.service_needed}</p>
              </div>
            )}
            
            {lead.urgency && (
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <span className="text-stone-500 text-sm">Urgency</span>
                <span className="text-stone-800 capitalize">{lead.urgency}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-stone-500 text-sm">Created</span>
              <span className="text-stone-800">{new Date(lead.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-3 border border-stone-300 rounded-xl resize-none h-24 text-base focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              placeholder="Add notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50 flex gap-3">
          <button className="flex-1 py-3 px-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-lg shadow-primary-500/20">
            Save Changes
          </button>
          <button className="py-3 px-4 text-red-600 font-medium hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors">
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

  // Filter leads
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.service_needed?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];

  // Stats
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
          <p className="text-stone-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Leads</h1>
            <p className="text-stone-500 mt-1 text-sm sm:text-base">Manage and track all your leads</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-lg shadow-primary-500/20 sm:w-auto w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </button>
        </div>
      </FadeIn>

      {/* Stats - scrollable on mobile */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 scrollbar-hide">
        {[
          { label: 'Total', value: stats.total, color: 'stone' },
          { label: 'New', value: stats.new, color: 'blue' },
          { label: 'Qualified', value: stats.qualified, color: 'emerald' },
          { label: 'Converted', value: stats.converted, color: 'purple' },
        ].map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 50}>
            <div className="bg-white rounded-xl p-4 border border-stone-200 min-w-[120px] sm:min-w-0">
              <p className="text-stone-500 text-xs sm:text-sm">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Filters */}
      <FadeIn delay={100}>
        <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-transparent rounded-xl text-base focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-stone-100 border border-transparent rounded-xl text-base focus:bg-white focus:border-primary-300 outline-none sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </FadeIn>

      {/* Content */}
      {filteredLeads.length === 0 ? (
        <FadeIn delay={150}>
          <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
              <span className="text-3xl sm:text-4xl">👥</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2">No leads yet</h3>
            <p className="text-stone-500 max-w-md mx-auto text-sm sm:text-base">
              When customers call your BookFox number, their information will appear here automatically.
            </p>
          </div>
        </FadeIn>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="space-y-3 lg:hidden">
            {filteredLeads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} onSelect={setSelectedLead} delay={i * 30} />
            ))}
          </div>

          {/* Desktop: Table layout */}
          <FadeIn delay={150} className="hidden lg:block">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider hidden lg:table-cell">Source</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider hidden xl:table-cell">Service</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider hidden lg:table-cell">Urgency</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLeads.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} onSelect={setSelectedLead} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </>
      )}

      {/* Lead Detail Sheet */}
      {selectedLead && (
        <LeadDetailSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
