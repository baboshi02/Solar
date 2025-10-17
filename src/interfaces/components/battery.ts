export type BatteryType = "lithium" | "normal";
export interface Battery {
  company: string;
  price: number;
  type: BatteryType;
  voltage: number;
}
