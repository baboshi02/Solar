import { Battery } from "../interfaces/components/battery";
import { Inverter } from "../interfaces/components/inverter";
import { InverterModel } from "../models/components/inverter";

export const add_inverter = async (inverter: Inverter) => {
  return await InverterModel.create(inverter);
};

export const get_inverter = async (query: Partial<Inverter>) => {
  return await InverterModel.findOne(query);
};

export const get_all_inverters = async () => {
  return await InverterModel.find();
};

export const update_inverter = async (
  name: string,
  updateFields: Partial<Battery>,
) => {
  const inverter = await InverterModel.findOne({ name });
  if (!inverter) return;
  inverter.updateOne(updateFields);
};
export const delete_inverter = async (name: string) => {
  if (!(await InverterModel.exists({ name }))) return;
  await InverterModel.deleteOne({ name });
};
