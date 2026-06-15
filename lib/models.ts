// Central config for the fal.ai motion-control models used by the studio.
// "Motion control" = give it a character photo + a reference video, and the person
// in the photo performs the movements from the video.
// Model docs: https://fal.ai/models/fal-ai/kling-video/v2.6/standard/motion-control

export type QualityId = "standard" | "pro";

export interface ModelOption {
  id: QualityId;
  label: string;
  endpoint: string;
  blurb: string;
  badge?: string;
}

export const MOTION_MODELS: ModelOption[] = [
  {
    id: "standard",
    label: "Standard",
    endpoint: "fal-ai/kling-video/v2.6/standard/motion-control",
    blurb: "Fast & affordable. Great for most clips and quick iterations.",
  },
  {
    id: "pro",
    label: "Pro",
    endpoint: "fal-ai/kling-video/v2.6/pro/motion-control",
    blurb: "Highest fidelity — ideal for complex dance moves and fine gestures.",
    badge: "Best quality",
  },
];

export function getEndpoint(quality: QualityId): string {
  return (
    MOTION_MODELS.find((m) => m.id === quality)?.endpoint ??
    MOTION_MODELS[0].endpoint
  );
}

export type CharacterOrientation = "video" | "image";

export interface OrientationOption {
  id: CharacterOrientation;
  label: string;
  hint: string;
}

export const ORIENTATIONS: OrientationOption[] = [
  {
    id: "video",
    label: "Follow the video",
    hint: "Best for complex motion (dance, sports). Up to ~30s.",
  },
  {
    id: "image",
    label: "Follow the photo",
    hint: "Best for camera movement & keeping the original pose. Up to ~10s.",
  },
];

// Shape of the input we send to the model.
export interface MotionControlInput {
  image_url: string;
  video_url: string;
  prompt?: string;
  character_orientation: CharacterOrientation;
  keep_original_sound?: boolean;
}
