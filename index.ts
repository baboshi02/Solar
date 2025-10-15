import {
  TelegramBot,
  KeyboardButton,
  ReplyKeyboardMarkup,
} from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { UserStates } from "./interfaces/userStates";
import { id_command, load_command, start_command } from "./commands";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const userStates: UserStates = {};

bot.on("message:text", (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    bot.sendMessage({ chat_id, text });
    return;
  }
  if (userStates[user_id] == 1) {
    bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    userStates[user_id] = 2;
    return;
  }
  if (userStates[user_id] == 2) {
    const text = "Good you entered all the required parameters";
    bot.sendMessage({
      chat_id,
      text,
    });
    userStates[user_id] = 0;
    return;
  }
  if (msg.text == "/start") {
    start_command(bot, msg);
    return;
  }
  if (msg.text == "/id") {
    id_command(bot, msg);
    return;
  }
  if ((msg.text = "/loads")) {
    load_command(bot, msg, userStates);
    return;
  }
  const text = "Unknown text";
  bot.sendMessage({
    chat_id: msg.chat.id,
    text,
  });
});
