import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { UserStatesInterface } from "./interfaces/userStates";
import { load_command, start_command } from "./commands";
import { Load } from "./interfaces/components/loads";
import { add_load, get_loads, load_exits } from "./services/load";
import mongoose from "mongoose";
import { UserStates } from "./UserStates";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const loads: UserLoad = {};

interface UserLoad {
  [key: string]: Load;
}

mongoose
  .connect(mongourl)
  .then(() => console.log("database connection successfully"))
  .catch(() => {
    console.log("database connection unsuccessfull");
  });

const userStates = new UserStates();
bot.on("message:text", async (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  const msg_text = msg.text;
  try {
    if (!user_id) {
      const text =
        "This seems to be a channel this service only works for accounts";
      return bot.sendMessage({ chat_id, text });
    }
    if (userStates.is_initial(user_id)) {
      if (msg_text === "add") {
        const text = "Enter the load name ";
        userStates.add_load(user_id);
        return bot.sendMessage({ chat_id, text });
      }
      if (msg_text === "show") {
        const text = "These are the available loads";
        const loads = await get_loads();
        if (!loads) {
          const text = "there is no available loads populate it first";
          return bot.sendMessage({ chat_id, text });
        }
        bot.sendMessage({ chat_id, text });
        return loads.map((load) => {
          bot.sendMessage({
            chat_id,
            text: `Load: ${load.name} || power: ${load.power}`,
          });
        });
      }
    }
    if (userStates.is_add_load(user_id)) {
      //TODO: Make the monsumage forced to be a number
      loads[user_id] = { name: msg_text, power: 0 };
      userStates.add_consumage(user_id);
      return bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    }
    if (userStates.is_add_consumage(user_id)) {
      loads[user_id].power = Number(msg_text);
      const load_name = loads[user_id].name;
      const load_power = loads[user_id].power;
      const text = `Your ${load_name} have power of ${load_power}`;
      if (await load_exits(load_name)) {
        const text = "Sorry load already exists";
        userStates.restart_state(user_id);
        return bot.sendMessage({ chat_id, text });
      }
      await add_load(load_name, load_power);
      userStates.restart_state(user_id);
      return bot.sendMessage({
        chat_id,
        text,
      });
    }
    if (msg_text == "/start") {
      return start_command(bot, msg);
    }
    if (msg_text == "/loads") {
      load_command(bot, msg);
      return userStates.restart_state(user_id);
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
