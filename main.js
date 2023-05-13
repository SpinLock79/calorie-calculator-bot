import TelegramAPI from "node-telegram-bot-api";
import {readFile} from "fs/promises";

const config = JSON.parse(await readFile(new URL("./config.json", import.meta.url)));
const {settings} = config;
const {token} = settings;

const bot = new TelegramAPI(token, {polling: true});

const caloriesRegEx = /"([А-Яа-я]+)"\s(\d+)/;
const start = () => {
    bot.on("message", async msg => {
        switch (msg.text) {
            case "/start": {
                const user_name = `${msg.chat.first_name ? msg.chat.first_name : ""} ${msg.chat.last_name ? msg.chat.last_name : ""}`;
                await bot.sendMessage(msg.chat.id, `Здравствуйте, ${user_name}\n` +
                    `Введите "название_продукта" вес_в_граммах`
                );
                break;
            }
            case msg.text.match(caloriesRegEx)?.input: {
                const result = caloriesRegEx.exec(msg.text);
                await bot.sendMessage(msg.chat.id, `${result[1]} (${result[2]} грамм) - 0 ккал`);
                break;
            }
            default: {
                await bot.sendMessage(msg.chat.id, "Вы ввели неизвестную команду");
            }
        }
    });
}

start();
