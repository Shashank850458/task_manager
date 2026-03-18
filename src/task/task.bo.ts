import { AppError } from "../utils/appError";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../models/task.model";
import { TaskDal } from "./task.dal";
import { canManageAnyTasks, requireRole } from "../utils/rbac";

export class TaskBo {
  public static async createTask(
    organizationId: string,
    createdByUserId: string,
    input: CreateTaskInput,
  ) {
    const payload = {
      ...input,
      dueDate: input.dueDate ? input.dueDate.getTime() : null,
      createdByUserId,
      organizationId,
    };
    return TaskDal.create(payload);
  }

  public static async listTasks(organizationId: string, query: ListTasksQuery) {
    return TaskDal.listForOrg(
      organizationId,
      { status: query.status, priority: query.priority, q: query.q },
      query.page,
      query.limit,
    );
  }

  public static async getTask(organizationId: string, taskId: string) {
    const task = await TaskDal.findByIdForOrg(taskId, organizationId);
    if (!task) throw new AppError(404, "Task not found");
    return task;
  }

  public static async updateTask(
    organizationId: string,
    actor: { userId: string; role?: string },
    taskId: string,
    updates: UpdateTaskInput,
  ) {
    const role = requireRole(actor.role);
    if (!canManageAnyTasks(role)) {
      const existing = await TaskDal.findByIdForOrg(taskId, organizationId);
      if (!existing) throw new AppError(404, "Task not found");

      const isOwner = String((existing as any).createdByUserId) === actor.userId;
      const isAssignee =
        (existing as any).assignedToUserId &&
        String((existing as any).assignedToUserId) === actor.userId;

      if (!isOwner && !isAssignee) {
        throw new AppError(403, "You don't have permission to update this task");
      }
    }

    const normalized = {
      ...updates,
      dueDate:
        updates.dueDate === undefined
          ? undefined
          : updates.dueDate
            ? updates.dueDate.getTime()
            : null,
    };

    const updated = await TaskDal.updateByIdForOrg(taskId, organizationId, normalized);
    if (!updated) throw new AppError(404, "Task not found");
    return updated;
  }

  public static async deleteTask(
    organizationId: string,
    actor: { userId: string; role?: string },
    taskId: string,
  ) {
    const role = requireRole(actor.role);
    if (!canManageAnyTasks(role)) {
      const existing = await TaskDal.findByIdForOrg(taskId, organizationId);
      if (!existing) throw new AppError(404, "Task not found");

      const isOwner = String((existing as any).createdByUserId) === actor.userId;
      const isAssignee =
        (existing as any).assignedToUserId &&
        String((existing as any).assignedToUserId) === actor.userId;

      if (!isOwner && !isAssignee) {
        throw new AppError(403, "You don't have permission to delete this task");
      }
    }

    const deleted = await TaskDal.deleteByIdForOrg(taskId, organizationId);
    if (!deleted) throw new AppError(404, "Task not found");
    return deleted;
  }
}

