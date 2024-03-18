import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { courses } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";


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
    })


})
