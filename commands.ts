import {
  Message,
  ReplyKeyboardMarkup,
  TelegramBot,
} from "typescript-telegram-bot-api";
import { UserStates } from "./interfaces/userStates";

export const start_command = (bot: TelegramBot, msg: Message) => {
  const chat_id = msg.chat.id;
  const keyboard1 = "Add loads";
  const keyboard2 = "Remove Loads";
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: [[keyboard1, keyboard2]],
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

export const id_command = (bot: TelegramBot, msg: Message) => {
  const chat_id = msg.chat.id;
  const user_id = msg.from?.id;
  const firstname = msg.from?.first_name;
  const text = `Hello ${firstname} whose id is ${user_id}`;
  bot.sendMessage({ chat_id, text });
  return;
};
export const load_command = (
  bot: TelegramBot,
  msg: Message,
  userStates: UserStates,
) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  if (!user_id) return;
  userStates[user_id] = 1;
  const text_1 = "Enter The load name";
  bot.sendMessage({
    chat_id,
    text: text_1,
  });
  return;
};
