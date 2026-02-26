// === GENERATION MODELS ===

export const IMAGE_MODELS = {
  FLUX_PRO_ULTRA: "fal-ai/flux-pro/v1.1-ultra",
  FLUX_DEV: "fal-ai/flux/dev",
} as const;

export const VIDEO_MODELS = {
  KLING_V21_PRO: "fal-ai/kling-video/v2.1/master/text-to-video",
  KLING_V21_PRO_I2V: "fal-ai/kling-video/v2.1/pro/image-to-video",
  VEO2_I2V: "fal-ai/veo2/image-to-video",
} as const;

// === IMAGE EDITING MODELS ===

export const IMAGE_EDIT_MODELS = {
  REVE_EDIT: "fal-ai/reve/edit", // Text-guided edit, no mask
  FLUX_2_EDIT: "fal-ai/flux-2/edit", // Multi-reference edit
  FLUX_PRO_FILL: "fal-ai/flux-pro/v1/fill", // Inpainting with mask
  OUTPAINT: "fal-ai/image-apps-v2/outpaint", // Extend image edges
  STYLE_TRANSFER: "fal-ai/image-editing/style-transfer",
  REMOVE_BG: "fal-ai/bria/background/remove",
  UPSCALE: "fal-ai/clarity-upscaler",
  IMAGE_TO_IMAGE: "fal-ai/flux/dev/image-to-image",
} as const;

// === VIDEO EDITING MODELS ===

export const VIDEO_EDIT_MODELS = {
  LUCY_RESTYLE: "decart/lucy-restyle", // Style transfer, up to 30min
  KLING_V2V_EDIT: "fal-ai/kling-video/o1/video-to-video/edit",
  VEO31_EXTEND: "fal-ai/veo3.1/extend-video",
  VIDEO_UPSCALE: "clarityai/crystal-video-upscaler",
} as const;

// === MODEL OPTIONS FOR UI ===

export const IMAGE_MODEL_OPTIONS = [
  {
    id: IMAGE_MODELS.FLUX_PRO_ULTRA,
    label: "FLUX Pro Ultra",
    description: "Highest quality",
  },
  {
    id: IMAGE_MODELS.FLUX_DEV,
    label: "FLUX Dev",
    description: "Fast, good quality",
  },
];

export const VIDEO_MODEL_OPTIONS = [
  {
    id: VIDEO_MODELS.KLING_V21_PRO,
    label: "Kling 2.1 Pro",
    description: "Text-to-video, 5-10s",
  },
  {
    id: VIDEO_MODELS.KLING_V21_PRO_I2V,
    label: "Kling 2.1 Pro (Image)",
    description: "Image-to-video",
  },
  {
    id: VIDEO_MODELS.VEO2_I2V,
    label: "Veo 2",
    description: "Cinematic, image-to-video",
  },
];

// === ASPECT RATIOS ===

export const ASPECT_RATIOS = {
  REEL: "9:16",
  POST_SQUARE: "1:1",
  POST_PORTRAIT: "4:5",
  LANDSCAPE: "16:9",
} as const;

export const VIDEO_DURATIONS = ["5", "10"] as const;
