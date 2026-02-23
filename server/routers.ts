export const appRouter = router({
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

        // --- Chunking logic ---
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

        // Generate summaries for each chunk concurrently
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

        // Final summary and key points
        const [finalSummaryResponse, keyPointsResponse] = await Promise.all([
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
        ]);

        return {
          summary: finalSummaryResponse.choices[0]?.message?.content || "",
          keyPoints: keyPointsResponse.choices[0]?.message?.content || "",
          usage,
          chunksProcessed: chunks.length,
        };
      } catch (error) {
        throw new Error("Failed to generate study pack");
      }
    }),
});