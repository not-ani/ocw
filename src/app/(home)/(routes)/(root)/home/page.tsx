import { CoursesList } from "@/components/course-list";
import { getUserAuth } from "@/server/auth";
import { getDashboardData } from "@/server/api/routers/courseRouter";

export default async function Dashboard() {
  const { user } = await getUserAuth()
  if (!user) {
    return <div> No User </div>
  }
  const courses = await getDashboardData()


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
