import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(403).json({ message: "(Username) or password are incorrect!" });

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword)
      return res.status(403).json({ message: "Username or (password) are incorrect!" });

    if (!user.verify && user.verificationTokenExpires > new Date())
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

    res.cookie("refresh_token", refresh_token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
