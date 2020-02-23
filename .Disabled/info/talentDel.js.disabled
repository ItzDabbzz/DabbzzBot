const { RichEmbed } = require("discord.js");
module.exports = {
    name: "tdel",
    category: "info",
    description: "Show off what you know!",
    run: async (client, message, args) => {
        const _ = require('underscore');

        const allowed = ['CSS', 'C', 'JAVA', 'NODEJS', 'GFX', 'PYTHON', 'VB', 'PHP', 'HTML', 'C#', 'UNIX', 'PERL', 'ASSEMBLY', 'TALENTLESS', 'SQL', 'JAVASCRIPT', 'LUA', 'C++'];

        if (args == '') {
            var skillsallowed = [];
            _.each(allowed, function(check) {
                check = check.toUpperCase();
                const rolecheck = message.channel.guild.roles.find(role => role.name, check);
                if (!message.member.roles.has(rolecheck.id)) {
                    skillsallowed.push(check);
                }
            });
            if (skillsallowed.length < 1) {
                return message.reply("You don't have any skills to delete, go add some with the addtalent command!");
            }
            return message.reply("Please add the skill you want to remove. you can choose from the following skills: ```\r" +  skillsallowed.join('\r').toLowerCase() + "```");
        }

        const arg = args.split(' ');
        let command = args.shift();
        command = command.toUpperCase();
        const username = message.author.username;

        const user = message.channel.guild.members.find(member => member.user.username == username);

        if (_.contains(allowed,command)) {
            const role = message.channel.guild.roles.find(role => role.name, command);
            if (message.member.roles.has(role.id)) {
                return message.reply("you're not in the " + role.name.toLowerCase() + " role");
            }
            await user.removeRole(role.id);
            return message.reply("You have been removed to the "  + role.name.toLowerCase() + " role");
        }
        else {
            return message.reply("That role doesn't exist or is not allowed");
        }
    }
}
