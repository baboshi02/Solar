export type BatteryType = "lithium" | "normal";
export interface BatteryInterface {
  company: string;
  name: string;
  price: number;
  type: BatteryType;
  voltage: number;
}
