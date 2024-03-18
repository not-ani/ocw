
import { CourseCard } from "@/components/course-card";
import { RouterOutputs } from "@/types/trpc";

type CourseWithProgressWithCategory = RouterOutputs["courses"]["getDashboardData"]
interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
  items
}: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => {
          if (!item) throw Error("Skill ISsue")
          return (
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.name}
              imageUrl={item.imageUrl!}
              unitLengths={item.units.length}
              category={item?.subject?.name!}
            />
          )
        })}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}
