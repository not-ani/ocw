import { SubjectPermission, CoursePermission } from "@/types/permissions";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { type UserPermissions } from "@/types/permissions";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ocw_${name}`);
export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  roles: json("roles").$type<UserPermissions>().default(["basics"]).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const fieldEnum = pgEnum('field', [
  'Math',
  'Science',
  'Computer Science',
  'Social Studies',
  'World Languages',
  'English',
  'Debate',
]);

// Define Subjects table
export const subjects = createTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  field: fieldEnum('field')
});

// Define Courses table
export const courses = createTable('courses', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull(),
  name: text('name').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  imageUrl: text('image_url').default('/placeholder.png').notNull(),
  description: text('description').notNull()
});

// Define Units table
export const units = createTable('units', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  unitNumber: serial('unitNumber').notNull(),
  name: text('name').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
});

export type Units = typeof units.$inferSelect;
export type Course = typeof courses.$inferSelect

// Define Lessons table
export const lessons = createTable('lessons', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id').notNull(),
  position: integer('position').notNull().default(100),
  name: text('name').notNull(),
  embedId: text('embedId').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
});

// Define relationships
export const subjectsRelations = relations(subjects, ({ many }) => ({
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  subject: one(subjects, { fields: [courses.subjectId], references: [subjects.id] }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, { fields: [units.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  unit: one(units, { fields: [lessons.unitId], references: [units.id] }),
}));

export const subjectTracker = createTable(
  "subject_tracker",
  {
    userId: text("userId").notNull(),
    subjectId: integer("subjectId").notNull(),
    permissions: json("permissions").$type<SubjectPermission[]>().notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.subjectId),
  }),
);

export const subjectTrackerRelations = relations(subjectTracker, ({ one }) => ({
  user: one(users, {
    fields: [subjectTracker.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [subjectTracker.subjectId],
    references: [subjects.id],
  }),
}));

export const courseTracker = createTable(
  "courses_tracker",
  {
    userId: text("userId").notNull(),
    courseId: integer("courseId").notNull(),
    permissions: json("permissions").$type<CoursePermission[]>().notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.courseId),
  }),
);

export const subjectRelations = relations(courseTracker, ({ one }) => ({
  user: one(users, {
    fields: [courseTracker.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [courseTracker.courseId],
    references: [courses.id],
  }),
}));


export const updateCourseSchema = createSelectSchema(courses, {
  name: z.string().optional(),
  subjectId: z.number().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  imageUrl: z.string().optional(),
})

export const updateLessonSchema = createSelectSchema(lessons, {
  name: z.string().optional(),
  unitId: z.number().optional(),
  isPublic: z.boolean().optional(),
  embedId: z.string().optional(),
  position: z.number().optional()
})

export const updateUnitSchema = createSelectSchema(units, {
  name: z.string().optional(),
  isPublic: z.boolean().optional(),
  unitNumber: z.number().optional(),
  courseId: z.number().optional()
})

export type Lessons = typeof lessons.$inferSelect
