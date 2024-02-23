import { Schema, model } from "mongoose";

export interface IMessage {
  _id?: string;
  text: string;
  channelId: string;
  authorId: string;
  createdAt: Date;
}

export interface IMessageAuthor extends IMessage {
  author: string;
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  channelId: { type: String, required: true, index: true },
  authorId: { type: String, required: true, index: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

export const Message = model("message", messageSchema);
Message.ensureIndexes();
