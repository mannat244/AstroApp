"use client";

import { cn } from "@/lib/utils";

export function ServiceCard({ icon: Icon, title, description, actionText, onClick, imageSrc }) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer relative flex flex-col p-6 rounded-3xl bg-transparent backdrop-blur-md border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary-gold/30 hover:shadow-glow-gold h-full min-h-[200px]"
        >
            {/* Background Image & Gradient */}
            {imageSrc && (
                <>
                    <img
                        src={imageSrc}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent opacity-90" />
                </>
            )}

            {/* Background Gradient on Hover (if no image or additive) */}
            <div className={`absolute inset-0 bg-gradient-to-br from-primary-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${imageSrc ? 'mix-blend-overlay' : ''}`} />

            {/* Icon */}
            <div className="relative z-10 size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-auto transition-colors group-hover:bg-primary-gold/20 group-hover:border-primary-gold/20 backdrop-blur-sm">
                <Icon className="size-6 text-primary-gold" />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-4">
                <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
                <p className="text-white/60 text-xs line-clamp-2 mb-4">{description}</p>

                <span className="inline-flex items-center text-xs font-bold text-primary-gold uppercase tracking-wider group-hover:underline underline-offset-4">
                    {actionText || "View Details"}
                </span>
            </div>
        </div>
    );
}
