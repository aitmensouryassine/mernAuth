import User from "../models/user.model.js";

const verifyEmailController = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $lte: Date.now() },
    });

    if (!user)
      return res
        .status(403)
        .json({ message: "Verification link expired (Or not found)!" });

    user.verified = true;
    user.verificationTokenExpires = null;
    user.save();

    res.status(200).json({ message: "Email verified sunccessefully, please log in!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default verifyEmailController;
