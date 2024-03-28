import { db } from "@/server/db";
import { lessons, units } from "@/server/db/schema";
import { asc } from "drizzle-orm";
import React, { cache } from "react";
import LessonsSidebar from "./Sidebar";

const getUnits = cache(async (courseId: number) => {
  const data = await db.query.units.findMany({
    where: (units, { eq, and }) => and(eq(units.courseId, courseId), eq(units.isPublic, true)),
    orderBy: asc(units.unitNumber),
    with: {
      lessons: {
        orderBy: asc(lessons.position),
      },
    },
  });

  return data;
});

export default async function Layout(props: {
  params: {
    courseId: string;
    lessonId: string;
    unitId: string;
  };
  children: React.ReactNode;
}) {
  const { courseId, lessonId, unitId } = props.params;
  const data = await getUnits(parseInt(courseId));

  return (
    <html>
      <body>
        <div className="h-full">
          <div className="flex flex-row">
            <div className="hidden md:block">
              <LessonsSidebar data={data}
                unitId={parseInt(unitId)}
                lessonId={parseInt(lessonId)}
                courseId={parseInt(courseId)} />
            </div>
            <div className="p-10 pr-4">
              {props.children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
