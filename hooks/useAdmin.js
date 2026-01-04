"use client";

import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

/**
 * Hook to check if current user is an admin
 * Uses environment variable NEXT_PUBLIC_ADMIN_EMAILS for whitelist
 */
export function useAdmin() {
    const { user, userProfile, loading } = useAuth();

    const isAdmin = useMemo(() => {
        if (!user) return false;

        // Get admin emails from environment variable
        const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
        const adminEmails = adminEmailsString
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        // Check if user email is in whitelist
        return adminEmails.includes(user.email);
    }, [user]);

    return {
        isAdmin,
        loading,
        user,
        userProfile
    };
}
