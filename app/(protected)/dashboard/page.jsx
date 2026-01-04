"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { InstallPrompt } from "@/components/install-prompt";
import { useEffect, useState } from "react";

import { ServiceCard } from "@/components/service-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Sparkles,
    Briefcase,
    Video,
    Gem,
    Heart,
    TrendingUp,
    GraduationCap,
    HeartPulse,
    Coins,
    Home,
    Building2
} from "lucide-react";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [greeting, setGreeting] = useState("Good Day");

    useEffect(() => {
        const hour = new Date().getHours();

        let timeGreeting = "Good Day";
        if (hour < 12) timeGreeting = "Good Morning";
        else if (hour < 18) timeGreeting = "Good Afternoon";
        else timeGreeting = "Good Evening";

        setGreeting(timeGreeting);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    const firstName = user.displayName?.split(" ")[0] || "Star Child";

    // Quick Access Data
    const quickServices = [
        { name: "Kundali Matching", icon: Heart, path: "/book?category=astrology&service=Kundali+Matching" },
        { name: "Career Growth", icon: TrendingUp, path: "/book?category=astrology&service=Astrology+for+Career+Growth" },
        { name: "Education", icon: GraduationCap, path: "/book?category=astrology&service=Astrology+for+Education" },
        { name: "Health Issues", icon: HeartPulse, path: "/book?category=astrology&service=Astrology+for+Health" },
        { name: "Love Problems", icon: Heart, path: "/book?category=astrology&service=Astrology+for+Love+Problem" },
        { name: "Wealth & Finance", icon: Coins, path: "/book?category=astrology&service=Astrology+for+Wealth" },
        { name: "Vastu Residence", icon: Home, path: "/book?category=vastu&service=Vastu+Shastra+Consultants+For+Residence" },
        { name: "Vastu Office", icon: Building2, path: "/book?category=vastu&service=Vastu+Shastra+Consultants+For+Property" },
    ];

    return (
        <main className="px-6 py-8 md:px-12 md:py-10 max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-gradient-to-br from-primary-gold to-primary-dark p-[1px]">
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${firstName}&background=D4AF37&color=000`}
                            alt={firstName}
                            className="w-full h-full rounded-full object-cover border-2 border-bg-dark"
                        />
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">{greeting} {firstName}</p>
                        <h1 className="text-white text-2xl font-bold">The stars align for you.</h1>
                    </div>
                </div>
            </header>

            {/* Image Carousel */}
            <section className="mb-12">
                <Carousel className="w-full max-w-2xl mx-auto">
                    <CarouselContent>
                        <CarouselItem>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary-gold/20">
                                <img
                                    src="/vinnay-raaj-profile.png"
                                    alt="Vinnay Raj - Astrology Expert"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-8 px-6 pt-16">
                                    <h3 className="text-white text-xl font-bold">Expert Astrologer</h3>
                                    <p className="text-white/70 text-sm">Vinnay Raj - Your Guide to the Stars</p>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary-gold/20">
                                <img
                                    src="/vinnay.png"
                                    alt="Vinnay Raj - Vedic Astrology"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-8 px-6 pt-16">
                                    <h3 className="text-white text-xl font-bold">Vedic Wisdom</h3>
                                    <p className="text-white/70 text-sm">Ancient Knowledge, Modern Solutions</p>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary-gold/20">
                                <img
                                    src="/book.png"
                                    alt="Vinnay Raj - Professional Consultation"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-8 px-6 pt-16">
                                    <h3 className="text-white text-xl font-bold">Professional Guidance</h3>
                                    <p className="text-white/70 text-sm">Personalized Consultations</p>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 md:-left-12" />
                    <CarouselNext className="-right-4 md:-right-12" />
                </Carousel>
            </section>

            {/* Quick Services Grid */}
            <section className="mb-12">
                <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="size-4 text-primary-gold" />
                    Quick Services
                </h2>
                <div className="grid grid-cols-4 gap-4">
                    {quickServices.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary-gold/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
                            >
                                <IconComponent className="size-6 text-primary-gold/80 group-hover:text-primary-gold group-hover:scale-110 transition-all" />
                                <span className="text-xs font-bold text-white/80 group-hover:text-primary-gold text-center">{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Featured Section */}
            <section>
                <h2 className="text-white text-lg font-bold mb-4">Featured Consultations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ServiceCard
                        title="Book Appointment"
                        description="In-person readings & chart analysis with expert astrologers."
                        icon={Briefcase}
                        actionText="Book Now"
                        onClick={() => router.push("/book?mode=in-person")}
                        imageSrc="/assets/dashboard/appointment.png"
                    />
                    <ServiceCard
                        title="Video Consultation"
                        description="Connect remotely from the comfort of your home."
                        icon={Video}
                        actionText="Schedule Call"
                        onClick={() => router.push("/book?mode=online")}
                        imageSrc="/assets/dashboard/video.png"
                    />
                    <ServiceCard
                        title="Gemstone Guide"
                        description="Find the stones that heal and amplify your energy."
                        icon={Gem}
                        actionText="Explore Stones"
                        imageSrc="/assets/dashboard/gems.png"
                        onClick={() => router.push("/gemstones")}
                    />
                </div>
            </section>
            <InstallPrompt />
        </main>
    );
}
