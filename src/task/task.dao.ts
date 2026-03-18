import { taskModel } from "../models/task.model";

export class TaskDao {
  public static async create(payload: any) {
    return taskModel.create(payload);
  }

  public static async findByIdForOrg(taskId: string, organizationId: string) {
    return taskModel.findOne({ taskId, organizationId });
  }

  public static async listForOrg(
    organizationId: string,
    filter: { status?: string; priority?: string; q?: string },
    page: number,
    limit: number,
  ) {
    const query: any = { organizationId };
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.q) query.title = { $regex: filter.q, $options: "i" };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      taskModel
        .find(query)
        .sort({ createdTime: -1 })
        .skip(skip)
        .limit(limit),
      taskModel.countDocuments(query),
    ]);

    return { items, total };
  }

  public static async updateByIdForOrg(
    taskId: string,
    organizationId: string,
    updates: any,
  ) {
    return taskModel.findOneAndUpdate(
      { taskId, organizationId },
      { $set: { ...updates, updatedTime: Date.now() } },
      { returnDocument: 'after' },
    );
  }

  public static async deleteByIdForOrg(taskId: string, organizationId: string) {
    return taskModel.findOneAndDelete({ taskId, organizationId });
  }
}

