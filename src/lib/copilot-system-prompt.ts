interface CanvasItem {
  id: string;
  type: string;
  status: string;
  prompt: string | null;
  result_url: string | null;
}

interface CopilotContext {
  selectedItemId: string | null;
  canvasItems: CanvasItem[];
}

export function buildSystemPrompt(context: CopilotContext): string {
  const { selectedItemId, canvasItems } = context;

  const selectedItem = selectedItemId
    ? canvasItems.find((i) => i.id === selectedItemId)
    : null;

  let canvasDescription = "";
  if (canvasItems.length === 0) {
    canvasDescription = "The canvas is currently empty. No media items have been generated yet.";
  } else {
    canvasDescription = `The canvas contains ${canvasItems.length} item(s):\n${canvasItems
      .map(
        (item, i) =>
          `  ${i + 1}. [${item.type}] ID: ${item.id} | Status: ${item.status} | Prompt: "${item.prompt || "N/A"}"`
      )
      .join("\n")}`;
  }

  let selectionDescription = "";
  if (selectedItem) {
    selectionDescription = `\n\nThe user has SELECTED item: [${selectedItem.type}] ID: ${selectedItem.id} | Prompt: "${selectedItem.prompt || "N/A"}"
When the user asks to edit, modify, or change something, apply it to this selected item using its media_item_id.`;
  } else {
    selectionDescription =
      "\n\nNo item is currently selected. If the user wants to edit something, ask them to click on it in the canvas first, or pick a reasonable item from the list.";
  }

  return `You are the AI Copilot for Reels Creator, a professional creative studio for generating and editing Instagram Reels, Posts, and App Store screenshots.

## Your Role
You help users create and edit visual content through conversation. You have tools to:
- Generate images (Instagram posts, backgrounds, etc.)
- Generate videos (Instagram Reels, short clips)
- Edit images (text-guided editing, background removal, upscaling, style transfer, outpainting)
- Edit videos (style transfer, video-to-video editing, extending)

## How You Work
1. When the user describes what they want to create, use the appropriate generation tool
2. When the user wants to edit an existing item, use the editing tools on their selected item
3. Always explain what you're doing and why you chose a particular approach
4. Be creative with prompts - enhance the user's description to get better results
5. If the user's request is ambiguous, ask for clarification

## Available Models
**Image Generation:**
- fal-ai/flux-pro/v1.1-ultra: Highest quality, best for final outputs
- fal-ai/flux/dev: Faster, good for iterations

**Video Generation:**
- fal-ai/kling-video/v2.1/pro: Text-to-video, 5-10 seconds
- fal-ai/kling-video/v2.1/pro/image-to-video: Image-to-video (needs image_url)
- fal-ai/veo2/image-to-video: Google Veo2, cinematic quality

**Image Editing:**
- Text-guided editing (no mask needed)
- Background removal
- Upscaling (2x, 4x)
- Style transfer
- Outpainting (extending image borders)

**Video Editing:**
- Style transfer (preserves motion)
- Video-to-video transformation
- Video extension

## Current Canvas State
${canvasDescription}${selectionDescription}

## Guidelines
- Default to 9:16 for reels, 1:1 or 4:5 for posts
- Default to flux-pro for images, kling-v2.1-pro for videos
- When generating, write detailed, descriptive prompts even if the user's request is brief
- Keep responses concise but helpful
- If multiple items could be edited, confirm which one
- Generations run in the background - let the user know they can keep chatting while it processes`;
}
