import { model, Schema } from "mongoose";
import { Load } from "../../interfaces/components/loads";

const LoadSchema = new Schema<Load>(
  {
    name: { type: String, required: true, unique: true },
    power: { type: Number, required: true },
  },
  { timestamps: true },
);

export const LoadModel = model<Load>("Load", LoadSchema);
