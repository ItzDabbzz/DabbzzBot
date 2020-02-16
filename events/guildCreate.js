// This event executes when a new guild (server) is joined.
// guildCreate
/* Emitted whenever the client joins a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The created guild    */
module.exports = (client, guild) => {
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
    
    const settings = client.getSettings(member.guild.id);

    const channel = guild.channels.find(channel => channel.name === settings.modLogChannel)
    let embed = new Discord.RichEmbed()
                .setTitle('Moderation Log')
                .setColor(client.config.embedPink)
                .setDescription(`${message.author}, you are not allowed to advertise other Discords`);
    schannel.send(embed);
};