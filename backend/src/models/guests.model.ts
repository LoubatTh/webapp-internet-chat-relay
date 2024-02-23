import { Schema, model } from "mongoose";

// TODO: Replace channels by servers when the servers will be implemented
export interface IGuest {
  username: string;
  channels: string[];
  pmsgs: string[];
  lastConnexion: Date;
}

const guestSchema = new Schema<IGuest>({
  username: { type: String, required: true, unique: true },
  channels: { type: [String], required: false },
  pmsgs: { type: [String], required: false },
  lastConnexion: {
    type: Date,
    default: () => Date.now(),
    index: true,
  },
});

export const Guest = model("guest", guestSchema);
Guest.ensureIndexes();
