/**
 * A simple protected route
 *
 * Responds with the authenticated user object attached by authMiddleware
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}A JSON response with user object on success, and with
 * error message on failure
 */

const profileController = (req, res) => {
  const user = req.user;

  try {
    return res.status(200).json({ user });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export default profileController;
