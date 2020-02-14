module.exports = {
    name: "vkick",
    category: "moderation",
    description: "Kick someone from voice chat",
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if(!user) return message.reply("You must mention someone or give their ID!");
        const member = message.guild.member(user);
        message.guild.createChannel("Kick", "voice").then(vChan => {
            member.setVoiceChannel(vChan).then(mem => vChan.delete());
            message.react("✅");
        }).catch(err => message.reply(message.channel, err));
    }
}
