import type { ScreenshotSize, DeviceFrame } from "@/types/screenshot";

export const SCREENSHOT_SIZES: Record<string, ScreenshotSize> = {
  "iphone-6.9": { width: 1320, height: 2868, label: 'iPhone 6.9" (16 Pro Max)' },
  "iphone-6.7": { width: 1290, height: 2796, label: 'iPhone 6.7" (16 Plus)' },
  "iphone-6.1": { width: 1179, height: 2556, label: 'iPhone 6.1" (16)' },
  "ipad-13": { width: 2064, height: 2752, label: 'iPad 13" (M-series)' },
};

export const DEVICE_FRAMES: Record<string, DeviceFrame> = {
  "iphone-6.9": {
    framePath: "/device-frames/iphone-16-pro-max.png",
    screenInset: { top: 142, left: 52, right: 52, bottom: 142 },
    frameWidth: 1424,
    frameHeight: 3020,
  },
  "iphone-6.7": {
    framePath: "/device-frames/iphone-16-plus.png",
    screenInset: { top: 130, left: 48, right: 48, bottom: 130 },
    frameWidth: 1386,
    frameHeight: 2932,
  },
  "iphone-6.1": {
    framePath: "/device-frames/iphone-16.png",
    screenInset: { top: 120, left: 44, right: 44, bottom: 120 },
    frameWidth: 1267,
    frameHeight: 2680,
  },
  "ipad-13": {
    framePath: "/device-frames/ipad-pro-13.png",
    screenInset: { top: 80, left: 80, right: 80, bottom: 80 },
    frameWidth: 2224,
    frameHeight: 2912,
  },
};
