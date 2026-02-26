import { fal } from "@fal-ai/client";

let configured = false;

export function getFal() {
  if (!configured) {
    const key = process.env.FAL_KEY;
    if (!key) {
      throw new Error("Missing FAL_KEY environment variable");
    }
    fal.config({ credentials: key });
    configured = true;
  }
  return fal;
}

export { fal };
