import jwt from "jsonwebtoken";

const refreshController = (req, res) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token)
    return res.status(401).json({ message: "No refresh token provided!" });

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET_KEY);

    const new_access_token = jwt.sign(
      { _id: decoded._id, email: decoded.email },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "15m" }
    );
    const new_refresh_token = jwt.sign(
      { _id: decoded._id, email: decoded.email },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("refresh_token", new_refresh_token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    });
    res.json({ user: decoded, access_token: new_access_token });
  } catch (error) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(401).json({ message: "Session expired!" });
  }
};

export default refreshController;
