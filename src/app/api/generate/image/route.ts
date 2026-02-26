import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { generateImageSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generateImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { prompt, aspect_ratio, model, num_images } = parsed.data;
    const fal = getFal();

    const sizeMap: Record<string, string> = {
      "1:1": "square_hd",
      "4:5": "portrait_4_3",
      "9:16": "portrait_16_9",
      "16:9": "landscape_16_9",
    };

    const { request_id } = await fal.queue.submit(model, {
      input: {
        prompt,
        image_size: (sizeMap[aspect_ratio] || "square_hd") as "square_hd",
        num_images,
        output_format: "png",
      },
    });

    return NextResponse.json({
      requestId: request_id,
      model,
      status: "queued",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
