module.exports = {
    name: "gXP",
    category: "moderation",
    description: "Gives someone extra xp",
    run: async (client, message, args) => {
        // Limited to guild owner - adjust to your own preference!
        if(message.author.id !== message.guild.ownerID)
            return message.reply("You're not the boss of me, you can't do that!");

        const user = message.mentions.users.first() || client.users.get(args[0]);
        if(!user) return message.reply("You must mention someone or give their ID!");

        const pointsToAdd = parseInt(args[1], 10);
        if(!pointsToAdd)
            return message.reply("You didn't tell me how much xp to give...")

        // Ensure there is a points entry for this user.
        client.xp.ensure(`${message.guild.id}-${user.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            xp: 0,
            level: 1
        });

        // Get their current points.
        let userPoints = client.xp.get(`${message.guild.id}-${user.id}`, "xp");
        userPoints += pointsToAdd;


        // And we save it!
        client.xp.set(`${message.guild.id}-${user.id}`, userPoints, "xp")

        message.channel.send(`${user.tag} has received ${pointsToAdd} xp and now stands at ${userPoints} xp.`);
    }
}
