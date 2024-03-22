export const permissions = ["basics", "activites"] as const;

export type UserPermission = (typeof permissions)[number];
export type UserPermissions = UserPermission[];

export const course_permissions = [
  "none",
  "read:users",
  "add:lessons",
  "add:tags",
  "add:courses",
  "edit:lessons",
  "edit:tags",
  "edit:courses",
] as const;

export type CoursePermission = (typeof course_permissions)[number];
export type CoursePermissions = CoursePermission[];

export const subject_permissions = ["read:users", "add:courses"];
export type SubjectPermission = (typeof subject_permissions)[number];
export type SubjectPermissions = SubjectPermission[];

export enum ACTIONS {
  CAN_VIEW_DASHBOARD
}

export function getSenario({
  action
}: {
  action: ACTIONS
}) {
  switch (action) {
    case ACTIONS.CAN_VIEW_DASHBOARD:
      return ["add:tags", "read:users", "edit:lessons", "edit:courses"] as CoursePermissions as string[]
    default:
      break;
  }

}
