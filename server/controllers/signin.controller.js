import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { setKey } from "../lib/redis.js";

/**
 * Handles user signin
 *
 * Retrieves user credentials from req.body
 * checks DB if user exists, if exists, compares provided
 * password to the one in the DB, checks if user is verified
 * then signs the access and refresh tokens, save refresh_token:userId key
 * to Redis and set an httpOnly cookie for the refresh token
 *
 * Sends a response with a success message and the access token on success
 * or an error on failure
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends a JSON response {message:string, access_token:string} on success
 * or {message: string} on failure
 */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid email or password!" });

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword)
      return res.status(401).json({ message: "Invalid email or password!" });

    if (!user.verified)
      return res.status(401).json({ message: "Please verify your email first!" });

    const access_token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    const refresh_token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const ttl = 7 * 24 * 60 * 60;
    await setKey(`refresh_token:${user._id}`, refresh_token, ttl);

    res.cookie("refresh_token", refresh_token, {
      expires: new Date(Date.now() + ttl * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "You're now logged in Successfully!", access_token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default signin;
