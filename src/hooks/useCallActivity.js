import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to fetch recent call and message activity
 */
export function useCallActivity(limit = 10) {
  const { business } = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business?.id) {
      setActivity([]);
      setLoading(false);
      return;
    }

    async function fetchActivity() {
      setLoading(true);
      try {
        // Fetch call log
        const { data: calls } = await supabase
          .from('call_log')
          .select('*, lead:leads(name, phone)')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        // Fetch recent messages
        const { data: messages } = await supabase
          .from('messages')
          .select(`
            *,
            conversation:conversations(
              id,
              lead:leads(name, phone)
            )
          `)
          .eq('direction', 'inbound')
          .order('created_at', { ascending: false })
          .limit(limit);

        // Combine and format
        const callActivity = (calls || []).map(call => ({
          id: `call-${call.id}`,
          icon: '📞',
          title: `Call from ${call.lead?.name || call.from_phone}`,
          description: call.processed ? 'AI sent follow-up SMS' : 'Missed call',
          time: formatTimeAgo(call.created_at),
          type: 'call',
          timestamp: new Date(call.created_at),
        }));

        const messageActivity = (messages || []).map(msg => ({
          id: `msg-${msg.id}`,
          icon: '💬',
          title: `Message from ${msg.conversation?.lead?.name || 'Customer'}`,
          description: msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : ''),
          time: formatTimeAgo(msg.created_at),
          type: 'message',
          timestamp: new Date(msg.created_at),
        }));

        // Combine and sort by timestamp
        const combined = [...callActivity, ...messageActivity]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);

        setActivity(combined);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();

    // Subscribe to realtime updates
    const callChannel = supabase
      .channel('call-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_log',
          filter: `business_id=eq.${business.id}`,
        },
        () => fetchActivity()
      )
      .subscribe();

    const msgChannel = supabase
      .channel('message-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => fetchActivity()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [business?.id, limit]);

  return { activity, loading };
}

/**
 * Hook to get weekly lead stats
 */
export function useWeeklyStats() {
  const { business } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business?.id) {
      setWeeklyData([]);
      setLoading(false);
      return;
    }

    async function fetchWeeklyStats() {
      try {
        // Get leads from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: leads } = await supabase
          .from('leads')
          .select('created_at')
          .eq('business_id', business.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        // Group by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = {};
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = dayNames[date.getDay()];
          counts[dayName] = 0;
        }

        // Count leads per day
        (leads || []).forEach(lead => {
          const date = new Date(lead.created_at);
          const dayName = dayNames[date.getDay()];
          counts[dayName] = (counts[dayName] || 0) + 1;
        });

        // Convert to array format
        const data = Object.entries(counts).map(([label, value]) => ({
          label,
          value,
        }));

        setWeeklyData(data);
      } catch (err) {
        console.error('Error fetching weekly stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyStats();
  }, [business?.id]);

  return { weeklyData, loading };
}

// Helper to format relative time
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
