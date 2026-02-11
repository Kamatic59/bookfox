import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { setUser as setSentryUser } from '../lib/sentry';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000);

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (!mounted) return;
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }
        
        const newUser = session?.user ?? null;
        setUser(newUser);
        setSentryUser(newUser); // Track user in Sentry
        
        if (newUser) {
          loadBusiness(newUser.id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to get session:', err);
        setError(err.message);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadBusiness(session.user.id);
        } else {
          setBusiness(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
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

    // Create business via Edge Function (bypasses RLS)
    if (data.user && data.session) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-business`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`,
            },
            body: JSON.stringify({ name: businessName }),
          }
        );
        
        const result = await response.json();
        
        if (!response.ok) {
          console.error('Failed to create business:', result);
          throw new Error(result.error || 'Failed to create business');
        }
        
        setBusiness(result.business);
      } catch (bizError) {
        console.error('Business creation error:', bizError);
        // Don't throw - user account was created, they can complete onboarding later
      }
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
    error,
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
