import { getApiBaseUrl } from "@/constants/oauth";

export type VisionServicePayload = {
  fileName: string;
  mimeType: string;
  base64: string;
  subject: string;
  topic?: string;
  notes?: string;
};

export type VisionResult = {
  summary: string;
  keyPoints: string[];
  takeaways: string[];
  questions: string[];
  rawContent: string;
};

const buildVisionUrl = () => {
  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/api/vision/process`;
  }
  return "/api/vision/process";
};

export async function processVisionFile(payload: VisionServicePayload): Promise<VisionResult> {
  const response = await fetch(buildVisionUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message =
      json?.error ??
      json?.message ??
      `Vision API request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  return (await response.json()) as VisionResult;
}
