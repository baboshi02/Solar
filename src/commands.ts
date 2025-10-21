import { ReplyKeyboardMarkup } from "typescript-telegram-bot-api";

export const keyboard_markup = (...keyboard: string[][]) => {
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: keyboard,
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  return reply_keyboard;
};
