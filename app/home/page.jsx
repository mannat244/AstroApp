"use client";

import { useRouter } from "next/navigation";
import { Sparkles, MapPin, Award, CheckCircle, Smartphone, Instagram, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reviews } from "@/components/reviews";

export default function HomePage() {
    const router = useRouter();

    const services = [
        { title: "Kundli Analysis", icon: Sparkles, desc: "Detailed life predictions" },
        { title: "Vastu Shastra", icon: MapPin, desc: "Harmonize your space" },
        { title: "Vedic Rituals", icon: Award, desc: "Remedies for peace" },
    ];

    return (
        <div className="min-h-screen bg-bg-dark text-white font-sans overflow-x-hidden">

            <main className="relative z-10">

                {/* Top Logo / Brand */}
                <div className="absolute top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary-gold flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        <span className="text-black font-bold text-xl font-serif">VR</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold tracking-widest leading-none">VINNAY RAAJ</span>
                        <span className="text-primary-gold text-[0.6rem] uppercase tracking-[0.3em] font-medium">Astro & Vastu</span>
                    </div>
                </div>

                {/* --- HERO SECTION (Split Layout) --- */}
                <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-24 md:py-0 relative">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none opacity-50" />

                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 mb-12 md:mb-0 relative py-12">
                        <div className="relative">
                            <div className="w-[280px] h-[350px] md:w-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/10 relative z-10 shadow-2xl shadow-primary-gold/10">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <img
                                    src="/vinnay-raaj-profile.png"
                                    alt="Vinnay Raaj"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2 px-4 inline-flex items-center gap-2">
                                        <CheckCircle className="size-4 text-green-400 fill-green-400/20" />
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Astro Expert</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Ring */}
                            <div className="absolute -top-6 -right-6 w-full h-full rounded-[3rem] border-2 border-primary-gold/30 z-0" />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                        <div>
                            <span className="text-primary-gold font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-2 block">Astro & Vastu</span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-white tracking-tighter mb-4">
                                VINNAY <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-gold to-primary-light">RAAJ</span>
                            </h1>
                            <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto md:mx-0 font-light leading-relaxed">
                                Unlocking destiny through ancient Vedic wisdom. Trusted by thousands for life-changing guidance.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="h-14 px-8 bg-primary-gold text-black text-lg font-bold rounded-full shadow-lg shadow-primary-gold/20 hover:bg-white hover:scale-105 transition-all"
                            >
                                Book Consultation
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- DIVIDER --- */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

                {/* --- WHY PEOPLE TRUST (Achievements) --- */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Image */}
                        <div className="relative order-2 md:order-1 max-w-md mx-auto md:ml-0">
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl shadow-primary-gold/5 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-40" />
                                <img
                                    src="/vinnay.png"
                                    alt="Trusted Astrologer"
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-[200px]">
                                    <p className="text-primary-gold font-bold text-2xl">50k+</p>
                                    <p className="text-white/60 text-xs uppercase tracking-wider">Lives Transformed</p>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -z-10 top-12 -left-12 w-full h-full border border-white/5 rounded-[2.5rem]" />
                        </div>

                        {/* Right: Content */}
                        <div className="order-1 md:order-2 space-y-8 text-center md:text-left">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <div className="h-px w-8 bg-primary-gold" />
                                    <span className="text-primary-gold font-bold tracking-[0.2em] uppercase text-xs">Why Choose Vinnay Raaj</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    Trusted by Families <br /> <span className="text-white/40">Across Generations.</span>
                                </h2>
                                <p className="text-white/60 text-lg leading-relaxed">
                                    With over two decades of experience, Vinnay Raaj combines ancient Vedic wisdom with modern practical solutions. His guidance has helped thousands navigate life's complexities with clarity and confidence.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Highlights - No Card Style */}
                                <div className="flex flex-col gap-2">
                                    <Award className="size-8 text-primary-gold mb-2" />
                                    <h4 className="text-xl font-bold text-white">GEA Winner</h4>
                                    <p className="text-white/50 text-sm leading-relaxed">Awarded "Best Astrologer in Madhya Pradesh" for accuracy and excellence.</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Sparkles className="size-8 text-primary-gold mb-2" />
                                    <h4 className="text-xl font-bold text-white">24+ Years</h4>
                                    <p className="text-white/50 text-sm leading-relaxed">Decades of professional experience guiding individuals towards success.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SERVICES (Static Center Layout) --- */}
                <section className="py-20 px-6 relative overflow-hidden flex flex-col items-center justify-center">
                    {/* Section Header */}
                    <div className="text-center mb-16 relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-px w-8 bg-primary-gold" />
                            <span className="text-primary-gold font-bold tracking-[0.2em] uppercase text-xs">Services & Expertise</span>
                            <div className="h-px w-8 bg-primary-gold" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Holistic Vedic Solutions</h2>
                        <p className="text-white/50 max-w-2xl mx-auto">Comprehensive guidance to align your life with cosmic rhythms.</p>
                    </div>

                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-12 md:gap-20">

                        {/* Left Services */}
                        <div className="space-y-8 text-center md:text-right order-2 md:order-1">
                            {[
                                { title: "Kundli Analysis", desc: "Birth Chart Reading" },
                                { title: "Vastu Shastra", desc: "Home & Office Harmony" },
                                { title: "Vedic Rituals", desc: "Dosha Nivarana" },
                                { title: "Face Reading", desc: "Physiognomy Insights" }
                            ].map((s, i) => (
                                <div key={i} className="group flex flex-col items-center md:items-end">
                                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-gold transition-colors cursor-default">{s.title}</h3>
                                    <div className="h-px w-12 bg-white/10 my-2 group-hover:bg-primary-gold/50 transition-colors" />
                                    <p className="text-white/40 text-sm uppercase tracking-wider">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Center Image */}
                        <div className="relative z-10 w-[300px] h-[300px] md:w-[450px] md:h-[450px] mx-auto order-1 md:order-2">
                            <img
                                src="/magic-vinnay.png"
                                alt="Vinnay Raaj"
                                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.2)] md:-translate-x-9"
                            />
                            {/* Subtle Glow Behind */}
                            <div className="absolute inset-0 bg-primary-gold/10 blur-[100px] rounded-full -z-10" />
                        </div>

                        {/* Right Services */}
                        <div className="space-y-8 text-center md:text-left order-3">
                            {[
                                { title: "Gemstones", desc: "Aura Enhancement" },
                                { title: "Numerology", desc: "Power of Numbers" },
                                { title: "Match Making", desc: "Compatibility Check" },
                                { title: "Career Path", desc: "Professional Growth" }
                            ].map((s, i) => (
                                <div key={i} className="group flex flex-col items-center md:items-start">
                                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-gold transition-colors cursor-default">{s.title}</h3>
                                    <div className="h-px w-12 bg-white/10 my-2 group-hover:bg-primary-gold/50 transition-colors" />
                                    <p className="text-white/40 text-sm uppercase tracking-wider">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* --- REVIEWS --- */}
                <Reviews />

                {/* --- FOOTER CTA --- */}
                <section className="py-20 px-6 text-center bg-gradient-to-t from-primary-gold/10 to-transparent">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to change your destiny?</h2>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="h-16 px-10 bg-primary-gold text-black text-xl font-bold rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:bg-white hover:scale-105 transition-all"
                    >
                        Start Your Journey
                    </Button>
                </section>

            </main>
        </div >
    );
}
