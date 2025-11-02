import { Inline_Keyboard } from "../commands";
import { AllSpecifications } from "../interfaces/general";

export const process_remove_component = (
  component: AllSpecifications[],
  type: "battery" | "load" | "inverter" | "pv",
) => {
  const componentColumns: Inline_Keyboard[][] = [];
  let componentRows: Inline_Keyboard[] = [];
  component.forEach((entry: any) => {
    componentRows.push({
      text: type === "load" ? entry.name : entry.company,
      callback_data: `remove_${type}_${entry.id}`,
    });
    // Once we have 2 elements, push and reset
    if (componentRows.length === 2) {
      componentColumns.push(componentRows);
      componentRows = [];
    }
  });
  // Push any remaining items (in case of an odd count)
  if (componentRows.length > 0) {
    componentColumns.push(componentRows);
  }
  return componentColumns;
};
