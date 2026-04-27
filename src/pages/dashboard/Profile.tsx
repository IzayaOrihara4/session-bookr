import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  User, Mail, Shield, Calendar, Loader2, Save, 
  ArrowLeft, LogOut, Camera, Phone, MapPin, 
  Home, Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [county, setCounty] = useState("");
  
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state with profile data when it loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setPhonePrefix(profile.phone_prefix || "");
      setDateOfBirth(profile.date_of_birth || "");
      setAddressLine1(profile.address_line_1 || "");
      setAddressLine2(profile.address_line_2 || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setPostalCode(profile.postal_code || "");
      setCountry(profile.country || "");
      setCounty(profile.county || "");
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
          phone,
          phone_prefix: phonePrefix,
          date_of_birth: dateOfBirth || null,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          city,
          state,
          postal_code: postalCode,
          country,
          county,
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

      // 2. Get Public URL
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
      {/* Subtle Background Elements */}
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
          <div className="font-serif text-xl tracking-widest text-espresso uppercase opacity-80 cursor-pointer" onClick={() => navigate('/')}>
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
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                Secure Account · {displayProfile.role}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-espresso">Profile Management</h1>
            <p className="text-espresso/50 font-medium italic max-w-lg mx-auto">
              Refine your personal details for a tailored clinical experience.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar with Avatar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-sm text-center flex flex-col items-center sticky top-8">
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
                  {fullName || "User"}
                </h2>
                <p className="text-espresso/40 text-xs uppercase tracking-widest mt-2">
                  {displayProfile.role} · {displayProfile.status}
                </p>
                
                <div className="w-full mt-8 pt-8 border-t border-black/5 space-y-6">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-bold leading-none">Joined</p>
                      <p className="text-sm font-medium text-espresso mt-1">
                        {displayProfile.created_at ? new Date(displayProfile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '2026'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-bold leading-none">Primary Email</p>
                      <p className="text-xs font-medium text-espresso mt-1 truncate">
                        {displayProfile.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full pt-8">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-2xl shadow-[0_10px_30px_-10px_hsla(340,30%,48%,0.4)] transition-all font-semibold flex items-center justify-center gap-3 border border-white/10"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Editing Form */}
            <div className="lg:col-span-8 space-y-8">
              {/* Personal Section */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-black/5 bg-black/[0.01]">
                   <h3 className="text-lg font-serif text-espresso flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="full_name" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Maya Alvarez"
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="dob" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        Date of Birth
                      </Label>
                      <div className="relative">
                        <Input
                          id="dob"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                        />
                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-3 space-y-3">
                      <Label htmlFor="prefix" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        Prefix
                      </Label>
                      <Input
                        id="prefix"
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        placeholder="+44"
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                    <div className="md:col-span-9 space-y-3">
                      <Label htmlFor="phone" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07700 900000"
                          className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                        />
                        <Phone className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                      Account Email
                    </Label>
                    <div className="relative group">
                      <Input
                        value={displayProfile.email}
                        disabled
                        className="bg-espresso/[0.03] border-black/5 rounded-2xl h-14 cursor-not-allowed text-espresso/40 font-medium px-5"
                      />
                      <Shield className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/10" />
                    </div>
                    <p className="text-[10px] text-espresso/30 ml-2 italic">
                      Email addresses are verified and cannot be changed manually.
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="px-8 py-6 border-b border-black/5 bg-black/[0.01]">
                   <h3 className="text-lg font-serif text-espresso flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Residential Address
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="addr1" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                      Address Line 1
                    </Label>
                    <Input
                      id="addr1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street address or P.O. box"
                      className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="addr2" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="addr2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="state" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        State / Province
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="zip" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        Postal / Zip Code
                      </Label>
                      <Input
                        id="zip"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="county" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                        County
                      </Label>
                      <Input
                        id="county"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="country" className="text-[11px] uppercase tracking-[0.15em] text-espresso/40 font-bold ml-1">
                      Country
                    </Label>
                    <div className="relative">
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="bg-white/50 border-black/5 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary transition-all text-espresso font-light px-5"
                      />
                      <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
