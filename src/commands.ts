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

export interface Inline_Keyboard {
  text: string;
  callback_data: string;
}
export const inline_keyboard_markup = (
  ...inline_keyboard: Inline_Keyboard[][]
) => {
  const inlineKeyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard,
  };
  return inlineKeyboardMarkup;
};
