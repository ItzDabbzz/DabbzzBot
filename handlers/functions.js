const { Client, RichEmbed } = require('discord.js');
const errors = require('./errors')
const config = require('../config')
module.exports = (client) => {

  // get the last image posted from a channel
  client.lastImageGet = (channelId) => {
    return (typeof lastAttachmentUrl[channelId] !== 'undefined') ? lastAttachmentUrl[channelId] : null;
  };

  // fetch and set the last image posted from a channel
  client.lastImageSet = (msg) => {
    // get the first image url from a message
    let url = /https?:\/\/.*\.(?:png|jpg|gif|jpeg)/g.exec(msg.content);
    if (url && url[0]) {
      lastAttachmentUrl[msg.channel.id] = url[0];
    }
    // get direct attachment
    else if (typeof msg.attachments.first() !== 'undefined' && msg.attachments.first()) {
      lastAttachmentUrl[msg.channel.id] = msg.attachments.first().url;
    }
  };

    client.findLogs = async (client, message, modLogs) => {
        const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
        if (!modLogs || !message.guild.channels.find(c => c.name === modLogs)) {
            const embed = new RichEmbed()
                .setTitle("An error has occurred!")
                .setDescription(`No log channel found with the name \`${modLogs}\`.`)
                .setColor(config.embedRed)
                .setFooter(`${client.config.footer} |  Use ${prefix}edit modlogs to change this.`);
            return message.channel.send(embed), false;
        } else {
            return true;
        }
    };

    client.findPunishment = async (message, punishment) => {
        if (!punishment) {
            const embed = new RichEmbed()
                .setTitle('An error has occurred!')
                .setDescription(`A punishment with the specified ID hasn't been found.`)
                .setColor(config.embedRed)
                .setFooter(`${client.config.footer} | ${message.author.tag}`, message.author.avatarURL);
            return message.channel.send(embed), false;
        } else {
            return true;
        }
    };

    client.findTicket = async (message, ticket) => {
        if (!ticket) {
            const embed = new RichEmbed()
                .setTitle('An error has occurred!')
                .setDescription(`A ticket with the specified ID hasn't been found.`)
                .setColor(config.embedRed)
                .setFooter(`${client.config.footer} | ${message.author.tag}`, message.author.avatarURL);
            return message.channel.send(embed), false;
        } else {
            return true;
        }
    };

    client.sendTicket = async (message, channel, department, user, reason, id) => {
        let embed = new RichEmbed()
            .setTitle(":ticket: Ticket Logs")
            .setDescription(`Guild name: ${message.guild.name}`)
            .setColor(config.embedAqua)
            .setTimestamp()
            .addField("User:", `${user} (${user.id})`, true)
            .addField("Department:", `${department}`, true)
            .addField("Reason:", reason, true)
            .setFooter(`${client.config.footer}| ID: ${id}`);
        let tLogsChannel = message.guild.channels.find(c => c.name === "ticket-logs");
        if (!tLogsChannel) return await errors.couldNotLog(message, "ticket-logs");
        if (!tLogsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await tLogsChannel.send([
                "Ticket Logs",
                `**Action: ${type}**\nGuild name: ${message.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Deparment:**\n ${department}`,
                `**Reason:**\n ${reason}`,
                `ID:\n${id}`
            ].join("\n")).catch(async err => {
                await errors.couldNotLog(message, modLogs);
            }) 
        };
        await tLogsChannel.send(embed)
            .catch(async () => {
                await errors.couldNotLog(message, modLogs);
            });
        await user.send(embed)
        .catch(async () => {
            await errors.couldNotDM(message);
        });
    };

    client.sendUser = async (elo, rank, party, user, id) => {
        let embed = new RichEmbed()
            .setTitle(":bust_in_silhouette: User Logs")
            .setDescription(`Guild name: ${user.guild.name}`)
            .setColor(config.embedAqua)
            .setTimestamp()
            .addField("User:", `${user} (${user.id})`, true)
            .addField("Elo:", `${elo}`, true)
            .addField("Rank:", `${rank}`, true)
            .addField("Party:", party, true)
            .setFooter(`${client.config.footer}| ID: ${id}`);
        let modLogsChannel = user.guild.channels.find(c => c.name === "mod-logs");
        if (!modLogsChannel) return await errors.couldNotLog(message, "mod-logs");
        if (!modLogsChannel.permissionsFor(user.guild.me).has("EMBED_LINKS")) {
            return await modLogsChannel.send([
                "User Logs",
                `**Action: ${type}**\nGuild name: ${user.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Elo:**\m${elo}`,
                `**Rank:**\n ${rank}`,
                `**Party:**\n ${party}`,
                `ID:\n${id}`
            ].join("\n")).catch(async err => {
                //await errors.couldNotLog(message, modLogs);
            }) 
        };
        await modLogsChannel.send(embed)
            .catch(async () => {
                //await errors.couldNotLog(message, modLogs);
            });
        //await user.send(embed)
        //.catch(async () => {
            //await errors.couldNotDM(message);
        //});
    };

    client.sendPunishment = async (message, type, user, reason, modLogs, id) => {
        let embed = new RichEmbed()
            .setTitle("R6Bot Logs")
            .setDescription(`**Action: ${type}**\nGuild name: ${message.guild.name}`)
            .setColor(config.embedPink)
            .setTimestamp()
            .addField("User:", `${user} (${user.id})`, true)
            .addField("Action by:", `${message.author} (${message.author.id})`, true)
            .addField("Reason:", reason, true)
            .setFooter(`${client.config.footer} | ID: ${id}`);
        let modLogsChannel = message.guild.channels.find(c => c.name === modLogs);
        if (!modLogsChannel) return await errors.couldNotLog(message, modLogs);
        if (!modLogsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await modLogsChannel.send([
                "R6Bot Logs",
                `**Action: ${type}**\nGuild name: ${message.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Action by:**\n ${message.author} (${message.author.id})`,
                `**Reason:**\n ${reason}`,
                `ID:\n${id}`
            ].join("\n")).catch(async err => {
                await errors.couldNotLog(message, modLogs);
            }) 
        };
        await modLogsChannel.send(embed)
            .catch(async () => {
                await errors.couldNotLog(message, modLogs);
            });
        await user.send(embed)
            .catch(async () => {
                await errors.couldNotDM(message);
            });
    };

    client.sendReport = async (message, user, reason, modLogs, id) => {
        let embed = new RichEmbed()
            .setTitle("Report")
            .setDescription(`Guild name: ${message.guild.name}`)
            .setColor(config.embedRed)
            .setTimestamp()
            .addField("User:", `${user} (${user.id})`, true)
            .addField("Action by:", `${message.author} (${message.author.id})`, true)
            .addField("Reason:", reason, false)
            .setFooter(`${client.config.footer} | ID: ${id}`);
        let reportsChannel = message.guild.channels.find(c => c.name === "reports");
        if (!reportsChannel) return await errors.couldNotLog(message, modLogs);
        if (!reportsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await reportsChannel.send([
                "Report",
                `Guild name: ${message.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Action by:**\n ${message.author} (${message.author.id})`,
                `**Reason:**\n ${reason}`,
                `ID:\n${id}\n**R6Bot**`
            ].join("\n")).catch(async err => {
                await errors.couldNotLog(message, modLogs);
            }) 
        };
        await reportsChannel.send(embed)
            .catch(async () => {
                await errors.couldNotLog(message, modLogs);
            });
        await user.send(embed)
            .catch(async () => {
                await errors.couldNotDM(message);
            });
    };

    /*
    PERMISSION LEVEL FUNCTION
    This is a very basic permission system for commands which uses "levels"
    "spaces" are intentionally left black so you can add them if you want.
    NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
    command including the VERY DANGEROUS `eval` and `exec` commands!
    */
    client.permlevel = message => {
        let permlvl = 0;

        const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    };

    /*
    GUILD SETTINGS FUNCTION
    This function merges the default settings (from config.defaultSettings) with any
    guild override you might have for particular guild. If no overrides are present,
    the default settings are used.
    */

    /*
    // THIS IS HERE BECAUSE SOME PEOPLE DELETE ALL THE GUILD SETTINGS
    // And then they're stuck because the default settings are also gone.
    // So if you do that, you're resetting your defaults. Congrats.
    const defaultSettings = {
        "prefix": "-",
        "modLogChannel": "mod-log",
        "modRole": "Mod",
        "adminRole": "Admin",
        "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
        "welcomeChannel": "welcome",
        "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
        "welcomeEnabled": "false",
        "tlogChannel": "620316098390392885",
        "clogChannel": "620316099296362506",
        "discordinvite": "true",
    };

    // getSettings merges the client defaults with the guild settings. guild settings in
    // enmap should only have *unique* overrides that are different from defaults.
    client.getSettings = (guild) => {
        client.settings.ensure("default", defaultSettings);
        if(!guild) return client.settings.get("default");
        const guildConf = client.settings.get(guild.id) || {};
        // This "..." thing is the "Spread Operator". It's awesome!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        return ({...client.settings.get("default"), ...guildConf});
    };*/

    /*
    SINGLE-LINE AWAITMESSAGE
    A simple way to grab a single reply, from the user that initiated
    the command. Useful to get "precisions" on certain things...
    USAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    client.awaitReply = async (msg, question, limit = 60000) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };

    /*
    MESSAGE CLEAN FUNCTION
    "Clean" removes @everyone pings, as well as tokens, and makes code blocks
    escaped so they're shown more easily. As a bonus it resolves promises
    and stringifies objects!
    This is mostly only used by the Eval and Exec commands.
    */
    client.clean = async (client, text) => {
        if (text && text.constructor.name == "Promise")
            text = await text;
        if (typeof evaled !== "string")
            text = require("util").inspect(text, {depth: 1});

        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

        return text;
    };

    /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

    // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
    // later, this conflicts with native code. Also, if some other lib you use does
    // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
    // are, we feel, very useful in code.

    // <String>.toPropercase() returns a proper-cased string such as:
    // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
    Object.defineProperty(String.prototype, "toProperCase", {
        value: function() {
            return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
    });

    // <Array>.random() returns a single random element from an array
    // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
    Object.defineProperty(Array.prototype, "random", {
        value: function() {
            return this[Math.floor(Math.random() * this.length)];
        }
    });

    // `await client.wait(1000);` to "pause" for 1 second.
    client.wait = require("util").promisify(setTimeout);

    // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
    process.on("uncaughtException", (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        client.logger.error(`Uncaught Exception: ${errorMsg}`);
        console.error(err);
        // Always best practice to let the code crash on uncaught exceptions.
        // Because you should be catching them anyway.
        process.exit(1);
    });

    process.on("unhandledRejection", err => {
        client.logger.error(`Unhandled rejection: ${err}`);
        console.error(err);
    });

};