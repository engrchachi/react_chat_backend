const app = require("express")();
const http = require("http").createServer(app);
const PORT = 3000;
const io = require("socket.io")(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (uname) => {
    users[socket.id] = uname;
    socket.broadcast.emit("user-connected", uname);
    console.log(users);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
    console.log(message);
  });
});
http.listen(9000, () => {
  console.log("connected");
});
