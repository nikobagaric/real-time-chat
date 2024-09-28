const chatService = require('../services/chatService');

exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const history = await chatService.getMessages(roomId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { roomId, senderId, content } = req.body;
  try {
    const message = await chatService.sendMessage(roomId, senderId, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createChatRoom = async (req, res) => {
  const { name, userIds } = req.body;
  try {
    const chatRoom = await chatService.createChatRoom(name, userIds);
    res.status(201).json(chatRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};