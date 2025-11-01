import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { connect_db } from "./db/db";
import { getOrCreateActor } from "./actor";
import { inline_keyboard_markup } from "./commands";
import { BatteryInterface } from "./interfaces/components/battery";
import { PVInterface } from "./interfaces/components/pv";
import { LoadInterface } from "./interfaces/components/loads";
import { InverterInterface } from "./interfaces/components/inverter";
import { add_battery, get_all_batteries } from "./services/battery";
import { add_inverter, get_all_inverters } from "./services/inverter";
import { add_load, get_loads } from "./services/load";
import { add_pv, get_all_pv } from "./services/pv";
import { AllSpecifications } from "./interfaces/general";
import { process_components } from "./utils/processing_components";

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
      snapshot.matches("add_battery") ||
      snapshot.matches("add_pv") ||
      snapshot.matches("add_load") ||
      snapshot.matches("add_inverter")
    ) {
      actor.send({ type: "NEXT_INPUT", payload: { input: msg_text } });
      const newSnaphot = actor.getSnapshot();
      let text = "";
      //THIS MEANS THE INPUT FINISHED
      if (newSnaphot.matches("completed")) {
        console.log("completed");
        let Specifications: AllSpecifications | {} = {};
        if (snapshot.matches("add_battery")) {
          Specifications = newSnaphot.context.battery;
          await add_battery(Specifications as BatteryInterface);
        } else if (snapshot.matches("add_inverter")) {
          Specifications = newSnaphot.context.inverter;
          await add_inverter(Specifications as InverterInterface);
        } else if (snapshot.matches("add_load")) {
          Specifications = newSnaphot.context.load;
          await add_load(Specifications as LoadInterface);
        } else if (snapshot.matches("add_pv")) {
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
      case "add_load": {
        actor.send({ type: "LOAD_COMMAND" });
        break;
      }
      case "add_battery": {
        actor.send({ type: "BATTERY_COMMAND" });
        break;
      }
      case "add_inverter": {
        actor.send({ type: "INVERTER_COMMAND" });
        break;
      }
      case "add_pv": {
        actor.send({ type: "PV_COMMAND" });
        break;
      }
      case "remove": {
        actor.send({ type: "REMOVE_COMMAND" });
        break;
      }
      case "show_loads": {
        const loads = await get_loads();
        if (!loads) {
          bot.sendMessage({ chat_id, text: "Sorry component not found" });
          break;
        }
        const processed_loads = process_components(loads, "load")!;
        console.log("loads: ", processed_loads);
        processed_loads.map((processed_loads) =>
          bot.sendMessage({ chat_id, text: processed_loads }),
        );
        actor.send({ type: "START_COMMAND" });
        return bot.answerCallbackQuery({ callback_query_id: query.id });
      }
      case "show_batteries": {
        const batteries = await get_all_batteries();
        if (!batteries) {
          bot.sendMessage({ chat_id, text: "Sorry component not found" });
          break;
        }
        const processed_batteries = process_components(batteries, "battery")!;
        processed_batteries.map((processed_battery) =>
          bot.sendMessage({ chat_id, text: processed_battery }),
        );
        actor.send({ type: "START_COMMAND" });
        return bot.answerCallbackQuery({ callback_query_id: query.id });
      }
      case "show_inverters": {
        const inverters = await get_all_inverters();
        if (!inverters) {
          bot.sendMessage({ chat_id, text: "Sorry component not found" });
          break;
        }
        const processed_inverters = process_components(inverters, "inverter")!;
        processed_inverters.map((processed_inverter) =>
          bot.sendMessage({ chat_id, text: processed_inverter }),
        );
        actor.send({ type: "START_COMMAND" });
        return bot.answerCallbackQuery({ callback_query_id: query.id });
      }
      case "show_pvs": {
        const pvs = await get_all_pv();
        if (!pvs) {
          bot.sendMessage({ chat_id, text: "Sorry component not found" });
          break;
        }
        const processed_pvs = process_components(pvs, "pv")!;
        processed_pvs.map((processed_pvs) =>
          bot.sendMessage({ chat_id, text: processed_pvs }),
        );
        actor.send({ type: "START_COMMAND" });
        return bot.answerCallbackQuery({ callback_query_id: query.id });
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
  }
});
bot.startPolling();
