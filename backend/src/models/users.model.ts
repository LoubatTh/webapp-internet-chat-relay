import { Schema, model } from "mongoose";

// TODO: Replace channels by servers when the servers will be implemented
interface IUser {
  username: string;
  channels: string[];
  informations: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: false },
  channels: { type: [String], required: false },
  informations: { type: String, required: false },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

export const User = model("user", userSchema);
