module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('chat message', (msg) => {
      io.to(msg.roomId).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};