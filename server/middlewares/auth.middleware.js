import jwt from "jsonwebtoken";

/**
 * Checks if the user is authenticated
 *
 * Gets the access token from the Authorization header
 * checks if it's a valid token
 * sets req.user to decoded payload and calls next()
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {Promise<void>} Calls next on success or returns a
 * JSON response {message: string} with a 401 status on failure
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Token not provided!" });

    let token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token!" });
  }
};

export default authMiddleware;
