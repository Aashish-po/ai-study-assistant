import { storagePut } from "./storage";
import {  invokeLLM } from "./_core/llm";
import {
  normalizeVisionMimeType,
  type VisionFileMimeType,
} from "../shared/vision";

export type VisionRequest = {
  fileName: string;
  mimeType?: VisionFileMimeType;
  base64: string;
  subject?: string;
  topic?: string;
  notes?: string;
};

export type VisionResponse = {
  summary: string;
  keyPoints: string[];
  takeaways: string[];
  questions: string[];
  rawContent: string;
};

type VisionLLMResponse = {
  summary?: string;
  keyPoints?: string[];
  takeaways?: string[];
  questions?: string[];
};

const VISION_RESPONSE_SCHEMA = {
  name: "vision_summary",
  strict: true,
  schema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Concise study summary generated from the document or photo.",
      },
      keyPoints: {
        type: "array",
        items: { type: "string" },
        description: "Bullet list of the most important facts.",
      },
      takeaways: {
        type: "array",
        items: { type: "string" },
        description: "Actionable takeaways or memory hooks.",
      },
      questions: {
        type: "array",
        items: { type: "string" },
        description: "Practice questions the student can use for self-testing.",
      },
    },
    required: ["summary", "keyPoints"],
    additionalProperties: false,
  },
} as const;

const cleanBase64 = (value: string) => {
  if (!value) return "";
  const parts = value.split(";base64,");
  return parts.length > 1 ? parts[parts.length - 1] : value;
};

const sanitizeFileName = (input: string) => {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return "vision-file";
  return trimmed.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
};

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

export async function processVisionFile(data: VisionRequest): Promise<VisionResponse> {
  if (!data.base64) {
    throw new Error("File data is required");
  }

  const cleanedBase64 = cleanBase64(data.base64);
  if (!cleanedBase64) {
    throw new Error("File data was empty");
  }

  const buffer = Buffer.from(cleanedBase64, "base64");
  const sanitizedName = sanitizeFileName(data.fileName);
  const fileKey = `vision/${Date.now()}-${sanitizedName}`;
  const mimeType = normalizeVisionMimeType(data.mimeType);
  const { url } = await storagePut(fileKey, buffer, mimeType);

  const contextParts = [
    data.subject ? `Subject: ${data.subject}` : "",
    data.topic ? `Topic: ${data.topic}` : "",
    data.notes ? `Notes: ${data.notes}` : "",
  ].filter(Boolean);

  const userPrompt = [
    "Transcribe and summarize the study material from the attached file.",
    "Highlight definitions, formulas, mnemonics, and potential exam questions.",
    contextParts.length > 0 ? `Context:\n${contextParts.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await invokeLLM({
    model: "gemini-1.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are a study assistant with vision capabilities. Read the provided document or photo carefully, extract the key ideas, and return a helpful study plan.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
            {
              type: "file_url",
              file_url: {
                url,
                mime_type: mimeType,
              },
            },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: VISION_RESPONSE_SCHEMA,
    },
  });

  const rawResponse = response.choices[0]?.message?.content;
  if (typeof rawResponse !== "string") {
    throw new Error("Vision AI did not return a text response");
  }

  let parsed: VisionLLMResponse;
  try {
    parsed = JSON.parse(rawResponse);
  } catch (error) {
    console.error("Failed to parse vision response", error);
    throw new Error("Vision AI response could not be parsed");
  }

  return {
    summary: parsed.summary?.trim() ?? "",
    keyPoints: ensureArray(parsed.keyPoints),
    takeaways: ensureArray(parsed.takeaways),
    questions: ensureArray(parsed.questions),
    rawContent: rawResponse,
  };
}
