import { NextRequest, NextResponse } from "next/server";
import { getFal } from "@/lib/fal";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const model = req.nextUrl.searchParams.get("model");

    if (!requestId || !model) {
      return NextResponse.json(
        { error: "Missing requestId or model" },
        { status: 400 }
      );
    }

    const fal = getFal();

    // Check queue status
    const status = await fal.queue.status(model, {
      requestId,
      logs: true,
    });

    if (status.status === "COMPLETED") {
      // Fetch the result
      const result = await fal.queue.result(model, { requestId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.data as any;

      // Extract result URL - handle both image and video responses
      let resultUrl: string | null = null;
      let resultType: "image" | "video" = "image";

      if (data?.images?.[0]?.url) {
        resultUrl = data.images[0].url;
        resultType = "image";
      } else if (data?.image?.url) {
        resultUrl = data.image.url;
        resultType = "image";
      } else if (data?.video?.url) {
        resultUrl = data.video.url;
        resultType = "video";
      }

      return NextResponse.json({
        status: "completed",
        resultUrl,
        resultType,
        output: data,
      });
    }

    // Still processing
    return NextResponse.json({
      status: status.status === "IN_QUEUE" ? "queued" : "generating",
      queuePosition:
        status.status === "IN_QUEUE"
          ? (status as { queue_position?: number }).queue_position
          : undefined,
      logs: (status as { logs?: unknown[] }).logs,
    });
  } catch (error) {
    console.error("Generation status error:", error);
    const message =
      error instanceof Error ? error.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
