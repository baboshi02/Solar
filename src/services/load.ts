import { Load } from "../interfaces/components/loads";
import { LoadModel } from "../models/components/loads";

export const load_exitss = async (name: string) => {
  return await LoadModel.exists({ name });
};
export const add_load = async (name: string, power: number) => {
  return await LoadModel.create({ name, power });
};

export const get_loads = async () => {
  return await LoadModel.find();
};

export const update_load = async (name: string, new_power: number) => {
  const load = await LoadModel.findOne({ name });
  if (!load) return;
  await load.updateOne({ new_power });
};

export const delete_load = async (name: string) => {
  const load = await LoadModel.findOne({ name });
  if (!load) return;
  await load.deleteOne({ name });
};
