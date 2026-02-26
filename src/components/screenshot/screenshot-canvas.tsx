"use client";

import { SCREENSHOT_SIZES, DEVICE_FRAMES } from "@/lib/screenshot-sizes";
import type { ScreenshotConfig } from "@/types/screenshot";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Composites a single App Store screenshot at the exact required dimensions.
 * Uses OffscreenCanvas for performance.
 *
 * Layers (bottom to top):
 * 1. Background (gradient / solid / AI image)
 * 2. Text overlays (above device)
 * 3. Device frame with app screenshot inside
 * 4. Text overlays (below device)
 */
export async function compositeScreenshot(
  config: ScreenshotConfig,
  screenshotIndex: number
): Promise<Blob> {
  const size = SCREENSHOT_SIZES[config.device];
  const frame = DEVICE_FRAMES[config.device];
  if (!size || !frame) throw new Error(`Unknown device: ${config.device}`);

  const { width, height } = size;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // === Layer 1: Background ===
  if (config.backgroundType === "gradient") {
    const [from, to] = config.backgroundValue.split(",");
    const gradient = ctx.createLinearGradient(0, 0, width * 0.3, height);
    gradient.addColorStop(0, from || "#6366f1");
    gradient.addColorStop(1, to || "#8b5cf6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else if (config.backgroundType === "solid") {
    ctx.fillStyle = config.backgroundValue || "#000000";
    ctx.fillRect(0, 0, width, height);
  } else if (config.backgroundType === "ai" && config.backgroundValue.startsWith("http")) {
    try {
      const bgImg = await loadImage(config.backgroundValue);
      ctx.drawImage(bgImg, 0, 0, width, height);
    } catch {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);
  }

  // === Calculate text space ===
  const aboveTexts = config.textOverlays.filter((t) => t.position === "above");
  const belowTexts = config.textOverlays.filter((t) => t.position === "below");

  // Reserve space for text
  const textTopSpace = aboveTexts.length > 0
    ? aboveTexts.reduce((sum, t) => sum + t.fontSize * 1.4, 0) + 80
    : 60;
  const textBottomSpace = belowTexts.length > 0
    ? belowTexts.reduce((sum, t) => sum + t.fontSize * 1.4, 0) + 80
    : 60;

  // === Layer 2: Text overlays (above device) ===
  let textY = textTopSpace - 20;
  for (const overlay of aboveTexts) {
    ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = overlay.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(overlay.text, width / 2, textY);
    textY += overlay.fontSize * 1.4;
  }

  // === Layer 3: Device frame with screenshot ===
  const availableHeight = height - textTopSpace - textBottomSpace;
  const availableWidth = width * 0.75;

  // Scale device frame to fit
  const frameScaleW = availableWidth / frame.frameWidth;
  const frameScaleH = availableHeight / frame.frameHeight;
  const frameScale = Math.min(frameScaleW, frameScaleH);

  const scaledFrameW = frame.frameWidth * frameScale;
  const scaledFrameH = frame.frameHeight * frameScale;
  const frameX = (width - scaledFrameW) / 2;
  const frameY = textTopSpace + (availableHeight - scaledFrameH) / 2;

  // Draw app screenshot inside frame's screen area
  const screenshotUrl = config.appScreenshots[screenshotIndex];
  if (screenshotUrl) {
    try {
      const appImg = await loadImage(screenshotUrl);
      const screenX = frameX + frame.screenInset.left * frameScale;
      const screenY = frameY + frame.screenInset.top * frameScale;
      const screenW =
        (frame.frameWidth - frame.screenInset.left - frame.screenInset.right) *
        frameScale;
      const screenH =
        (frame.frameHeight - frame.screenInset.top - frame.screenInset.bottom) *
        frameScale;

      // Clip to screen area and draw
      ctx.save();
      ctx.beginPath();
      // Round the corners slightly for realism
      const cornerRadius = 20 * frameScale;
      ctx.moveTo(screenX + cornerRadius, screenY);
      ctx.lineTo(screenX + screenW - cornerRadius, screenY);
      ctx.quadraticCurveTo(screenX + screenW, screenY, screenX + screenW, screenY + cornerRadius);
      ctx.lineTo(screenX + screenW, screenY + screenH - cornerRadius);
      ctx.quadraticCurveTo(screenX + screenW, screenY + screenH, screenX + screenW - cornerRadius, screenY + screenH);
      ctx.lineTo(screenX + cornerRadius, screenY + screenH);
      ctx.quadraticCurveTo(screenX, screenY + screenH, screenX, screenY + screenH - cornerRadius);
      ctx.lineTo(screenX, screenY + cornerRadius);
      ctx.quadraticCurveTo(screenX, screenY, screenX + cornerRadius, screenY);
      ctx.clip();
      ctx.drawImage(appImg, screenX, screenY, screenW, screenH);
      ctx.restore();
    } catch {
      // Draw placeholder if image fails to load
      const screenX = frameX + frame.screenInset.left * frameScale;
      const screenY = frameY + frame.screenInset.top * frameScale;
      const screenW =
        (frame.frameWidth - frame.screenInset.left - frame.screenInset.right) *
        frameScale;
      const screenH =
        (frame.frameHeight - frame.screenInset.top - frame.screenInset.bottom) *
        frameScale;
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(screenX, screenY, screenW, screenH);
    }
  }

  // Draw device frame overlay (if available)
  try {
    const frameImg = await loadImage(frame.framePath);
    ctx.drawImage(frameImg, frameX, frameY, scaledFrameW, scaledFrameH);
  } catch {
    // If no frame image, draw a rounded rect outline as fallback
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 4 * frameScale;
    const r = 40 * frameScale;
    ctx.beginPath();
    ctx.moveTo(frameX + r, frameY);
    ctx.lineTo(frameX + scaledFrameW - r, frameY);
    ctx.quadraticCurveTo(frameX + scaledFrameW, frameY, frameX + scaledFrameW, frameY + r);
    ctx.lineTo(frameX + scaledFrameW, frameY + scaledFrameH - r);
    ctx.quadraticCurveTo(frameX + scaledFrameW, frameY + scaledFrameH, frameX + scaledFrameW - r, frameY + scaledFrameH);
    ctx.lineTo(frameX + r, frameY + scaledFrameH);
    ctx.quadraticCurveTo(frameX, frameY + scaledFrameH, frameX, frameY + scaledFrameH - r);
    ctx.lineTo(frameX, frameY + r);
    ctx.quadraticCurveTo(frameX, frameY, frameX + r, frameY);
    ctx.closePath();
    ctx.stroke();
  }

  // === Layer 4: Text overlays (below device) ===
  let belowY = frameY + scaledFrameH + 60;
  for (const overlay of belowTexts) {
    ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = overlay.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(overlay.text, width / 2, belowY);
    belowY += overlay.fontSize * 1.4;
  }

  return canvas.convertToBlob({ type: "image/png" });
}

/**
 * Export all screenshots as a batch
 */
export async function exportAllScreenshots(
  config: ScreenshotConfig
): Promise<Blob[]> {
  const blobs: Blob[] = [];
  for (let i = 0; i < config.appScreenshots.length; i++) {
    const blob = await compositeScreenshot(config, i);
    blobs.push(blob);
  }
  return blobs;
}
