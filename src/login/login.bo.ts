import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import { AppError } from "../utils/appError";
import { LoginDal } from "./login.dal";
import { isUserApproved } from "../utils/rbac";

export class LoginBo {
  public static async login(email: string, password: string) {
    const userDoc = await LoginDal.findUserByEmailWithPassword(email);
    if (!userDoc) {
      throw new AppError(401, "Invalid email or password");
    }

    const user = userDoc.toObject() as any;
    const passwordHash = user.password as string | undefined;
    if (!passwordHash) {
      throw new AppError(500, "User password not available for verification");
    }

    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) {
      throw new AppError(401, "Invalid email or password");
    }

    // Check if user is approved
    if (!isUserApproved(user.role)) {
      throw new AppError(403, "Your account is pending approval. Please contact your admin.");
    }

    const env = getEnv();
    const token = jwt.sign(
      {
        sub: String(user.userId),
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
        role: user.role,
        createdTime: user.createdTime,
      },
    };
  }
}

