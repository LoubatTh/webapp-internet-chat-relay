import { Schema, model } from "mongoose";

// TODO: Replace channels by servers when the servers will be implemented
export interface IUser {
  username: string;
  channels: string[];
  informations: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  channels: { type: [String], required: false },
  informations: { type: String, required: false },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    index: true,
  },
});

export const User = model("user", userSchema);
User.ensureIndexes();
