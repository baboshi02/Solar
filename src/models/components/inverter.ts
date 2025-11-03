import { model, Schema } from "mongoose";
import { InverterInterface } from "../../interfaces/components/inverter";

const InverterSchema = new Schema<InverterInterface>({
  company: { type: String, required: true },
  power: { type: Number, required: true },
  price: { type: Number, required: true },
  min_pv_input_voltage: { type: Number, required: true },
  max_pv_input_voltage: { type: Number, required: true },
  battery_input_voltage: { type: Number, required: true },
});

export const InverterModel = model<InverterInterface>(
  "Inverter",
  InverterSchema,
);
