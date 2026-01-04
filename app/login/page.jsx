"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.onboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg-dark items-center justify-center">
        <Sparkles className="size-8 text-primary-gold animate-pulse" />
      </div>
    );
  }

  return <LoginForm />;
}
