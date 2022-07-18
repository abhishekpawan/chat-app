const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "A new user joined!");

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message);
    callback('Delivered')
  });

  socket.on("sendLocation", (location) => {
    io.emit("message",`https://google.com/maps?q=${location.latitude},${location.longitude}`);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
