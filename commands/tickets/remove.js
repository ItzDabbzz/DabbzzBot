const {Client, RichEmbed} = require("discord.js");
module.exports = {
    name: "tremove",
    category: "tickets",
    description: "Removes a user from a ticket",
    run: async (client, message, args) => {
        let staffGroup =  message.guild.roles.find(supportRole => supportRole.name === `Staff`)

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

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        const cantfinduser = new RichEmbed()
            .setDescription(`:x: Hmm! Does that user exist? I cannot find the user.`)
            .setColor('#ff0000')
            .setFooter(`${client.config.footer}`);
        if(!rUser) return message.channel.send({embed: cantfinduser});

        const channel = message.guild.channels.find(channel => channel.name === message.channel.name);

        const cantfindchannel = new RichEmbed()
            .setDescription(`:x: Hmm! Does that ticket exist? I cannot find the ticket channel.`)
            .setColor("#ff0000")
            .setFooter(`${client.config.footer}`);
        if(!channel) return message.channel.send({embed: cantfindchannel});
        message.delete().catch(O_o=>{});

        message.channel.overwritePermissions(rUser, { READ_MESSAGES: false, SEND_MESSAGES: false });

        const useradded = new RichEmbed()
            .setColor("#22ff00") 
            .setDescription(`:white_check_mark: Successfully remove ${rUser} from the ticket.`)
            .setTimestamp(Date.now())
            .setFooter(`${client.config.footer}`);

        message.channel.send({embed: useradded});
    }
}
