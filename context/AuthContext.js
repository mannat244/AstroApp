"use client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setUserProfile(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            // Listen to Firestore profile
            const unsubFirestore = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                if (doc.exists()) {
                    setUserProfile(doc.data());
                } else {
                    setUserProfile(null);
                }
                setLoading(false);
            });

            return () => unsubFirestore();
        });
        return () => unsubAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
