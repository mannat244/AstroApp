"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft, Sparkles } from "lucide-react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";

export function LoginForm({
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      console.log("User signed in:", user);

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
        createdAt: new Date().toISOString(), // Use string for better compatibility
      }, { merge: true });

      console.log("User saved to Firestore");

    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-bg-dark font-sans text-white antialiased selection:bg-primary-gold selection:text-black">
      {/* Top Gradient Blob */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-primary-gold/15 via-primary-dark/5 to-transparent blur-3xl pointer-events-none rounded-b-full opacity-50"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-6">
        <div className="size-10"></div>
        <div className="text-primary-gold/60 text-xs tracking-[0.2em] uppercase font-semibold">Sign In</div>
        <div className="size-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pb-6 pt-4 max-w-md mx-auto w-full justify-center">

        {/* Icon */}
        <div className="flex justify-center mb-10">
          <div className="relative flex items-center justify-center size-24 rounded-full bg-gradient-to-b from-bg-light to-bg-dark border border-primary-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] group">
            <div className="absolute inset-0 rounded-full bg-primary-gold/10 blur-xl"></div>
            <div className="absolute inset-0 rounded-full border border-primary-gold/10 scale-75"></div>
            <Sparkles className="size-10 text-primary-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] fill-primary-gold" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-bold leading-tight tracking-tight mb-3">Align Your Stars</h1>
          <p className="text-white/50 text-base font-normal">Sign in to uncover your destiny.</p>
        </div>

        {/* Google Button */}
        <div className="flex flex-col gap-5 w-full">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed text-black text-lg font-bold rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.2)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 border border-transparent cursor-pointer"
            type="button"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="tracking-wide text-gray-900">Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-white/40 text-sm font-medium">
            Don't have an account?
            <a className="text-primary-gold font-bold hover:text-primary-light transition-colors ml-1" href="#">Sign up</a>
          </p>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-primary-dark/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2"></div>
      <div className="fixed top-1/2 left-0 w-64 h-64 bg-primary-gold/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2"></div>
    </div>
  );
}
