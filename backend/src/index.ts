import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const app = express();

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
app.use("/api/channels", require("./routes/messages.routes"));
app.use("/api/users", require("./routes/users.routes"));

app.use("/ping", (req: Request, res: Response) => {
  res.send({ message: "Ping" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
