const {Client, RichEmbed} = require("discord.js");
// channelDelete
/* Emitted whenever a channel is deleted.
PARAMETER   TYPE      DESCRIPTION
channel     Channel   The channel that was deleted    */
module.exports = async (client, channel) => {
    const channel3 = channel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`❌ Channel ${channel3.name} Deleted ❌`);
    embed.setColor('#20fc3a');
    embed.setTimestamp();
    channel3.send(embed);
}