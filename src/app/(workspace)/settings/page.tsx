"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    await signOut(getFirebaseAuth());
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      {/* Account section */}
      <div className="border border-white/10 rounded-xl p-6 bg-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-white">{user?.display_name || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-white">{user?.email || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Member since</label>
            <p className="text-white">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/20 rounded-xl p-6 bg-red-500/5">
        <h2 className="text-lg font-semibold text-white mb-2">Sign out</h2>
        <p className="text-sm text-gray-400 mb-4">
          Sign out of your account on this device.
        </p>
        <Button variant="danger" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
