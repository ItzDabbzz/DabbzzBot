const {Client, RichEmbed} = require("discord.js");
// channelCreate
/* Emitted whenever a channel is created.
PARAMETER    TYPE        DESCRIPTION
channel      Channel     The channel that was created    */
module.exports = async (client, channel) => {
    const channel2 = channel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`✅ Channel ${channel2.name} Created ✅`);
    embed.setColor('#20fc3a');
    embed.setTimestamp();
    channel2.send(embed);
}