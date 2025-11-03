import { model, Schema } from "mongoose";
import { PVInterface } from "../../interfaces/components/pv";

const PVSchema = new Schema<PVInterface>({
  company: { type: String, required: true },
  voltage: { type: Number, required: true },
  price: { type: Number, required: true },
  power: { type: Number, required: true },
});

export const PVModel = model<PVInterface>("PV", PVSchema);
