import { Schema, model } from "mongoose";

export interface IMessage {
  text: string;
  channelId: string;
  authorId: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  channelId: { type: String, required: true, index: true },
  authorId: { type: String, required: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    index: true,
  },
});

export const Message = model("message", messageSchema);
Message.ensureIndexes();
