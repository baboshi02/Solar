import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { admin_command, start_command } from "./commands";
import { Load } from "./interfaces/components/loads";
import { add_load, get_loads, load_exits } from "./services/load";
import { UserStates } from "./UserStates";
import { connect_db } from "./db/db";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
const loads: UserLoad = {};

interface UserLoad {
  [key: string]: Load;
}

connect_db(mongourl);
const userStates = new UserStates();

bot.startPolling();
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
    if (userStates.state_type(user_id) === "admin") {
      if (msg_text === "add") {
        const text = "Enter the load name ";
        userStates.set_add_load_state(user_id);
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
    if (userStates.state_type(user_id) === "add_load") {
      //TODO: Make the monsumage forced to be a number
      loads[user_id] = { name: msg_text, power: 0 };
      const load_name = msg_text;
      if (await load_exits(load_name)) {
        const text = "Sorry load already exists";
        userStates.set_initial_state(user_id);
        return bot.sendMessage({ chat_id, text });
      }
      userStates.set_add_consumage_state(user_id);
      return bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    }
    if (userStates.state_type(user_id) === "add_consumage") {
      loads[user_id].power = Number(msg_text);
      const load_name = loads[user_id].name;
      const load_power = loads[user_id].power;
      const text = `Your ${load_name} have power of ${load_power}`;
      await add_load(load_name, load_power);
      userStates.set_initial_state(user_id);
      return bot.sendMessage({
        chat_id,
        text,
      });
    }
    if (msg_text == "/start") {
      start_command(bot, msg);
      return userStates.set_initial_state(user_id);
    }
    if (msg_text == "/admin") {
      admin_command(bot, msg);
      return userStates.set_admin_state(user_id);
    }
    if (msg_text == "/customer") {
      const text = "Hello client to our services";
      return bot.sendMessage({ chat_id, text });
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
