import { Phone, MessageSquare, Calendar, Users, TrendingUp, Clock, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeads, useLeadStats } from '../hooks/useLeads';
import { useConversations } from '../hooks/useConversations';
import StatCard from '../components/StatCard';
import LeadCard from '../components/LeadCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { business } = useAuth();
  const { stats } = useLeadStats();
  const { leads, loading: leadsLoading } = useLeads({ limit: 5 });
  const { conversations, loading: convosLoading } = useConversations({ limit: 3 });

  // Calculate active AI conversations
  const aiConversations = conversations.filter(c => c.mode === 'ai').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Welcome back! 🦊
          </h1>
          <p className="text-stone-500 mt-1">
            Here's what's happening with {business?.name || 'your business'}
          </p>
        </div>
        
        {!business?.twilio_phone && (
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition"
          >
            <Phone className="w-4 h-4" />
            Complete phone setup
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          change={12}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="New Today"
          value={stats.new}
          change={8}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="AI Active"
          value={aiConversations}
          icon={Bot}
          color="purple"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          change={-3}
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recent Leads
            </h2>
            <Link to="/leads" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>

          {leadsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-stone-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-4xl mb-2">📞</div>
              <p>No leads yet</p>
              <p className="text-sm mt-1">Forward missed calls to start catching leads!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </div>

        {/* Active Conversations */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Active Chats
            </h2>
            <Link to="/inbox" className="text-sm text-blue-600 hover:text-blue-700">
              Open inbox →
            </Link>
          </div>

          {convosLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-4xl mb-2">💬</div>
              <p>No active conversations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((convo) => (
                <Link
                  key={convo.id}
                  to="/inbox"
                  className="block p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-700 truncate">
                      {convo.lead?.name || convo.customer_phone}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      convo.mode === 'ai' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {convo.mode === 'ai' ? '🤖 AI' : '👤 Human'}
                    </span>
                  </div>
                  {convo.messages?.[convo.messages.length - 1] && (
                    <p className="text-sm text-stone-500 truncate mt-1">
                      {convo.messages[convo.messages.length - 1].content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="font-semibold text-lg mb-2">🦊 Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <Link
            to="/inbox"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <MessageSquare className="w-6 h-6" />
            <div>
              <div className="font-medium">Check Inbox</div>
              <div className="text-sm text-blue-100">Review AI conversations</div>
            </div>
          </Link>
          <Link
            to="/calendar"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <Calendar className="w-6 h-6" />
            <div>
              <div className="font-medium">View Calendar</div>
              <div className="text-sm text-blue-100">See booked appointments</div>
            </div>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <Bot className="w-6 h-6" />
            <div>
              <div className="font-medium">AI Settings</div>
              <div className="text-sm text-blue-100">Customize responses</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
