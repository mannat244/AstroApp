"use client";

import * as React from "react";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroupContext = React.createContext({});

const RadioGroup = React.forwardRef(({ className, onValueChange, defaultValue, value, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || value);

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleValueChange = (newValue) => {
        setSelectedValue(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <RadioGroupContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange }}>
            <div className={cn("grid gap-2", className)} ref={ref} {...props} />
        </RadioGroupContext.Provider>
    );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const isChecked = context.value === value;

    return (
        <button
            type="button"
            role="radio"
            aria-checked={isChecked}
            data-state={isChecked ? "checked" : "unchecked"}
            value={value}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary-gold text-primary-gold ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isChecked ? "bg-primary-gold" : "bg-transparent",
                className
            )}
            onClick={() => context.onValueChange(value)}
            ref={ref}
            {...props}
        >
            <div className={cn("flex items-center justify-center", isChecked ? "text-black" : "text-transparent")}>
                <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </div>
        </button>
    );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
