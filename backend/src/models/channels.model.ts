import { Schema, model } from "mongoose";

export interface IChannel {
  name: string;
  members: string[];
  visibility: string;
}

const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true },
  members: { type: [String], required: false, unique: true },
  visibility: { type: String, required: true },
});

export const Channel = model("channel", channelSchema);
