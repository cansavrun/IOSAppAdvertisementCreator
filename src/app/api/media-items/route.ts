import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// Save a media item to the database
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();

    // Verify project belongs to user
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", body.project_id)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: item, error } = await supabaseAdmin
      .from("media_items")
      .upsert(
        {
          id: body.id,
          project_id: body.project_id,
          type: body.type,
          status: body.status,
          prompt: body.prompt,
          fal_model: body.fal_model,
          fal_request_id: body.fal_request_id,
          input: body.input || {},
          output: body.output,
          result_url: body.result_url,
          storage_path: body.storage_path,
          thumbnail_path: body.thumbnail_path,
          parent_id: body.parent_id,
          error_message: body.error_message,
          completed_at: body.completed_at,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Media item save error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Media item error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
