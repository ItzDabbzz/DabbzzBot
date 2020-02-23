const { Client, RichEmbed } = require(`discord.js`);
const config = require('../../config')

module.exports = {
    name: "viewtickets",
    category: "tickets",
    description: "View Tickets",
    run: async (client, message, args) => {
        if (!args[0]) return errors.noArgs(message, exports);

        const ticket = await client.db.r.table("tickets").get(args[0]).run();
        if (!await client.findTicket(message, ticket)) return;

        const guildid = await client.db.r.table("tickets").get(args[0]).getField("guildid").run();
        if(message.guild.id !== guildid) return errors.otherGuildPunishment(message);
        const department = await client.db.r.table("tickets").get(args[0]).getField("department").run();
        let user = await client.db.r.table("tickets").get(args[0]).getField("user").run();
        const reason = await client.db.r.table("tickets").get(args[0]).getField("reason").run();
        let time = await client.db.r.table("tickets").get(args[0]).getField("time").run();

        time = time.toUTCString();

        const embed = new RichEmbed()
            .setTitle(`Punishment Information`)
            .setColor(config.embedBlue)
            .addField("Department:", department)
            .addField("User:", `<@${user}> (${user})`)
            .addField("Reason:", reason)
            .addField("Given at:", time)
            .setFooter(`${client.config.footer} | ID: ${args[0]} | Guild ID: ${guildid}`);
        
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send(embed).catch(err => {});
        const msg = [
            `Department: ${department}`,
            `User: ${(await client.fetchUser(user)).tag} (${user})`,
            `Reason: ${reason}`,
            `Given at: ${time}`
        ];
        return await message.channel.send(msg.join("\n")).catch(err => {});
    }
}
