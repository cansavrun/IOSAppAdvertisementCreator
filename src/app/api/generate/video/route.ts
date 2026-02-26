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

    const input: Record<string, unknown> = {
      prompt,
      duration,
      aspect_ratio,
    };

    if (image_url) {
      input.image_url = image_url;
    }

    // Use fal.subscribe which handles the full queue lifecycle
    const result = await fal.subscribe(model, {
      input,
      logs: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;

    let resultUrl: string | null = null;
    if (data?.video?.url) {
      resultUrl = data.video.url;
    } else if (data?.images?.[0]?.url) {
      resultUrl = data.images[0].url;
    }

    return NextResponse.json({
      requestId: result.requestId,
      status: "completed",
      resultUrl,
      output: data,
    });
  } catch (error) {
    console.error("Video generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
