import { z } from "zod";

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(2000),
  aspect_ratio: z.enum(["1:1", "4:5", "9:16", "16:9"]).optional().default("1:1"),
  model: z
    .enum(["fal-ai/flux-pro/v1.1-ultra", "fal-ai/flux/dev"])
    .optional()
    .default("fal-ai/flux-pro/v1.1-ultra"),
  num_images: z.number().int().min(1).max(4).optional().default(1),
});

export const generateVideoSchema = z.object({
  prompt: z.string().min(1).max(2000),
  image_url: z.string().url().optional(),
  duration: z.enum(["5", "10"]).optional().default("5"),
  aspect_ratio: z.enum(["9:16", "16:9", "1:1"]).optional().default("9:16"),
  model: z
    .enum([
      "fal-ai/kling-video/v2.1/pro",
      "fal-ai/kling-video/v2.1/pro/image-to-video",
      "fal-ai/veo2/image-to-video",
    ])
    .optional()
    .default("fal-ai/kling-video/v2.1/pro"),
});

export const editImageSchema = z.object({
  edit_type: z.enum(["text_guided", "style_transfer", "outpaint"]),
  source_url: z.string().min(1),
  edit_prompt: z.string().max(2000).optional(),
  direction: z.enum(["left", "right", "top", "bottom", "all"]).optional(),
  prompt: z.string().max(2000).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  projectId: z.string().min(1),
  conversationHistory: z.array(z.object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(100),
  canvasState: z.object({
    selectedItemId: z.string().nullable(),
    items: z.array(z.object({
      id: z.string(),
      type: z.string(),
      status: z.string(),
      prompt: z.string().nullable(),
      result_url: z.string().nullable(),
    })).max(200),
  }),
});
