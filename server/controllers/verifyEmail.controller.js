import User from "../models/user.model.js";

/**
 * Verifies User's Email
 *
 * Gets the token, checks DB for a not expired token
 * sets user.verified to true and saves the user to DB
 *
 * Sends HTTP status 200 on success with a message
 * or 400 on failure with an error message
 *
 * @param {import('express').Request} req - Express Request Object
 * @param {import('express').Response} res - Express Response Object
 * @returns {Promise<void>} - Sends a JSON response {message: string}
 * with 200 HTTP status on success or 400 HTTP status on failure
 */
const verifyEmailController = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(403)
        .json({ message: "Verification link expired (or not found)!" });

    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified sunccessfully, please log in!" });
  } catch (error) {
    res.status(400).json({ message: "Unable to verify your email!" });
  }
};

export default verifyEmailController;
