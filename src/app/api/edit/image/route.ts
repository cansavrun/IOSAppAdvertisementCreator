import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { IMAGE_EDIT_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { edit_type, source_url, edit_prompt, direction, prompt } = body;

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
      case "text_guided":
        model = IMAGE_EDIT_MODELS.REVE_EDIT;
        input = {
          image_url: source_url,
          prompt: edit_prompt,
          num_images: 1,
        };
        break;

      case "style_transfer":
        model = IMAGE_EDIT_MODELS.STYLE_TRANSFER;
        input = {
          image_url: source_url,
          prompt: edit_prompt || "artistic style transfer",
        };
        break;

      case "outpaint":
        model = IMAGE_EDIT_MODELS.OUTPAINT;
        input = {
          image_url: source_url,
          prompt: prompt || "",
          expand_left: direction === "left" || direction === "all" ? 300 : 0,
          expand_right: direction === "right" || direction === "all" ? 300 : 0,
          expand_top: direction === "top" || direction === "all" ? 300 : 0,
          expand_bottom:
            direction === "bottom" || direction === "all" ? 300 : 0,
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
    console.error("Image edit error:", error);
    const message =
      error instanceof Error ? error.message : "Edit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
