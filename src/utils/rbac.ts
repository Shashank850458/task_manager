import { AppError } from "./appError";

export type UserRole = "admin" | "manager" | "member" | "pending";

export function requireRole(role?: string): UserRole {
  if (role === "admin" || role === "manager" || role === "member" || role === "pending") return role;
  throw new AppError(403, "Missing or invalid role in token");
}

export function canManageAnyTasks(role: UserRole): boolean {
  return role === "admin" || role === "manager";
}

export function canCreateTasks(role: UserRole): boolean {
  return role === "admin" || role === "manager";
}

export function canUpdateTasks(role: UserRole): boolean {
  return role === "admin" || role === "manager" || role === "member";
}

export function canDeleteTasks(role: UserRole): boolean {
  return role === "admin" || role === "manager";
}

export function canManageUserRoles(role: UserRole): boolean {
  return role === "admin";
}

export function isUserApproved(role: UserRole): boolean {
  return role !== "pending";
}
