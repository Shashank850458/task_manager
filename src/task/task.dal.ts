import { TaskDao } from "./task.dao";

export class TaskDal {
  public static async create(payload: any) {
    return TaskDao.create(payload);
  }

  public static async findByIdForOrg(taskId: string, organizationId: string) {
    return TaskDao.findByIdForOrg(taskId, organizationId);
  }

  public static async listForOrg(
    organizationId: string,
    filter: { status?: string; priority?: string; q?: string },
    page: number,
    limit: number,
  ) {
    return TaskDao.listForOrg(organizationId, filter, page, limit);
  }

  public static async updateByIdForOrg(
    taskId: string,
    organizationId: string,
    updates: any,
  ) {
    return TaskDao.updateByIdForOrg(taskId, organizationId, updates);
  }

  public static async deleteByIdForOrg(taskId: string, organizationId: string) {
    return TaskDao.deleteByIdForOrg(taskId, organizationId);
  }
}

