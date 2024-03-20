import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/server/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { ChapterTitleForm } from "./_components/unit-title-form";
import { ChapterActions } from "./_components/unit-actions";
import { LessonsForm } from "./_components/lessons-form";
import { asc } from "drizzle-orm";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; unitId: string }
}) => {
  const cID = parseInt(params.courseId)
  const uID = parseInt(params.unitId)
  console.log(cID, uID)

  const unit = await db.query.units.findFirst({
    where: (units, { and, eq }) => and(
      eq(units.id, uID),
      eq(units.courseId, cID),
    ),
    with: {
      lessons: {
        orderBy: (units) => [asc(units.position)]
      }
    }
  });

  if (!unit) {
    return redirect("/")
  }

  const requiredFields = [
    unit.name,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!unit.isPublic && (
        <Banner
          variant="warning"
          label="This unit is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Unit Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={cID}
                unitId={uID}
                isPublished={unit.isPublic}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your unit
                </h2>
              </div>
              <ChapterTitleForm
                initialData={unit}
                courseId={parseInt(params.courseId)}
                unitId={parseInt(params.unitId)}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your unit
                </h2>
              </div>
              <LessonsForm
                initialData={unit}
                courseId={parseInt(params.courseId)}
                unitId={parseInt(params.unitId)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChapterIdPage;
