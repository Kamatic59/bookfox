import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadBusiness(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadBusiness(session.user.id);
        } else {
          setBusiness(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadBusiness(userId) {
    try {
      // Get the user's team membership and business
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading business:', error);
      }

      setBusiness(teamMember?.business ?? null);
    } catch (err) {
      console.error('Error loading business:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, businessName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create business and team member after signup
    if (data.user) {
      const { data: newBusiness, error: bizError } = await supabase
        .from('businesses')
        .insert({ name: businessName })
        .select()
        .single();

      if (bizError) throw bizError;

      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          user_id: data.user.id,
          business_id: newBusiness.id,
          role: 'owner',
        });

      if (teamError) throw teamError;

      setBusiness(newBusiness);
    }

    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setBusiness(null);
  }

  async function refreshBusiness() {
    if (user) {
      await loadBusiness(user.id);
    }
  }

  const value = {
    user,
    business,
    loading,
    signUp,
    signIn,
    signOut,
    refreshBusiness,
    isAuthenticated: !!user,
    hasCompletedSetup: !!business?.twilio_phone,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
