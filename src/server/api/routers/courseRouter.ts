import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { courses, lessons, units, updateCourseSchema } from "@/server/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";


export async function getDashboardData() {
  return await db.query.courses.findMany({
    where: (courses, { eq }) => eq(courses.isPublic, true),
    columns: {
      id: true,
      name: true,
      description: true,
      subjectId: true,
      imageUrl: true,
    },
    with: {
      units: {
        columns: {
          id: true
        },
        where: (units, { eq }) => eq(units.isPublic, true)
      },
      subject: {
        columns: {
          name: true,
        }
      }
    }

  })
}


export const coursesRouter = createTRPCRouter({
  getDashboardData: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.isPublic, true),
        columns: {
          id: true,
          name: true,
          description: true,
          subjectId: true,
          imageUrl: true,
        },
        with: {
          units: {
            columns: {
            },
            where: (units, { eq }) => eq(units.isPublic, true)
          },
          subject: {
            columns: {
              name: true,
            }
          }
        }

      })
    }),
  update: protectedProcedure
    .input(updateCourseSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(courses).set(input).where(eq(courses.id, input.id))
      revalidatePath(`/dashboard/course/${input.id}`)
    })
  ,
  delete: protectedProcedure
    .input(z.object({
      id: z.number()
    })).mutation(async ({ ctx, input }) => {
      await ctx.db.delete(courses).where(eq(courses.id, input.id))
    }),
  getSidebar: publicProcedure
    .input(
      z.object({
        courseId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { courseId } = input;
      const data = await ctx.db.query.units.findMany({
        where: (units, { eq }) => eq(units.courseId, courseId),
        orderBy: asc(units.unitNumber),
        with: {
          lessons: {
            orderBy: asc(lessons.position),
          },
        },
      });

      return data;
    }),

})

