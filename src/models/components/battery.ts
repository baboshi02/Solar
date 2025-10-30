import { model, Schema } from "mongoose";
import { BatteryInterface } from "../../interfaces/components/battery";

//TODO: Add the battery type to be enum rather than string value
//TODO: Add validation for user input to be right
const BatterySchema = new Schema<BatteryInterface>({
  company: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  voltage: { type: Number, required: true },
});

export const BatteryModel = model<BatteryInterface>("Battery", BatterySchema);
