const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const { swaggerUi, specs } = require('./config/swaggerConfig');
const chatService = require('./services/chatService');

// Disable Mongoose debug mode globally
mongoose.set('debug', false);

// MongoDB connection
async function connectToDatabase() {
  const dbUrl = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URL : process.env.DB_URL;
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
}

// Middleware to parse JSON
app.use(express.json());

app.use(express.static('public'));
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Initialize Socket.IO with Redis
chatService.initializeSocket(server);

const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});

module.exports = { app, server };