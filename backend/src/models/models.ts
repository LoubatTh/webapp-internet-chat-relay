import { Schema, model } from "mongoose";

interface IChannel {
  name: string;
  members: string[];
  visibility: string;
}

interface IUser {
  username: string;
  channels: string[];
  informations: string;
  createdAt: Date;
}

interface IMessage {
  text: string;
  channelId: string;
  authorId: string;
  timestamp: Date;
}

interface IServer {
  name: string;
  channels: string[];
  members: string[];
  createdAt: Date;
}

const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true },
  members: { type: [String], required: false },
  visibility: { type: String, required: true },
});

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  channels: { type: [String], required: false },
  informations: { type: String, required: false },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  channelId: { type: String, required: true },
  authorId: { type: String, required: true },
  timestamp: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const serverSchema = new Schema<IServer>({
  name: { type: String, required: true },
  channels: { type: [String], required: false },
  members: { type: [String], required: false },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const Channel = model("channel", channelSchema);
const Message = model("message", messageSchema);
const User = model("user", userSchema);
const Server = model("server", serverSchema);

module.exports = {
  Server,
  Channel,
  Message,
  User,
};
