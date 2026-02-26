import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch media items for this project
    const { data: mediaItems } = await supabaseAdmin
      .from("media_items")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    // Fetch chat messages
    const { data: chatMessages } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      ...project,
      media_items: mediaItems || [],
      chat_messages: chatMessages || [],
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .update({
        title: body.title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
