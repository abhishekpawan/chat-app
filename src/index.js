const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')
const PORT = process.env.PORT || 5000;
const {generateMessage} = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.emit("message", generateMessage("welcome"));
  socket.broadcast.emit("message", generateMessage("A new user joined!"));

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter()
    if(filter.isProfane(message)){
      return callback('Profanity is not allowed!')
    }
    io.emit("message", generateMessage(message));
    callback()
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit("locationMessage",generateMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
    callback()
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

server.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
