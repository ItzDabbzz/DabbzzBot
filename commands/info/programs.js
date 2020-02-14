const { RichEmbed } = require("discord.js");
const {stripIndents} = require("common-tags");

module.exports = {
    name: "programs",
    category: "info",
    description: "Shows suggested programs to use",
    run: async (client, message, args) => {
        const embed = new RichEmbed()
            .setFooter("Highly Suggested Programs")
            //.setThumbnail(member.user.displayAvatarURL)
            .setColor("#00DCFF")

            .addField('General Use:', stripIndents`**> Opera:** [Get It Here](https://www.opera.com)
            **> IntelliJ Idea: (Java)** [Get It Here](https://www.jetbrains.com/idea/)
            **> Visual Studio Code: (JavaScript)** [Get It Here](https://code.visualstudio.com)`, true)

            .setTimestamp()


        message.channel.send(embed);
    }
}
