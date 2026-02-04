import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-amber-100 text-amber-700 border-amber-200',
    qualified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    converted: 'bg-purple-100 text-purple-700 border-purple-200',
    lost: 'bg-stone-100 text-stone-600 border-stone-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.new}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Source badge
function SourceBadge({ source }) {
  const styles = {
    missed_call: { bg: 'bg-red-50 text-red-700', icon: '📞' },
    sms: { bg: 'bg-blue-50 text-blue-700', icon: '💬' },
    manual: { bg: 'bg-stone-50 text-stone-700', icon: '✏️' },
    website: { bg: 'bg-purple-50 text-purple-700', icon: '🌐' },
  };

  const style = styles[source] || styles.manual;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${style.bg}`}>
      <span>{style.icon}</span>
      <span>{source?.replace('_', ' ') || 'unknown'}</span>
    </span>
  );
}

// Lead row component
function LeadRow({ lead, onSelect }) {
  return (
    <tr 
      className="hover:bg-stone-50 cursor-pointer transition-colors"
      onClick={() => onSelect(lead)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-stone-800">{lead.name || 'Unknown'}</p>
            <p className="text-stone-500 text-sm">{lead.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-6 py-4">
        <SourceBadge source={lead.source} />
      </td>
      <td className="px-6 py-4">
        <p className="text-stone-600 text-sm max-w-xs truncate">
          {lead.service_needed || '—'}
        </p>
      </td>
      <td className="px-6 py-4">
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
      <td className="px-6 py-4 text-stone-500 text-sm">
        {new Date(lead.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button 
            className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors"
            onClick={(e) => { e.stopPropagation(); /* TODO: Open chat */ }}
            title="Send message"
          >
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button 
            className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors"
            onClick={(e) => { e.stopPropagation(); /* TODO: Call */ }}
            title="Call"
          >
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// Lead detail sidebar
function LeadDetail({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-stone-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-800">Lead Details</h3>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Contact Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xl font-bold text-stone-800">{lead.name || 'Unknown'}</h4>
            <p className="text-stone-500">{lead.phone}</p>
            {lead.email && <p className="text-stone-500 text-sm">{lead.email}</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-4 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
            <span className="text-xl">💬</span>
            <span className="text-sm text-stone-600">Message</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
            <span className="text-xl">📞</span>
            <span className="text-sm text-stone-600">Call</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
            <span className="text-xl">📅</span>
            <span className="text-sm text-stone-600">Schedule</span>
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">Status</label>
          <select className="w-full px-4 py-2 border border-stone-300 rounded-xl bg-white">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-stone-500 mb-1">Source</label>
            <p className="text-stone-800"><SourceBadge source={lead.source} /></p>
          </div>
          
          {lead.service_needed && (
            <div>
              <label className="block text-sm text-stone-500 mb-1">Service Needed</label>
              <p className="text-stone-800">{lead.service_needed}</p>
            </div>
          )}
          
          {lead.urgency && (
            <div>
              <label className="block text-sm text-stone-500 mb-1">Urgency</label>
              <p className="text-stone-800 capitalize">{lead.urgency}</p>
            </div>
          )}
          
          {lead.property_type && (
            <div>
              <label className="block text-sm text-stone-500 mb-1">Property Type</label>
              <p className="text-stone-800 capitalize">{lead.property_type}</p>
            </div>
          )}
          
          {lead.preferred_contact_time && (
            <div>
              <label className="block text-sm text-stone-500 mb-1">Preferred Contact Time</label>
              <p className="text-stone-800">{lead.preferred_contact_time}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-stone-500 mb-1">Created</label>
            <p className="text-stone-800">
              {new Date(lead.created_at).toLocaleString()}
            </p>
          </div>
          
          {lead.ai_score && (
            <div>
              <label className="block text-sm text-stone-500 mb-1">AI Lead Score</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      lead.ai_score >= 80 ? 'bg-emerald-500' :
                      lead.ai_score >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${lead.ai_score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-stone-700">{lead.ai_score}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">Notes</label>
          <textarea
            className="w-full px-4 py-3 border border-stone-300 rounded-xl resize-none h-24"
            placeholder="Add notes about this lead..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200 flex gap-3">
        <button className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
        <button className="py-2.5 px-4 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function Leads() {
  const { leads, loading } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort leads
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.service_needed?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  }) || [];

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
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🦊</div>
          <p className="text-stone-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Leads</h1>
          <p className="text-stone-500 mt-1">Manage and track all your leads</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Total Leads</p>
          <p className="text-2xl font-bold text-stone-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">New</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Qualified</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.qualified}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Converted</p>
          <p className="text-2xl font-bold text-purple-600">{stats.converted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-stone-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-stone-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-stone-800 mb-2">No leads yet</h3>
            <p className="text-stone-500 max-w-md mx-auto">
              When customers call your BookFox number, their information will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredLeads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} onSelect={setSelectedLead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedLead(null)}
          />
          <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </>
      )}
    </div>
  );
}
