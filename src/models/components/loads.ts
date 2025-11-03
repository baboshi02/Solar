import { model, Schema } from "mongoose";
import { LoadInterface } from "../../interfaces/components/loads";

const LoadSchema = new Schema<LoadInterface>(
  {
    name: { type: String, required: true, unique: true },
    power: { type: Number, required: true },
  },
  { timestamps: true },
);

export const LoadModel = model<LoadInterface>("Load", LoadSchema);
