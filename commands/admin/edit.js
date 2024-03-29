const errors = require("../../handlers/errors");

module.exports = {
    name: "edit",
    category: "admin",
    description: "Edits the guild config",
    run: async (client, message, args) => {
        if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
        if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send("I can't use this command if I can't create embeds").catch(err => {});
        if (!args[0]) return errors.noArgs(message, exports);

        if (args[0].toLowerCase() === "prefix") {
            const currentPrefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
            const response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentPrefix}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
            if (response === "cancel") return client.canceled(message);
    
            await client.db.updatePrefix(message.guild.id, response);
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentPrefix}\` → \`${response}\``);

        } else if (args[0].toLowerCase() === "modlogs") {
            const currentLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentLogs}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
            response = String(response).toLowerCase();
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentLogs)) return errors.sameSetting(message);
    
            await client.db.updateLogs(message.guild.id, response);
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentLogs}\` → \`${response}\``);

        } else if (args[0].toLowerCase() === "ticketlogs") {
            const currentLogs = await client.db.r.table("guilds").get(message.guild.id).getField("tlogChannel").run();
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentLogs}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
            response = String(response).toLowerCase();
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentLogs)) return errors.sameSetting(message);
    
            await client.db.updateTlogChannel(message.guild.id, response);
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentLogs}\` → \`${response}\``);

        } else if (args[0].toLowerCase() === "commandlogs") {
            const currentLogs = await client.db.r.table("guilds").get(message.guild.id).getField("clogChannel").run();
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentLogs}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
            response = String(response).toLowerCase();
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentLogs)) return errors.sameSetting(message);
    
            await client.db.updateClogChannel(message.guild.id, response);
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentLogs}\` → \`${response}\``);

        } else if (args[0].toLowerCase() === "arole"){
            const currentLogs = await client.db.r.table("guilds").get(message.guild.id).getField("autoRoleName").run();
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentLogs}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
            response = String(response);
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentLogs)) return errors.sameSetting(message);
    
            await client.db.updateAutoRoleName(message.guild.id, response);
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentLogs}\` → \`${response}\``);
        } else if (args[0].toLowerCase() === "welcome") {
            const currentWelcome = await client.db.r.table("guilds").get(message.guild.id).getField("welcomeEnabled").run();
            const welcomeEmoji = currentWelcome ? "✅" : "❎";
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${welcomeEmoji}\`\nReply with \`<true/false>\` to change \`${args[0].toLowerCase()}\`.\n**Reply 'cancel' to cancel.**`);
            response = String(response).toLowerCase();
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentWelcome)) return errors.sameSetting(message);
    
            if(response === "true") {
                await client.db.toggleWelcome(message.guild.id, true);
            } else if(response === "false") {
                await client.db.toggleWelcome(message.guild.id, false);
            } else {
                return errors.responseNotRecognised(message, response);
            }
    
            const newWelcome = await client.db.r.table("guilds").get(message.guild.id).getField("welcomeEnabled").run();
            const newWelcomeEmoji = newWelcome ? "✅" : "❎";
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${welcomeEmoji}\` → \`${newWelcomeEmoji}\``)
        } else if (args[0].toLowerCase() === "autorole") {
            const currentWelcome = await client.db.r.table("guilds").get(message.guild.id).getField("autoRoleEnabled").run();
            const welcomeEmoji = currentWelcome ? "✅" : "❎";
            let response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${welcomeEmoji}\`\nReply with \`<true/false>\` to change \`${args[0].toLowerCase()}\`.\n**Reply 'cancel' to cancel.**`);
            response = String(response).toLowerCase();
            if (response === "cancel") return client.canceled(message);
            if (response === String(currentWelcome)) return errors.sameSetting(message);
    
            if(response === "true") {
                await client.db.toggleAutoRole(message.guild.id, true);
            } else if(response === "false") {
                await client.db.toggleAutoRole(message.guild.id, false);
            } else {
                return errors.responseNotRecognised(message, response);
            }
    
            const newWelcome = await client.db.r.table("guilds").get(message.guild.id).getField("autoRoleEnabled").run();
            const newWelcomeEmoji = newWelcome ? "✅" : "❎";
            return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${welcomeEmoji}\` → \`${newWelcomeEmoji}\``)
        } else {
            errors.settingNotRecognised(message);
        }
    }
}

exports.conf = {
    permission: "MANAGE_GUILD",
};