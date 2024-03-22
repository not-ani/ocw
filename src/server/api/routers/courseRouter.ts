import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { courseTracker, courses, lessons, subjects, units, updateCourseSchema, users } from "@/server/db/schema";
import { and, arrayContains, arrayOverlaps, asc, eq, like, not, notLike, or, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { ACTIONS, CoursePermission, getSenario as getPermissions, permissions } from "@/types/permissions";
import { filterColumn } from "@/lib/utils";

export async function getAdminData({
  name,
  subjectId,
  currentUserId,
  isActivities = false,
}: {
  name: string | undefined,
  subjectId: number | undefined,
  currentUserId: string,
  isActivities: boolean,
}) {
  if (isActivities) {
    const data = await db.select({
      id: courses.id,
      name: courses.name,
      subjectId: courses.subjectId,
      imageUrl: courses.imageUrl,
      description: courses.description,
      subject: {
        name: subjects.name
      },
    })
      .from(courseTracker)
      .where(
        and(
          eq(courseTracker.userId, currentUserId),
        )
      )
      .innerJoin(courses,
        and(
          name ? filterColumn({ column: courses.name, value: name }) : undefined,
          subjectId ? eq(courses.subjectId, subjectId) : undefined,
          eq(courses.id, courseTracker.courseId),
        )
      )
      .innerJoin(subjects, eq(subjects.id, courses.id));
    return data

  }
  const data = await db.select({
    id: courses.id,
    name: courses.name,
    subjectId: courses.subjectId,
    imageUrl: courses.imageUrl,
    description: courses.description,
    subject: {
      name: subjects.name
    },
  })
    .from(courseTracker)
    .where(
      and(
        eq(courseTracker.userId, currentUserId),
        arrayOverlaps(courseTracker.permissions, getPermissions({
          action: ACTIONS.CAN_VIEW_DASHBOARD
        }) as string[]),
      )
    )
    .innerJoin(courses,
      and(
        name ? filterColumn({ column: courses.name, value: name }) : undefined,
        subjectId ? eq(courses.subjectId, subjectId) : undefined,
        eq(courses.id, courseTracker.courseId)
      )
    )
    .innerJoin(subjects, eq(subjects.id, courses.id));
  return data
}
export type Dashboard = Awaited<ReturnType<typeof getAdminData>>;


export async function getDashboardData({
  name,
  subjectId,
}: {
  name: string | undefined,
  subjectId: number | undefined
}) {
  return await db.query.courses.findMany({
    where: (courses, { eq, and }) => and(
      name ? filterColumn({ column: courses.name, value: name }) : undefined,
      subjectId ? eq(courses.subjectId, subjectId) : undefined,
      eq(courses.isPublic, true)
    ),
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
  getContributors: publicProcedure
    .input(z.object({
      id: z.number()
    })).query(async ({ ctx, input }) => {
      return await ctx.db.select({
        id: users.id,
        name: users.id,
        image: users.image
      })
        .from(users)
        .leftJoin(courseTracker, and(eq(courseTracker.courseId, input.id), not(arrayContains(courseTracker.permissions, ["none"]))))
    })

})

