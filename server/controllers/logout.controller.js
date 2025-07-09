import jwt from "jsonwebtoken";
import { delKey } from "../lib/redis.js";

const logoutController = async (req, res) => {
  const { refresh_token } = req.cookies;

  try {
    if (refresh_token) {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET_KEY);
      await delKey(`refresh_token:${decoded._id}`);
    }
  } catch (error) {
    console.error("Error while logging out! " + error);
  }

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });

  res.status(200).json({ message: "Logout successefully!" });
};

export default logoutController;
