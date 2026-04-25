import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { User, Mail, Shield, Calendar, Loader2, Save, ArrowLeft, LogOut, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state with profile data when it loads
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUpdating(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL (or signed URL if private, but using public for rendering ease)
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      toast.success('Avatar updated successfully');
      
      // Force reload or state update would be better in a real app
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-espresso/40 font-serif italic">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Safe fallback for profile
  const displayProfile = profile || {
    email: user?.email || "User",
    full_name: "User",
    role: "user" as const,
    status: "active",
    avatar_url: null,
    created_at: new Date().toISOString(),
  };

  const initials = displayProfile.full_name && displayProfile.full_name !== "User"
    ? displayProfile.full_name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase()
    : displayProfile.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Background Elements to match branding */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #e2d1c3 0%, transparent 70%)' }}
        />
      </div>

      <nav className="relative z-20 px-6 py-6 border-b border-black/5 bg-white/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-espresso/60 hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="font-serif text-xl tracking-widest text-espresso uppercase opacity-80">
            Maya Alvarez
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => signOut(navigate)}
            className="text-espresso/40 hover:text-muted-rose gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </nav>
      
      <main className="flex-1 relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                Secure Account · {displayProfile.role}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-espresso">Your Studio Profile</h1>
            <p className="text-espresso/50 font-medium italic max-w-lg mx-auto">
              Manage your personal information and preferences for a seamless luxury experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar with Avatar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-sm text-center flex flex-col items-center">
                <div className="relative mb-6 group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <AvatarImage src={displayProfile.avatar_url || ""} alt={displayProfile.full_name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl font-serif">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-[2px]"
                  >
                    <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <input 
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUpdating}
                    />
                  </label>

                  <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md border border-black/5 z-10">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif text-espresso leading-tight">
                  {displayProfile.full_name || "User"}
                </h2>
                <p className="text-espresso/40 text-xs uppercase tracking-widest mt-2">
                  Member status: {displayProfile.status}
                </p>
                
                <div className="w-full mt-8 pt-8 border-t border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-bold leading-none">Joined</p>
                      <p className="text-sm font-medium text-espresso mt-1">
                        {displayProfile.created_at ? new Date(displayProfile.created_at).getFullYear() : '2026'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editing Form */}
            <div className="lg:col-span-8">
              <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-black/5 bg-black/[0.01]">
                   <h3 className="text-lg font-serif text-espresso flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                </div>
                <div className="p-8">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="full_name" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="How shall we address you?"
                          className="bg-white/50 border-espresso/10 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso text-lg font-light leading-relaxed px-5"
                        />
                        <p className="text-[10px] text-espresso/30 ml-2 italic">Your name accurately reflects on all clinical schedules.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                          Account Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            value={displayProfile.email}
                            disabled
                            className="bg-espresso/[0.03] border-espresso/5 rounded-2xl h-14 cursor-not-allowed text-espresso/40 font-medium px-5"
                          />
                          <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/10" />
                        </div>
                        <p className="text-[10px] text-espresso/30 ml-2 flex items-center gap-1.5 font-medium">
                          <Shield className="w-3 h-3" />
                          To maintain clinical security, email addresses are locked.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        type="submit" 
                        disabled={isUpdating}
                        className="w-full sm:w-auto px-12 h-14 bg-primary hover:bg-primary/95 text-white rounded-full shadow-[0_15px_40px_-8px_hsla(340,30%,48%,0.3)] hover:shadow-[0_20px_50px_-8px_hsla(340,30%,48%,0.5)] transition-all font-semibold text-base flex items-center gap-3 border border-white/10"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-10 border-t border-espresso/5 opacity-30 mt-12">
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-espresso">
          Clinical Excellence · Maya Alvarez Studio · Privacy First
        </p>
      </footer>
    </div>
  );
};

export default Profile;
