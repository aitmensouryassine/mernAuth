import jwt from "jsonwebtoken";
import { delKey } from "../lib/redis.js";

/**
 * Handles user logout
 *
 * Gets the refresh_token from req.cookies, verifies the signature
 * deletes Redis key if valid
 * and clears the cookie "refresh_token" regardless of token validity
 *
 * Always respond with HTTP 200 and a JSON success message
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Always sends a JSON {message: string}.
 */

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

  res.status(200).json({ message: "Logout successfully!" });
};

export default logoutController;
