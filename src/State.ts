import { assign, createMachine } from "xstate";

export const messagingMachine = createMachine({
  context: {
    text: "Welcome to our service enter /start",
    keyboard: [] as any,
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
            text: "Enter pv name",
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
            NEXT: {
              target: "battery_company",
              actions: assign({
                text: "Enter battery company",
              }),
            },
          },
        },
        battery_company: {
          on: {
            NEXT: {
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
            NEXT: {
              target: "battery_price",
              actions: assign({ text: "Enter battery price" }),
            },
          },
        },
        battery_price: {
          on: {
            NEXT: {
              target: "battery_voltage",
              actions: assign({ text: "Enter voltage level" }),
            },
          },
        },
        battery_voltage: {
          on: {
            NEXT: {
              actions: assign({ text: "Well done you have completed" }),
            },
          },
        },
      },
    },
    load: {},
    pv: {},
    inverter: {},
  },
});
