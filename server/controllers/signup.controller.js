const signup = (req, res) => {
  try {
    const { name, email, password } = req.body;
    res.status(201).json({ name, email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default signup;
