import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, BarChart3, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(340, 35%, 88%, 0.4) 0%, hsla(340, 35%, 88%, 0) 70%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(35, 30%, 84%, 0.4) 0%, hsla(35, 30%, 84%, 0) 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-espresso rounded-2xl flex items-center justify-center shadow-2xl shadow-espresso/20">
              <LayoutDashboard className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-4 h-px bg-primary/40" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                  Executive Suite
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-espresso tracking-tight">
                Clinic Command Center
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-full text-espresso/60 hover:text-espresso gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button 
              onClick={() => signOut(navigate)} 
              variant="outline" 
              className="rounded-full border-espresso/10 text-espresso hover:bg-espresso/5 gap-2 px-6"
            >
              <LogOut className="w-4 h-4 opacity-60" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Clients', value: '1,284', trend: '+12%', icon: Users },
            { label: 'Live Appointments', value: '42', trend: 'Stable', icon: Activity },
            { label: 'Studio Revenue', value: '$12,450', trend: '+8%', icon: BarChart3 }
          ].map((stat, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(45,35,30,0.05)] group hover:scale-[1.02] transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-espresso/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-espresso/70 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg uppercase tracking-tight">
                  {stat.trend}
                </span>
              </div>
              <p className="text-espresso/40 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <span className="text-4xl font-semibold text-espresso">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              <div className="px-8 py-6 border-b border-white/40 bg-white/20 flex justify-between items-center">
                <h3 className="font-semibold text-espresso">Management Overview</h3>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40" />
                  <span className="w-2 h-2 rounded-full bg-espresso/10" />
                  <span className="w-2 h-2 rounded-full bg-espresso/10" />
                </div>
              </div>
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-ivory/50 rounded-full border-2 border-dashed border-espresso/10 flex items-center justify-center">
                  <Activity className="w-10 h-10 text-espresso/10" />
                </div>
                <div>
                  <p className="text-xl font-medium text-espresso italic">Modules Generating...</p>
                  <p className="text-espresso/40 text-sm max-w-sm mt-2">The studio data integration engine is preparing detailed treatment charts and client histories.</p>
                </div>
                <Button variant="ghost" className="text-primary font-bold hover:bg-transparent hover:text-primary/70 underline underline-offset-4 decoration-primary/30">
                  Enable Legacy View
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm">
              <h4 className="text-xs uppercase tracking-widest font-bold text-espresso/40 mb-6">Recent Activity</h4>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-espresso italic">Client Booking</p>
                      <p className="text-xs text-espresso/50">Sarah J. finalized consultation 2m ago.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] text-center">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">System Status</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-espresso">Clinic Cloud: Online</span>
              </div>
              <p className="text-[10px] text-espresso/40 uppercase tracking-widest">v2.4.0 High-Performance</p>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-espresso/5 flex justify-between items-center opacity-30">
          <p className="text-[10px] tracking-[0.2em] uppercase text-espresso">Maya Alvarez Studio Control</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-espresso italic">Session-Bookr Integrated Platform</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
