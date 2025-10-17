import {
  Message,
  ReplyKeyboardMarkup,
  TelegramBot,
} from "typescript-telegram-bot-api";
import { UserStates } from "./interfaces/userStates";
import { Load } from "./interfaces/components/loads";

export const start_command = (bot: TelegramBot, msg: Message) => {
  const chat_id = msg.chat.id;
  const keyboard1 = "Loads";
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: [[keyboard1]],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  const text = "Choose the service you want";
  bot.sendMessage({
    chat_id,
    text,
    reply_markup: reply_keyboard,
  });
  return;
};

export const load_command = (
  bot: TelegramBot,
  msg: Message,
  userStates: UserStates,
) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  const keyboard1 = "add";
  const keyboard2 = "show";
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: [[keyboard1, keyboard2]],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  if (!user_id) return;
  userStates[user_id] = "initial";
  const text_1 = "What do you want to do";
  bot.sendMessage({
    chat_id,
    text: text_1,
    reply_markup: reply_keyboard,
  });
  return;
};
