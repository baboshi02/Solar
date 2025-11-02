import { Query, RootFilterQuery } from "mongoose";
import { LoadInterface } from "../interfaces/components/loads";
import { LoadModel } from "../models/components/loads";

export const load_exits = async (name: string) => {
  return await LoadModel.exists({ name });
};
export const add_load = async (specificatoins: LoadInterface) => {
  return await LoadModel.create(specificatoins);
};

export const get_loads = async () => {
  return await LoadModel.find();
};
export const get_load = async (filter: RootFilterQuery<LoadInterface>) => {
  return await LoadModel.find(filter);
};

export const update_load = async (
  name: string,
  query: Partial<LoadInterface>,
) => {
  const load = await LoadModel.findOne({ name });
  if (!load) return;
  await load.updateOne(query);
};

export const delete_load = async (filter: RootFilterQuery<LoadInterface>) => {
  await LoadModel.deleteOne(filter);
};
