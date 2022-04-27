'use strict'

const Plugin = {
    "name": "KeyWord",
    "version": "1.0.0",
    "depends": {
        "pluginLoader": ">=4.7.0",
        "DataBase": ">=1.1.0"
    },
    "Events": ["messageCreate"],
    "Commands": [
        {
            "name": "keyword set <標籤> <內容>",
            "note": "設定關鍵字"
        },
        {
            "name": "keyword remove <標籤>",
            "note": "移除關鍵字"
        }
    ],
    "author": ["whes1015"],
    "link": "https://github.com/ExpTechTW/MPR-KeyWord",
    "resources": ["AGPL-3.0"],
    "description": "關鍵字回覆"
}

const DB = require("./DataBase")
const pluginLoader = require('../Core/pluginLoader')

async function messageCreate(client, message) {
    if (message.content.startsWith("keyword set ")) {
        let args = message.content.replace("keyword set ", "").split(" ")
        DB.write(Plugin, args[0], args[1])
        let list = await DB.read(Plugin, "keyword") ?? []
        if (!list.includes(args[0])) {
            list.push(args[0])
            DB.write(Plugin, "keyword", list)
        }
        await message.reply(await pluginLoader.embed("已 新增 此關鍵字"))
    } else if (message.content.startsWith("keyword remove ")) {
        let args = message.content.replace("keyword remove ", "").split(" ")
        let list = await DB.read(Plugin, "keyword") ?? []
        if (!list.includes(args[0])) {
            await message.reply(await pluginLoader.embed("未找到此關鍵字"))
        } else {
            DB.del(Plugin, args[0])
            list.splice(list.indexOf(args[0]), 1)
            DB.write(Plugin, "keyword", list)
            await message.reply(await pluginLoader.embed("已 刪除 此關鍵字"))
        }
    } else {
        let list = await DB.read(Plugin, "keyword") ?? []
        if (list.includes(message.content)) {
            await message.reply(await DB.read(Plugin, message.content))
        }
    }
}

module.exports = {
    Plugin,
    messageCreate
}
