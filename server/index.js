import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  connectDB();
});
