import { LoadInterface } from "./components/loads";

export interface Components {
  [key: string]: ComponentType;
}

export type ComponentType = "inverter" | "pv" | "battery" | "load";

export interface UserLoad {
  [key: string]: LoadInterface;
}
