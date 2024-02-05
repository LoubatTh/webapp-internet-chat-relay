import { Schema, model, Types } from "mongoose";

interface IServer {
  name: string;
  channels: Types.Array<string>;
  members: Types.Array<string>;
  createdAt: Date;
}

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

const Server = model("server", serverSchema);

module.exports = Server;
