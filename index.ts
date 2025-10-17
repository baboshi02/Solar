import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { UserStates } from "./src/interfaces/userStates";
import { load_command, start_command } from "./src/commands";
import { Load } from "./src/interfaces/components/loads";
import { add_load, get_loads, load_exitss } from "./src/services/load";
import mongoose from "mongoose";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const userStates: UserStates = {};
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

bot.on("message:text", async (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  const msg_text = msg.text;
  try {
    if (!user_id) {
      const text =
        "This seems to be a channel this service only works for accounts";
      console.log("loads: ", loads);
      return bot.sendMessage({ chat_id, text });
    }
    if (userStates[user_id] == "initial") {
      if (msg_text === "add") {
        const text = "Enter the load name ";
        userStates[user_id] = "add_load";
        return bot.sendMessage({ chat_id, text });
      }
      if (msg_text === "show") {
        const text = "These are the available loads";
        const loads = await get_loads();
        if (!loads) {
          const text = "there is no available loads populate it first";
          return bot.sendMessage({ chat_id, text });
        }
        userStates[user_id] = "start";
        bot.sendMessage({ chat_id, text });
        return loads.map((load) => {
          bot.sendMessage({
            chat_id,
            text: `Load: ${load.name} || power: ${load.power}`,
          });
        });
      }
    }
    if (userStates[user_id] == "add_load") {
      //TODO: Make the monsumage forced to be a number
      loads[user_id] = { name: msg_text, power: 0 };
      userStates[user_id] = "add_consumage";
      return bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    }
    if (userStates[user_id] == "add_consumage") {
      loads[user_id].power = Number(msg_text);
      const load_name = loads[user_id].name;
      const load_power = loads[user_id].power;
      const text = `Your ${load_name} have power of ${load_power}`;
      if (await load_exitss(load_name)) {
        const text = "Sorry load already exists";
        userStates[user_id] = "start";
        return bot.sendMessage({ chat_id, text });
      }
      await add_load(load_name, load_power);
      userStates[user_id] = "start";
      return bot.sendMessage({
        chat_id,
        text,
      });
    }
    if (msg_text == "/start") {
      return start_command(bot, msg);
    }
    if (msg_text == "/loads") {
      return load_command(bot, msg, userStates);
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
