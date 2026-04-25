import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useBookingDemo } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { openBookingDemo } = useBookingDemo();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navLinks = [
    { label: "Results", id: "testimonials" },
    { label: "Services", id: "schedule" },
    { label: "Safety & FAQ", id: "logistics" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (sectionIds.includes(id)) {
              setActiveSection(id);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.4,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navLinks]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBook = () => {
    setMobileOpen(false);
    openBookingDemo();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/85 backdrop-blur-2xl border-b border-white/40 shadow-[0_15px_40px_-10px_rgba(40,25,18,0.08)]" 
          : "bg-gradient-to-b from-background/40 via-background/10 to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-20">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-espresso font-semibold text-lg sm:text-xl tracking-[0.15em] uppercase whitespace-nowrap transition-standard hover:opacity-80 active:scale-95 cursor-pointer"
            role="link"
            aria-label="Maya Alvarez Laser Studio - Home"
          >
            Maya Alvarez
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative group/nav ${
                    isActive
                      ? "text-primary"
                      : "text-espresso/70 hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover/nav:w-full"}`} />
                </button>
              );
            })}
            <div className="flex items-center gap-4">
              {profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 outline-none group">
                      <div className="flex flex-col items-end mr-1 hidden lg:flex">
                        <span className="text-[10px] font-bold text-espresso/80 leading-none">
                          {profile.full_name || 'My Account'}
                        </span>
                        <span className="text-[9px] text-espresso/40 uppercase tracking-widest leading-none mt-1">
                          {profile.role}
                        </span>
                      </div>
                      <Avatar className="w-9 h-9 border border-primary/20 transition-all duration-300 group-hover:border-primary/50 group-hover:scale-105 shadow-sm">
                        <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                        <AvatarFallback className="bg-primary/5 text-primary text-[11px] font-bold">
                          {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 bg-background/95 backdrop-blur-xl border-primary/10 shadow-xl rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                    <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-espresso/40 font-bold">
                      Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard/profile')}
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-espresso/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate(profile.role === 'admin' ? '/admin' : '/dashboard')}
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-espresso/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      {profile.role === 'admin' ? 'Admin' : 'Dashboard'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-primary/5" />
                    <DropdownMenuItem 
                      onClick={() => signOut(navigate)}
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-muted-rose hover:bg-muted-rose/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-[11px] tracking-widest uppercase font-bold text-espresso/70 hover:text-primary transition-all duration-300"
                  aria-label="Member login"
                >
                  Login
                </button>
              )}
              <Button
                size="sm"
                onClick={handleBook}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 h-10 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary/20 hover:shadow-primary/30"
              >
                Book Free Consult
              </Button>
            </div>
          </nav>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              size="sm"
              onClick={handleBook}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 text-xs font-semibold h-8 shadow-sm"
            >
              Consult
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground p-1 hover:text-primary transition-colors"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu + overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 sm:top-20 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm h-[calc(100vh-3.5rem)]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-background/98 backdrop-blur-md border-b border-border shadow-xl">
            <nav className="flex flex-col px-6 py-5 gap-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`text-sm py-2 tracking-widest uppercase text-left transition-colors border-b border-border/50 ${
                      isActive
                        ? "text-primary font-bold"
                        : "text-foreground font-medium hover:text-primary pl-2"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              {profile ? (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/dashboard/profile');
                    }}
                    className="text-sm py-3 tracking-widest uppercase text-left font-medium text-foreground hover:text-primary pl-2 border-b border-border/50 flex items-center gap-3"
                  >
                    <UserIcon className="w-4 h-4 text-primary/60" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(profile.role === 'admin' ? '/admin' : '/dashboard');
                    }}
                    className="text-sm py-3 tracking-widest uppercase text-left font-medium text-foreground hover:text-primary pl-2 border-b border-border/50 flex items-center gap-3"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary/60" />
                    {profile.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut(navigate);
                    }}
                    className="text-sm py-3 tracking-widest uppercase text-left font-medium text-muted-rose pl-2 border-b border-border/50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/auth/login');
                  }}
                  className="text-sm py-2 tracking-widest uppercase text-left font-medium text-foreground hover:text-primary pl-2 border-b border-border/50"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
