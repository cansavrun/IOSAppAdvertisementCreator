import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { VIDEO_EDIT_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { edit_type, source_url, style_prompt, edit_prompt, continuation_prompt } = body;

    if (!source_url) {
      return NextResponse.json(
        { error: "Missing source_url" },
        { status: 400 }
      );
    }

    const fal = getFal();
    let model: string;
    let input: Record<string, unknown>;

    switch (edit_type) {
      case "restyle":
        model = VIDEO_EDIT_MODELS.LUCY_RESTYLE;
        input = {
          video_url: source_url,
          prompt: style_prompt,
        };
        break;

      case "v2v":
        model = VIDEO_EDIT_MODELS.KLING_V2V_EDIT;
        input = {
          video_url: source_url,
          prompt: edit_prompt,
        };
        break;

      case "extend":
        model = VIDEO_EDIT_MODELS.VEO31_EXTEND;
        input = {
          video_url: source_url,
          prompt: continuation_prompt,
          duration: "7",
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid edit_type" },
          { status: 400 }
        );
    }

    const { request_id } = await fal.queue.submit(model, { input });

    return NextResponse.json({
      requestId: request_id,
      model,
      status: "queued",
    });
  } catch (error) {
    console.error("Video edit error:", error);
    const message =
      error instanceof Error ? error.message : "Edit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
