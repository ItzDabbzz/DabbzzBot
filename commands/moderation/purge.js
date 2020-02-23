const { RichEmbed } = require("discord.js");
const {stripIndents} = require("common-tags");

module.exports = {
    name: "purge",
    category: "moderation",
    description: "Clears a chat",
    run: async (client, message, args) => {

        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(list);
                    const embed = new RichEmbed()
                    .setTitle("Purge")
                    .setDescription("Purged All Messages")
                    .setFooter(`${client.config.footer} | Purge`)
                    .setTimestamp(Date.now());
                    message.channel.send(embed);
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})                        
        }

       
    }
}
