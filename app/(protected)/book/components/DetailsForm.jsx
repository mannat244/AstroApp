"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label"; // Keep for radio group labels if needed
import { cn } from "@/lib/utils";

export function DetailsForm({
    isVastu,
    beneficiary,
    setBeneficiary,
    formData,
    setFormData,
    onBack,
    onNext
}) {
    const [error, setError] = useState("");

    // Shared Input Styles - Standard Size & Premium Feel
    // User requested "standard sizes" -> h-10 (40px) is standard. h-12 was 48px.
    const inputClasses = "bg-neutral-900 border-white/20 h-10 text-white placeholder:text-white/40 focus:ring-1 focus:ring-primary-gold focus:border-primary-gold transition-all text-sm";

    // Field Label custom style to match previous look
    const labelClasses = "text-white/80 font-medium text-sm";

    const handleContinue = () => {
        setError("");
        let isValid = true;

        if (isVastu) {
            if (!formData.propertySize) isValid = false;
        } else {
            if (!formData.name || !formData.dob || !formData.timeOfBirth || !formData.placeOfBirth) {
                isValid = false;
            }

            // Date Validation
            if (formData.dob) {
                const dobDate = new Date(formData.dob);
                const year = dobDate.getFullYear();
                const currentYear = new Date().getFullYear();

                if (year < 1900 || year > currentYear) {
                    setError("Please enter a valid birth year (1900 - Present).");
                    return; // Stop here
                }

                // Check for invalid dates like "4558" or strictly valid js dates that might still be logically wrong
                if (isNaN(dobDate.getTime())) {
                    setError("Invalid date format.");
                    return;
                }
            }
        }

        if (isValid) {
            onNext();
        } else {
            setError("Please fill in all required fields to proceed.");
        }
    };

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
                    {isVastu ? "Property Details" : "Your Details"}
                </h2>

                {/* Toggle for Astro Only */}
                {!isVastu && (
                    <div className="flex bg-black/60 p-1.5 rounded-xl mb-8 border border-white/10">
                        <button
                            onClick={() => setBeneficiary("self")}
                            className={cn("flex-1 py-2.5 rounded-lg border-none text-sm font-bold transition-all", beneficiary === "self" ? "bg-white/10 text-primary-gold shadow-md border border-white/5" : "text-white/40 hover:text-white")}
                        >
                            For Me
                        </button>
                        <button
                            onClick={() => setBeneficiary("other")}
                            className={cn("flex-1 py-2.5 rounded-lg border-none  text-sm font-bold transition-all", beneficiary === "other" ? "bg-white/10 text-primary-gold shadow-md border border-white/5" : "text-white/40 hover:text-white")}
                        >
                            For Someone Else
                        </button>
                    </div>
                )}

                {/* VASTU FIELDS */}
                {isVastu && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className={labelClasses}>Property Type <span className="text-red-500">*</span></Label>
                            <RadioGroup defaultValue={formData.propertyType} onValueChange={(val) => setFormData({ ...formData, propertyType: val })} className="grid grid-cols-3 gap-3">
                                {['residential', 'commercial', 'plot'].map((type) => (
                                    <div key={type}>
                                        <RadioGroupItem value={type} id={type} className="peer sr-only" />
                                        <Label htmlFor={type} className="flex items-center justify-center p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 peer-aria-checked:border-primary-gold peer-aria-checked:text-black peer-aria-checked:bg-primary-gold cursor-pointer capitalize text-xs md:text-sm font-bold transition-all hover:bg-white/10">
                                            {type}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <Field>
                            <FieldLabel className={labelClasses}>Property Size (sq ft) <span className="text-red-500">*</span></FieldLabel>
                            <Input
                                required
                                type="number"
                                placeholder="e.g. 1200"
                                className={inputClasses}
                                value={formData.propertySize}
                                onChange={(e) => setFormData({ ...formData, propertySize: e.target.value })}
                            />
                        </Field>
                    </div>
                )}

                {/* ASTRO FIELDS */}
                {!isVastu && (
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel className={labelClasses}>Full Name <span className="text-red-500">*</span></FieldLabel>
                            <Input
                                required
                                placeholder="Enter Full Name"
                                className={inputClasses}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={beneficiary === "self"}
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date Picker (Native for typing support) */}
                            <Field className="flex flex-col">
                                <FieldLabel className={labelClasses}>Date of Birth <span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    required
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    className={cn(inputClasses, "[color-scheme:dark] w-full")}
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </Field>

                            {/* Time Picker (Native with showPicker on click) */}
                            <Field>
                                <FieldLabel className={labelClasses}>Time of Birth <span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    required
                                    type="time"
                                    className={cn(inputClasses, "[color-scheme:dark] cursor-pointer w-full")}
                                    value={formData.timeOfBirth}
                                    onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel className={labelClasses}>Place of Birth <span className="text-red-500">*</span></FieldLabel>
                            <Input
                                required
                                placeholder="City, State, Country"
                                className={inputClasses}
                                value={formData.placeOfBirth}
                                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                            />
                        </Field>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="size-4" />
                        {error}
                    </div>
                )}

                <div className="pt-8 flex gap-4">
                    <Button onClick={onBack} variant="outline" className="flex-1 h-12 rounded-full border-white/20 bg-transparent text-white transition-all">
                        Back
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="flex-[2] bg-primary-gold text-black rounded-full h-12 text-base font-bold shadow-glow-gold hover:scale-[1.02] hover:bg-primary-gold transition-all"
                    >
                        Schedule Slot
                    </Button>
                </div>
            </div>
        </div>
    );
}
