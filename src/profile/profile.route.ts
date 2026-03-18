import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ProfileController } from "./profile.controller";

const router = Router();

router.get("/profile", requireAuth, asyncHandler(ProfileController.getProfile));

export default router;

