const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "userinfo",
    aliases: ["user-info", "ui"],
    category: "moderation",
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        let nickname = member.nickname;
        if (nickname) {
            nickname = member.nickname;
        } else {
            nickname = "None"
        };
        
        if (member.presence.game !== null && member.presence.game.type === 2 && member.presence.game.name === "Spotify") {
            const trackURL = `https://open.spotify.com/track/${user.presence.game.syncID}`;
            playingStatus = `${trackURL}`
        } else if (member.presence.game) {
            playingStatus = member.presence.game.name;
        } else {
            playingStatus = "None";
        };

        //get user punishments
        const punishments = await client.db.r.table("punishments").run()
        .filter(punishment => punishment.offender === `${message.guild.id}-${member.id}`);
        const kickable = member.kickable ? "✅" : "❎";
        const bannable = member.bannable ? "✅" : "❎";

        
        const embed = new RichEmbed()
            .setFooter(`${client.config.footer} | ${member.displayName}`, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', stripIndents`**> Display name:** ${member.displayName}
            **> Joined at:** ${joined}
            **> Roles:** ${roles}
            **> Created:** ${created}`, true)

            .addField('User information:', stripIndents`**> ID:** ${member.user.id}
            **> Username**: ${member.user.username}
            **> Nickname**: ${nickname}
            **> Tag**: ${member.user.tag}
            **> Status**: ${playingStatus}`)

            .addField(`Punishments:`, stripIndents`**Strikes**: ${punishments.length}
            **> Bannable**: ${bannable}
            **> Kickable**: ${kickable}`)
            
            .setTimestamp()

        //if (member.user.presence.game) 
        //    embed.addField('Currently playing', stripIndents`**> Name:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}