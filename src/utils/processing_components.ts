import { LoadInterface } from "../interfaces/components/loads";
import { AllSpecifications } from "../interfaces/general";

enum LoadKeys {
  name,
  power,
}

enum BatteryKeys {
  company,
  name,
  price,
  type,
  voltage,
}
enum PvKeys {
  company,
  price,
  power,
  voltage,
}

enum InverterKeys {
  company,
  price,
  min_pv_input_voltage,
  max_pv_input_voltage,
  battery_input_voltage,
  power,
}

export const process_components = (
  loads: AllSpecifications[],
  type: "battery" | "load" | "inverter" | "pv",
) => {
  let componentKeys;
  switch (type) {
    case "load": {
      componentKeys = LoadKeys;
      break;
    }
    case "battery": {
      componentKeys = BatteryKeys;
      break;
    }
    case "inverter": {
      componentKeys = InverterKeys;
      break;
    }
    case "pv": {
      componentKeys = PvKeys;
      break;
    }
    default: {
      return;
    }
  }
  const processed_texts: string[] = [];
  for (const load of loads) {
    console.log("load: ", load);
    let text = "";
    const stringNames = Object.values(componentKeys).filter(
      (v) => typeof v === "string",
    );
    console.log("string names: ", stringNames);
    for (const loadKey of stringNames) {
      const validKey = loadKey as keyof typeof load;
      console.log("validKey: ", validKey);
      text += `${validKey}: ${load[validKey]}\n `;
    }
    text = text.replace(/_/, " ");
    processed_texts.push(text);
  }
  return processed_texts;
};
