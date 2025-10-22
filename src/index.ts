import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { keyboard_markup } from "./commands";
import { LoadInterface } from "./interfaces/components/loads";
import { add_load, load_exits } from "./services/load";
import { UserStates } from "./UserStates";
import { connect_db } from "./db/db";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
const loads: UserLoad = {};

interface Components {
  [key: string]: "inverter" | "pv" | "battery" | "load";
}
const components: Components = {};

interface UserLoad {
  [key: string]: LoadInterface;
}

connect_db(mongourl);
const userStates = new UserStates();

bot.startPolling();
bot.on("message:text", async (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  const msg_text = msg.text;
  //IF NO ID THEN ACCOUNT IS A CHANNEL NOT A PERSON
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    return bot.sendMessage({ chat_id, text });
  }
  const state = userStates.state_type(user_id);
  try {
    if (msg_text == "/start") {
      const text = "Choose the service you want";
      const reply_markup = keyboard_markup(["/admin", "/client"]);
      bot.sendMessage({ chat_id, text, reply_markup });
      return userStates.set_state(user_id, "initial");
    }
    if (msg_text == "/admin") {
      const reply_markup = keyboard_markup(
        ["inverter", "pv"],
        ["battery", "load"],
      );
      const text = "What do you want to do";
      bot.sendMessage({
        chat_id,
        text,
        reply_markup,
      });
      return userStates.set_state(user_id, "admin");
    }
    if (msg_text == "/client") {
      const text = "Hello client to our services";
      userStates.set_state(user_id, "client");
      const keyboard1 = "available loads";
      const keyboard2 = "available inverters";
      const keyboard3 = "available pvs";
      const keyboard4 = "available batteries";
      const reply_markup = keyboard_markup(
        [keyboard1, keyboard2],
        [keyboard3, keyboard4],
      );
      return bot.sendMessage({ chat_id, text, reply_markup });
    }
    if (state === "client") {
      if (msg_text.toLowerCase().includes("inverter")) {
        bot.sendMessage({ chat_id, text: "Inverter service" });
        return;
      }
      if (msg_text.toLowerCase().includes("loads")) {
        bot.sendMessage({ chat_id, text: "Loads service" });
        return;
      }
      if (msg_text.toLowerCase().includes("pv")) {
        bot.sendMessage({ chat_id, text: "PV service" });
        return;
      }
      if (msg_text.toLowerCase().includes("batteries")) {
        bot.sendMessage({ chat_id, text: "Batteries service" });
        return;
      }
    }
    if (state === "admin") {
      const reply_markup = keyboard_markup(["add", "show"]);
      const text = "select what you want to do with it";
      if (msg_text === "inverter") {
        components[user_id] = "inverter";
      }
      if (msg_text === "pv") {
        components[user_id] = "pv";
      }
      if (msg_text === "battery") {
        components[user_id] = "battery";
      }
      if (msg_text === "load") {
        components[user_id] = "load";
      }
      userStates.set_state(user_id, "add_show");
      return bot.sendMessage({ chat_id, text, reply_markup });
    }
    if (state === "add_show") {
      const component = components[user_id];
      let text;
      if (msg_text === "add") {
        text = `Add ${component}`;
      } else if (msg_text === "show") {
        text = `Show ${component}`;
      } else {
        text = "invalid command";
        userStates.set_state(user_id, "initial");
      }
      return bot.sendMessage({ chat_id, text });
    }

    if (state === "add_load") {
      //TODO: Make the consumage forced to be a number
      loads[user_id] = { name: msg_text, power: 0 };
      const load_name = msg_text;
      if (await load_exits(load_name)) {
        const text = "Sorry load already exists";
        userStates.set_state(user_id, "initial");
        return bot.sendMessage({ chat_id, text });
      }
      userStates.set_state(user_id, "add_consumage");
      return bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    }
    if (state === "add_consumage") {
      loads[user_id].power = Number(msg_text);
      const load_name = loads[user_id].name;
      const load_power = loads[user_id].power;
      const text = `Your ${load_name} have power of ${load_power}`;
      await add_load(load_name, load_power);
      userStates.set_state(user_id, "initial");
      return bot.sendMessage({
        chat_id,
        text,
      });
    }
    const text = "Unknown text";
    return bot.sendMessage({
      chat_id: msg.chat.id,
      text,
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage({ chat_id, text: "Unknown error occured" });
  }
});
