import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";
import { IMAGE_EDIT_MODELS } from "@/lib/fal-models";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { source_url } = await req.json();

    if (!source_url) {
      return NextResponse.json({ error: "Missing source_url" }, { status: 400 });
    }

    const fal = getFal();
    const model = IMAGE_EDIT_MODELS.REMOVE_BG;

    const result = await fal.subscribe(model, {
      input: { image_url: source_url },
      logs: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;
    const resultUrl = data?.image?.url || null;

    return NextResponse.json({
      requestId: result.requestId,
      model,
      status: "completed",
      resultUrl,
      output: data,
    });
  } catch (error) {
    console.error("Remove background error:", error);
    const message = error instanceof Error ? error.message : "Remove BG failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
