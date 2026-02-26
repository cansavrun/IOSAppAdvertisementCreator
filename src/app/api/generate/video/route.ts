import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { VIDEO_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";

const VALID_MODELS = new Set(Object.values(VIDEO_MODELS));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      image_url,
      duration = "5",
      aspect_ratio = "9:16",
      model = VIDEO_MODELS.KLING_V21_PRO,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    if (!VALID_MODELS.has(model)) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const fal = getFal();

    // Build input based on model type
    const input: Record<string, unknown> = {
      prompt,
      duration,
      aspect_ratio,
    };

    // Image-to-video models need an image_url
    if (image_url) {
      input.image_url = image_url;
    }

    const { request_id } = await fal.queue.submit(model, { input });

    return NextResponse.json({
      requestId: request_id,
      model,
      status: "queued",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
