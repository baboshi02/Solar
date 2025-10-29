import { assign, createMachine } from "xstate";
import { Inverter } from "./interfaces/components/inverter";
import { BatteryInterface } from "./interfaces/components/battery";
import { PV } from "./interfaces/components/pv";
import { LoadInterface } from "./interfaces/components/loads";

export const messagingMachine = createMachine({
  context: {
    text: "Welcome to our service enter /start",
    keyboard: [] as any,
    inverter: {} as Partial<Record<keyof Inverter, string>>,
    battery: {} as Partial<Record<keyof BatteryInterface, string>>,
    pv: {} as Partial<Record<keyof PV, string>>,
    load: {} as Partial<Record<keyof LoadInterface, string>>,
  },
  id: "messaging",
  initial: "initial",
  states: {
    initial: {
      on: {
        START_COMMAND: {
          target: "start",
          actions: assign({
            text: "Choose the action you want",
            keyboard: [["admin", "client"]],
          }),
        },
      },
    },
    start: {
      on: {
        ADMIN_COMMAND: {
          target: "admin",
          actions: assign({
            text: "Choose the service you want",
            keyboard: [["add", "show"]],
          }),
        },
        CLIENT_COMMAND: {
          target: "client",
          actions: assign({
            text: "How are you doing",
          }),
        },
      },
    },
    admin: {
      on: {
        ADD_COMMAND: {
          target: "add",
          actions: assign({
            text: "Choose the component you want",
            keyboard: [
              ["battery", "pv"],
              ["load", "inverter"],
            ],
          }),
        },
        SHOW_COMMAND: {
          target: "show",
          actions: assign({
            text: "Choose the component you want",
            keyboard: [
              ["battery", "pv"],
              ["load", "inverter"],
            ],
          }),
        },
      },
    },
    client: {
      on: {
        INITIAL: "start",
      },
    },
    add: {
      on: {
        BATTERY_COMMAND: {
          target: "battery",
          actions: assign({
            text: "Enter battery name",
          }),
        },
        LOAD_COMMAND: {
          target: "load",
          actions: assign({
            text: "Enter load name",
          }),
        },
        PV_COMMAND: {
          target: "pv",
          actions: assign({
            text: "Enter pv company",
          }),
        },
        INVERTER_COMMAND: {
          target: "inverter",
          actions: assign({
            text: "Enter inverter name",
          }),
        },
      },
    },
    show: {
      on: {
        Inverter: {
          target: "inverter",
        },
        Battery: {
          target: "battery",
        },
        Load: {
          target: "load",
        },
        Pv: {
          target: "pv",
        },
      },
    },
    battery: {
      initial: "battery_name",
      states: {
        battery_name: {
          on: {
            NEXT_INPUT: {
              target: "battery_company",
              actions: assign({
                text: "Enter battery company",
              }),
            },
          },
        },
        battery_company: {
          on: {
            NEXT_INPUT: {
              target: "battery_type",
              actions: assign({
                text: "Enter battery type",
                keyboard: [["lithium", "normal"]],
              }),
            },
          },
        },
        battery_type: {
          on: {
            NEXT_INPUT: {
              target: "battery_price",
              actions: assign({ text: "Enter battery price" }),
            },
          },
        },
        battery_price: {
          on: {
            NEXT_INPUT: {
              target: "battery_voltage",
              actions: assign({ text: "Enter voltage level" }),
            },
          },
        },
        battery_voltage: {
          on: {
            NEXT_INPUT: {
              actions: assign({ text: "Well done you have completed" }),
            },
          },
        },
      },
    },
    load: {
      initial: "load_name",
      states: {
        load_name: {
          on: {
            NEXT_INPUT: {
              target: "load_power",
              actions: assign({
                text: "Enter power",
                load: ({ context, event }) => ({
                  ...context.load,
                  name: event.payload.input,
                }),
              }),
            },
          },
        },
        load_power: {
          on: {
            NEXT_INPUT: {
              target: "completed",
              actions: assign({
                text: "Load completed",
                load: ({ context, event }) => ({
                  ...context.load,
                  power: event.payload.input,
                }),
              }),
            },
          },
        },
        completed: {
          on: {
            NEXT_INPUT: {
              target: "#messaging.initial",
              actions: assign({
                text: ({ context, event }) =>
                  `Your ${context.load.name} is ${context.load.power} wattage`,
              }),
            },
          },
        },
      },
    },
    pv: {
      initial: "pv_company",
      states: {
        pv_company: {
          on: {
            NEXT_INPUT: {
              target: "pv_price",
              actions: assign({ text: "Enter Price" }),
            },
          },
        },
        pv_price: {
          on: {
            NEXT_INPUT: {
              target: "pv_power",
              actions: assign({ text: "Enter Power" }),
            },
          },
        },
        pv_power: {
          on: {
            NEXT_INPUT: {
              target: "pv_voltage",
              actions: assign({ text: "Enter Voltage" }),
            },
          },
        },
        pv_voltage: {
          on: {
            NEXT_INPUT: {
              actions: assign({ text: "Completed" }),
            },
          },
        },
      },
    },
    inverter: {
      initial: "inverter_company",
      states: {
        inverter_company: {
          on: {
            NEXT_INPUT: {
              target: "inverter_price",
              actions: assign({ text: "Enter price" }),
            },
          },
        },
        inverter_price: {
          on: {
            NEXT_INPUT: {
              target: "inverter_min_voltage",
              actions: assign({ text: "Enter min_pv_voltage" }),
            },
          },
        },
        inverter_min_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_max_voltage",
              actions: assign({ text: "Enter max_pv_voltage" }),
            },
          },
        },
        inverter_max_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_battery_voltage",
              actions: assign({ text: "Enter battery voltage" }),
            },
          },
        },
        inverter_battery_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_power",
              actions: assign({ text: "Enter Inverter power" }),
            },
          },
        },
        inverter_power: {
          on: {
            NEXT_INPUT: {
              target: "#messaging.initial",
              actions: assign({ text: "Completed" }),
            },
          },
        },
      },
    },
  },
});
