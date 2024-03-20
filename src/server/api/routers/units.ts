import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { units, updateUnitSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const unitsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      courseId: z.number(),

    })).mutation(async ({ ctx, input }) => {
      const { name } = input;
      await ctx.db.insert(units).values({
        name: name,
        courseId: input.courseId,
        isPublic: false,
      })

    }),
  reorder: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      list: z.array(z.object({
        id: z.number(),
        position: z.number(),
      }))
    })).mutation(async ({ ctx, input }) => {
      const { list } = input;

      for (const item of list) {
        await ctx.db.update(units).set({
          unitNumber: item.position
        }).where(eq(units.id, item.id))
      }
      revalidatePath(`/dashboard/course/${input.courseId}/`)
    }),

  reorderLessons: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      unitId: z.number(),
      list: z.array(z.object({
        id: z.number(),
        position: z.number(),
      }))
    })).mutation(async ({ ctx, input }) => {
      const { list } = input;

      for (const item of list) {
        await ctx.db.update(units).set({
          unitNumber: item.position
        }).where(eq(units.id, item.id))
      }
      revalidatePath(`/dashboard/course/${input.courseId}/units/${input.unitId}`)
    }),
  update: protectedProcedure
    .input(updateUnitSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(units).set(input).where(eq(units.id, input.id))
    }),
  delete: protectedProcedure
    .input(z.object({
      id: z.number()
    })).mutation(async ({ ctx, input }) => {
      await ctx.db.delete(units).where(eq(units.id, input.id))
    })




})
