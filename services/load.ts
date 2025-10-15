import { LoadModel } from "../schema/loads";

export const add_load = async (
  name: string,
  power: number,
  image_url?: string,
) => {
  return await LoadModel.create({ name, power, image_url });
};

export const show_loads = async () => {
  return await LoadModel.find();
};

export const update_load = async (
  name: string,
  new_power: number,
  new_image_url?: string,
) => {
  const load = await LoadModel.findOne({ name });
  if (!load) return;
  await load.updateOne({ new_power, new_image_url });
};

export const delete_load = async (name: string) => {
  const load = await LoadModel.findOne({ name });
  if (!load) return;
  await load.deleteOne({ name });
};
