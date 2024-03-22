import { db } from '@/server/db';
import "prismjs/themes/prism-tomorrow.css";
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import { z } from 'zod';
import { Notion } from './notion';
import { getCurrentUser } from '@/server/auth';
import { hasCoursePermission } from '@/lib/permissions';
import { LessonsAction } from './LessonActions';

const searchParamsSchema = z.object({
  edit: z.string().optional()
})

const Page: React.FC<{
  params: {
    lessonId: string;
    courseId: string;
    unitId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}> = async ({ params, searchParams }) => {
  const { edit } = searchParamsSchema.parse(searchParams);
  const courseId = parseInt(params.courseId, 10); // Always specify radix

  const lessonId = parseInt(params.lessonId, 10);
  if (isNaN(courseId) || isNaN(lessonId)) {
    // Early return for invalid IDs
    console.error("Invalid courseId or lessonId");
    return notFound();
  }

  const data = await db.query.lessons.findFirst({
    where: (lessons, { eq }) => eq(lessons.id, lessonId)
  });

  if (!data) {
    console.error("No data found for lessonId:", lessonId);
    return notFound();
  }

  if (edit) {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      console.error("No session or user found");
      return redirect(`/api/auth/signin`);
    }

    const hasPermission = hasCoursePermission({
      session,
      requiredPermissions: ['edit:lessons'],
      courseId,
    });

    if (!hasPermission) {
      return redirect(`/courses/${courseId}/units/${params.unitId}/lessons/${params.lessonId}`);
    }

    return (
      <div>
        <LessonsAction isPublished={data.isPublic} disabled={false} lessonId={lessonId} courseId={courseId} />
        <Notion id={data.embedId} />
      </div>
    );

  } else {
    if (!data.isPublic) {
      console.error("Data is not public");
      return notFound();
    }
  }

  // Only return JSX for non-edit mode and public data
  return (
    <div>
      <Notion id={data.embedId} />
    </div>
  );
};

export default Page;
