import { Schema, model } from "mongoose";

export interface IMessage {
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

export const Message = model("message", messageSchema);
