import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/units-form";
import { Actions } from "./_components/actions";
import { db } from "@/server/db";
import { asc } from "drizzle-orm";
import { getCurrentUser, getPermissions } from "@/server/auth";
import { sessionsRelations } from "@/server/db/schema";
import { hasCoursePermission } from "@/lib/permissions";
import { ACTIONS, CoursePermissions, getSenario } from "@/types/permissions";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  noStore()

  const session = await getCurrentUser()
  if (!session || !session.user) return redirect(`/api/auth/signin`)


  const courseId = parseInt(params.courseId)

  if (!hasCoursePermission({
    session: session,
    courseId: courseId,
    requiredPermissions: getSenario({
      action: ACTIONS.CAN_VIEW_DASHBOARD
    }) as CoursePermissions
  })) {
    redirect(`/unauthorized`)
  }

  const course = await db.query.courses.findFirst({
    where: (courses, { eq }) => eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units) => [asc(units.unitNumber)]
      },
    },
  });

  const categories = await db.query.subjects.findMany({
    columns: {
      id: true,
      name: true
    }
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.name,
    course.description,
    course.imageUrl,
    course.subjectId,
    course.units.some(chapter => chapter.isPublic),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublic && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublic}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your course
              </h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={{
                subjectId: String(course.subjectId)
              }}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: String(category.id),
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course Units
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;
