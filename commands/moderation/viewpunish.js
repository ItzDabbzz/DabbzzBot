const { Client, RichEmbed } = require(`discord.js`);
const config = require('../../config')

module.exports = {
    name: "viewpunish",
    category: "moderation",
    description: "View Punishments",
    run: async (client, message, args) => {
        if (!args[0]) return errors.noArgs(message, exports);

        const punishment = await client.db.r.table("punishments").get(args[0]).run();
        if (!await client.findPunishment(message, punishment)) return;

        const guildid = await client.db.r.table("punishments").get(args[0]).getField("guildid").run();
        if(message.guild.id !== guildid) return errors.otherGuildPunishment(message);
        const type = await client.db.r.table("punishments").get(args[0]).getField("type").run();
        let punisher = await client.db.r.table("punishments").get(args[0]).getField("punisher").run();
        let offender = await client.db.r.table("punishments").get(args[0]).getField("offender").run();
        const reason = await client.db.r.table("punishments").get(args[0]).getField("reason").run();
        let time = await client.db.r.table("punishments").get(args[0]).getField("time").run();

        punisher = punisher.split("-").slice(1);
        offender = offender.split("-").slice(1);
        time = time.toUTCString();

        const embed = new RichEmbed()
            .setTitle(`Punishment Information`)
            .setColor(config.embedBlue)
            .addField("Type:", type)
            .addField("Punisher:", `<@${punisher}> (${punisher})`)
            .addField("Offender:", `<@${offender}> (${offender})`)
            .addField("Reason:", reason)
            .addField("Given at:", time)
            .setFooter(`${client.config.footer} | ID: ${args[0]} | Guild ID: ${guildid}`);
        
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send(embed).catch(err => {});
        const msg = [
            `Type: ${type}`,
            `Punisher: ${(await client.fetchUser(punisher)).tag} (${punisher})`,
            `Offender: ${(await client.fetchUser(offender)).tag} (${offender})`,
            `Reason: ${reason}`,
            `Given at: ${time}`
        ];
        return await message.channel.send(msg.join("\n")).catch(err => {});
    }
}
