import express from "express";
import dotenv from "dotenv";
import signupRouter from "./routes/signup.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/auth", signupRouter);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
