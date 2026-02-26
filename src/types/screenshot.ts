export interface ScreenshotSize {
  width: number;
  height: number;
  label: string;
}

export interface DeviceFrame {
  framePath: string;
  screenInset: { top: number; left: number; right: number; bottom: number };
  frameWidth: number;
  frameHeight: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  position: "above" | "below";
  y: number;
}

export interface ScreenshotConfig {
  device: string;
  appScreenshots: string[]; // URLs of uploaded app screenshots
  backgroundType: "gradient" | "solid" | "ai";
  backgroundValue: string; // CSS gradient, hex color, or AI image URL
  textOverlays: TextOverlay[];
}
