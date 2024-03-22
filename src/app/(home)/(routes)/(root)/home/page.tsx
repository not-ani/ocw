import { CoursesList } from "@/components/course-list";
import { getDashboardData } from "@/server/api/routers/courseRouter";
import { z } from "zod";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  subjectId: z.string().optional()
})

export default async function Dashboard({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const {
    name,
    subjectId
  } = searchParamsSchema.parse(searchParams)

  const courses = await getDashboardData({
    name: name,
    subjectId: subjectId ? parseInt(subjectId) : undefined
  })

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
      <CoursesList
        items={courses}
      />
    </div>
  )
}
