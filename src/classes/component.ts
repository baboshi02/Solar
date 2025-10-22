import { spec } from "node:test/reporters";
import { InverterInterface } from "../interfaces/components/inverter";
import { LoadInterface } from "../interfaces/components/loads";
import { PVInterface } from "../interfaces/components/pv";
import {
  BatteryInterface,
  BatteryType,
} from "../interfaces/components/battery";

class Inverter {
  name: string;
  company: string;
  price: number;
  min_pv_input_voltage: number;
  max_pv_input_voltage: number;
  battery_input_voltage: number;
  power: number;
  constructor(specification: InverterInterface) {
    this.name = specification.name;
    this.company = specification.company;
    this.price = specification.price;
    this.min_pv_input_voltage = specification.min_pv_input_voltage;
    this.max_pv_input_voltage = specification.max_pv_input_voltage;
    this.battery_input_voltage = specification.battery_input_voltage;
    this.power = specification.power;
  }
}

class Load {
  name: string;
  power: number;
  constructor(specification: LoadInterface) {
    this.power = specification.power;
    this.name = specification.name;
  }
}

class PV {
  company: string;
  price: number;
  power: number;
  voltage: number;
  constructor(specification: PVInterface) {
    this.company = specification.company;
    this.price = specification.price;
    this.power = specification.power;
    this.voltage = specification.voltage;
  }
}
class Battery {
  company: string;
  price: number;
  type: BatteryType;
  voltage: number;
  constructor(specification: BatteryInterface) {
    this.company = specification.company;
    this.price = specification.price;
    this.type = specification.type;
    this.voltage = specification.voltage;
  }
}
