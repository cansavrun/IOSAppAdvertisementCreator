import Anthropic from "@anthropic-ai/sdk";

export const COPILOT_TOOLS: Anthropic.Tool[] = [
  // === CREATION ===
  {
    name: "generate_image",
    description:
      "Generate a new image from a text prompt. Use this when the user wants to create a new image, Instagram post, or visual content.",
    input_schema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description: "Detailed text prompt describing the image to generate",
        },
        aspect_ratio: {
          type: "string",
          enum: ["1:1", "4:5", "9:16", "16:9"],
          description:
            "Aspect ratio. Use 1:1 or 4:5 for Instagram posts, 9:16 for reels/stories, 16:9 for landscape",
        },
        model: {
          type: "string",
          enum: ["fal-ai/flux-pro/v1.1-ultra", "fal-ai/flux/dev"],
          description:
            "Model to use. flux-pro for highest quality, flux/dev for faster generation",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_video",
    description:
      "Generate a video/reel from a text prompt, optionally using an existing image as the starting frame. Use for Instagram Reels and short video content.",
    input_schema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description: "Text prompt describing the video content and motion",
        },
        image_url: {
          type: "string",
          description:
            "Optional: URL of an existing image to use as the starting frame for image-to-video generation",
        },
        duration: {
          type: "string",
          enum: ["5", "10"],
          description: "Video duration in seconds",
        },
        aspect_ratio: {
          type: "string",
          enum: ["9:16", "16:9", "1:1"],
          description: "Aspect ratio. Use 9:16 for Instagram Reels",
        },
        model: {
          type: "string",
          enum: [
            "fal-ai/kling-video/v2.1/master/text-to-video",
            "fal-ai/kling-video/v2.1/pro/image-to-video",
            "fal-ai/veo2/image-to-video",
          ],
          description: "Video model. Use image-to-video variants when image_url is provided",
        },
      },
      required: ["prompt"],
    },
  },

  // === IMAGE EDITING ===
  {
    name: "edit_image",
    description:
      "Edit an existing image using text instructions. No mask needed - the model automatically detects which regions to modify. Use when the user wants to change, modify, or improve a selected image.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to edit (from the canvas)",
        },
        edit_prompt: {
          type: "string",
          description:
            "Natural language instruction for the edit, e.g. 'make the sky more dramatic' or 'add flowers in the foreground'",
        },
      },
      required: ["media_item_id", "edit_prompt"],
    },
  },
  {
    name: "remove_background",
    description:
      "Remove the background from an image, leaving a transparent cutout of the subject.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to remove background from",
        },
      },
      required: ["media_item_id"],
    },
  },
  {
    name: "upscale_image",
    description:
      "Upscale an image to higher resolution with enhanced detail. Supports up to 4x scaling.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to upscale",
        },
        scale_factor: {
          type: "number",
          enum: [2, 4],
          description: "How much to upscale (2x or 4x)",
        },
      },
      required: ["media_item_id"],
    },
  },
  {
    name: "style_transfer",
    description:
      "Apply an artistic style to an image (e.g. watercolor, oil painting, anime, cyberpunk).",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to style",
        },
        style_prompt: {
          type: "string",
          description:
            "Description of the artistic style to apply, e.g. 'Van Gogh watercolor' or 'cyberpunk neon'",
        },
      },
      required: ["media_item_id", "style_prompt"],
    },
  },
  {
    name: "outpaint_image",
    description: "Extend an image by generating new content beyond its current borders.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to extend",
        },
        direction: {
          type: "string",
          enum: ["left", "right", "top", "bottom", "all"],
          description: "Which direction(s) to extend the image",
        },
        prompt: {
          type: "string",
          description: "Optional description of what should appear in the extended area",
        },
      },
      required: ["media_item_id", "direction"],
    },
  },

  // === VIDEO EDITING ===
  {
    name: "restyle_video",
    description:
      "Apply a visual style to a video while preserving the original motion and identity. Works on videos up to 30 minutes.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the video to restyle",
        },
        style_prompt: {
          type: "string",
          description:
            "Description of the style to apply, e.g. 'anime style' or 'watercolor painting'",
        },
      },
      required: ["media_item_id", "style_prompt"],
    },
  },
  {
    name: "edit_video",
    description:
      "Edit a video - change characters, environments, or visual elements while preserving camera motion.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the video to edit",
        },
        edit_prompt: {
          type: "string",
          description:
            "Description of the edit, e.g. 'replace the person with a cartoon character'",
        },
      },
      required: ["media_item_id", "edit_prompt"],
    },
  },
  {
    name: "extend_video",
    description: "Extend a video by generating additional seconds of continuation.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the video to extend",
        },
        continuation_prompt: {
          type: "string",
          description: "Description of what should happen in the extended portion",
        },
      },
      required: ["media_item_id", "continuation_prompt"],
    },
  },

  // === UTILITY ===
  {
    name: "select_media",
    description: "Select a specific media item in the canvas workspace for the user to focus on.",
    input_schema: {
      type: "object" as const,
      properties: {
        media_item_id: {
          type: "string",
          description: "ID of the media item to select",
        },
      },
      required: ["media_item_id"],
    },
  },
];
