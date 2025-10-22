import { model, Schema } from "mongoose";
import { BatteryInterface } from "../../interfaces/components/battery";

const BatterySchema = new Schema<BatteryInterface>({
  company: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true, enum: ["lithium", "normal"] },
  voltage: { type: Number, required: true },
});

export const BatteryModel = model<BatteryInterface>("Battery", BatterySchema);
