import { assign, createMachine } from "xstate";
import { InverterInterface } from "./interfaces/components/inverter";
import { BatteryInterface } from "./interfaces/components/battery";
import { PVInterface } from "./interfaces/components/pv";
import { LoadInterface } from "./interfaces/components/loads";

export const messagingMachine = createMachine({
  context: {
    text: "Welcome to our service enter /start",
    keyboard: [] as any,
    inverter: {} as Partial<Record<keyof InverterInterface, string>>,
    battery: {} as Partial<Record<keyof BatteryInterface, string>>,
    pv: {} as Partial<Record<keyof PVInterface, string>>,
    load: {} as Partial<Record<keyof LoadInterface, string>>,
  },
  id: "messaging",
  initial: "initial",
  states: {
    initial: {
      entry: assign({
        inverter: {},
        load: {},
        keyboard: [[]],
        text: "Welcome to our service enter /start",
        battery: {},
        pv: {},
      }),
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
    completed: {
      on: {
        RESTART_COMMAND: {
          target: "initial",
          actions: assign({ text: "Completed" }),
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
        battery: {
          target: "SHOW_BATTERY",
        },
        inverter: {
          target: "SHOW_INVERTER",
        },
        load: {
          target: "SHOW_LOAD",
        },
        pv: {
          target: "SHOW_PV",
        },
      },
    },
    SHOW_BATTERY: {},
    SHOW_INVERTER: {},
    SHOW_LOAD: {},
    SHOW_PV: {},
    battery: {
      initial: "battery_name",
      states: {
        battery_name: {
          on: {
            NEXT_INPUT: {
              target: "battery_company",
              actions: assign({
                text: "Enter battery company",
                battery: ({ context, event }) => ({
                  ...context.battery,
                  name: event.payload.input,
                }),
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
                battery: ({ context, event }) => ({
                  ...context.battery,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_type: {
          on: {
            NEXT_INPUT: {
              target: "battery_price",
              actions: assign({
                text: "Enter battery price",
                battery: ({ context, event }) => ({
                  ...context.battery,
                  type: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_price: {
          on: {
            NEXT_INPUT: {
              target: "battery_voltage",
              actions: assign({
                text: "Enter voltage level",
                battery: ({ context, event }) => ({
                  ...context.battery,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_voltage: {
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
                text: "Well done you have completed",
                battery: ({ context, event }) => ({
                  ...context.battery,
                  voltage: event.payload.input,
                }),
              }),
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
              target: "#messaging.completed",
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
      },
    },
    pv: {
      initial: "pv_company",
      states: {
        pv_company: {
          on: {
            NEXT_INPUT: {
              target: "pv_price",
              actions: assign({
                text: "Enter Price",
                pv: ({ context, event }) => ({
                  ...context.pv,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_price: {
          on: {
            NEXT_INPUT: {
              target: "pv_power",
              actions: assign({
                text: "Enter Power",

                pv: ({ context, event }) => ({
                  ...context.pv,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_power: {
          on: {
            NEXT_INPUT: {
              target: "pv_voltage",
              actions: assign({
                text: "Enter Voltage",

                pv: ({ context, event }) => ({
                  ...context.pv,
                  power: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_voltage: {
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
                text: "Completed",

                pv: ({ context, event }) => ({
                  ...context.pv,
                  voltage: event.payload.input,
                }),
              }),
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
              actions: assign({
                text: "Enter price",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_price: {
          on: {
            NEXT_INPUT: {
              target: "inverter_min_voltage",
              actions: assign({
                text: "Enter min_pv_voltage",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_min_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_max_voltage",
              actions: assign({
                text: "Enter max_pv_voltage",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  min_pv_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_max_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_battery_voltage",
              actions: assign({
                text: "Enter battery voltage",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  max_pv_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_battery_voltage: {
          on: {
            NEXT_INPUT: {
              target: "inverter_power",
              actions: assign({
                text: "Enter Inverter power",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  battery_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_power: {
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
                text: "Completed",
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  power: event.payload.input,
                }),
              }),
            },
          },
        },
      },
    },
  },
});
