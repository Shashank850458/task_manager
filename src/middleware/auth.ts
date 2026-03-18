import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import { AppError } from "../utils/appError";

type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  organizationId?: string;
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization") ?? req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    return next(new AppError(401, "Missing Authorization Bearer token"));
  }

  try {
    const env = getEnv();
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!decoded?.sub) {
      return next(new AppError(401, "Invalid token"));
    }

    req.user = {
      id: String(decoded.sub),
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };

    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

