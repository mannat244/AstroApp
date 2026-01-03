"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        // Check if already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        // Show prompt after 3 seconds if not installed
        if (!standalone) {
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (isStandalone || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5">
            <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
                <X className="size-4" />
            </button>

            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Install Astro Booking</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                        {isIOS
                            ? "Tap the share button and select 'Add to Home Screen'"
                            : "Install our app for quick access to astrology services"
                        }
                    </p>

                    {!isIOS && (
                        <Button
                            size="sm"
                            className="w-full"
                            onClick={() => setShowPrompt(false)}
                        >
                            Got it
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
