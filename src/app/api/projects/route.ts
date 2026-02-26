import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select("*, media_items(id, result_url, type, status)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Attach first completed thumbnail to each project
    const enriched = (projects || []).map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (p as any).media_items || [];
      const firstCompleted = items.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => i.status === "completed" && i.result_url
      );
      return {
        ...p,
        thumbnail_url: firstCompleted?.result_url || null,
        media_count: items.length,
        media_items: undefined, // Don't send full list
      };
    });

    return NextResponse.json({ projects: enriched });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json().catch(() => ({}));

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id: user.id,
        title: body.title || "Untitled Project",
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
