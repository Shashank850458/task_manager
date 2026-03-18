import {UserModelType} from "../models/user.model";
import {userDao} from "./user.dao";
import bcrypt from "bcrypt";
import {AppError} from "../utils/appError";
import {requireRole} from "../utils/rbac";
import {v4 as uuidv4} from "uuid";

export class UserBo {
    public async registerUser(payload: UserModelType) {
        const existingUser = await userDao.findByEmail(payload.email);
        if (existingUser) {
            throw new AppError(409, "User already exists");
        }

        // Auto-generate organizationId for admin if not provided
        if (payload.role === "admin" && !payload.organizationId) {
            payload.organizationId = uuidv4();
        }

        // If role is specified as admin, check if admin already exists
        if (payload.role === "admin") {
            const existingAdmin = await userDao.findAdminByOrganization(payload.organizationId!);
            if (existingAdmin) {
                throw new AppError(400, "An admin already exists for this organization. Please register as member or manager and wait for approval.");
            }
        } else {
            // For non-admin roles, organizationId is required
            if (!payload.organizationId) {
                throw new AppError(400, "organizationId is required for non-admin users");
            }
            // Validate that the organization exists
            const orgAdmin = await userDao.findAdminByOrganization(payload.organizationId);
            if (!orgAdmin) {
                throw new AppError(400, "Invalid organizationId");
            }

            // For non-admin roles, set to pending
            payload.role = "pending";
        }

        payload.password = await bcrypt.hash(payload.password, 16);
        return await userDao.createUser(payload);
    }

    public async changeUserRole(userId: string, newRole: string) {
        // Validate the new role
        requireRole(newRole);

        // Check if user exists
        const user = await userDao.findById(userId);
        if (!user) {
            throw new AppError(404, "User not found");
        }

        const organizationId = (user as any).organizationId;

        // If trying to set to admin, check if there's already an admin
        if (newRole === "admin") {
            const existingAdmin = await userDao.findAdminByOrganization(organizationId);
            if (existingAdmin && String((existingAdmin as any).userId) !== userId) {
                throw new AppError(400, "An organization can have only one admin");
            }
        }

        // If changing an admin to another role, ensure there's still an admin left
        if ((user as any).role === "admin" && newRole !== "admin") {
            const existingAdmin = await userDao.findAdminByOrganization(organizationId);
            if (existingAdmin && String((existingAdmin as any).userId) === userId) {
                // This is the only admin, can't change their role
                throw new AppError(400, "Cannot change the admin's role as the organization must have exactly one admin");
            }
        }

        // Update the role
        return await userDao.updateUserRole(userId, newRole);
    }

    public async approveUser(adminUserId: string, userIdToApprove: string, approvedRole: string) {
        // Validate the approved role
        requireRole(approvedRole);
        if (approvedRole === "pending") {
            throw new AppError(400, "Cannot approve to pending role");
        }

        // Check if admin exists and is admin
        const admin = await userDao.findById(adminUserId);
        if (!admin || (admin as any).role !== "admin") {
            throw new AppError(403, "Only admins can approve users");
        }

        // Check if user to approve exists and is pending
        const userToApprove = await userDao.findById(userIdToApprove);
        if (!userToApprove) {
            throw new AppError(404, "User not found");
        }
        if ((userToApprove as any).role !== "pending") {
            throw new AppError(400, "User is not pending approval");
        }

        // Check same organization
        if ((userToApprove as any).organizationId !== (admin as any).organizationId) {
            throw new AppError(403, "Cannot approve users from different organizations");
        }

        // Update the role
        return await userDao.updateUserRole(userIdToApprove, approvedRole);
    }

    public async getPendingUsers(adminUserId: string) {
        // Check if admin exists and is admin
        const admin = await userDao.findById(adminUserId);
        if (!admin || (admin as any).role !== "admin") {
            throw new AppError(403, "Only admins can view pending users");
        }

        const organizationId = (admin as any).organizationId;
        return await userDao.findPendingUsersByOrganization(organizationId);
    }
}