"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_command = exports.start_command = void 0;
const start_command = (bot, msg) => {
    const chat_id = msg.chat.id;
    const keyboard1 = "Loads";
    const reply_keyboard = {
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
exports.start_command = start_command;
const load_command = (bot, msg, userStates) => {
    var _a;
    const user_id = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
    const chat_id = msg.chat.id;
    const keyboard1 = "add";
    const keyboard2 = "show";
    const reply_keyboard = {
        keyboard: [[keyboard1, keyboard2]],
        resize_keyboard: true,
        one_time_keyboard: true,
    };
    if (!user_id)
        return;
    userStates[user_id] = "initial";
    const text_1 = "What do you want to do";
    bot.sendMessage({
        chat_id,
        text: text_1,
        reply_markup: reply_keyboard,
    });
    return;
};
exports.load_command = load_command;
