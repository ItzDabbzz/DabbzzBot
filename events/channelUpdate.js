const {Client, RichEmbed} = require("discord.js");
// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */
module.exports = async(oldChannel, newChannel) => {
    const channel = newChannel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`Channel ${oldChannel.name} Updated`);
    embed.setColor('#20fc3a');
    embed.addField('Name', (oldChannel.name == newChannel.name) ? "Updated: ❌" : `Updated: ✅ \n New Name: ${newChannel.name}`, true);
    embed.addField('Topic', (oldChannel.topic == newChannel.topic) ? "Updated: ❌" : `Updated: ✅ \n New Topic: ${newChannel.topic}`, true);
    embed.addField('Is NSFW?', (newChannel.nsfw) ? "✅" : "❌", true);
    embed.addField('Category', (newChannel.parent && oldChannel.parent.name == newChannel.parent.name) ? "Updated: ❌" : `Updated: ✅ \n New Category: ${newChannel.parent.name}`, true);
    embed.addField('Position', (oldChannel.position == newChannel.position) ? "Updated: ❌" : `Updated:  ✅ \n New Position: ${newChannel.position}`, true);
    embed.setFooter(`ID: ${newChannel.id}`);0
    embed.setTimestamp();
    channel.send(embed);
}