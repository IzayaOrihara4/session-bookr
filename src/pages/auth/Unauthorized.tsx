import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleBack = () => {
    if (profile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl opacity-20"
          style={{ background: 'hsla(340, 35%, 88%, 1)' }}
        />
        <div
          className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl opacity-20"
          style={{ background: 'hsla(35, 30%, 84%, 1)' }}
        />
      </div>

      <div className="w-full max-w-md text-center relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(45,35,30,0.1)] border border-white/60">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-primary/40" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Security Protocol
              </span>
            </div>
            <h1 className="text-4xl font-semibold text-espresso tracking-tight">
              Access Restricted
            </h1>
            <p className="text-espresso/60 max-w-[280px] mx-auto text-sm leading-relaxed">
              Your current credentials do not have permission to access the Executive Suite.
            </p>
          </div>

          <Button 
            onClick={handleBack}
            className="bg-espresso hover:bg-espresso/90 text-ivory rounded-full px-10 py-7 text-base font-semibold shadow-xl shadow-espresso/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back to Dashboard
          </Button>
          
          <div className="mt-12 pt-8 border-t border-espresso/5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-espresso/30">
              Maya Alvarez Laser Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
