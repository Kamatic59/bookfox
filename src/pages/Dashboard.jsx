import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useConversations } from '../hooks/useConversations';

// Stat card with trend
function StatCard({ icon, label, value, trend, trendUp, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center text-xl text-white`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-stone-800">{value}</p>
        <p className="text-stone-500 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

// Activity item
function ActivityItem({ icon, title, description, time, type }) {
  const typeColors = {
    call: 'bg-blue-100 text-blue-600',
    message: 'bg-green-100 text-green-600',
    booking: 'bg-amber-100 text-amber-600',
    lead: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-stone-50 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${typeColors[type]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-800">{title}</p>
        <p className="text-stone-500 text-sm truncate">{description}</p>
      </div>
      <span className="text-stone-400 text-sm whitespace-nowrap">{time}</span>
    </div>
  );
}

// Quick action card
function QuickAction({ icon, title, description, to, color = 'blue' }) {
  const colorClasses = {
    blue: 'hover:border-blue-200 hover:bg-blue-50/50',
    green: 'hover:border-emerald-200 hover:bg-emerald-50/50',
    amber: 'hover:border-amber-200 hover:bg-amber-50/50',
    purple: 'hover:border-purple-200 hover:bg-purple-50/50',
  };

  return (
    <Link 
      to={to}
      className={`block p-4 bg-white rounded-xl border border-stone-100 ${colorClasses[color]} transition-all group`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <div>
          <p className="font-medium text-stone-800">{title}</p>
          <p className="text-stone-500 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// Lead preview card
function LeadCard({ lead }) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    qualified: 'bg-emerald-100 text-emerald-700',
    converted: 'bg-purple-100 text-purple-700',
    lost: 'bg-stone-100 text-stone-700',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-stone-800">{lead.name || 'Unknown'}</p>
          <p className="text-stone-500 text-sm">{lead.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[lead.status] || statusColors.new}`}>
          {lead.status}
        </span>
        <span className="text-stone-400 text-sm">
          {new Date(lead.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

// Simple bar chart
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value > 0 ? '8px' : '0' }}
          />
          <span className="text-xs text-stone-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { business } = useAuth();
  const { leads, loading: leadsLoading } = useLeads();
  const { conversations, loading: convoLoading } = useConversations();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayLeads = leads?.filter(l => new Date(l.created_at) >= today) || [];
  const newLeads = leads?.filter(l => l.status === 'new') || [];
  const qualifiedLeads = leads?.filter(l => l.status === 'qualified') || [];
  const activeConvos = conversations?.filter(c => c.status === 'active') || [];

  // Mock weekly data for chart
  const weeklyData = [
    { label: 'Mon', value: 5 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 12 },
    { label: 'Fri', value: 7 },
    { label: 'Sat', value: 2 },
    { label: 'Sun', value: 1 },
  ];

  // Mock activity data
  const recentActivity = [
    { icon: '📞', title: 'Missed call from (385) 555-0123', description: 'AI sent follow-up SMS', time: '2 min ago', type: 'call' },
    { icon: '💬', title: 'New message from John D.', description: 'Looking for a quote on water heater...', time: '15 min ago', type: 'message' },
    { icon: '📅', title: 'Appointment booked', description: 'Sarah M. - Pipe repair - Tomorrow 2pm', time: '1 hr ago', type: 'booking' },
    { icon: '✨', title: 'New lead qualified', description: 'Mike T. - Emergency plumbing - Hot lead', time: '2 hrs ago', type: 'lead' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">
          {greeting}, {business?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-stone-500 mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard 
          icon="📞" 
          label="Leads Today" 
          value={todayLeads.length}
          trend="12%"
          trendUp={true}
          color="blue"
        />
        <StatCard 
          icon="💬" 
          label="Active Conversations" 
          value={activeConvos.length}
          trend="8%"
          trendUp={true}
          color="green"
        />
        <StatCard 
          icon="✨" 
          label="Qualified Leads" 
          value={qualifiedLeads.length}
          trend="23%"
          trendUp={true}
          color="amber"
        />
        <StatCard 
          icon="⏰" 
          label="Avg Response Time" 
          value="< 30s"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-stone-800">Leads This Week</h2>
              <p className="text-stone-500 text-sm">Your lead capture performance</p>
            </div>
            <select className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <MiniBarChart data={weeklyData} />
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-stone-800">38</p>
              <p className="text-stone-500 text-sm">Total leads this week</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-600 font-medium">+15% vs last week</p>
              <p className="text-stone-500 text-sm">Keep it up! 🎉</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickAction 
              icon="💬" 
              title="View Inbox" 
              description={`${activeConvos.length} active conversations`}
              to="/dashboard/inbox"
              color="blue"
            />
            <QuickAction 
              icon="👥" 
              title="Manage Leads" 
              description={`${newLeads.length} new leads to review`}
              to="/dashboard/leads"
              color="green"
            />
            <QuickAction 
              icon="📅" 
              title="Calendar" 
              description="View upcoming appointments"
              to="/dashboard/calendar"
              color="amber"
            />
            <QuickAction 
              icon="⚙️" 
              title="Settings" 
              description="Configure your AI assistant"
              to="/dashboard/settings"
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">Recent Activity</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {recentActivity.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">Recent Leads</h2>
              <Link to="/dashboard/leads" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {leadsLoading ? (
              <div className="p-8 text-center text-stone-500">Loading leads...</div>
            ) : leads?.length > 0 ? (
              leads.slice(0, 4).map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))
            ) : (
              <div className="p-8 text-center">
                <span className="text-4xl mb-3 block">🦊</span>
                <p className="text-stone-600 font-medium">No leads yet</p>
                <p className="text-stone-500 text-sm mt-1">
                  When someone calls your BookFox number, they'll appear here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Setup Banner - Show if no Twilio phone configured */}
      {!business?.twilio_phone && (
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚡</span>
            <div className="flex-1">
              <h3 className="font-bold text-amber-800">Complete your setup</h3>
              <p className="text-amber-700 mt-1">
                Connect your Twilio phone number to start catching missed calls automatically.
              </p>
              <Link 
                to="/dashboard/settings"
                className="inline-block mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Finish Setup →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
