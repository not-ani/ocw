import { CoursePermission, SubjectPermission, UserPermission } from "@/types/permissions";
import { Session } from "next-auth";

export const hasPermission = (session: Session, permissions: UserPermission[]) => {
  if (!session || !session.user) return false;
  const USER_PERMISSIONS = session.user.permissions;

  const matchedPermissions = USER_PERMISSIONS.filter((permission) => {
    return permissions.includes(permission);
  });

  return matchedPermissions.length > 0;
};

export const hasCoursePermission = ({
  session,
  requiredPermissions,
  courseId,
}: {
  session: Session,
  requiredPermissions: CoursePermission[],
  courseId: number,
}): boolean => {
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
