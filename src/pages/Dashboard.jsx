import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useConversations } from '../hooks/useConversations';
import { useCallActivity, useWeeklyStats } from '../hooks/useCallActivity';
import { FadeIn, OrganicCard } from '../components/shared/Animations';

// Premium stat card — Organic Tech
function StatCard({ icon, label, value, trend, trendUp, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div
        className="relative overflow-hidden bg-[#F2F0E9]/90 backdrop-blur-sm rounded-[2rem] p-5 sm:p-6 shadow-[0_8px_24px_-8px_rgba(46,64,54,0.12)] border border-[#2E4036]/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2E4036] shadow-md shadow-[#2E4036]/20 flex items-center justify-center">
            <span className="text-xl">{icon}</span>
          </div>
          {trend && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full font-['IBM_Plex_Mono'] ${trendUp
                ? 'text-[#2E4036] bg-[#2E4036]/10'
                : 'text-[#CC5833] bg-[#CC5833]/10'
              }`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{value}</p>
        <p className="text-[#2E4036]/60 text-sm mt-1 font-['Outfit']">{label}</p>
      </div>
    </FadeIn>
  );
}

// Activity timeline item
function ActivityItem({ icon, title, description, time, type }) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-[#2E4036]/5 rounded-xl transition-colors group cursor-pointer">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-[#2E4036]/10 text-[#2E4036] ring-4 ring-[#2E4036]/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#1A1A1A] group-hover:text-[#CC5833] transition-colors font-['Plus_Jakarta_Sans']">{title}</p>
        <p className="text-[#2E4036]/60 text-sm truncate font-['Outfit']">{description}</p>
      </div>
      <span className="text-[#2E4036]/40 text-sm whitespace-nowrap font-['IBM_Plex_Mono']">{time}</span>
    </div>
  );
}

// Quick action button
function QuickAction({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="block p-4 bg-[#F2F0E9] rounded-xl border-2 border-[#2E4036]/10 hover:border-[#2E4036]/30 hover:shadow-lg transition-all duration-300 group active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#1A1A1A] group-hover:text-[#CC5833] transition-colors font-['Plus_Jakarta_Sans']">{title}</p>
          <p className="text-[#2E4036]/60 text-sm truncate font-['Outfit']">{description}</p>
        </div>
        <svg className="w-5 h-5 text-[#2E4036]/30 group-hover:text-[#CC5833] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// Lead card with avatar
function LeadCard({ lead }) {
  const statusColors = {
    new: 'bg-[#2E4036]/10 text-[#2E4036] ring-[#2E4036]/10',
    contacted: 'bg-[#CC5833]/10 text-[#CC5833] ring-[#CC5833]/10',
    qualified: 'bg-[#2E4036]/15 text-[#2E4036] ring-[#2E4036]/15',
    converted: 'bg-[#2E4036]/20 text-[#2E4036] ring-[#2E4036]/20',
    lost: 'bg-[#1A1A1A]/10 text-[#1A1A1A]/60 ring-[#1A1A1A]/5',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-[#2E4036]/5 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-[#2E4036] flex items-center justify-center text-[#F2F0E9] font-bold shadow-md shadow-[#2E4036]/20">
          {(lead.name || lead.phone || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[#1A1A1A] group-hover:text-[#CC5833] transition-colors font-['Plus_Jakarta_Sans']">{lead.name || 'Unknown'}</p>
          <p className="text-[#2E4036]/60 text-sm font-['IBM_Plex_Mono']">{lead.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-2 font-['IBM_Plex_Mono'] ${statusColors[lead.status] || statusColors.new}`}>
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
              className="w-full bg-gradient-to-t from-[#2E4036] to-[#557864] rounded-t-lg transition-all duration-500 hover:from-[#1A1A1A] hover:to-[#2E4036] cursor-pointer"
              style={{
                height: `${(item.value / max) * 100}%`,
                minHeight: item.value > 0 ? '12px' : '0',
                animationDelay: `${i * 50}ms`
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#F2F0E9] text-xs px-2 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap font-['IBM_Plex_Mono']">
                {item.value} leads
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-[#2E4036]/60 font-['IBM_Plex_Mono']">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ icon, title, description }) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-[#1A1A1A] font-semibold font-['Plus_Jakarta_Sans']">{title}</p>
      <p className="text-[#2E4036]/60 text-sm mt-1 max-w-xs mx-auto font-['Outfit']">{description}</p>
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
          <div className="w-16 h-16 border-4 border-[#2E4036]/20 border-t-[#2E4036] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2E4036]/70 font-['Plus_Jakarta_Sans']">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if no business
  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#CC5833]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Business Not Found</h2>
          <p className="text-[#2E4036]/70 mb-6 font-['Outfit']">
            We couldn't load your business. Please complete onboarding or contact support.
          </p>
          <Link
            to="/onboarding"
            className="inline-block px-6 py-3 bg-[#2E4036] text-[#F2F0E9] rounded-full font-semibold hover:bg-[#1A1A1A] transition font-['Plus_Jakarta_Sans']"
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
            <h1 className="text-2xl lg:text-4xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">
              {greeting}! 👋
            </h1>
          </div>
          <p className="text-[#2E4036]/70 text-lg font-['Outfit']">
            Here's what's happening with <span className="font-semibold text-[#CC5833]">{business?.name || 'your business'}</span> today.
          </p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatCard icon="📞" label="Leads Today" value={todayLeads.length} trend="12%" trendUp={true} delay={0} />
        <StatCard icon="💬" label="Active Chats" value={activeConvos.length} trend="8%" trendUp={true} delay={75} />
        <StatCard icon="✨" label="Qualified" value={qualifiedLeads.length} trend="23%" trendUp={true} delay={150} />
        <StatCard icon="⚡" label="Avg Response" value="< 30s" delay={225} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Chart Section */}
        <FadeIn delay={300}>
          <OrganicCard className="lg:col-span-2 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Weekly <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Performance</span></h2>
                <p className="text-[#2E4036]/60 text-sm font-['Outfit']">Lead capture trends</p>
              </div>
              <select className="text-sm border-2 border-[#2E4036]/10 rounded-xl px-3 py-2 bg-[#F2F0E9]/60 focus:border-[#2E4036]/30 focus:ring-2 focus:ring-[#2E4036]/10 outline-none transition-all cursor-pointer font-['Plus_Jakarta_Sans']">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            {weeklyLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#2E4036]/20 border-t-[#2E4036] rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-[#2E4036]/60 text-sm font-['Outfit']">Loading stats...</p>
                </div>
              </div>
            ) : weeklyData.length > 0 ? (
              <>
                <MiniBarChart data={weeklyData} />
                <div className="mt-6 pt-4 border-t border-[#2E4036]/10 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{weeklyData.reduce((sum, day) => sum + day.value, 0)}</p>
                    <p className="text-[#2E4036]/60 text-sm font-['Outfit']">Total leads this week</p>
                  </div>
                  {weeklyData.reduce((sum, day) => sum + day.value, 0) > 0 && (
                    <div className="text-right bg-[#2E4036]/10 rounded-xl px-4 py-2">
                      <p className="text-[#2E4036] font-semibold font-['Plus_Jakarta_Sans']">Active</p>
                      <p className="text-[#2E4036]/70 text-sm font-['IBM_Plex_Mono']">Tracking</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl mb-3 block">📊</span>
                  <p className="text-[#1A1A1A] font-medium font-['Plus_Jakarta_Sans']">No data yet</p>
                  <p className="text-[#2E4036]/60 text-sm font-['Outfit']">Stats will appear when you start getting leads</p>
                </div>
              </div>
            )}
          </OrganicCard>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={400}>
          <OrganicCard className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 font-['Plus_Jakarta_Sans']">Quick <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Actions</span></h2>
            <div className="space-y-3">
              <QuickAction icon="💬" title="View Inbox" description={`${activeConvos.length} active conversations`} to="/dashboard/inbox" />
              <QuickAction icon="👥" title="Manage Leads" description={`${newLeads.length} new leads to review`} to="/dashboard/leads" />
              <QuickAction icon="📅" title="Calendar" description="View appointments" to="/dashboard/calendar" />
              <QuickAction icon="⚙️" title="Settings" description="Configure AI assistant" to="/dashboard/settings" />
            </div>
          </OrganicCard>
        </FadeIn>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <FadeIn delay={500}>
          <OrganicCard className="overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#2E4036]/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Recent <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Activity</span></h2>
                <button className="text-[#2E4036] text-sm font-medium hover:text-[#CC5833] flex items-center gap-1 transition-colors font-['Plus_Jakarta_Sans']">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="divide-y divide-[#2E4036]/5">
              {activityLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-11 h-11 bg-[#2E4036]/10 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#2E4036]/10 rounded w-48 mb-2" />
                        <div className="h-3 bg-[#2E4036]/5 rounded w-32" />
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
          </OrganicCard>
        </FadeIn>

        {/* Recent Leads */}
        <FadeIn delay={600}>
          <OrganicCard className="overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#2E4036]/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Recent <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Leads</span></h2>
                <Link to="/dashboard/leads" className="text-[#2E4036] text-sm font-medium hover:text-[#CC5833] flex items-center gap-1 transition-colors font-['Plus_Jakarta_Sans']">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-[#2E4036]/5">
              {leadsLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-11 h-11 bg-[#2E4036]/10 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#2E4036]/10 rounded w-32 mb-2" />
                        <div className="h-3 bg-[#2E4036]/5 rounded w-24" />
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
          </OrganicCard>
        </FadeIn>
      </div>

      {/* Setup Banner - Show if no Twilio phone configured */}
      {!business?.twilio_phone && (
        <div className="mt-6 sm:mt-8 bg-[#CC5833]/10 border-2 border-[#CC5833]/20 rounded-[2rem] p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-[#CC5833] rounded-2xl flex items-center justify-center shadow-md shadow-[#CC5833]/20">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A1A] text-lg font-['Plus_Jakarta_Sans']">Complete your setup</h3>
              <p className="text-[#2E4036]/70 mt-1 font-['Outfit']">
                Connect your phone number to start catching missed calls automatically.
              </p>
            </div>
            <Link
              to="/dashboard/settings"
              className="w-full sm:w-auto text-center bg-[#2E4036] text-[#F2F0E9] px-6 py-3 rounded-full font-semibold hover:bg-[#1A1A1A] transition-all shadow-md shadow-[#2E4036]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-['Plus_Jakarta_Sans']"
            >
              Finish Setup →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
