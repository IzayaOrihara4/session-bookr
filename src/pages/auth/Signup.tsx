import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

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
                Join the Studio
              </span>
            </div>
            <h1 className="text-4xl font-semibold text-espresso tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-espresso/60 text-sm font-medium">
              Start your curated clinical journey today.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[11px] uppercase tracking-wider text-espresso/70 font-bold ml-1">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Maya Alvarez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/50 border-white/40 focus:bg-white/80 transition-all duration-300 rounded-2xl h-12"
              />
            </div>
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
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-espresso/70 font-bold ml-1">Password</Label>
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
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Start Journey'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-espresso/5 text-center">
            <p className="text-espresso/60 text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
                Sign In
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

export default Signup;
