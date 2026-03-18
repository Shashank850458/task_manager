import mongoose from "mongoose";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().trim().min(1).optional(),
  status: taskStatusSchema.default("todo"),
  priority: taskPrioritySchema.default("medium"),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  assignedToUserId: z.string().trim().min(1).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" },
);

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  q: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

export type TaskModelType = {
  taskId?: string;
  title: string;
  description?: string;
  status: z.infer<typeof taskStatusSchema>;
  priority: z.infer<typeof taskPrioritySchema>;
  dueDate?: number | null;
  tags: string[];
  assignedToUserId?: string;
  createdByUserId: string;
  organizationId: string;
  createdTime: number;
  updatedTime: number;
};

const taskSchema = new mongoose.Schema<TaskModelType>(
  {
    taskId: { type: String, required: true, unique: true, default: () => uuidv4() },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    dueDate: { type: Number, default: null },
    tags: { type: [String], default: [] },
    assignedToUserId: { type: String },
    createdByUserId: { type: String, required: true, index: true },
    organizationId: { type: String, required: true, index: true },
    createdTime: { type: Number, default: () => Date.now() },
    updatedTime: { type: Number, default: () => Date.now() },
  },
  { versionKey: false },
);

taskSchema.index({ organizationId: 1, createdTime: -1 });

export const taskModel = mongoose.model("Task", taskSchema);

