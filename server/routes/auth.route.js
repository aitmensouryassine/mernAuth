import { Router } from "express";
import signinController from "../controllers/signin.controller.js";
import signupController from "../controllers/signup.controller.js";
import verifyEmailController from "../controllers/verifyEmail.controller.js";
import refreshController from "../controllers/refresh.controller.js";
import logoutController from "../controllers/logout.controller.js";

const authRouter = Router();

authRouter.post("/signin", signinController);
authRouter.post("/signup", signupController);
authRouter.get("/verify/:token", verifyEmailController);
authRouter.get("/refresh", refreshController);
authRouter.get("/logout", logoutController);

export default authRouter;
