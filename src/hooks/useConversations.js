import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useConversations(options = {}) {
  const { business } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { status = 'active', limit = 50 } = options;

  useEffect(() => {
    if (!business?.id) return;

    async function fetchConversations() {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select(`
            *,
            lead:leads(id, name, phone, service_needed, urgency),
            messages:messages(id, content, direction, sender_type, created_at)
          `)
          .eq('business_id', business.id)
          .eq('status', status)
          .order('updated_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;

        // Sort messages within each conversation
        const sorted = (data || []).map((convo) => ({
          ...convo,
          messages: (convo.messages || []).sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        }));

        setConversations(sorted);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `business_id=eq.${business.id}`,
        },
        () => {
          // Refetch on any change (simpler than handling partial updates)
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Refetch when new messages arrive
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business?.id, status, limit]);

  return { conversations, loading, error };
}

export function useConversation(conversationId) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!conversationId) return;

    try {
      // Fetch conversation
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .select(`
          *,
          lead:leads(*)
        `)
        .eq('id', conversationId)
        .single();

      if (convoError) throw convoError;
      setConversation(convoData);

      // Fetch messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgData || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchData();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchData]);

  async function sendMessage(content) {
    if (!conversation) throw new Error('No conversation loaded');

    // This would normally go through an Edge Function to send via Twilio
    // For now, just insert directly (human takeover mode)
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        direction: 'outbound',
        content,
        sender_type: 'human',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function setMode(mode) {
    const { error } = await supabase
      .from('conversations')
      .update({ mode })
      .eq('id', conversationId);

    if (error) throw error;
    setConversation((prev) => ({ ...prev, mode }));
  }

  return {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    setMode,
    refetch: fetchData,
  };
}
