

import { TelegramBot,KeyboardButton,InlineKeyboardButton } from "typescript-telegram-bot-api"
import dotenv from "dotenv"

dotenv.config()
const TELEGRAM_BOT_API=process.env.TELEGRAM_BOT_API||""
console.log("API: ",TELEGRAM_BOT_API)
const bot=new TelegramBot({botToken:TELEGRAM_BOT_API})
bot.startPolling()

bot.on("message:text",(msg)=>{
    if(msg.text=="/start"){
        bot.sendMessage({chat_id:msg.chat.id,text:"You started this"})
    }
    else if(msg.text=="/help"){
        bot.sendMessage({chat_id:msg.chat.id,text:"Help is right around the corner"})
    }else if (msg.text=="/settings"){
        bot.sendMessage({chat_id:msg.chat.id,text:"Here are the settings"})
    }else{
        bot.sendMessage({chat_id:msg.chat.id,text:"Not available command"})
    }
})

