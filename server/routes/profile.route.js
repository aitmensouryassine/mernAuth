import { Router } from "express";
import profileController from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const profileRouter = Router();

profileRouter.get("/profile", authMiddleware, profileController);

export default profileRouter;
