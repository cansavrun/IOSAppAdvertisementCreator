import { useChatStore } from "@/stores/chat-store";
import { useCanvasStore } from "@/stores/canvas-store";
import type { ChatRequest, ToolCallUI } from "@/types/chat";
import type { MediaItem } from "@/types/database";

interface SSEEvent {
  type: "text" | "tool_call" | "done" | "error";
  text?: string;
  tool?: { id: string; name: string; input: Record<string, unknown> };
  stop_reason?: string;
  error?: string;
}

export async function sendChatMessage(message: string): Promise<void> {
  const chatStore = useChatStore.getState();
  const canvasStore = useCanvasStore.getState();

  const assistantMsgId = crypto.randomUUID();
  chatStore.addMessage({
    id: assistantMsgId,
    role: "assistant",
    content: "",
    isStreaming: true,
    createdAt: new Date().toISOString(),
  });
  chatStore.setStreaming(true);

  try {
    const payload: ChatRequest = {
      message,
      projectId: chatStore.projectId || "default",
      conversationHistory: chatStore.messages.filter(
        (m) => m.id !== assistantMsgId
      ),
      canvasState: {
        selectedItemId: canvasStore.selectedItemId,
        items: canvasStore.items.map((item) => ({
          id: item.id,
          type: item.type,
          status: item.status,
          prompt: item.prompt,
          result_url: item.result_url,
        })),
      },
    };

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Chat API returned ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";
    const toolCalls: ToolCallUI[] = [];
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const event: SSEEvent = JSON.parse(jsonStr);

          if (event.type === "text" && event.text) {
            fullText += event.text;
            chatStore.updateMessage(assistantMsgId, { content: fullText });
          } else if (event.type === "tool_call" && event.tool) {
            const toolCall: ToolCallUI = {
              id: event.tool.id,
              name: event.tool.name,
              input: event.tool.input,
              status: "running",
            };
            toolCalls.push(toolCall);
            chatStore.updateMessage(assistantMsgId, {
              toolCalls: [...toolCalls],
            });

            // Execute tool call and update status
            try {
              await executeToolCall(toolCall);
              toolCall.status = "completed";
            } catch {
              toolCall.status = "failed";
            }
            chatStore.updateMessage(assistantMsgId, {
              toolCalls: [...toolCalls],
            });
          } else if (event.type === "error") {
            fullText += `\n\n_Error: ${event.error}_`;
            chatStore.updateMessage(assistantMsgId, { content: fullText });
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }

    chatStore.updateMessage(assistantMsgId, {
      content: fullText || "I processed your request.",
      isStreaming: false,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    });
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";
    chatStore.updateMessage(assistantMsgId, {
      content: `Sorry, I encountered an error: ${errMsg}`,
      isStreaming: false,
    });
  } finally {
    chatStore.setStreaming(false);
  }
}

// Helper to create a canvas placeholder and optionally start a generation job
function createPlaceholder(
  type: MediaItem["type"],
  prompt: string | null,
  model: string,
  input: Record<string, unknown>,
  parentId?: string
): string {
  const id = crypto.randomUUID();
  useCanvasStore.getState().addItem({
    id,
    project_id: "default",
    type,
    status: "queued",
    prompt,
    fal_model: model,
    fal_request_id: null,
    input,
    output: null,
    result_url: null,
    storage_path: null,
    thumbnail_path: null,
    parent_id: parentId || null,
    error_message: null,
    created_at: new Date().toISOString(),
    completed_at: null,
  });
  return id;
}

// Submit to generation API - the server uses fal.subscribe() which
// waits for completion, so the response contains the final result.
// We fire this in the background so the UI stays responsive.
function submitGeneration(
  endpoint: string,
  body: Record<string, unknown>,
  mediaItemId: string
): void {
  // Update canvas to show generating state
  useCanvasStore.getState().updateItem(mediaItemId, { status: "generating" });

  // Fire the request in the background (don't await)
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error || `HTTP ${res.status}`
        );
      }
      return res.json();
    })
    .then((data) => {
      // Server returns completed result directly
      useCanvasStore.getState().updateItem(mediaItemId, {
        status: "completed",
        result_url: data.resultUrl,
        fal_request_id: data.requestId,
        output: data.output,
        completed_at: new Date().toISOString(),
      });
    })
    .catch((error) => {
      useCanvasStore.getState().updateItem(mediaItemId, {
        status: "failed",
        error_message:
          error instanceof Error ? error.message : "Generation failed",
      });
    });
}

async function executeToolCall(toolCall: ToolCallUI): Promise<void> {
  const input = toolCall.input;

  switch (toolCall.name) {
    // === GENERATION ===
    case "generate_image": {
      const model =
        (input.model as string) || "fal-ai/flux-pro/v1.1-ultra";
      const prompt = input.prompt as string;
      const mediaItemId = createPlaceholder("image", prompt, model, input);

      submitGeneration(
        "/api/generate/image",
        {
          prompt,
          aspect_ratio: input.aspect_ratio || "1:1",
          model,
        },
        mediaItemId
      );
      break;
    }

    case "generate_video": {
      const model =
        (input.model as string) || "fal-ai/kling-video/v2.1/master/text-to-video";
      const prompt = input.prompt as string;
      const mediaItemId = createPlaceholder("video", prompt, model, input);

      submitGeneration(
        "/api/generate/video",
        {
          prompt,
          image_url: input.image_url,
          duration: input.duration || "5",
          aspect_ratio: input.aspect_ratio || "9:16",
          model,
        },
        mediaItemId
      );
      break;
    }

    // === IMAGE EDITING ===
    case "edit_image": {
      const sourceId = input.media_item_id as string;
      const editPrompt = input.edit_prompt as string;
      const model = "fal-ai/reve/edit";
      const mediaItemId = createPlaceholder(
        "image",
        editPrompt,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/image",
        {
          media_item_id: sourceId,
          edit_prompt: editPrompt,
          edit_type: "text_guided",
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    case "remove_background": {
      const sourceId = input.media_item_id as string;
      const model = "fal-ai/bria/background/remove";
      const mediaItemId = createPlaceholder(
        "image",
        "Remove background",
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/tools/remove-bg",
        {
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    case "upscale_image": {
      const sourceId = input.media_item_id as string;
      const model = "fal-ai/clarity-upscaler";
      const mediaItemId = createPlaceholder(
        "image",
        `Upscale ${input.scale_factor || 2}x`,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/tools/upscale",
        {
          source_url: getSourceUrl(sourceId),
          scale_factor: input.scale_factor || 2,
        },
        mediaItemId
      );
      break;
    }

    case "style_transfer": {
      const sourceId = input.media_item_id as string;
      const stylePrompt = input.style_prompt as string;
      const model = "fal-ai/image-editing/style-transfer";
      const mediaItemId = createPlaceholder(
        "image",
        stylePrompt,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/image",
        {
          media_item_id: sourceId,
          edit_prompt: stylePrompt,
          edit_type: "style_transfer",
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    case "outpaint_image": {
      const sourceId = input.media_item_id as string;
      const model = "fal-ai/image-apps-v2/outpaint";
      const mediaItemId = createPlaceholder(
        "image",
        `Extend ${input.direction}`,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/image",
        {
          media_item_id: sourceId,
          edit_type: "outpaint",
          direction: input.direction,
          prompt: input.prompt,
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    // === VIDEO EDITING ===
    case "restyle_video": {
      const sourceId = input.media_item_id as string;
      const stylePrompt = input.style_prompt as string;
      const model = "decart/lucy-restyle";
      const mediaItemId = createPlaceholder(
        "video",
        stylePrompt,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/video",
        {
          media_item_id: sourceId,
          edit_type: "restyle",
          style_prompt: stylePrompt,
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    case "edit_video": {
      const sourceId = input.media_item_id as string;
      const editPrompt = input.edit_prompt as string;
      const model = "fal-ai/kling-video/o1/video-to-video/edit";
      const mediaItemId = createPlaceholder(
        "video",
        editPrompt,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/video",
        {
          media_item_id: sourceId,
          edit_type: "v2v",
          edit_prompt: editPrompt,
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    case "extend_video": {
      const sourceId = input.media_item_id as string;
      const contPrompt = input.continuation_prompt as string;
      const model = "fal-ai/veo3.1/extend-video";
      const mediaItemId = createPlaceholder(
        "video",
        contPrompt,
        model,
        input,
        sourceId
      );

      submitGeneration(
        "/api/edit/video",
        {
          media_item_id: sourceId,
          edit_type: "extend",
          continuation_prompt: contPrompt,
          source_url: getSourceUrl(sourceId),
        },
        mediaItemId
      );
      break;
    }

    // === UTILITY ===
    case "select_media": {
      const id = input.media_item_id as string;
      if (id) {
        useCanvasStore.getState().selectItem(id);
      }
      break;
    }
  }
}

/** Look up the result_url of an existing canvas item */
function getSourceUrl(mediaItemId: string): string | null {
  const item = useCanvasStore
    .getState()
    .items.find((i) => i.id === mediaItemId);
  return item?.result_url || null;
}
