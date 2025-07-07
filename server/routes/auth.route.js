import { Router } from "express";
import signinController from "../controllers/signin.controller.js";
import signupController from "../controllers/signup.controller.js";
import verifyEmailController from "../controllers/verifyEmail.controller.js";
import refreshController from "../controllers/refresh.controller.js";

const authRouter = Router();

authRouter.post("/signin", signinController);
authRouter.post("/signup", signupController);
authRouter.get("/verify", verifyEmailController);
authRouter.get("/refresh", refreshController);

export default authRouter;
