const userService = require('../services/userService');

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userService.createUser(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const updatedUser = await userService.updateUser(req.params.id, username, password);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};