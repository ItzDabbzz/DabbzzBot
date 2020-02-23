module.exports = {
    name: "bugreport",
    category: "general",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        let channel = message.guild.channels.find(Channel => Channel.name === 'reports')

        if (!channel) return message.channel.send(Embed({ preset: 'console' }));
        if (!args[0]) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));
  
        channel.send(Embed({
          title: 'Bug Report',
          description: args.join(" "),
          footer: { text: 'From: ' + message.author.tag, icon: message.author.displayAvatarURL },
          timestamp: new Date()
        }))
        message.channel.send(Embed({ title: `Bug Reported`, description: ':white_check_mark: Thank you for reporting the bug.' }));
    }
}
