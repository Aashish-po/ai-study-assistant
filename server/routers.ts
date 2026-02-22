/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

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

  // Study Materials
  materials: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          subject: z.string().min(1).max(100),
          content: z.string().min(1),
          fileUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const materialId = await db.createStudyMaterial({
            userId: ctx.user.id,
            title: input.title,
            subject: input.subject,
            content: input.content,
            fileUrl: input.fileUrl,
          });

          return { materialId, success: true };
        } catch (error) {
          console.error("Error creating material:", error);
          throw error;
        }
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserStudyMaterials(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return db.getStudyMaterial(input.id);
      }),
  }),

  // Quiz
  quiz: router({
    generateQuestions: protectedProcedure
      .input(
        z.object({
          materialId: z.number(),
          count: z.number().default(5),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const material = await db.getStudyMaterial(input.materialId);
        if (!material) throw new Error("Material not found");

        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert educator. Generate multiple choice questions based on the provided study material.",
              },
              {
                role: "user",
                content: `Generate ${input.count} MCQ questions from this material:\n\n${material.content}`,
              },
            ],
          });

          return {
            questions: response.choices[0]?.message?.content || "",
          };
        } catch (error) {
          console.error("Error generating questions:", error);
          throw error;
        }
      }),

    submitSession: protectedProcedure
      .input(
        z.object({
          subject: z.string(),
          totalQuestions: z.number(),
          correctAnswers: z.number(),
          duration: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const score = (input.correctAnswers / input.totalQuestions) * 100;
        const sessionId = await db.createQuizSession({
          userId: ctx.user.id,
          subject: input.subject,
          totalQuestions: input.totalQuestions,
          correctAnswers: input.correctAnswers,
          score: score.toFixed(2),
          duration: input.duration,
        });

        return { sessionId, score: score.toFixed(2) };
      }),

    getSessions: protectedProcedure.query(({ ctx }) => {
      return db.getUserQuizSessions(ctx.user.id);
    }),
  }),

  // Revision Planner
  revision: router({
    createPlan: protectedProcedure
      .input(
        z.object({
          examDate: z.date(),
          subject: z.string(),
          totalTopics: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const planId = await db.createRevisionPlan({
          userId: ctx.user.id,
          examDate: input.examDate,
          subject: input.subject,
          totalTopics: input.totalTopics,
        });

        return { planId };
      }),

    getPlan: protectedProcedure.query(({ ctx }) => {
      return db.getUserRevisionPlan(ctx.user.id);
    }),
  }),

  // Study Sessions
  sessions: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          subject: z.string(),
          type: z.enum(["quiz", "revision", "voice", "summary"]),
          duration: z.number(),
          score: z.number().optional(),
        })
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

  // AI Features
  ai: router({
    generateSummary: publicProcedure
      .input(z.object({ content: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert study assistant. Create a concise summary highlighting key points.",
              },
              {
                role: "user",
                content: `Summarize this:\n\n${input.content}`,
              },
            ],
          });

          return {
            summary: response.choices[0]?.message?.content || "",
          };
        } catch (error) {
          throw new Error("Failed to generate summary");
        }
      }),

    generateKeyPoints: publicProcedure
      .input(z.object({ content: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "Extract key points from the provided text. Return as a JSON array of strings.",
              },
              {
                role: "user",
                content: `Extract key points from:\n\n${input.content}`,
              },
            ],
          });

          return {
            keyPoints: response.choices[0]?.message?.content || "",
          };
        } catch (error) {
          return { keyPoints: [] };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
