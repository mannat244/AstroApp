"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { sanitizeOnboardingData } from "@/lib/sanitize";
import { rateLimiters } from "@/lib/rateLimit";

export default function OnboardingPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        gender: "",
        dob: "",
        birthCity: "",
        birthCountry: "India", // Default
        whatsapp: "",
    });

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (userProfile?.onboarded) {
                router.push("/dashboard");
            }
        }
    }, [user, userProfile, loading, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check rate limit
        const rateCheck = rateLimiters.formSubmit.checkLimit();
        if (!rateCheck.allowed) {
            alert(`Too many submission attempts. Please wait ${rateCheck.waitTime} seconds before trying again.`);
            return;
        }

        // Record the attempt
        if (!rateLimiters.formSubmit.attempt()) {
            alert("Rate limit exceeded. Please try again later.");
            return;
        }

        setIsLoading(true);

        try {
            // Sanitize all user inputs before saving
            const sanitizedData = sanitizeOnboardingData(formData);

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                ...sanitizedData,
                onboarded: true,
                updatedAt: new Date().toISOString(),
            });
            // Router will redirect via useEffect when userProfile updates
        } catch (error) {
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return null; // Or a sparkle loader

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 font-sans">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-primary-gold/10 via-primary-dark/5 to-transparent blur-3xl rounded-b-full opacity-50"></div>
            </div>

            <Card className="w-full max-w-md bg-surface border-white/5 relative z-10">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="size-12 rounded-full bg-primary-gold/10 flex items-center justify-center">
                            <Sparkles className="size-6 text-primary-gold" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
                    <CardDescription className="text-white/50">
                        To give you accurate readings, we need a few details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label className="text-white/80">Gender</Label>
                            <div className="flex gap-4">
                                {["Male", "Female", "Other"].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: g })}
                                        className={`flex-1 h-10 rounded-md border transition-colors text-sm font-medium ${formData.gender === g
                                            ? "bg-primary-gold text-black border-primary-gold"
                                            : "bg-transparent text-white border-white/20 hover:border-primary-gold/50"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-white/80">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                required
                                value={formData.dob}
                                onChange={handleChange}
                                className="bg-black/20 border-white/10 text-white focus:border-primary-gold/50"
                            />
                        </div>

                        {/* Place of Birth */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birthCity" className="text-white/80">Birth City</Label>
                                <Input
                                    id="birthCity"
                                    name="birthCity"
                                    placeholder="e.g. Mumbai"
                                    required
                                    value={formData.birthCity}
                                    onChange={handleChange}
                                    className="bg-black/20 border-white/10 text-white focus:border-primary-gold/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthCountry" className="text-white/80">Country</Label>
                                <div className="relative">
                                    <select
                                        id="birthCountry"
                                        name="birthCountry"
                                        value={formData.birthCountry}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary-gold/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {/* Custom Arrow */}
                                    <div className="absolute right-3 top-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-white/80">WhatsApp Number</Label>
                            <Input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                placeholder="+91 98765 43210"
                                required
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="bg-black/20 border-white/10 text-white focus:border-primary-gold/50"
                            />
                            <p className="text-[10px] text-white/40">Used for sharing session details only.</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={!formData.gender || isLoading}
                            className="w-full bg-primary-gold text-black hover:bg-primary-light font-bold"
                        >
                            {isLoading ? "Saving..." : "Continue to Dashboard"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
