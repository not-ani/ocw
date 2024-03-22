import { CoursesList, CoursesListDashboard } from "@/components/course-list";
import { getAdminData } from "@/server/api/routers/courseRouter";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  subjectId: z.string().optional(),
})

export default async function Page({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { name, subjectId } = searchParamsSchema.parse(searchParams);
  const session = await getCurrentUser()
  if (!session?.user) return redirect(`/api/auth/signin`)

  const data = await getAdminData({
    name: name,
    subjectId: subjectId ? parseInt(subjectId) : undefined,
    currentUserId: session.user.id,
    isActivities: session.user.permissions.includes("activites"),
  })

  return (
    <div>
      <CoursesListDashboard data={data} />
    </div>
  )
}
