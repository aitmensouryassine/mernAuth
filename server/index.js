import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import cookieParser from "cookie-parser";
import { redisConnect } from "./lib/redis.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);

/**
 * Start express server
 *
 * Connects to MongoDB first, then to Redis and then start the server
 * when failed exit with code 1
 *
 * @async
 * @function
 * @name startServer
 * @returns {Promise<void>} - Resolves when the server starts successfully.
 */
const startServer = async () => {
  try {
    await connectDB();
    await redisConnect();
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Server failed to start!", error);
    process.exit(1);
  }
};
startServer();

export default app;
