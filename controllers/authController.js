const authService = require('../services/authService');
const userService = require('../services/userService');

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Register a new user
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userService.createUser(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Logout a user
exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    await authService.blacklistToken(token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};