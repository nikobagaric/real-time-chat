const Message = require('../models/messageModel');
const ChatRoom = require('../models/chatRoomModel');
const { Server } = require('socket.io');
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

let io;

const pubClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

const initializeSocket = async (server) => {
  io = new Server(server);

  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('sendMessage', async ({ roomId, senderId, content }) => {
      try {
        const message = await sendMessage(roomId, senderId, content);
        io.to(roomId).emit('receiveMessage', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });
  });
};

const sendMessage = async (roomId, senderId, content) => {
  const message = new Message({
    sender: senderId,
    content,
  });

  try {
    const savedMessage = await message.save();
    await ChatRoom.findByIdAndUpdate(roomId, { $push: { messages: savedMessage._id } });
    return savedMessage;
  } catch (err) {
    throw new Error('Error sending message: ' + err.message);
  }
};

const getMessages = async (roomId) => {
  try {
    const room = await ChatRoom.findById(roomId).populate('messages');
    return room.messages;
  } catch (err) {
    throw new Error('Error retrieving messages: ' + err.message);
  }
};

const createChatRoom = async (name, userIds) => {
  const chatRoom = new ChatRoom({
    name,
    users: userIds,
  });

  try {
    const savedChatRoom = await chatRoom.save();
    return savedChatRoom;
  } catch (err) {
    throw new Error('Error creating chat room: ' + err.message);
  }
};

module.exports = {
  initializeSocket,
  sendMessage,
  getMessages,
  createChatRoom,
};