import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { Server } from "socket.io";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const app = express();

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/channels", require("./routes/channels.routes"));
app.use("/api/messages", require("./routes/messages.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/guests", require("./routes/guests.routes"));
app.use("/api/pmsgs", require("./routes/pmsgs.routes"));

app.use("/ping", (req: Request, res: Response) => {
  res.send({ message: "Ping" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const socketio = io.listen(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Récupérer les nouveaux messages
  socket.on("newMessage", (newMessage) => {
    console.log("New message received:", newMessage);

    io.emit("newMessage", newMessage);
  });
});
