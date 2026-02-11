import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useLeads(options = {}) {
  const { business } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { status, limit = 50, search = '' } = options;

  useEffect(() => {
    if (!business?.id) {
      setLeads([]);
      setLoading(false);
      return;
    }

    async function fetchLeads() {
      setLoading(true);
      try {
        let query = supabase
          .from('leads')
          .select('*, assigned_to:team_members(name)')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (status) {
          query = query.eq('status', status);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setLeads(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `business_id=eq.${business.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new, ...prev].slice(0, limit));
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === payload.new.id ? payload.new : lead
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) =>
              prev.filter((lead) => lead.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business?.id, status, limit, search]);

  async function updateLead(id, updates) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  return { leads, loading, error, updateLead };
}

export function useLeadStats() {
  const { business } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    converted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business?.id) return;

    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('status')
          .eq('business_id', business.id);

        if (error) throw error;

        const counts = {
          total: data.length,
          new: data.filter((l) => l.status === 'new').length,
          qualified: data.filter((l) => l.status === 'qualified').length,
          converted: data.filter((l) => l.status === 'converted').length,
        };

        setStats(counts);
      } catch (err) {
        console.error('Error fetching lead stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [business?.id]);

  return { stats, loading };
}
