// import { Schema, model } from "mongoose";

// interface IServer {
//   name: string;
//   channels: string[];
//   members: string[];
//   createdAt: Date;
// }

// const serverSchema = new Schema<IServer>({
//   name: { type: String, required: true },
//   channels: { type: [String], required: false },
//   members: { type: [String], required: false },
//   createdAt: {
//     type: Date,
//     default: () => Date.now(),
//     immutable: true,
//     index: true,
//   },
// });

// export const Server = model("server", serverSchema);
