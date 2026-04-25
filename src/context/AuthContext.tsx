import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserRole = 'user' | 'client' | 'admin';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: string;
  avatar_url?: string | null;
  created_at?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      
      console.log('[AuthContext] Auth event received:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (!newSession) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const fetchProfile = async (userId: string) => {
    console.log('[AuthContext] fetchProfile starting for user:', userId);
    setLoading(true);
    
    // Add a safety timeout to ensure we never hang "Authenticating" forever
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('[AuthContext] Profile fetch timed out');
        setLoading(false);
      }
    }, 8000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthContext] profile fetch error:', error.message);
        throw error;
      }
      
      console.log('[AuthContext] profile fetch success:', data);
      console.log('[AuthContext] resolved role:', data.role);
      
      setProfile(data as Profile);
    } catch (error: any) {
      console.error('[AuthContext] fetchProfile failed:', error);
      toast.error(`Account Setup Error: ${error.message || 'Profile fetch failed'}`);
    } finally {
      clearTimeout(timeoutId);
      console.log('[AuthContext] fetchProfile complete, setting loading false');
      setLoading(false);
    }
  };

  const signOut = async (navigate?: (path: string) => void) => {
    console.log('[AuthContext] Executing Sign Out');
    await supabase.auth.signOut();
    if (navigate) navigate('/');
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
