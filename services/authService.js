const jwt = require('jsonwebtoken');
const redis = require('redis');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
require('dotenv').config();

const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redisClient.connect();

const generateToken = (user) => {
  const payload = { _id: user._id, username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid Token');
  }
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Invalid username or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid username or password');

  return generateToken(user);
};

const blacklistToken = async (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) throw new Error('Invalid Token');

  const expiration = decoded.exp - Math.floor(Date.now() / 1000);
  await redisClient.set(token, 'blacklisted', 'EX', expiration);
};

const isTokenBlacklisted = async (token) => {
  const result = await redisClient.get(token);
  return result === 'blacklisted';
};

module.exports = {
  generateToken,
  verifyToken,
  login,
  blacklistToken,
  isTokenBlacklisted,
};