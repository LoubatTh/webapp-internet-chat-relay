import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

const socketIO = require('socket.io');
import http from "http";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const app = express();
const server = http.createServer(app);
const io = socketIO(server,{
  cors: {
    origin: 'http://localhost:3000'
  }
})

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

app.use("/ping", (req: Request, res: Response) => {
  res.send({ message: "Ping" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


io.on('connection', (socket: { id: any; join: (arg0: string) => void; on: (arg0: string, arg1: (reason: any) => void) => void; }) => {
  console.log('client connected ',socket.id);

  socket.join('clock-room');

  socket.on('disconnect', (reason: any)=>{
    console.log(reason);
  })
});

server.listen(3000, () => {
  console.log('Server socket.io is running at http://localhost:3000');
});

setInterval(()=>{
  io.to('clock-room').emit('time',new Date())}, 1000)

server.listen(PORT, err => {
    if(err) console.log("Error - ",err)
      console.log("Server running on port ", PORT)
});