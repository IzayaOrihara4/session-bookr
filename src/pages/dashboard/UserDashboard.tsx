import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Gift, LogOut, User as UserIcon, Wallet } from 'lucide-react';

const UserDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(340, 35%, 88%, 0.6) 0%, hsla(340, 35%, 88%, 0) 70%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(35, 30%, 84%, 0.5) 0%, hsla(35, 30%, 84%, 0) 70%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-primary/40" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Member Portal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-espresso tracking-tight">
              Welcome, <span className="text-primary italic font-light">{profile?.full_name?.split(' ')[0] || 'Guest'}</span>
            </h1>
          </div>
          <Button 
            onClick={() => signOut(navigate)} 
            variant="outline" 
            className="rounded-full border-espresso/10 text-espresso hover:bg-espresso/5 gap-2 px-6"
          >
            <LogOut className="w-4 h-4 opacity-60" />
            Sign Out
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Appointment Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(45,35,30,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                <Calendar className="w-32 h-32 text-espresso" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-espresso mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Your Next Session
                </h2>
                <div className="p-10 bg-ivory/40 rounded-3xl border border-white/40 flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-espresso/40 font-medium italic">No upcoming appointments scheduled.</p>
                  <Button className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-full px-10 h-14 text-base font-semibold shadow-[0_20px_50px_-12px_hsla(340,30%,48%,0.4)] hover:shadow-[0_25px_60px_-12px_hsla(340,30%,48%,0.6)] transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] border border-white/20">
                    Schedule Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-espresso">Wallet & Credits</h3>
                </div>
                <p className="text-espresso/60 text-sm leading-relaxed">
                  You have <span className="text-espresso font-bold">$0.00</span> in studio credits and <span className="text-primary font-bold">450</span> loyalty points.
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-espresso">Member Perk</h3>
                </div>
                <p className="text-espresso/60 text-sm leading-relaxed">
                  Refer a friend and you both receive <span className="text-primary font-bold">$25</span> toward your next laser session.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Sidebar */}
          <div className="space-y-8">
            <div className="bg-espresso text-ivory p-8 rounded-[2.5rem] shadow-2xl shadow-espresso/20 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl mb-6 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{profile?.full_name}</h3>
                <p className="text-ivory/60 text-xs tracking-widest uppercase mb-8">{profile?.status} Member</p>
                
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm text-ivory/80">
                    <span className="opacity-60">Email</span>
                    <span className="font-medium">{profile?.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-ivory/80">
                    <span className="opacity-60">Member Since</span>
                    <span className="font-medium">2024</span>
                  </div>
                </div>

                <Button variant="link" className="text-primary p-0 h-auto mt-8 font-bold hover:no-underline hover:text-primary/80 transition-colors">
                  Edit Studio Profile →
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-espresso/5 flex justify-between items-center opacity-40">
          <p className="text-[10px] tracking-[0.2em] uppercase text-espresso">Maya Alvarez Laser Studio</p>
          <div className="h-px bg-espresso/20 flex-grow mx-8" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-espresso">Clinical Precision · Aesthetic Luxury</p>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
