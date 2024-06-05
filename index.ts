import express, { Application } from "express";
import cors from "cors";

import HTTP from "http";
import { Server } from "socket.io";

const app: Application = express();
app.use(cors());

const http = HTTP.createServer(app);

const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

interface Message {
  message: string;
  username: string;
  timestamp: string;
}

let messages: Message[] = [
  {
    username: "admin",
    message: "Init Chat",
    timestamp: new Date().toLocaleTimeString(),
  }
];

io.on("connection", (socket) => {
  console.log("Socket connected!");
  socket.emit("connection", null);

  socket.emit("init", messages)

  socket.on("chat-msg", (message) => {
    console.log("NEW MESSAGE: ", message);
    messages.push(message);
    io.emit("chat-msg", message);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/clear", (req, res) => {
  messages = [
    {
      username: "admin",
      message: "Init Chat",
      timestamp: new Date().toLocaleTimeString(),
    } as Message
  ];
  io.emit("init", messages);
  res.send("Messages cleared");
});

http.listen(5000, "0.0.0.0", () => {
  console.log("Server listening on port 5000");
});
