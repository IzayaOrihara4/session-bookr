import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, loading: authLoading } = useAuth();

  // Watch for profile changes and redirect
  React.useEffect(() => {
    if (profile) {
      console.log('[Login] Profile detected in AuthContext, redirecting...');
      const destination = profile.role === 'admin' ? '/admin' : '/dashboard';
      navigate(destination);
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('[Login] Starting authentication for:', email);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Login] Auth error:', error);
        throw error;
      }
      
      console.log('[Login] Auth successful, waiting for profile via AuthContext...');
      // Navigation is now handled by the useEffect watching 'profile'
      
    } catch (error: any) {
      console.error('[Login] Caught login error:', error);
      toast.error(error.message || 'Error logging in');
      setLoading(false);
    }
  };

  // Combine local and global loading for button state
  const isAuthenticating = loading || (authLoading && !profile);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(340, 35%, 88%, 0.8) 0%, hsla(340, 35%, 88%, 0) 70%)',
            animation: 'float-orb-1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(35, 30%, 84%, 0.7) 0%, hsla(35, 30%, 84%, 0) 70%)',
            animation: 'float-orb-2 25s ease-in-out infinite',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/40 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(45,35,30,0.1)] border border-white/60">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-px bg-primary/40" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Welcome Back
              </span>
            </div>
            <h1 className="text-4xl font-semibold text-espresso tracking-tight mb-2">
              Boutique Login
            </h1>
            <p className="text-espresso/60 text-sm font-medium">
              Access your treatment records and schedule.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-espresso/70 font-bold ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="maya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-white/40 focus:bg-white/80 transition-all duration-300 rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-espresso/70 font-bold">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 border-white/40 focus:bg-white/80 transition-all duration-300 rounded-2xl h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-espresso hover:bg-espresso/90 text-ivory rounded-full py-7 text-base font-semibold transition-all duration-300 shadow-xl shadow-espresso/10 hover:scale-[1.01] active:scale-[0.99]"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-espresso/5 text-center">
            <p className="text-espresso/60 text-sm">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
                Join the Studio
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] tracking-[0.3em] uppercase text-espresso/30">
          Maya Alvarez Laser Studio
        </p>
      </div>
    </div>
  );
};

export default Login;
