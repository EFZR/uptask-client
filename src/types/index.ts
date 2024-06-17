import { z } from "zod";

/** Auth & Users */
const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  taskName: true,
  description: true,
  project: true,
  status: true,
});

export type Task = z.infer<typeof taskSchema>;

export type TaskFormData = Pick<Task, "description" | "taskName">;

export type TaskStatus = z.infer<typeof taskStatusSchema>;

/** Projects */
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  tasks: z.array(taskSchema),
});

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    clientName: true,
    projectName: true,
    description: true,
  })
);

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<
  Project,
  "clientName" | "projectName" | "description" | "tasks"
>;
