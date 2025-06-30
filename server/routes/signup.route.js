import { Router } from "express";
import signup from "../controllers/signup.controller.js";

const signupRouter = Router();

signupRouter.post("/signup", signup);

export default signupRouter;
