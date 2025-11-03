import { BatteryInterface } from "../interfaces/components/battery";
import { BatteryModel } from "../models/components/battery";

export const add_battery = async (battery: BatteryInterface) => {
  return await BatteryModel.create(battery);
};

export const get_battery = async (query: Partial<BatteryInterface>) => {
  return await BatteryModel.findOne(query);
};

export const get_all_batteries = async () => {
  return await BatteryModel.find();
};
export const update_battery = async (
  name: string,
  updateFields: Partial<BatteryInterface>,
) => {
  const battery = await BatteryModel.findOne({ name });
  if (!battery) return;
  battery.updateOne(updateFields);
};

export const delete_battery = async (name: string) => {
  if (!(await BatteryModel.exists({ name }))) return;
  await BatteryModel.deleteOne({ name });
};
