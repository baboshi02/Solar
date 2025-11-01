import { BatteryInterface } from "./components/battery";
import { InverterInterface } from "./components/inverter";
import { LoadInterface } from "./components/loads";
import { PVInterface } from "./components/pv";

export interface Components {
  [key: string]: ComponentType;
}

export type ComponentType = "inverter" | "pv" | "battery" | "load";

export interface UserLoad {
  [key: string]: LoadInterface;
}
export type AllSpecifications =
  | BatteryInterface
  | InverterInterface
  | PVInterface
  | LoadInterface;
