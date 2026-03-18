import {Router} from "express";
import {UserController} from "./user.controller";
import { requireAuth } from "../middleware/auth";

const router =Router();
const userController =new  UserController();

router.post("/register",userController.registerUser);
router.put("/change-role", requireAuth, userController.changeUserRole);
router.put("/approve-user", requireAuth, userController.approveUser);
router.get("/pending-users", requireAuth, userController.getPendingUsers);

export default router;