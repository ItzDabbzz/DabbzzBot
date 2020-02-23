const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "strike",
    category: "moderation",
    description: "Strikes the member",
    usage: "<id | mention> <reason>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "mod-logs") || message.channel;
        const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
        const type = "strike";
        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to Strike.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to Strike.")
                .then(m => m.delete(5000));
        }

        const user = message.mentions.members.first() || message.guild.members.get(args[0]);
        const reason = args.slice(1).join(" ");
        // No member found
        if (!user) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete(5000));
        }

        // Can't kick urself
        if (user.id === message.author.id) {
            return message.reply("You can't strike yourself...")
                .then(m => m.delete(5000));
        }
                
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(user.user.displayAvatarURL)
            .setFooter(`${client.config.footer} | ${message.member.displayName}`, message.author.displayAvatarURL)
            .setTimestamp(Date.now())
            .setDescription(stripIndents`**> Striked member:** ${user} (${user.id})
            **> Striked by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to kick ${user}?`)
            .setTimestamp(Date.now())
            .setFooter(`${client.config.footer}`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();
                await client.db.createPunish(client, message, type, user, reason, modLogs);
                client.logger.log(`User Striked ${user}`);
                user.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
