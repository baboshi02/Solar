import {
  TelegramBot,
  KeyboardButton,
  InlineKeyboardButton,
} from "typescript-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
console.log("API: ", TELEGRAM_BOT_API);
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();

bot.on("message:text", (msg) => {
  if (msg.text == "/start") {
    bot.sendMessage({ chat_id: msg.chat.id, text: "You started this" });
  }
});
