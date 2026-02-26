import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { COPILOT_TOOLS } from "@/lib/copilot-tools";
import { buildSystemPrompt } from "@/lib/copilot-system-prompt";
import type { ChatRequest } from "@/types/chat";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, conversationHistory, canvasState } = body;

    // Build system prompt with current canvas context
    const systemPrompt = buildSystemPrompt({
      selectedItemId: canvasState.selectedItemId,
      canvasItems: canvasState.items,
    });

    // Build message history for Claude
    const messages: Anthropic.MessageParam[] = [];

    for (const msg of conversationHistory) {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add the new user message
    messages.push({ role: "user", content: message });

    // Stream response from Claude with tools
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      tools: COPILOT_TOOLS,
    });

    // Create a ReadableStream that forwards SSE events
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const response = await stream.finalMessage();

          // Process all content blocks
          for (const block of response.content) {
            if (block.type === "text") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text", text: block.text })}\n\n`
                )
              );
            } else if (block.type === "tool_use") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "tool_call",
                    tool: {
                      id: block.id,
                      name: block.name,
                      input: block.input,
                    },
                  })}\n\n`
                )
              );
            }
          }

          // Send done event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", stop_reason: response.stop_reason })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          const errMsg =
            error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
