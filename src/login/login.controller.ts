import type { NextFunction, Request, Response } from "express";
import { LoginBo } from "./login.bo";
import { loginSchema } from "./login.schema";

export class LoginController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await LoginBo.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

