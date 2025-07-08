import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { setKey } from "../lib/redis.js";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(403).json({ message: "Invalid email or password!" });

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword)
      return res.status(403).json({ message: "Invalid email or password!" });

    if (!user.verify)
      return res.status(403).json({ message: "Please verify your email first!" });

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

    res
      .status(201)
      .json({ message: "You're now logged in Successefylly!", access_token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default signin;
