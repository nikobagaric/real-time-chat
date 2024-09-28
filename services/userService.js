const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const createUser = async (username, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ username, password: hashedPassword });
  try {
    const savedUser = await user.save();
    return savedUser;
  } catch (err) {
    throw new Error("Error creating user: " + err.message);
  }
};

const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    throw new Error("Error finding user: " + err.message);
  }
};

const validatePassword = async (inputPassword, userPassword) => {
  try {
    const isValid = await bcrypt.compare(inputPassword, userPassword);
    return isValid;
  } catch (err) {
    throw new Error("Error validating password: " + err.message);
  }
};

const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    throw new Error("Error finding user: " + err.message);
  }
};

const updateUser = async (id, username, password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, password: hashedPassword },
      { new: true }
    );
    return updatedUser;
  } catch (err) {
    throw new Error("Error updating user: " + err.message);
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (err) {
    throw new Error("Error deleting user: " + err.message);
  }
};

const listUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw new Error("Error listing users: " + err.message);
  }
};

module.exports = {
  createUser,
  findUserByUsername,
  validatePassword,
  findUserById,
  updateUser,
  deleteUser,
  listUsers,
};