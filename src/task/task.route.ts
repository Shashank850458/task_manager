import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { TaskController } from "./task.controller";

const router = Router();

router.post("/tasks", requireAuth, asyncHandler(TaskController.create));
router.get("/tasks", requireAuth, asyncHandler(TaskController.list));
router.get("/tasks/:id", requireAuth, asyncHandler(TaskController.getById));
router.put("/tasks/:id", requireAuth, asyncHandler(TaskController.update));
router.delete("/tasks/:id", requireAuth, asyncHandler(TaskController.remove));

export default router;

