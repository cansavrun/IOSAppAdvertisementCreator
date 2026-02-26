export interface FalImageResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
  timings?: { inference: number };
  seed?: number;
  prompt?: string;
}

export interface FalVideoResult {
  video: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
  };
  timings?: { inference: number };
  seed?: number;
}

export interface FalQueueStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED";
  queue_position?: number;
  logs?: Array<{ message: string; timestamp: string }>;
}

export interface FalRemoveBgResult {
  image: {
    url: string;
    width: number;
    height: number;
    content_type: string;
  };
}
