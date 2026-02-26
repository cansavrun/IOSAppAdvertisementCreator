import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { VIDEO_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max for video generation

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

    console.log("[video] Submitting to fal.ai:", { model, input });

    const result = await fal.subscribe(model, {
      input,
      logs: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;

    // Log the full response to see the structure
    console.log("[video] fal.ai response keys:", Object.keys(data || {}));
    console.log("[video] Full response:", JSON.stringify(data).slice(0, 500));

    // Try multiple response formats - different models return differently
    let resultUrl: string | null = null;

    if (data?.video?.url) {
      resultUrl = data.video.url;
    } else if (data?.video_url) {
      resultUrl = data.video_url;
    } else if (data?.output?.url) {
      resultUrl = data.output.url;
    } else if (data?.images?.[0]?.url) {
      resultUrl = data.images[0].url;
    } else if (data?.image?.url) {
      resultUrl = data.image.url;
    } else if (typeof data?.url === "string") {
      resultUrl = data.url;
    }

    // Last resort: search for any URL in the response
    if (!resultUrl && data) {
      const jsonStr = JSON.stringify(data);
      const urlMatch = jsonStr.match(/https:\/\/[^"]+\.(mp4|webm|mov)/);
      if (urlMatch) {
        resultUrl = urlMatch[0];
        console.log("[video] Found URL via regex:", resultUrl);
      }
    }

    console.log("[video] Extracted resultUrl:", resultUrl);

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
