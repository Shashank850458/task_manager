import { NextFunction, Request, Response } from "express";
import {UserBo} from "./user.bo"
import {userModelSchema} from "../models/user.model";
import { AppError } from "../utils/appError";
import { canManageUserRoles, requireRole } from "../utils/rbac";

export class UserController {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = userModelSchema.parse(req.body);
            const userBo = new UserBo();
            const createdUser = await userBo.registerUser(payload);

            const responseBody = {
                userId: (createdUser as any).userId,
                name: createdUser.name,
                email: createdUser.email,
                organizationId: createdUser.organizationId,
                organizationName: createdUser.organizationName,
                role: createdUser.role,
                createdTime: createdUser.createdTime,
            };

            res.status(201).json(responseBody);
        } catch (err) {
            next(err);
        }
    }

    async changeUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const adminRole = requireRole(req.user?.role);
            
            // Only admin can change roles
            if (!canManageUserRoles(adminRole)) {
                throw new AppError(403, "Only admins can change user roles");
            }

            const { userId, newRole } = req.body;
            
            if (!userId || !newRole) {
                throw new AppError(400, "userId and newRole are required");
            }

            const userBo = new UserBo();
            const updatedUser = await userBo.changeUserRole(userId, newRole);

            if (!updatedUser) {
                throw new AppError(500, "Failed to update user role");
            }

            const responseBody = {
                userId: (updatedUser as any).userId,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                organizationId: updatedUser.organizationId,
            };

            res.status(200).json(responseBody);
        } catch (err) {
            next(err);
        }
    }

    async approveUser(req: Request, res: Response, next: NextFunction) {
        try {
            const adminUserId = req.user?.id;
            if (!adminUserId) {
                throw new AppError(401, "Unauthorized");
            }

            const { userId, role } = req.body;
            
            if (!userId || !role) {
                throw new AppError(400, "userId and role are required");
            }

            const userBo = new UserBo();
            const approvedUser = await userBo.approveUser(adminUserId, userId, role);

            if (!approvedUser) {
                throw new AppError(500, "Failed to approve user");
            }

            const responseBody = {
                userId: (approvedUser as any).userId,
                name: approvedUser.name,
                email: approvedUser.email,
                role: approvedUser.role,
                organizationId: approvedUser.organizationId,
            };

            res.status(200).json(responseBody);
        } catch (err) {
            next(err);
        }
    }

    async getPendingUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const adminUserId = req.user?.id;
            if (!adminUserId) {
                throw new AppError(401, "Unauthorized");
            }

            const userBo = new UserBo();
            const pendingUsers = await userBo.getPendingUsers(adminUserId);

            const responseBody = pendingUsers.map(user => ({
                userId: (user as any).userId,
                name: user.name,
                email: user.email,
                organizationId: user.organizationId,
                createdTime: user.createdTime,
            }));

            res.status(200).json({ users: responseBody });
        } catch (err) {
            next(err);
        }
    }
}