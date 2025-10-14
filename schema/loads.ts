import { model, Schema } from "mongoose";
import { Load } from "../interfaces/loads";

const LoadSchema = new Schema<Load>(
  {
    name: { type: String, required: true, unique: true },
    power: { type: Number, required: true },
    image_url: { type: String, required: false },
  },
  { timestamps: true },
);

export const LoadModel = model<Load>("Load", LoadSchema);
