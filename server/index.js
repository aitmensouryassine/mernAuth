import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import signupRouter from "./routes/signup.route.js";
import verifyEmailRouter from "./routes/verifyEmail.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/auth", signupRouter);
app.use("/api/auth", verifyEmailRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  connectDB();
});
