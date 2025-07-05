const profileController = (req, res) => {
  const user = req.user;

  try {
    return res.json({ user });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export default profileController;
