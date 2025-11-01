import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from "typescript-telegram-bot-api";

export const reply_keyboard_markup = (...keyboard: string[][]) => {
  const reply_keyboard: ReplyKeyboardMarkup = {
    keyboard: keyboard,
    is_persistent: true,
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  return reply_keyboard;
};

interface data {
  text: string;
  callback_data: string;
}
export const inline_keyboard_markup = (...inline_keyboard: data[][]) => {
  const inlineKeyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard,
  };
  return inlineKeyboardMarkup;
};
