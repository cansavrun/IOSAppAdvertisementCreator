"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();

          // Send token to our API to verify and create/update profile
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        // User signed out - clear session cookie
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
