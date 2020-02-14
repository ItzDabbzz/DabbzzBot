module.exports = {
    name: "xp",
    category: "general",
    description: "Shows your level/xp",
    run: async (client, message, args) => {
        const key = `${message.guild.id}-${message.author.id}`;
        return message.channel.send(`You currently have ${client.xp.get(key, "xp")} xp, and are level ${client.xp.get(key, "level")}!`);
    }
}
