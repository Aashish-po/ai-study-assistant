export const VISION_FILE_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/heic",
] as const;

export type VisionFileMimeType = (typeof VISION_FILE_MIME_TYPES)[number];

export const normalizeVisionMimeType = (value?: string): VisionFileMimeType => {
  const normalized = value?.trim().toLowerCase();
  if (normalized && VISION_FILE_MIME_TYPES.includes(normalized as VisionFileMimeType)) {
    return normalized as VisionFileMimeType;
  }

  if (normalized && normalized.startsWith("image/")) {
    return "image/jpeg";
  }

  return "application/pdf";
};
