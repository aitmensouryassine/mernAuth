import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import signupRouter from "./routes/signup.route.js";
import verifyEmailRouter from "./routes/verifyEmail.route.js";
import signinRouter from "./routes/signin.route.js";
import profileRouter from "./routes/profile.route.js";
import authMiddleware from "./middlewares/auth.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/auth", signupRouter);
app.use("/api/auth", verifyEmailRouter);
app.use("/api/auth", signinRouter);
app.use("/api/user", authMiddleware, profileRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  connectDB();
});
