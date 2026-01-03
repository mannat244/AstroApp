"use client";

import { CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SERVICES_DATA } from "@/data/services";

export function ServiceSelection({
    selectedCategory,
    handleCategoryChange,
    selectedService,
    handleServiceSelect,
    onNext
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl mx-auto pb-40 md:pb-0">
            <Tabs
                defaultValue={selectedCategory}
                onValueChange={handleCategoryChange}
                value={selectedCategory}
                className="w-full flex flex-col items-center"
            >
                {/* Tabs Navigation */}
                <TabsList className="bg-black/50 border border-white/10 p-1.5 rounded-full h-auto gap-2 mb-8 sticky top-4 z-30 backdrop-blur-xl shadow-2xl flex-wrap justify-center">
                    {Object.values(SERVICES_DATA).map((cat) => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                            className="rounded-full px-4 md:px-6 py-2 text-xs md:text-sm font-bold data-[state=active]:bg-primary-gold data-[state=active]:text-black text-white/50 hover:text-white transition-all uppercase tracking-wide"
                        >
                            {cat.title.replace(" Services", "")}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Service Cards Grid - Scrollable Container */}
                {Object.values(SERVICES_DATA).map((cat) => (
                    <TabsContent key={cat.id} value={cat.id} className="w-full">
                        <RadioGroup
                            value={selectedService?.id}
                            onValueChange={handleServiceSelect}
                            className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                        >
                            {cat.items.map((item) => (
                                <div key={item.id} className="relative group">
                                    <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                                    <Label
                                        htmlFor={item.id}
                                        className={cn(
                                            "flex flex-col h-full p-4 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm relative overflow-hidden group-hover:bg-white/10",
                                            selectedService?.id === item.id
                                                ? "border-primary-gold bg-primary-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                                                : "border-white/5 hover:border-primary-gold/30"
                                        )}
                                    >
                                        {/* Selection Checkbox Visual */}
                                        <div className={cn(
                                            "absolute top-3 right-3 md:top-5 md:right-5 size-4 md:size-5 rounded-full border flex items-center justify-center transition-colors",
                                            selectedService?.id === item.id ? "border-primary-gold bg-primary-gold text-black" : "border-white/20 bg-transparent"
                                        )}>
                                            {selectedService?.id === item.id && <CheckCircle className="size-3 md:size-3.5" />}
                                        </div>

                                        <div className="mb-3 md:mb-4 pr-6 md:pr-8">
                                            <h3 className={cn("text-base md:text-lg font-bold mb-1.5 leading-tight transition-colors", selectedService?.id === item.id ? "text-primary-gold" : "text-white")}>
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-3 md:pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-1">
                                            {/* Price - Hidden on Mobile (shown in footer), Visible on Desktop */}
                                            <div className="hidden md:flex items-center gap-2 md:gap-3">
                                                <span className="text-lg md:text-xl font-bold text-white">₹{item.price}</span>
                                                <span className="text-[10px] md:text-xs text-white/40 line-through decoration-red-500/50">₹{item.originalPrice}</span>
                                            </div>
                                            {/* Discount Badge - Always Visible */}
                                            <span className="hidden h-fit md:block text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 md:py-1 rounded-full uppercase tracking-wider w-fit">
                                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Floating Action Bar (Mobile: Price + Button, Desktop: Button Only) */}
            <div className="fixed bottom-20 left-0 right-0 p-4 pt-10 z-40 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent md:static md:bg-none md:p-0 md:mt-12">
                <div className="flex items-center justify-between md:justify-center gap-4 max-w-5xl mx-auto">

                    {/* Mobile Price Display */}
                    <div className="md:hidden">
                        {selectedService ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-white/40 line-through">₹{selectedService.originalPrice}</span>
                                <span className="text-xl font-bold text-primary-gold">₹{selectedService.price}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-white/40">Select Service</span>
                        )}
                    </div>

                    <Button
                        onClick={onNext}
                        disabled={!selectedService}
                        className={cn(
                            "bg-primary-gold text-black rounded-full px-8 md:px-24 py-6 text-base md:text-lg font-bold shadow-glow-gold hover:scale-105 hover:bg-primary-gold transition-all flex items-center justify-center gap-2 ml-auto md:ml-0 md:min-w-[300px]",
                            !selectedService ? "opacity-50 cursor-not-allowed" : "opacity-100 scale-100"
                        )}
                    >
                        Continue <ChevronRight className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
