import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { IMAGE_EDIT_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source_url } = body;

    if (!source_url) {
      return NextResponse.json(
        { error: "Missing source_url" },
        { status: 400 }
      );
    }

    const fal = getFal();
    const model = IMAGE_EDIT_MODELS.REMOVE_BG;

    const { request_id } = await fal.queue.submit(model, {
      input: { image_url: source_url },
    });

    return NextResponse.json({
      requestId: request_id,
      model,
      status: "queued",
    });
  } catch (error) {
    console.error("Remove background error:", error);
    const message =
      error instanceof Error ? error.message : "Remove BG failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
