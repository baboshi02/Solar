"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_telegram_bot_api_1 = require("typescript-telegram-bot-api");
const dotenv_1 = __importDefault(require("dotenv"));
const commands_1 = require("./commands");
const load_1 = require("./services/load");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new typescript_telegram_bot_api_1.TelegramBot({ botToken: TELEGRAM_BOT_API });
bot.startPolling();
const userStates = {};
const loads = {};
console.log("Bot api: ", TELEGRAM_BOT_API);
console.log("Mongours: ", mongourl);
mongoose_1.default
    .connect(mongourl)
    .then(() => console.log("database connection successfully"))
    .catch(() => {
    console.log("database connection unsuccessfull");
});
bot.on("message:text", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_id = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
    const chat_id = msg.chat.id;
    const msg_text = msg.text;
    try {
        if (!user_id) {
            const text = "This seems to be a channel this service only works for accounts";
            console.log("loads: ", loads);
            return bot.sendMessage({ chat_id, text });
        }
        if (userStates[user_id] == "initial") {
            if (msg_text === "add") {
                const text = "Enter the load name ";
                userStates[user_id] = "add_load";
                return bot.sendMessage({ chat_id, text });
            }
            if (msg_text === "show") {
                const text = "These are the available loads";
                const loads = yield (0, load_1.get_loads)();
                if (!loads) {
                    const text = "there is no available loads populate it first";
                    return bot.sendMessage({ chat_id, text });
                }
                userStates[user_id] = "start";
                bot.sendMessage({ chat_id, text });
                return loads.map((load) => {
                    bot.sendMessage({
                        chat_id,
                        text: `Load: ${load.name} || power: ${load.power}`,
                    });
                });
            }
        }
        if (userStates[user_id] == "add_load") {
            //TODO: Make the monsumage forced to be a number
            loads[user_id] = { name: msg_text, power: 0 };
            userStates[user_id] = "add_consumage";
            return bot.sendMessage({ chat_id, text: "Enter the power consumage" });
        }
        if (userStates[user_id] == "add_consumage") {
            loads[user_id].power = Number(msg_text);
            const load_name = loads[user_id].name;
            const load_power = loads[user_id].power;
            const text = `Your ${load_name} have power of ${load_power}`;
            if (yield (0, load_1.load_exitss)(load_name)) {
                const text = "Sorry load already exists";
                userStates[user_id] = "start";
                return bot.sendMessage({ chat_id, text });
            }
            yield (0, load_1.add_load)(load_name, load_power);
            userStates[user_id] = "start";
            return bot.sendMessage({
                chat_id,
                text,
            });
        }
        if (msg_text == "/start") {
            return (0, commands_1.start_command)(bot, msg);
        }
        if (msg_text == "/loads") {
            return (0, commands_1.load_command)(bot, msg, userStates);
        }
        const text = "Unknown text";
        return bot.sendMessage({
            chat_id: msg.chat.id,
            text,
        });
    }
    catch (error) {
        console.error(error);
        bot.sendMessage({ chat_id, text: "Unknown error occured" });
    }
}));
