import { lessons, updateLessonSchema } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { extractNotionId } from "@/lib/utils";





export const lessonsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateLessonSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(lessons).set(input).where(eq(lessons.id, input.id))
    }),
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      embedId: z.string(),
      unitId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      //FIXME: make sure that position autoincreaments
      const embedId = extractNotionId(input.embedId);
      if (!embedId) {
        throw new Error("NO ID FOUND IN URL")
      }
      await ctx.db.insert(lessons).values({
        ...input,
        isPublic: false,
        embedId: embedId
      })
    }),

  delete: protectedProcedure
    .input(z.object({
    id: z.number()
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(lessons).where(eq(lessons.id,input.id))
  })

})
