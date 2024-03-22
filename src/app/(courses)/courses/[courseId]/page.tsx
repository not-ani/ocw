import React, { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/server/db";
import Image from "next/image";
import { and, arrayContains, arrayOverlaps, asc, eq, not, notIlike, notLike } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { courseTracker, users } from "@/server/db/schema";
import { CoursePermissions } from "@/types/permissions";

const getCourse = cache(async (courseId: number) => {
  noStore()
  const { course, contributors, units } = await db.transaction(async (tx) => {

    const course = await tx.query.courses.findFirst({
      where: (course, { eq }) => eq(course.id, courseId),
      with: {
        subject: {
          columns: {
            field: true,
          },
        },
      },
    });

    const units = await db.query.units.findMany({
      where: (units, { eq, and }) => and(eq(units.courseId, courseId), eq(units.isPublic, true)),
      with: {
        lessons: {
          orderBy: (lessons) => asc(lessons.position),
        },
      },
      orderBy: (units) => asc(units.unitNumber),
    });
    const contributors = await db.select({
      id: users.id,
      name: users.id,
      image: users.image
    })
      .from(users)
      .leftJoin(courseTracker,
        and(eq(courseTracker.courseId, course!.id),
          not(arrayContains(courseTracker.permissions, ["none"]
          ))))
    return {
      units,
      course,
      contributors
    };
  });

  return {
    course,
    units,
    contributors
  };
});


/**
 * An overview of all units under a course. i.e Unit 1, Unit 2, Unit 3 under AP Bio
 *
 * @see httpa://github.com/ani-0/creek-ocw/issues/5
 * */
export default async function Page(props: {
  params: {
    courseId: string;
  };
}) {
  const { courseId } = props.params;
  const cId = parseInt(courseId)
  const { course, units } = await getCourse(cId);
  if (!course) {
    return <div>Course not found</div>;
  }
  if (!units) {
    return <div>Units not found</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-center p-5">
        <Image
          src={course.imageUrl}
          width={300}
          height={300}
          alt={String(course.id)}
          className="rounded-xl"
        />
        <div className="ml-4 flex flex-col">
          <h3 className="text-3xl font-bold">{course.name}</h3>
          <Badge className="w-[80px]">{course.subject.field}</Badge>
        </div>
      </div>
      <div className="my-4 p-4">
        {units.map((unit) => (
          <Accordion key={unit.unitNumber} type="multiple" className="my-2">
            <AccordionItem value={`${unit.unitNumber}`}>
              <AccordionTrigger className="flex justify-between rounded-lg bg-primary-foreground p-4 hover:bg-muted">
                {unit.name}
              </AccordionTrigger>
              <AccordionContent className="rounded-lg p-4 shadow">
                {unit.lessons.map((lesson) => (
                  <Link
                    href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                    key={lesson.id}
                    className="block rounded p-2 "
                  >
                    {lesson.name}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
