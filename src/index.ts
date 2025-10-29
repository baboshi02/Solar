import { TelegramBot } from "typescript-telegram-bot-api";
import dotenv from "dotenv";
import { connect_db } from "./db/db";
import { Actor, createActor } from "xstate";
import { messagingMachine } from "./State";
import { keyboard_markup } from "./commands";
import { PV } from "./interfaces/components/pv";
import { LoadInterface } from "./interfaces/components/loads";
import { BatteryInterface } from "./interfaces/components/battery";
import { Inverter } from "./interfaces/components/inverter";

dotenv.config();
const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API || "";
const mongourl = process.env.MONGO_URL || "";
const bot = new TelegramBot({ botToken: TELEGRAM_BOT_API });

connect_db(mongourl);
type BotActor = Actor<typeof messagingMachine>;

const userActors: Map<number, BotActor> = new Map();

function destroyActor(chatId: number): void {
  const actor = userActors.get(chatId);
  if (actor) {
    actor.stop();
    userActors.delete(chatId);
    console.log(`[Chat ${chatId}] Actor stopped and removed.`);
  }
}
function getOrCreateActor(chatId: number): BotActor {
  let actor = userActors.get(chatId);
  if (!actor) {
    actor = createActor(messagingMachine) as BotActor;
    actor.start();
    userActors.set(chatId, actor);
    actor.subscribe((state) => {
      console.log(`[Chat ${chatId}] Transitioned to: ${state.value}`);
    });
  }
  return actor;
}
bot.startPolling();
bot.on("message:text", async (msg) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  if (!user_id) {
    const text =
      "This seems to be a channel this service only works for accounts";
    return bot.sendMessage({ chat_id, text });
  }
  const msg_text = msg.text;
  if (msg_text === "/start") destroyActor(chat_id);
  const actor = getOrCreateActor(chat_id);
  let state = actor.getSnapshot();
  const state_value = state.value;

  let state_text = actor.getSnapshot().context.text;
  let state_keyboard = actor.getSnapshot().context.keyboard;
  const getContextText = () => actor.getSnapshot().context.text;
  const getContextKeyobard = () => actor.getSnapshot().context.keyboard;
  //IF NO ID THEN ACCOUNT IS A CHANNEL NOT A PERSON
  try {
    let text = state_text;
    let keyboard = state_keyboard;
    switch (state_value) {
      case "initial": {
        if (msg_text === "/start") {
          actor.send({ type: "START_COMMAND" });
          text = getContextText();
          keyboard = getContextKeyobard();
          console.log("key: ", keyboard);
          bot.sendMessage({
            chat_id,
            text,
            reply_markup: keyboard_markup(...keyboard),
          });
        } else {
          bot.sendMessage({ chat_id, text });
        }
        break;
      }
      case "start": {
        if (msg_text === "admin") {
          actor.send({ type: "ADMIN_COMMAND" });
        } else if (msg_text === "client") {
          actor.send({ type: "CLIENT_COMMAND" });
        }
        text = getContextText();
        keyboard = getContextKeyobard();
        bot.sendMessage({
          chat_id,
          text,
          reply_markup: keyboard_markup(...keyboard),
        });
        break;
      }
      case "admin": {
        if (msg_text === "add") {
          actor.send({ type: "ADD_COMMAND" });
        } else if (msg_text === "show") {
          actor.send({ type: "SHOW_COMMAND" });
        }
        text = getContextText();
        keyboard = getContextKeyobard();
        console.log("current keyboard: ", keyboard);
        bot.sendMessage({
          chat_id,
          text,
          reply_markup: keyboard_markup(...keyboard),
        });
        break;
      }
      case "client": {
        text = getContextText();
        bot.sendMessage({ chat_id, text });
        actor.send({ type: "INITIAL" });
        break;
      }
      case "add": {
        if (msg_text === "battery") {
          actor.send({ type: "BATTERY_COMMAND" });
        }
        if (msg_text === "load") {
          actor.send({ type: "LOAD_COMMAND" });
        }
        if (msg_text === "pv") {
          actor.send({ type: "PV_COMMAND" });
        }
        if (msg_text === "inverter") {
          actor.send({ type: "INVERTER_COMMAND" });
        }
        text = getContextText();
        bot.sendMessage({
          chat_id,
          text,
        });
        break;
      }
    }
    if (
      state.matches("battery") ||
      state.matches("inverter") ||
      state.matches("pv") ||
      state.matches("load")
    ) {
      const previous_state = state;
      actor.send({ type: "NEXT_INPUT", payload: { input: msg.text } });
      text = getContextText();
      bot.sendMessage({ chat_id, text });
      const current_state = actor.getSnapshot();
      if (current_state.matches("completed")) {
        text = "";
        if (previous_state.matches("pv")) {
          const pv_context = current_state.context.pv;
          for (const key of Object.keys(pv_context)) {
            const pvKey = key as keyof PV;
            text += `${key}:${pv_context[pvKey]}\n`;
          }
        } else if (previous_state.matches("load")) {
          const load_context = current_state.context.load;
          for (const key of Object.keys(load_context)) {
            const loadKey = key as keyof LoadInterface;
            text += `${key}:${load_context[loadKey]}\n`;
          }
        } else if (previous_state.matches("battery")) {
          const battery_context = current_state.context.battery;
          for (const key of Object.keys(battery_context)) {
            const batteryKey = key as keyof BatteryInterface;
            text += `${key}:${battery_context[batteryKey]}\n`;
          }
        } else if (previous_state.matches("inverter")) {
          const inverter_context = current_state.context.inverter;
          for (const key of Object.keys(inverter_context)) {
            const inverterKey = key as keyof Inverter;
            text += `${key}:${inverter_context[inverterKey]}\n`;
          }
        }
        bot.sendMessage({ chat_id, text });
        console.log("Hello");
        actor.send({ type: "RESTART_COMMAND" });
      }
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage({ chat_id, text: "Unknown error occured" });
  }
});
