import type { NextFunction, Request, Response } from "express";
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "../models/task.model";
import { AppError } from "../utils/appError";
import { TaskBo } from "./task.bo";
import { canCreateTasks, canDeleteTasks, requireRole } from "../utils/rbac";

function requireOrgId(req: Request): string {
  const orgId = req.user?.organizationId;
  if (!orgId) throw new AppError(403, "Missing organizationId in token");
  return orgId;
}

function requireUserId(req: Request): string {
  const userId = req.user?.id;
  if (!userId) throw new AppError(401, "Unauthorized");
  return userId;
}

function getRole(req: Request): string | undefined {
  return req.user?.role;
}

export class TaskController {
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const role = requireRole(getRole(req));
      
      // Only admin and manager can create tasks
      if (!canCreateTasks(role)) {
        throw new AppError(403, "Only admin and manager can create tasks");
      }

      const organizationId = requireOrgId(req);
      const createdByUserId = requireUserId(req);
      const input = createTaskSchema.parse(req.body);
      const created = await TaskBo.createTask(organizationId, createdByUserId, input);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = requireOrgId(req);
      const query = listTasksQuerySchema.parse(req.query);
      const { items, total } = await TaskBo.listTasks(organizationId, query);
      res.status(200).json({
        items,
        page: query.page,
        limit: query.limit,
        total,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = requireOrgId(req);
      const task = await TaskBo.getTask(organizationId, String(req.params.id));
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = requireOrgId(req);
      const actor = { userId: requireUserId(req), role: getRole(req) };
      const updates = updateTaskSchema.parse(req.body);
      const updated = await TaskBo.updateTask(
        organizationId,
        actor,
        String(req.params.id),
        updates,
      );
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const role = requireRole(getRole(req));
      
      // Only admin and manager can delete tasks
      if (!canDeleteTasks(role)) {
        throw new AppError(403, "Only admin and manager can delete tasks");
      }

      const organizationId = requireOrgId(req);
      const actor = { userId: requireUserId(req), role: getRole(req) };
      await TaskBo.deleteTask(organizationId, actor, String(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

