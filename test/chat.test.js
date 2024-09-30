const mongoose = require("mongoose");
const sinon = require("sinon");
const assert = require("assert"); // Node's built-in assertion library
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const ChatRoom = require("../models/chatRoomModel");
const chatController = require("../controllers/chatController");

describe("Chat testing", () => {
  it("should save a message to chatroom", async () => {
    const user = new User({
      username: "Test User",
      password: "password",
    });
    const chat = new ChatRoom({
      name: "Test Chat",
      messages: [],
      users: [],
    });
    const message = new Message({
      content: "Hello",
      sender: user,
      timestamp: Date.now(),
    });

    chat.messages.push(message);
    await message.save();
    await chat.save();
    const chatRoomFromDB = await ChatRoom.findOne({ name: "Test Chat" });
    const messageFromDB = await Message.findOne({ content: "Hello" });

    assert.strictEqual(
      chatRoomFromDB.messages[0]._id.toString(),
      messageFromDB._id.toString(),
    );
  });
});
