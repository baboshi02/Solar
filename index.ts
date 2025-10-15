import {
  TelegramBot,
  KeyboardButton,
  ReplyKeyboardMarkup,
} from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { UserStates } from "./interfaces/userStates";
import { id_command, load_command, start_command } from "./commands";
import { Load } from "./interfaces/loads";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const userStates: UserStates = {};
const loads: UserLoad = {};

interface UserLoad {
  [key: string]: Load;
}
bot.on("message:text", (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  const msg_text = msg.text;
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    console.log("loads: ", loads);
    bot.sendMessage({ chat_id, text });
    return;
  }
  if (userStates[user_id] == 1) {
    //TODO: Make the monsumage forced to be a number
    loads[user_id] = { name: msg_text, power: 0 };
    bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    userStates[user_id] = 2;
    return;
  }
  if (userStates[user_id] == 2) {
    loads[user_id].power = Number(msg_text);
    const load_name = loads[user_id].name;
    const load_power = loads[user_id].power;
    const text = `Your ${load_name} have power of ${load_power}`;
    bot.sendMessage({
      chat_id,
      text,
    });
    userStates[user_id] = 0;
    return;
  }
  if (msg_text == "/start") {
    start_command(bot, msg);
    return;
  }
  if (msg_text == "/id") {
    id_command(bot, msg);
    return;
  }
  if (msg_text == "/loads") {
    load_command(bot, msg, userStates);

    return;
  }
  const text = "Unknown text";
  bot.sendMessage({
    chat_id: msg.chat.id,
    text,
  });
});
