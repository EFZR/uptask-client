import { z } from "zod";

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
  status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;

export type TaskFormData = Pick<Task, "description" | "taskName">;

/** Projects */
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
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
  "clientName" | "projectName" | "description"
>;
