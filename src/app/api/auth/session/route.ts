import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing idToken" },
        { status: 400 }
      );
    }

    // Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Upsert profile in Supabase
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          firebase_uid: decoded.uid,
          email: decoded.email || "",
          display_name:
            decoded.name || decoded.email?.split("@")[0] || "User",
          avatar_url: decoded.picture || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "firebase_uid" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to sync profile" },
        { status: 500 }
      );
    }

    // Set httpOnly session cookie
    const response = NextResponse.json({ user: profile });
    response.cookies.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
