import { Router } from "express";
import verifyEmailController from "../controllers/verifyEmail.controller.js";

const verifyEmailRouter = Router();

verifyEmailRouter.get("/verify/:token", verifyEmailController);

export default verifyEmailRouter;
