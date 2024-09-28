const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware'); 

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management and real-time messaging
 */

/**
 * @swagger
 * /api/chat/history/{roomId}:
 *   get:
 *     summary: Get chat history for a room
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/history/:roomId', authMiddleware, chatController.getChatHistory);

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - senderId
 *               - content
 *             properties:
 *               roomId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       500:
 *         description: Internal server error
 */
router.post('/send', authMiddleware, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/room:
 *   post:
 *     summary: Create a chat room
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - userIds
 *             properties:
 *               name:
 *                 type: string
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Chat room created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/room', authMiddleware, chatController.createChatRoom);

module.exports = router;