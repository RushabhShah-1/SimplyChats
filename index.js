const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const PORTNO = 8000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
let totalUser = 0;
io.on("connection", (socket) => {
  totalUser++;
  socket.emit("totalUser", totalUser);
  socket.broadcast.emit("totalUser", totalUser);
  socket.on("newUserConnected", (userName) => {
    socket.broadcast.emit(
      "newUserConnected",
      `${userName} connected to this chat room`
    );
  });
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
  socket.on("disconnect", (reason) => {
    totalUser--;
    io.emit("userDisconnect", totalUser);
  });
});

app.use(express.static("./public"));
app.get("/", (req, res) => {
  return res.sendFile("public/index.html");
});
httpServer.listen(PORTNO, () => {
  console.log(
    `Server started at port ${PORTNO}.`
  );
});
