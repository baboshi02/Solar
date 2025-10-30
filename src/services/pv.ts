import { PVInterface } from "../interfaces/components/pv";
import { PVModel } from "../models/components/pv";

export const add_pv = async (pv: PVInterface) => {
  return await PVModel.create(pv);
};

export const get_pv = async (query: Partial<PVInterface>) => {
  return await PVModel.findOne(query);
};
export const get_all_pv = async () => {
  return await PVModel.find();
};

export const update_pv = async (
  name: string,
  updateFields: Partial<PVInterface>,
) => {
  const pv = await PVModel.findOne({ name });
  if (!pv) return;
  pv.updateOne(updateFields);
};

export const delete_battery = async (name: string) => {
  if (!(await PVModel.exists({ name }))) return;
  await PVModel.deleteOne({ name });
};
