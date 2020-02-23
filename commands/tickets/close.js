const {Client, RichEmbed} = require("discord.js");
module.exports = {
    name: "tclose",
    category: "tickets",
    description: "Closes a ticket",
    run: async (client, message, args) => {
        message.delete();

        const outsideticket = new RichEmbed()
        .setDescription(`:x: Cannot use this command becase you are outside a ticket channel.`)
        .setColor("ff0000")
        .setFooter(`${client.config.footer}`);
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send({embed: outsideticket});
        const close1 = new RichEmbed()
            .setDescription(`Looks like you have come to the end of your support ticket\nPlease confirm that you want to close your ticket by saying ||**confirm**||`)
            .addField("Time", "Your request will be avoided in 20 seconds")
            .setTimestamp(Date.now())
            .setColor("#ee00ff")
            .setFooter(`${client.config.footer}`);
        message.channel.send({embed: close1}).then(m => {
            message.channel.awaitMessages(response => response.content === `confirm`, {
                max: 1,
                time: 10000,
                errors: ['time'],
        
            }).then((collected) => {
                message.channel.delete();
        
            }).catch(() => {
                m.edit('Close ticket request, timedout').then(m2 => {
                m2.delete();
            }, 3000);
        
            });
        });
    }
}
