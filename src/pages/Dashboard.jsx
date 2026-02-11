import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useConversations } from '../hooks/useConversations';
import { useCallActivity, useWeeklyStats } from '../hooks/useCallActivity';
import { FadeIn, GlassCard } from '../components/shared/Animations';

// Premium stat card with gradient background
function StatCard({ icon, label, value, trend, trendUp, color = 'blue', delay = 0 }) {
  const colorClasses = {
    blue: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-violet-500 to-violet-600',
  };

  const bgClasses = {
    blue: 'bg-primary-50 border-primary-100/50',
    green: 'bg-green-50 border-green-100/50',
    amber: 'bg-amber-50 border-amber-100/50',
    purple: 'bg-violet-50 border-violet-100/50',
  };

  return (
    <FadeIn delay={delay}>
      <div 
        className={`relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
      >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center`}>
          <span className="text-xl text-white">{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            trendUp 
              ? 'text-green-700 bg-green-100' 
              : 'text-red-700 bg-red-100'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-stone-800">{value}</p>
      <p className="text-stone-500 text-sm mt-1">{label}</p>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${bgClasses[color]} rounded-full blur-2xl opacity-60`} />
      </div>
    </FadeIn>
  );
}

// Activity timeline item
function ActivityItem({ icon, title, description, time, type }) {
  const typeColors = {
    call: 'bg-primary-100 text-primary-600 ring-primary-500/20',
    message: 'bg-green-100 text-green-600 ring-green-500/20',
    booking: 'bg-amber-100 text-amber-600 ring-amber-500/20',
    lead: 'bg-violet-100 text-violet-600 ring-violet-500/20',
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-stone-50 rounded-xl transition-colors group cursor-pointer">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${typeColors[type]} ring-4`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-800 group-hover:text-primary-600 transition-colors">{title}</p>
        <p className="text-stone-500 text-sm truncate">{description}</p>
      </div>
      <span className="text-stone-400 text-sm whitespace-nowrap">{time}</span>
    </div>
  );
}

// Quick action button
function QuickAction({ icon, title, description, to, color = 'blue' }) {
  const hoverColors = {
    blue: 'hover:border-primary-300 hover:shadow-primary-100',
    green: 'hover:border-green-300 hover:shadow-green-100',
    amber: 'hover:border-amber-300 hover:shadow-amber-100',
    purple: 'hover:border-violet-300 hover:shadow-violet-100',
  };

  return (
    <Link 
      to={to}
      className={`block p-4 bg-white rounded-xl border-2 border-stone-100 ${hoverColors[color]} hover:shadow-lg transition-all duration-300 group active:scale-[0.98]`}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-stone-800 group-hover:text-primary-600 transition-colors">{title}</p>
          <p className="text-stone-500 text-sm truncate">{description}</p>
        </div>
        <svg className="w-5 h-5 text-stone-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// Lead card with avatar
function LeadCard({ lead }) {
  const statusColors = {
    new: 'bg-primary-100 text-primary-700 ring-primary-500/20',
    contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
    qualified: 'bg-green-100 text-green-700 ring-green-500/20',
    converted: 'bg-violet-100 text-violet-700 ring-violet-500/20',
    lost: 'bg-stone-100 text-stone-700 ring-stone-500/20',
  };

  const bgColors = ['from-primary-400 to-primary-600', 'from-green-400 to-green-600', 'from-amber-400 to-amber-600', 'from-violet-400 to-violet-600', 'from-rose-400 to-rose-600'];
  const bgColor = bgColors[lead.name?.charCodeAt(0) % bgColors.length || 0];

  return (
    <div className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center text-white font-bold shadow-lg`}>
          {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-stone-800 group-hover:text-primary-600 transition-colors">{lead.name || 'Unknown'}</p>
          <p className="text-stone-500 text-sm">{lead.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-2 ${statusColors[lead.status] || statusColors.new}`}>
          {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'New'}
        </span>
      </div>
    </div>
  );
}

// Bar chart with smooth animations
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end gap-3 h-36">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full relative h-full flex items-end">
            <div 
              className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-700 hover:to-primary-500 cursor-pointer"
              style={{ 
                height: `${(item.value / max) * 100}%`, 
                minHeight: item.value > 0 ? '12px' : '0',
                animationDelay: `${i * 50}ms`
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.value} leads
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-stone-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ icon, title, description }) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-stone-800 font-semibold">{title}</p>
      <p className="text-stone-500 text-sm mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { business, loading: authLoading } = useAuth();
  const { leads, loading: leadsLoading } = useLeads();
  const { conversations, loading: convoLoading } = useConversations();
  const { activity, loading: activityLoading } = useCallActivity(10);
  const { weeklyData, loading: weeklyLoading } = useWeeklyStats();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Show loading state while auth/business is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if no business (shouldn't happen after onboarding)
  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Business Not Found</h2>
          <p className="text-stone-600 mb-6">
            We couldn't load your business. Please complete onboarding or contact support.
          </p>
          <Link 
            to="/onboarding"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Complete Setup
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayLeads = leads?.filter(l => new Date(l.created_at) >= today) || [];
  const newLeads = leads?.filter(l => l.status === 'new') || [];
  const qualifiedLeads = leads?.filter(l => l.status === 'qualified') || [];
  const activeConvos = conversations?.filter(c => c.status === 'active') || [];

  // Use real activity data
  const recentActivity = activity;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-800">
              {greeting}! 👋
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Here's what's happening with <span className="font-semibold text-primary-600">{business?.name || 'your business'}</span> today.
          </p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatCard 
          icon="📞" 
          label="Leads Today" 
          value={todayLeads.length}
          trend="12%"
          trendUp={true}
          color="blue"
          delay={0}
        />
        <StatCard 
          icon="💬" 
          label="Active Chats" 
          value={activeConvos.length}
          trend="8%"
          trendUp={true}
          color="green"
          delay={75}
        />
        <StatCard 
          icon="✨" 
          label="Qualified" 
          value={qualifiedLeads.length}
          trend="23%"
          trendUp={true}
          color="amber"
          delay={150}
        />
        <StatCard 
          icon="⚡" 
          label="Avg Response" 
          value="< 30s"
          color="purple"
          delay={225}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Chart Section */}
        <FadeIn delay={300}>
          <GlassCard className="lg:col-span-2 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Weekly <span className="text-primary-600">Performance</span></h2>
                <p className="text-slate-600 text-sm">Lead capture trends</p>
              </div>
              <select className="text-sm border-2 border-slate-200 rounded-xl px-3 py-2 bg-white/60 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            {weeklyLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-500 text-sm">Loading stats...</p>
                </div>
              </div>
            ) : weeklyData.length > 0 ? (
              <>
                <MiniBarChart data={weeklyData} />
                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{weeklyData.reduce((sum, day) => sum + day.value, 0)}</p>
                    <p className="text-slate-600 text-sm">Total leads this week</p>
                  </div>
                  {weeklyData.reduce((sum, day) => sum + day.value, 0) > 0 && (
                    <div className="text-right bg-primary-50 rounded-xl px-4 py-2">
                      <p className="text-primary-700 font-semibold">Active</p>
                      <p className="text-primary-600 text-sm">Tracking</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl mb-3 block">📊</span>
                  <p className="text-slate-600 font-medium">No data yet</p>
                  <p className="text-slate-500 text-sm">Stats will appear when you start getting leads</p>
                </div>
              </div>
            )}
          </GlassCard>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={400}>
          <GlassCard className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Quick <span className="text-purple-600">Actions</span></h2>
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
              description="View appointments"
              to="/dashboard/calendar"
              color="amber"
            />
            <QuickAction 
              icon="⚙️" 
              title="Settings" 
              description="Configure AI assistant"
              to="/dashboard/settings"
              color="purple"
            />
          </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <FadeIn delay={500}>
          <GlassCard className="overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Recent <span className="text-green-600">Activity</span></h2>
                <button className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100/50">
            {activityLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-11 h-11 bg-slate-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))
            ) : (
              <EmptyState 
                icon="📞"
                title="No activity yet"
                description="Call and message activity will appear here once your Twilio number is set up."
              />
            )}
          </div>
          </GlassCard>
        </FadeIn>

        {/* Recent Leads */}
        <FadeIn delay={600}>
          <GlassCard className="overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Recent <span className="text-amber-600">Leads</span></h2>
                <Link to="/dashboard/leads" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100/50">
            {leadsLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-11 h-11 bg-slate-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leads?.length > 0 ? (
              leads.slice(0, 4).map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))
            ) : (
              <EmptyState 
                icon="🦊"
                title="No leads yet"
                description="When someone calls your BookFox number, they'll appear here automatically!"
              />
            )}
          </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Setup Banner - Show if no Twilio phone configured */}
      {!business?.twilio_phone && (
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg">Complete your setup</h3>
              <p className="text-amber-700 mt-1">
                Connect your phone number to start catching missed calls automatically.
              </p>
            </div>
            <Link 
              to="/dashboard/settings"
              className="w-full sm:w-auto text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Finish Setup →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
