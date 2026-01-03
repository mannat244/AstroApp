"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Sparkles, LogOut, Mail, User as UserIcon, MapPin, Calendar, Phone, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        gender: "",
        dob: "",
        birthCity: "",
        birthCountry: "India",
        whatsapp: "",
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
        if (userProfile) {
            setFormData({
                gender: userProfile.gender || "",
                dob: userProfile.dob || "",
                birthCity: userProfile.birthCity || "",
                birthCountry: userProfile.birthCountry || "India",
                whatsapp: userProfile.whatsapp || "",
            });
        }
    }, [user, userProfile, loading, router]);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                ...formData,
                updatedAt: new Date().toISOString(),
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Revert to original data
        if (userProfile) {
            setFormData({
                gender: userProfile.gender || "",
                dob: userProfile.dob || "",
                birthCity: userProfile.birthCity || "",
                birthCountry: userProfile.birthCountry || "India",
                whatsapp: userProfile.whatsapp || "",
            });
        }
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (loading || !user) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    const firstName = user.displayName?.split(" ")[0] || "Star Child";

    return (
        <main className="px-6 py-8 md:px-12 md:py-10 max-w-md mx-auto flex flex-col items-center">

            {/* Profile Card */}
            <div className="w-full bg-surface border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary-gold/10 to-transparent pointer-events-none" />

                {/* Edit Toggle */}
                <div className="absolute top-4 right-4 z-20">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/60 hover:text-primary-gold transition-colors">
                            <Edit2 className="size-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleCancel} disabled={isSaving} className="p-2 bg-red-500/10 rounded-full hover:bg-red-500/20 text-red-400 transition-colors">
                                <X className="size-4" />
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="p-2 bg-green-500/10 rounded-full hover:bg-green-500/20 text-green-400 transition-colors">
                                <Save className="size-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="relative z-10 size-24 rounded-full bg-gradient-to-br from-primary-gold to-primary-dark p-[2px] mb-4 shadow-glow-gold">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${firstName}&background=D4AF37&color=000`}
                        alt={user.displayName}
                        className="w-full h-full rounded-full object-cover border-4 border-bg-dark"
                    />
                </div>

                {/* Name & Email */}
                <h2 className="relative z-10 text-white text-xl font-bold mb-1">{user.displayName || "Star Child"}</h2>
                <p className="relative z-10 text-white/40 text-sm mb-6 flex items-center gap-2">
                    <Mail className="size-3" />
                    {user.email}
                </p>

                <div className="w-full h-px bg-white/5 my-4" />

                {/* Extended Details */}
                <div className="w-full text-left space-y-4 relative z-10 mb-8">
                    {/* Gender */}
                    <div className="space-y-1">
                        <Label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon className="size-3" /> Gender
                        </Label>
                        {isEditing ? (
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white text-sm focus:border-primary-gold/50 outline-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className="text-white text-sm font-medium pl-5">{formData.gender || "Not set"}</p>
                        )}
                    </div>

                    {/* DOB */}
                    <div className="space-y-1">
                        <Label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="size-3" /> Date of Birth
                        </Label>
                        {isEditing ? (
                            <Input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="h-9 bg-black/20 border-white/10 text-white text-sm"
                            />
                        ) : (
                            <p className="text-white text-sm font-medium pl-5">{formData.dob || "Not set"}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <Label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="size-3" /> Birth Place
                        </Label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Input
                                    name="birthCity"
                                    placeholder="City"
                                    value={formData.birthCity}
                                    onChange={handleChange}
                                    className="h-9 bg-black/20 border-white/10 text-white text-sm"
                                />
                                <select
                                    name="birthCountry"
                                    value={formData.birthCountry}
                                    onChange={handleChange}
                                    className="bg-black/20 border border-white/10 rounded-md p-2 text-white text-sm focus:border-primary-gold/50 outline-none"
                                >
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        ) : (
                            <p className="text-white text-sm font-medium pl-5">
                                {formData.birthCity ? `${formData.birthCity}, ` : ""}{formData.birthCountry}
                            </p>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                        <Label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="size-3" /> WhatsApp
                        </Label>
                        {isEditing ? (
                            <Input
                                type="tel"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="h-9 bg-black/20 border-white/10 text-white text-sm"
                            />
                        ) : (
                            <p className="text-white text-sm font-medium pl-5">{formData.whatsapp || "Not set"}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full">
                    <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full h-12 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 text-white/60 hover:text-red-400 group cursor-pointer"
                    >
                        <LogOut className="size-4 group-hover:scale-110 transition-transform" />
                        {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>
                </div>
            </div>

            <p className="mt-8 text-white/20 text-xs">
                Astro App v0.1.0 • Connected to Firebase
            </p>

        </main>
    );
}
