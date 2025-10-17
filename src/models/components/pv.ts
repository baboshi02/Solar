import { model, Schema } from "mongoose";
import { PV } from "../../interfaces/components/pv";

const PVSchema = new Schema<PV>({
  company: { type: String, required: true },
  voltage: { type: Number, required: true },
  price: { type: Number, required: true },
  power: { type: Number, required: true },
});

export const PVModel = model<PV>("PV", PVSchema);
