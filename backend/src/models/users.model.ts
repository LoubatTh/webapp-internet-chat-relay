import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  channels: string[];
  pmsgs: string[];
  informations: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  channels: { type: [String], required: false },
  pmsgs: { type: [String], required: false },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    index: true,
  },
});

export const User = model("user", userSchema);
User.ensureIndexes();
