import { z } from "zod";

/** Auth & Users */
const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;

export type UserLoginForm = Pick<Auth, "email" | "password">;

export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;

export type ConfirmToken = Pick<Auth, "token">;

export type RequestConfirmationCodeForm = Pick<Auth, "email">;

export type ForgotPasswordForm = Pick<Auth, "email">;

export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;

export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  "current_password" | "password" | "password_confirmation"
>;

export type CheckPasswordForm = Pick<Auth, "password">;

/** Users */

export const userScheme = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });

export type User = z.infer<typeof userScheme>;

export type UserProfileForm = Pick<User, "name" | "email">;

/** Notes */
const noteScheme = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userScheme,
  task: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteScheme>;

export type NoteFormData = Pick<Note, "content">;

/** Tasks */
const taskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);

export const taskSchema = z.object({
  _id: z.string(),
  taskName: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: userScheme,
      status: taskStatusSchema,
    })
  ),
  notes: z.array(noteScheme),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  taskName: true,
  description: true,
  project: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type Task = z.infer<typeof taskSchema>;

export type TaskProject = z.infer<typeof taskProjectSchema>;

export type TaskFormData = Pick<Task, "description" | "taskName">;

export type TaskStatus = z.infer<typeof taskStatusSchema>;

/** Projects */
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.string(userScheme.pick({ _id: true })),
  tasks: z.array(taskProjectSchema),
});

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    clientName: true,
    projectName: true,
    description: true,
    manager: true,
  })
);

export const editProjectSchema = projectSchema.pick({
  _id: true,
  projectName: true,
  clientName: true,
  description: true,
});

export type Project = z.infer<typeof projectSchema>;

export type ProjectFormData = Pick<
  Project,
  "clientName" | "projectName" | "description"
>;

export type EditProject = z.infer<typeof editProjectSchema>;

/** Team */
const teamMemberSchema = userScheme.pick({
  email: true,
  name: true,
  _id: true,
});

export const teamMembersSchema = z.array(teamMemberSchema);

export type TeamMember = z.infer<typeof teamMemberSchema>;

export type TeamMemberForm = Pick<TeamMember, "email">;
