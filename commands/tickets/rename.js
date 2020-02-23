const {Client, RichEmbed} = require("discord.js");
module.exports = {
    name: "trename",
    category: "tickets",
    description: "Renames a ticket",
    run: async (client, message, args) => {
        message.delete();

        let staffGroup = message.guild.roles.find(staffRole => staffRole.name === 'Staff')
    
        const rolemissing = new RichEmbed()
            .setDescription(`:x: Looks like this server doesn't have the role **Staff**`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`); 
        if (!staffGroup) return message.reply({embed: rolemissing});
    
        const donothaverole = new RichEmbed()
            .setDescription(`:x: Sorry! You cannot use this command with the role **Staff**`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`) ;
        if (!message.member.roles.has(staffGroup.id)) return message.reply({embed: donothaverole});
        
        const outsideticket = new RichEmbed()
            .setDescription(`:x: Cannot use this command becase you are outside a ticket channel.`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`) ;
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send({embed: outsideticket});
        const renameto = args.join(" ");
        message.channel.setName(`ticket-${renameto}-${message.author.username}`)
        
        // Renamed Ticket Logistic   
        const logEmbed = new RichEmbed()
            .setTitle(":ticket: Ticket Renamed")
            .setDescription(`<@${message.author.id}> has renamed a ticket to ${renameto}`)
            .setColor("#22ff00")
            .setFooter(`${client.config.footer}`)
            .setTimestamp(Date.now());
      
        let logChannel = message.guild.channels.find(TicketChannel => TicketChannel.name === `ticket-logs`);
        if(!logChannel) return message.channel.send(`:x: Error! Could not find the logs channel **ticket-logs**`);
        
        logChannel.send({embed: logEmbed});
    }
}
