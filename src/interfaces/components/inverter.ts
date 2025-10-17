export interface Inverter {
  company: string;
  price: number;
  min_pv_input_voltage: number;
  max_pv_input_voltage: number;
  battery_input_voltage: number;
  power: number;
}
