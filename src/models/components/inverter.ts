import { model, Schema } from "mongoose";
import { Inverter } from "../interfaces/components/inverter";

const InverterSchema = new Schema<Inverter>({
  company: { type: String, required: true },
  power: { type: Number, required: true },
  price: { type: Number, required: true },
  min_pv_input_voltage: { type: Number, required: true },
  max_pv_input_voltage: { type: Number, required: true },
  battery_input_voltage: { type: Number, required: true },
});

export const InverterModel = model<Inverter>("Inverter", InverterSchema);
