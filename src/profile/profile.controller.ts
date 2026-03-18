import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { userDao } from "../user/user.dao";

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        throw new AppError(401, "Unauthorized");
      }

      const user = await userDao.findById(req.user.id);
      if (!user) {
        throw new AppError(404, "User not found");
      }

      res.status(200).json({
        userId: (user as any).userId,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
        role: user.role,
        createdTime: user.createdTime,
      });
    } catch (err) {
      next(err);
    }
  }
}

