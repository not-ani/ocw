import { courseTracker } from "@/server/db/schema";
import { type CoursePermission } from "@/types/permissions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hasCoursePermission, hasSubjectPermission } from "@/lib/utils";


export const userRouter = createTRPCRouter({
  updateCoursePermissions: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        permissions: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, permissions, userId } = input;

      if (
        hasCoursePermission(ctx.session, ["read:users"], courseId) === false
      ) {
        throw new Error("You do not have permission to manage this course");
      }

      await ctx.db
        .update(courseTracker)
        .set({
          permissions: permissions as CoursePermission[],
        })
        .where(
          and(
            eq(courseTracker.userId, userId),
            eq(courseTracker.courseId, courseId),
          ),
        );
      revalidatePath(`/user/${userId}/`);
    }),

  updateSubjectPermissions: protectedProcedure
    .input(
      z.object({
        subjectId: z.number(),
        permissions: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subjectId, permissions, userId } = input;
      if (
        hasSubjectPermission(ctx.session, ["read:users"], subjectId) === false
      ) {
        throw new Error("You do not have permission to manage this subject");
      }
      await ctx.db
        .update(courseTracker)
        .set({
          permissions: permissions as CoursePermission[],
        })
        .where(
          and(
            eq(courseTracker.userId, userId),
            eq(courseTracker.courseId, subjectId),
          ),
        );
      revalidatePath(`/users/${userId}/subjects`);
    }),

  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const user = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, id),
      });
      return user;
    }),

  findAll: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
      },
    });

    return users;
  }),
})
