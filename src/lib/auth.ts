import { NextRequest } from "next/server";
import { adminAuth } from "./firebase-admin";
import { supabaseAdmin } from "./supabase-server";
import type { Profile } from "@/types/database";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuth(req: NextRequest): Promise<Profile> {
  const session = req.cookies.get("session")?.value;
  if (!session) {
    throw new AuthError("Not authenticated");
  }

  const decoded = await adminAuth.verifyIdToken(session);

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("firebase_uid", decoded.uid)
    .single();

  if (error || !profile) {
    throw new AuthError("Profile not found");
  }

  return profile as Profile;
}
