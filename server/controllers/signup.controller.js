import User from "../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return res.status(409).json({ message: "User already exists!" });

    // Create a token for email verification
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Save user to DB
    user = await User.create({ name, email, password, verificationToken });

    // Verification email link
    const link = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    const htmlMessage = `<h1>Verify Your Email</h1>
                        <p>Please click the button to verify your email</p>
                        <button><a ${link}>Verify</a></button>
                        <p>If you can't click the button use this instead:</p>
                        <p>${link}</p>
                        </br>
                        <p>Ignore this email if you didn't signup to mernAuth.com</p>
                        `;

    const info = await sendEmail(email, "Verify your email!", htmlMessage);

    return res.status(201).json({ message: "Please check your inbox (or spam)!", info });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default signup;
