import express from "express";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);

export default app;
