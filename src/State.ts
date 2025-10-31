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
        },
      },
    },
    start: {
      entry: assign({
        text: "Choose the action you want",
        keyboard: [["admin", "client"]],
      }),
      on: {
        ADMIN_COMMAND: {
          target: "admin",
        },
        CLIENT_COMMAND: {
          target: "client",
        },
      },
    },
    completed: {
      entry: assign({ text: "Completed Entry Succesfully!!" }),
      on: {
        RESTART_COMMAND: {
          target: "initial",
        },
      },
    },
    admin: {
      entry: assign({
        text: "Choose the service you want",
        keyboard: [["add", "show"]],
      }),
      on: {
        ADD_COMMAND: {
          target: "add",
        },
        SHOW_COMMAND: {
          target: "show",
        },
      },
    },
    client: {
      entry: assign({
        text: "How are you doing",
      }),
      on: {
        INITIAL: "start",
      },
    },
    add: {
      entry: assign({
        text: "Choose the component you want",
        keyboard: [
          ["battery", "pv"],
          ["load", "inverter"],
        ],
      }),
      on: {
        BATTERY_COMMAND: {
          target: "battery",
        },
        LOAD_COMMAND: {
          target: "load",
        },
        PV_COMMAND: {
          target: "pv",
        },
        INVERTER_COMMAND: {
          target: "inverter",
        },
      },
    },
    show: {
      entry: assign({
        text: "Choose the component you want",
        keyboard: [
          ["battery", "pv"],
          ["load", "inverter"],
        ],
      }),
    },
    battery: {
      initial: "battery_name",
      states: {
        battery_name: {
          entry: assign({
            text: "Enter battery name",
          }),
          on: {
            NEXT_INPUT: {
              target: "battery_company",
              actions: assign({
                battery: ({ context, event }) => ({
                  ...context.battery,
                  name: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_company: {
          entry: assign({
            text: "Enter battery company",
          }),
          on: {
            NEXT_INPUT: {
              target: "battery_type",
              actions: assign({
                battery: ({ context, event }) => ({
                  ...context.battery,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_type: {
          entry: assign({
            text: "Enter battery type",
            keyboard: [["lithium", "normal"]],
          }),
          on: {
            NEXT_INPUT: {
              target: "battery_price",
              actions: assign({
                battery: ({ context, event }) => ({
                  ...context.battery,
                  type: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_price: {
          entry: assign({
            text: "Enter battery price",
          }),
          on: {
            NEXT_INPUT: {
              target: "battery_voltage",
              actions: assign({
                battery: ({ context, event }) => ({
                  ...context.battery,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        battery_voltage: {
          entry: assign({
            text: "Enter voltage level",
          }),
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
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
          entry: assign({
            text: "Enter Name",
          }),
          on: {
            NEXT_INPUT: {
              target: "load_power",
              actions: assign({
                load: ({ context, event }) => ({
                  ...context.load,
                  name: event.payload.input,
                }),
              }),
            },
          },
        },
        load_power: {
          entry: assign({
            text: "Enter power",
          }),
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
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
          entry: assign({ text: "Enter PV Company name" }),
          on: {
            NEXT_INPUT: {
              target: "pv_price",
              actions: assign({
                pv: ({ context, event }) => ({
                  ...context.pv,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_price: {
          entry: assign({ text: "Enter PV Price" }),
          on: {
            NEXT_INPUT: {
              target: "pv_power",
              actions: assign({
                pv: ({ context, event }) => ({
                  ...context.pv,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_power: {
          entry: assign({ text: "Enter PV Power" }),
          on: {
            NEXT_INPUT: {
              target: "pv_voltage",
              actions: assign({
                pv: ({ context, event }) => ({
                  ...context.pv,
                  power: event.payload.input,
                }),
              }),
            },
          },
        },
        pv_voltage: {
          entry: assign({ text: "Enter PV Voltage" }),
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
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
          entry: assign({ text: "Enter Inverter Company" }),
          on: {
            NEXT_INPUT: {
              target: "inverter_price",
              actions: assign({
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  company: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_price: {
          entry: assign({ text: "Enter Inverter Price" }),
          on: {
            NEXT_INPUT: {
              target: "inverter_min_voltage",
              actions: assign({
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  price: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_min_voltage: {
          entry: assign({
            text: "Enter min inverter voltafe",
          }),
          on: {
            NEXT_INPUT: {
              target: "inverter_max_voltage",
              actions: assign({
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  min_pv_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_max_voltage: {
          entry: assign({
            text: "Enter max inverter voltage",
          }),
          on: {
            NEXT_INPUT: {
              target: "inverter_battery_voltage",
              actions: assign({
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  max_pv_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_battery_voltage: {
          entry: assign({
            text: "Enter battery voltage",
          }),
          on: {
            NEXT_INPUT: {
              target: "inverter_power",
              actions: assign({
                inverter: ({ context, event }) => ({
                  ...context.inverter,
                  battery_input_voltage: event.payload.input,
                }),
              }),
            },
          },
        },
        inverter_power: {
          entry: assign({
            text: "Enter Inverter power",
          }),
          on: {
            NEXT_INPUT: {
              target: "#messaging.completed",
              actions: assign({
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
