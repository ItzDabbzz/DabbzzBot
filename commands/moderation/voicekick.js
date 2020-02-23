module.exports = {
    name: "vkick",
    category: "moderation",
    description: "Kick someone from voice chat",
    run: async (client, message, args) => {
        const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
        const type = "voicekick";
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if(!user) return message.reply("You must mention someone or give their ID!");
        const reason = args.slice(1).join(" ");
        const member = message.guild.member(user);
        message.guild.createChannel("Kick", "voice").then(vChan => {
            member.setVoiceChannel(vChan).then(mem => vChan.delete());
            message.react("✅");
            client.db.createPunish(client, message, type, user, reason, modLogs);
            client.logger.log(`User Voice Kicked ${user}`);
        }).catch(err => message.reply(message.channel, err));
    }
}
