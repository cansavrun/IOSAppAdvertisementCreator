"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut(getFirebaseAuth());
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  const initials =
    user?.display_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top header bar */}
      <header className="h-14 border-b border-white/10 bg-surface flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/workspace" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="text-sm font-semibold text-white">
              Reels Creator
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/workspace"
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === "/workspace"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Workspace
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === "/dashboard"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Projects
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors"
            >
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center text-xs text-white font-medium">
                  {initials}
                </div>
              )}
              <span className="text-sm text-gray-300 hidden sm:inline">
                {user?.display_name || user?.email}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-white/10 rounded-lg shadow-xl py-1 z-50">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm text-white truncate">
                    {user?.display_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
