const express = require("express");

const app = express();
const server = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(server);

server.listen(8080);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "client", "index.html"));
});

io.on("connection", (socket) => {
  socket.emit("news", { hello: "world" });
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("message", ({ message, name }) => {
    io.emit("chat-message", `${name}:        ${message}`);
    if (message.includes("SOS")) {
      io.emit("SOS", `Help! ${name} is in trouble`);
      io.to(`${socket.id}`).emit("SOS", `${name}, your SOS mesage has been shared with all users. I'm sure they will help you soon`);
    }
  });
});

app.use(express.static(path.join(__dirname, "..", "client")));

app.use((req, res) => {
  res.status(404).json({
    message: "resource not found",
    route: req.url
  });
});

module.exports = app;
