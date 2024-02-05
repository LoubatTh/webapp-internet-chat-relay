import { Schema, model } from "mongoose";

interface IMessage {
  text: string;
  channelId: string;
  author: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  channelId: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const Message = model("message", messageSchema);

module.exports = Message;
