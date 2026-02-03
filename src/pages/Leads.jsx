import { useState } from 'react'
import { Search, Filter, User, Phone, MapPin, Clock, MoreVertical, Bot } from 'lucide-react'

const leads = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    phone: '+1 (801) 555-0123',
    issue: 'Water heater not working - pilot light out',
    location: 'Bountiful, UT 84010',
    status: 'new',
    source: 'missed-call',
    aiQualified: true,
    urgency: 'high',
    createdAt: '5 min ago'
  },
  {
    id: 2,
    name: 'Mike Thompson',
    phone: '+1 (801) 555-0456',
    issue: 'AC making loud noise, not cooling well',
    location: 'Centerville, UT 84014',
    status: 'qualified',
    source: 'missed-call',
    aiQualified: true,
    urgency: 'medium',
    createdAt: '2 hours ago'
  },
  {
    id: 3,
    name: 'Jennifer Adams',
    phone: '+1 (801) 555-0789',
    issue: 'Annual HVAC maintenance',
    location: 'Farmington, UT 84025',
    status: 'booked',
    source: 'missed-call',
    aiQualified: true,
    urgency: 'low',
    createdAt: 'Yesterday'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    phone: '+1 (801) 555-0321',
    issue: 'Furnace not igniting',
    location: 'Kaysville, UT 84037',
    status: 'contacted',
    source: 'missed-call',
    aiQualified: true,
    urgency: 'high',
    createdAt: 'Yesterday'
  },
]

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  qualified: 'bg-amber-100 text-amber-700',
  booked: 'bg-green-100 text-green-700',
  closed: 'bg-stone-100 text-stone-600',
}

const urgencyColors = {
  high: 'bg-red-50 border-l-red-400',
  medium: 'bg-amber-50 border-l-amber-400',
  low: 'bg-green-50 border-l-green-400',
}

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.issue.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Leads</h1>
          <p className="text-stone-500">Manage and track your incoming leads</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-lg text-sm
                placeholder:text-stone-400 focus:bg-white focus:ring-2 
                focus:ring-blue-500/20 border border-transparent focus:border-blue-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-stone-100 rounded-lg text-sm text-stone-700
                focus:bg-white focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-200"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="booked">Booked</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-stone-50 border-b border-stone-200 text-sm font-medium text-stone-500">
          <div className="col-span-4">Lead</div>
          <div className="col-span-3">Issue</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-stone-100">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id}
              className={`p-4 hover:bg-stone-50 transition-colors border-l-4 ${urgencyColors[lead.urgency]}`}
            >
              <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center space-y-3 sm:space-y-0">
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-stone-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-stone-800">{lead.name}</p>
                        {lead.aiQualified && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            <Bot className="w-3 h-3" />
                            AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-stone-700 line-clamp-2">{lead.issue}</p>
                  <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {lead.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="flex items-center gap-1.5 text-sm text-stone-500">
                    <Clock className="w-4 h-4" />
                    {lead.createdAt}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
