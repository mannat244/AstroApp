"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Data for the 9 Gems
const GEMS = [
    {
        order: "The First Divine",
        name: "RUBY",
        hindiName: "Manikya",
        color: "from-red-600 to-red-900",
        shape: "rounded-full", // Oval
        planet: "Sun",
        description: "Associated with the Sun, Ruby stimulates the root chakra and is believed to represent the soul, ego, and consciousness. It encourages feelings of love, passion, and confidence.",
        cssStyle: {
            background: "radial-gradient(circle at 30% 30%, #ff4d4d, #b30000, #4a0000)",
            boxShadow: "0 0 20px rgba(255, 0, 0, 0.4), inset -5px -5px 10px rgba(0,0,0,0.5)"
        }
    },
    {
        order: "The Second Divine",
        name: "YELLOW SAPPHIRE",
        hindiName: "Pukhraj",
        color: "from-yellow-400 to-yellow-600",
        shape: "rounded-lg", // Cushion
        planet: "Jupiter",
        description: "Associated with Jupiter, the planet of wisdom. It brings abundance, prosperity, and knowledge, stimulating the solar plexus chakra for personal power.",
        cssStyle: {
            background: "radial-gradient(ellipse at 40% 40%, #fffacd, #f0e68c, #daa520)",
            boxShadow: "0 0 25px rgba(255, 215, 0, 0.4), inset -2px -2px 8px rgba(0,0,0,0.2)"
        }
    },
    {
        order: "The Third Divine",
        name: "BLUE SAPPHIRE",
        hindiName: "Neelam",
        color: "from-blue-700 to-blue-950",
        shape: "rounded-[40%]", // Oval
        planet: "Saturn",
        description: "Linked to Saturn, it brings discipline, structure, and responsibility. It stimulates the throat chakra, aiding communication and self-expression.",
        cssStyle: {
            background: "radial-gradient(circle at 35% 35%, #4169e1, #000080, #000033)",
            boxShadow: "0 0 25px rgba(0, 0, 139, 0.4), inset -4px -4px 12px rgba(0,0,0,0.6)"
        }
    },
    {
        order: "The Fourth Divine",
        name: "EMERALD",
        hindiName: "Panna",
        color: "from-emerald-400 to-emerald-800",
        shape: "rounded-sm", // Emerald cut (rectangular)
        planet: "Mercury",
        description: "Associated with Mercury, representing intelligence and adaptability. It stimulates the heart chakra, fostering love, compassion, and emotional balance.",
        cssStyle: {
            background: "linear-gradient(135deg, #50c878 0%, #006400 100%)",
            boxShadow: "0 0 20px rgba(0, 128, 0, 0.4), inset 0 0 15px rgba(0,50,0,0.5)",
            clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" // Octagon/Emerald cut
        }
    },
    {
        order: "The Fifth Divine",
        name: "DIAMOND",
        hindiName: "Heera",
        color: "from-cyan-100 to-blue-200",
        shape: "rounded-full",
        planet: "Venus",
        description: "Representing Venus (love & beauty), Diamond is the stone of harmony. It stimulates the crown chakra, aiding spiritual connection and enlightenment.",
        cssStyle: {
            background: "conic-gradient(from 45deg, #e0faff, #ffffff, #cceeff, #ffffff, #e0faff)",
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.6), inset 0 0 10px rgba(255,255,255,0.8)",
            filter: "brightness(1.2)"
        }
    },
    {
        order: "The Sixth Divine",
        name: "PEARL",
        hindiName: "Moti",
        color: "from-gray-100 to-gray-300",
        shape: "rounded-full",
        planet: "Moon",
        description: "Associated with the Moon, Pearl brings emotional balance and stability. It soothes the mind and stimulates the sacral chakra for creativity.",
        cssStyle: {
            background: "radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0, #d3d3d3)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3), inset -10px -10px 20px rgba(0,0,0,0.1)"
        }
    },
    {
        order: "The Seventh Divine",
        name: "RED CORAL",
        hindiName: "Moonga",
        color: "from-orange-500 to-red-600",
        shape: "rounded-full", // Organic
        planet: "Mars",
        description: "Linked to Mars, representing energy and strength. Coral stimulates the root chakra and is grounding, balancing body energies.",
        cssStyle: {
            background: "radial-gradient(circle at 40% 40%, #ff7f50, #cd5c5c, #8b0000)",
            boxShadow: "inset -5px -5px 15px rgba(0,0,0,0.3)" // Matte finish
        }
    },
    {
        order: "The Eighth Divine",
        name: "HESSONITE",
        hindiName: "Gomedh",
        color: "from-orange-700 to-amber-900",
        shape: "rounded-xl",
        planet: "Rahu",
        description: "Associated with Rahu, it brings clarity and discernment, cutting through illusion. Believed to stimulate the third eye intuition.",
        cssStyle: {
            background: "radial-gradient(circle at 50% 30%, #d2691e, #8b4513, #3e1e07)",
            boxShadow: "0 0 15px rgba(210, 105, 30, 0.3), inset -2px -2px 10px rgba(0,0,0,0.5)"
        }
    },
    {
        order: "The Ninth Divine",
        name: "CAT'S EYE",
        hindiName: "Lehsunia",
        color: "from-yellow-700 to-green-900",
        shape: "rounded-full",
        planet: "Ketu",
        description: "Linked to Ketu, representing spiritual detachment. It stimulates the crown chakra and spiritual awakening. Features a distinct light ray.",
        cssStyle: {
            background: "linear-gradient(105deg, #556b2f 45%, #fffacd 50%, #556b2f 55%)", // Cat's eye slit effect
            boxShadow: "0 0 15px rgba(85, 107, 47, 0.4), inset 0 0 10px rgba(0,0,0,0.6)"
        }
    }
];

export default function GemstonesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [selectedGem, setSelectedGem] = useState(GEMS[0]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    return (
        <main className=" px-4 py-8 md:px-12 md:py-5 max-w-7xl mx-auto flex flex-col h-fit  md:h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex-none mb-6">


                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-primary-gold font-bold tracking-[0.2em] uppercase text-xs block mb-1">The Navratnas</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Divine Gemstones</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-6 md:gap-8 min-h-0">

                {/* Master List - Scrollable */}
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0 pr-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {GEMS.map((gem) => (
                        <button
                            key={gem.name}
                            onClick={() => setSelectedGem(gem)}
                            className={cn(
                                "flex-none w-[80px] md:w-full flex md:flex-row flex-col text-wrap items-center gap-3 p-3 rounded-2xl border transition-all duration-300 snap-start group",
                                selectedGem.name === gem.name
                                    ? "bg-neutral-900/5 border-primary-gold/40 shadow-[0_0_15px_-3px_rgba(255,215,0,0.1)]"
                                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                            )}
                        >
                            {/* Mini CSS Gem */}
                            <div
                                className={cn("size-8 md:size-10 rounded-full shadow-inner flex-none transition-transform duration-300 group-hover:scale-110", gem.shape)}
                                style={{
                                    ...gem.cssStyle,
                                    boxShadow: 'none',
                                    filter: selectedGem.name === gem.name ? 'none' : 'grayscale(0.3) opacity(0.7)', // Dim inactive gems slightly
                                }}
                            />

                            <div className="text-center md:text-left overflow-hidden w-full">
                                <h3 className={cn(
                                    "font-bold text-[10px] md:text-sm leading-tight transition-colors",
                                    selectedGem.name === gem.name ? "text-primary-gold" : "text-white/40 group-hover:text-white/80"
                                )}>
                                    {gem.name}
                                </h3>
                                <p className="hidden md:block text-[9px] text-white/20 uppercase tracking-widest group-hover:text-white/30">{gem.hindiName}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail View - Sleek Glass Panel */}
                <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {/* Background Glow based on gem color */}
                    <div className={cn("absolute inset-0 opacity-[0.15] bg-gradient-to-br transition-all duration-1000 pointer-events-none rounded-[2rem]", selectedGem.color)} />

                    {/* Left: The Gemstone Showcase */}
                    <div className="flex-none flex flex-col items-center justify-center w-full md:w-1/3 py-4 md:py-12">
                        <div className="relative">
                            {/* Rotating Ring Decoration */}
                            <div className="absolute inset-0 border border-white/10 rounded-full animate-slow-spin scale-150" />
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-reverse-spin scale-[1.8]" />

                            {/* Main CSS Gem */}
                            <div
                                key={selectedGem.name} // Force re-render for animation
                                className={cn("size-40 md:size-56 transition-all duration-700 hover:scale-105 animate-in zoom-in-50 duration-500", selectedGem.shape)}
                                style={selectedGem.cssStyle}
                            />
                        </div>
                        <h3 className="mt-8 text-primary-gold font-serif italic text-xl md:text-2xl">{selectedGem.hindiName}</h3>
                    </div>

                    {/* Right: The Info */}
                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <span className="text-primary-gold/60 text-xs font-bold uppercase tracking-widest mb-2 block">{selectedGem.order}</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{selectedGem.name}</h2>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="text-white/40 text-xs uppercase mr-2">Planet</span>
                                <span className="text-white font-bold">{selectedGem.planet}</span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="text-white/40 text-xs uppercase mr-2">Chakra</span>
                                <span className="text-white font-bold">Activated</span>
                            </div>
                        </div>

                        <div className="prose prose-invert">
                            <p className="text-white/70 text-lg leading-relaxed font-light">
                                {selectedGem.description}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/40 uppercase mb-1">Authenticity</p>
                                <p className="text-primary-gold font-bold">100% Certified</p>
                            </div>
                            <button
                                onClick={() => router.push("/book")}
                                className="bg-primary-gold text-bg-dark px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-glow-gold"
                            >
                                Enquire Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
