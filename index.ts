import {
  TelegramBot,
  KeyboardButton,
  ReplyKeyboardMarkup,
} from "typescript-telegram-bot-api";
import dotenv from "dotenv";

interface UserStates {
  [key: number]: number;
}
dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const userStates: UserStates = {};

bot.on("message:text", (msg) => {
  const user_id = msg.from?.id;
  const keyboard1 = "Add loads";
  const keyboard2 = "Remove Loads";
  const chat_id = msg.chat.id;
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    bot.sendMessage({ chat_id, text });
    return;
  }
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: [[keyboard1, keyboard2]],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  if (userStates[user_id] == 1) {
    bot.sendMessage({ chat_id, text: "Enter the power consumage" });
    userStates[user_id] = 2;
    return;
  }
  if (userStates[user_id] == 2) {
    bot.sendMessage({
      chat_id,
      text: "Good you entered all the required parameters",
    });
    userStates[user_id] = 0;
    return;
  }
  if (msg.text == "/start") {
    bot.sendMessage({
      chat_id,
      text: "Choose the service you want",
      reply_markup: reply_keyboard,
    });
    return;
  }
  if (msg.text == "/id") {
    const firstname = msg.from?.first_name;
    const text = `Hello ${firstname} whose id is ${user_id}`;
    bot.sendMessage({ chat_id, text });
    return;
  }
  if ((msg.text = "/loads")) {
    userStates[user_id] = 1;
    bot.sendMessage({
      chat_id,
      text: "Enter The loads you want to add and its power",
    });
    bot.sendMessage({ chat_id, text: "Enter the load name" });
    return;
  }
  bot.sendMessage({
    chat_id: msg.chat.id,
    text: "Unknown text",
  });
});
