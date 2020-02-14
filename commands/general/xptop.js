const { RichEmbed } = require("discord.js");
module.exports = {
    name: "xptop",
    category: "general",
    description: "Total XP Leaderboard",
    run: async (client, message, args) => {
        // Get a filtered list (for this guild only), and convert to an array while we're at it.
        const filtered = client.xp.filter( p => p.guild === message.guild.id ).array();

        // Sort it to get the top results... well... at the top. Y'know.
        const sorted = filtered.sort((a, b) => b.xp - a.xp);

        // Slice it, dice it, get the top 10 of it!
        const top10 = sorted.splice(0, 10);

        // Now shake it and show it! (as a nice embed, too!)
        const embed = new RichEmbed()
            .setTitle("Leaderboard")
            .setAuthor(client.user.username, client.user.avatarURL)
            .setDescription("Our top 10 xp leaders!")
            .setColor(0x00AE86);
        for(const data of top10) {
            embed.addField(client.users.get(data.user).tag, `${data.xp} xp (level ${data.level})`);
        }
        return message.channel.send(`${embed}`);}
}
