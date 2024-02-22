import { Schema, model } from "mongoose";

export interface IChannel {
  name: string;
  owner: string;
  members: string[];
  visibility: string;
}

const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  members: { type: [String], required: false },
  visibility: { type: String, required: true },
});

export const Channel = model("channel", channelSchema);
