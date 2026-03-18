import { Router } from "express";
import { LoginController } from "./login.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/login", asyncHandler(LoginController.login));

export default router;
