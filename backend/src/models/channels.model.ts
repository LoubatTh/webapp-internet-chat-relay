import { Schema, model, Types } from "mongoose";

interface IChannel {
  name: string;
  members: Types.Array<string>;
  visibility: string;
}

const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true },
  members: { type: [String], required: false },
  visibility: { type: String, required: true },
});

export const Channel = model("channel", channelSchema);
