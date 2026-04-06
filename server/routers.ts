import { z } from "zod";

import { COOKIE_NAME } from "../shared/const.js";
import { consumeDailyUsage, checkRateLimit, getActorKey, getUsage } from "./ai-usage";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const aiRouter = router({
  usage: publicProcedure.query(({ ctx }) => {
    const actorKey = getActorKey(ctx.user?.id ?? null, ctx.req.ip ?? null);
    return getUsage(actorKey);
  }),

  generateStudyPack: publicProcedure
    .input(
      z.object({
        content: z.string(),
        mode: z.enum(["simple", "exam", "detailed"]).default("simple"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const actorKey = getActorKey(ctx.user?.id ?? null, ctx.req.ip ?? null);

      checkRateLimit(actorKey);
      const usage = consumeDailyUsage(actorKey);

      try {
        const modePrompts: Record<"simple" | "exam" | "detailed", string> = {
          simple:
            "You are an expert study assistant. Explain in plain language with short paragraphs and simple terms.",
          exam:
            "You are an exam coach. Summarize for high-score revision with definitions, likely exam points, and memory hooks.",
          detailed:
            "You are a subject-matter tutor. Provide a deep-dive explanation with mechanisms, examples, and nuanced details.",
        };

        const userInstruction: Record<"simple" | "exam" | "detailed", string> = {
          simple: "Create a beginner-friendly summary in 5-8 bullet points.",
          exam: "Create an exam-focused summary with key terms, common question angles, and quick revision bullets.",
          detailed: "Create a detailed explanation including context, key concepts, cause/effect relationships, and examples.",
        };

        const MAX_CHARS_PER_CHUNK = 3000;
        const chunkText = (text: string) => {
          const normalized = text.trim();
          if (normalized.length <= MAX_CHARS_PER_CHUNK) return [normalized];

          const chunks: string[] = [];
          let index = 0;

          while (index < normalized.length) {
            let end = Math.min(index + MAX_CHARS_PER_CHUNK, normalized.length);
            if (end < normalized.length) {
              const splitAt = normalized.lastIndexOf("\n", end);
              if (splitAt > index + 500) end = splitAt;
            }

            chunks.push(normalized.slice(index, end).trim());
            index = end;
          }

          return chunks.filter(Boolean);
        };

        const chunks = chunkText(input.content);
        const chunkSummaries = await Promise.all(
          chunks.map((chunk, chunkIndex) =>
            invokeLLM({
              messages: [
                { role: "system", content: modePrompts[input.mode] },
                {
                  role: "user",
                  content: `${userInstruction[input.mode]}

This is part ${chunkIndex + 1} of ${chunks.length}.

Text:
${chunk}`,
                },
              ],
            }),
          ),
        );

        const combinedChunkSummaries = chunkSummaries
          .map((result) =>
            typeof result.choices[0]?.message?.content === "string"
              ? result.choices[0].message.content
              : "",
          )
          .filter(Boolean)
          .join("\n\n");

        const [finalSummaryResponse, keyPointsResponse, flashcardsResponse] = await Promise.all([
          invokeLLM({
            messages: [
              { role: "system", content: modePrompts[input.mode] },
              {
                role: "user",
                content:
                  chunks.length > 1
                    ? `Merge these chunk-level summaries into one coherent final summary. Keep it concise and avoid repetition.

${combinedChunkSummaries}`
                    : `Summarize this:

${input.content}`,
              },
            ],
          }),
          invokeLLM({
            messages: [
              { role: "system", content: "Extract key points from the provided text. Return as a JSON array of strings." },
              {
                role: "user",
                content:
                  chunks.length > 1
                    ? `Extract key points from this merged summary:

${combinedChunkSummaries}`
                    : `Extract key points from:

${input.content}`,
              },
            ],
          }),
          invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "Create flashcards from the provided content. Return only JSON array with objects: {\"question\": string, \"answer\": string}.",
              },
              {
                role: "user",
                content:
                  chunks.length > 1
                    ? `Create flashcards from this merged summary:

${combinedChunkSummaries}`
                    : `Create flashcards from:

${input.content}`,
              },
            ],
          }),
        ]);

        return {
          summary: finalSummaryResponse.choices[0]?.message?.content || "",
          keyPoints: keyPointsResponse.choices[0]?.message?.content || "",
          flashcards: flashcardsResponse.choices[0]?.message?.content || "",
          usage,
          chunksProcessed: chunks.length,
        };
      } catch {
        throw new Error("Failed to generate study pack");
      }
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
