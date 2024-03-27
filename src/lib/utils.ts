import { type ClassValue, clsx } from "clsx"
import { type Column, type ColumnBaseConfig, type ColumnDataType, like, notLike, eq, not } from "drizzle-orm";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast.error(errors.join("\n"));
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else {
    return toast.error("Something went wrong, please try again later.");
  }
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function filterColumn({
  column,
  value,
}: {
  column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>;
  value: string;
}) {
  const [filterValue, filterVariety] = value?.split(".") ?? [];

  switch (filterVariety) {
    case "contains":
      return like(column, `%${filterValue}%`);
    case "does not contain":
      return notLike(column, `%${filterValue}%`);
    case "is":
      return eq(column, filterValue);
    case "is not":
      return not(eq(column, filterValue));
    default:
      return like(column, `%${filterValue}%`);
  }
}
import { type Session } from "next-auth";
import { type UserPermission, type CoursePermission, type SubjectPermission } from "@/types/permissions";

export const hasPermission = (session: Session, permissions: UserPermission[]) => {
  if (!session || !session.user) return false;
  const USER_PERMISSIONS = session.user.permissions;

  const matchedPermissions = USER_PERMISSIONS.filter((permission) => {
    return permissions.includes(permission);
  });

  return matchedPermissions.length > 0;
};

export const hasCoursePermission = (
  session: Session,
  requiredPermissions: CoursePermission[],
  courseId: number,
): boolean => {
  if (!session || !session.user) return false;
  if (session.user.permissions.includes("activites")) return true;

  // Find the course permissions for the given courseId
  const coursePermissions = session.user.courses
    .filter((course) => course.id === courseId)
    .flatMap((course) => course.roles);

  // Return false if no permissions are found for the course
  if (!coursePermissions.length) return false;

  // Check if all required permissions are included in the user's permissions
  return requiredPermissions.every((permission) =>
    coursePermissions.includes(permission),
  );
};

export const hasSubjectPermission = (
  session: Session,
  requiredPermissions: SubjectPermission[],
  subjectId: number,
): boolean => {
  if (!session || !session.user) return false;
  if (session.user.permissions.includes("activites")) return true;
  // Find the subject permissions for the given subjectId
  const subjectPermissions = session.user.subjects
    .filter((subject) => subject.id === subjectId)
    .flatMap((subject) => subject.roles);
  // Return false if no permissions are found for the subject
  if (!subjectPermissions.length) return false;
  // Check if all required permissions are included in the user's permissions
  return requiredPermissions.every((permission) =>
    subjectPermissions.includes(permission),
  );
};

export function extractNotionId(url: string) {
  const match = url.match(/([a-f0-9]{32})/);
  return match ? `a${match[1]}` : null;
}
