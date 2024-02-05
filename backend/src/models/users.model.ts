import { Schema, model, Types } from "mongoose";

// TODO: Replace channels by servers when the servers will be implemented
interface IUser {
  username: string;
  channels: Types.Array<string>;
  informations: string;
  createdAt: Date;
}

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

const User = model("user", userSchema);

module.exports = User;
