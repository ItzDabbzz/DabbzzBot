const {Client, RichEmbed} = require("discord.js");
module.exports = {
    name: "tforceclose",
    category: "tickets",
    description: "Force closes a ticket",
    run: async (client, message, args) => {
        message.delete();

        let staffGroup = message.guild.roles.find(supportRole => supportRole.name === `Staff`)
    
        const rolemissing = new RichEmbed()
            .setDescription(`:x: Looks like this server doesn't have the role **Staff**`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`);
        if (!staffGroup) return message.reply({embed: rolemissing});
            
        const donothaverole = new RichEmbed()
            .setDescription(`:x: Sorry! You cannot use this command with the role **Staff**`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`);
        if (!message.member.roles.has(staffGroup.id)) return message.reply({embed: donothaverole});
        
        const outsideticket = new RichEmbed()
            .setDescription(`:x: Cannot use this command becase you are outside a ticket channel.`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`);
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send({embed: outsideticket});
        message.channel.delete();
    }
}
