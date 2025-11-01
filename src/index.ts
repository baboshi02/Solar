import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { connect_db } from "./db/db";
import { destroyActor, getOrCreateActor } from "./actor";
import { inline_keyboard_markup } from "./commands";
import { BatteryInterface } from "./interfaces/components/battery";
import { PVInterface } from "./interfaces/components/pv";
import { LoadInterface } from "./interfaces/components/loads";
import { InverterInterface } from "./interfaces/components/inverter";
import { add_battery } from "./services/battery";
import { add_inverter } from "./services/inverter";
import { add_load } from "./services/load";
import { add_pv } from "./services/pv";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });

connect_db(mongourl);
bot.on("message:text", async (msg) => {
  const msg_text = msg.text;
  const chat_id = msg.chat.id;
  const user_id = msg.from?.id;
  const actor = getOrCreateActor(chat_id);
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    return bot.sendMessage({ chat_id, text });
  }
  if (msg_text === "/start") {
    actor.send({ type: "START_COMMAND" });
  }
  const snapshot = actor.getSnapshot();
  //IF NO ID THEN ACCOUNT IS A CHANNEL NOT A PERSON
  try {
    if (msg_text === "/start") {
      actor.send({ type: "START_COMMAND" });
      let state = actor.getSnapshot();
      const keyboard = state.context.keyboard;
      const text = state.context.text;
      const reply_markup = inline_keyboard_markup(...keyboard);
      console.log(reply_markup);
      return bot.sendMessage({
        chat_id,
        text,
        reply_markup,
      });
    }
    if (
      snapshot.matches("battery") ||
      snapshot.matches("pv") ||
      snapshot.matches("load") ||
      snapshot.matches("inverter")
    ) {
      actor.send({ type: "NEXT_INPUT", payload: { input: msg_text } });
      const newSnaphot = actor.getSnapshot();
      let text = "";
      //THIS MEANS THE INPUT FINISHED
      if (newSnaphot.matches("completed")) {
        console.log("completed");
        type AllSpecifications =
          | BatteryInterface
          | InverterInterface
          | PVInterface
          | LoadInterface;
        let Specifications: AllSpecifications | {} = {};
        if (snapshot.matches("battery")) {
          Specifications = newSnaphot.context.battery;
          await add_battery(Specifications as BatteryInterface);
        } else if (snapshot.matches("inverter")) {
          Specifications = newSnaphot.context.inverter;
          await add_inverter(Specifications as InverterInterface);
        } else if (snapshot.matches("load")) {
          Specifications = newSnaphot.context.load;
          await add_load(Specifications as LoadInterface);
        } else if (snapshot.matches("pv")) {
          Specifications = newSnaphot.context.pv;
          await add_pv(Specifications as PVInterface);
        }
        for (const key in Specifications) {
          const validKey = key as keyof AllSpecifications;
          text += ` ${key} || ${Specifications[validKey]}\n`.replace(/_/g, " ");
        }
        actor.send({ type: "START_COMMAND" });
      } else {
        text = actor.getSnapshot().context.text;
      }
      return bot.sendMessage({
        chat_id,
        text,
      });
    }
    return bot.sendMessage({ chat_id, text: "Invalid command" });
  } catch (error) {
    console.error(error);
    bot.sendMessage({ chat_id, text: "Unknown error occured" });
  }
});
bot.on("callback_query", async (query) => {
  const chat_id = query.message?.chat.id!;
  const actor = getOrCreateActor(chat_id);
  const message_id = query.message?.message_id!;
  try {
    const { data } = query;
    switch (data) {
      case "admin": {
        actor.send({ type: "ADMIN_COMMAND" });
        break;
      }
      case "client": {
        actor.send({ type: "CLIENT_COMMAND" });
        break;
      }
      case "add": {
        actor.send({ type: "ADD_COMMAND" });
        break;
      }
      case "show": {
        actor.send({ type: "SHOW_COMMAND" });
        break;
      }
      case "load": {
        actor.send({ type: "LOAD_COMMAND" });
        break;
      }
      case "battery": {
        actor.send({ type: "BATTERY_COMMAND" });
        break;
      }
      case "inverter": {
        actor.send({ type: "INVERTER_COMMAND" });
        break;
      }
      case "pv": {
        actor.send({ type: "PV_COMMAND" });
        break;
      }
    }
    const text = actor.getSnapshot().context.text;
    const keyboard: [] = actor.getSnapshot().context.keyboard;
    let reply_markup = inline_keyboard_markup(...keyboard);
    if (keyboard.length === 0) {
      bot.editMessageText({ message_id, chat_id, text });
    } else {
      bot.editMessageText({ message_id, chat_id, text, reply_markup });
    }
    await bot.answerCallbackQuery({ callback_query_id: query.id });
  } catch (error) {
    console.error(error);
    bot.sendMessage({ chat_id, text: "Unknown error occured" });
  }
});
bot.startPolling();
