/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { db } from "./db";
import { invokeLLM } from "./lib/invokeLLM";

export const appRouter = router({
  // =============================
  // Study Sessions
  // =============================
  studySession: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          subject: z.string(),
          type: z.string(),
          duration: z.number(),
          score: z.number().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const sessionId = await db.createStudySession({
          userId: ctx.user.id,
          title: input.title,
          subject: input.subject,
          type: input.type,
          duration: input.duration,
          score: input.score ? input.score.toFixed(2) : null,
        });

        return { sessionId };
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserStudySessions(ctx.user.id);
    }),
  }),

  // =============================
  // AI Study Features
  // =============================
  ai: router({
    generateStudyContent: protectedProcedure
      .input(
        z.object({
          content: z.string().min(10),
          mode: z.enum(["simple", "exam", "detailed"]).default("simple"),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // 🔒 Content length protection
          if (input.content.length > 4000) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Content too long. Maximum 4000 characters allowed.",
            });
          }

          // 🔥 (Optional) Usage limit logic placeholder
          /*
          const usageToday = await db.getTodayUsage(ctx.user.id);
          if (usageToday >= 10) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Daily free limit reached.",
            });
          }
          */

          const modePrompts: Record<
            "simple" | "exam" | "detailed",
            string
          > = {
            simple:
              "You are a friendly study assistant who explains topics in simple language suitable for beginners.",
            exam:
              "You are an exam preparation expert. Focus on high-yield revision points, definitions, and common exam angles.",
            detailed:
              "You are an expert tutor. Provide deep explanations including mechanisms, examples, and contextual understanding.",
          };

          const response = await invokeLLM({
            model: "gpt-4o-mini",
            temperature: input.mode === "exam" ? 0.3 : 0.6,
            max_tokens: 1000,
            messages: [
              {
                role: "system",
                content: `${modePrompts[input.mode]}

Return output strictly in valid JSON format:
{
  "summary": "string",
  "keyPoints": ["string"],
  "flashcards": [
    { "question": "string", "answer": "string" }
  ]
}

Do NOT include markdown.
Do NOT include explanations outside JSON.
Return ONLY valid JSON.`,
              },
              {
                role: "user",
                content: `Generate structured study material from the following text:

${input.content}`,
              },
            ],
          });

          const raw = response.choices[0]?.message?.content;

          if (!raw) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Empty AI response.",
            });
          }

          let parsed;

          try {
            parsed = JSON.parse(raw);
          } catch {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "AI returned invalid JSON.",
            });
          }

          if (
            !parsed.summary ||
            !Array.isArray(parsed.keyPoints) ||
            !Array.isArray(parsed.flashcards)
          ) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Malformed AI response structure.",
            });
          }

          // 🔥 (Optional) Track usage
          /*
          await db.incrementUsage(ctx.user.id);
          */

          return {
            summary: parsed.summary,
            keyPoints: parsed.keyPoints,
            flashcards: parsed.flashcards,
          };
        } catch (error) {
          console.error("AI generation error:", error);

          if (error instanceof TRPCError) {
            throw error;
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate study content.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;