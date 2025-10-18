import { PV } from "../interfaces/components/pv";
import { PVModel } from "../models/components/pv";

export const add_pv = async (pv: PV) => {
  return await PVModel.create(pv);
};

export const get_pv = async (query: Partial<PV>) => {
  return await PVModel.findOne(query);
};
export const get_all_pv = async () => {
  return await PVModel.find();
};

export const update_pv = async (name: string, updateFields: Partial<PV>) => {
  const pv = await PVModel.findOne({ name });
  if (!pv) return;
  pv.updateOne(updateFields);
};

export const delete_battery = async (name: string) => {
  if (!(await PVModel.exists({ name }))) return;
  await PVModel.deleteOne({ name });
};
