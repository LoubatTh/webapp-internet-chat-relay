import { Schema, model } from "mongoose";

export interface IPmsg {
  _id?: string;
  name: string;
  members: string[];
}

const pmsgSchema = new Schema<IPmsg>({
  name: { type: String, unique: true },
  members: { type: [String], required: false, maxlength: 2 },
});

export const Pmsg = model("pmsg", pmsgSchema);
