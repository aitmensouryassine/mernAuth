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

    res.status(201).json({ message: "You're now logged in Successefylly!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default signin;
