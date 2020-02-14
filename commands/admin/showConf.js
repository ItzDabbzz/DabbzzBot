module.exports = {
    name: "showconf",
    category: "admin",
    description: "Shows guild config",
    run: async (client, message, args) => {
        const guildConf = client.settings.ensure(message.guild.id, client.config.defaultSettings);
        const adminRole = message.guild.roles.find(role => role.name, guildConf.adminRole);
        if(!adminRole) return message.reply("Administrator Role Not Found");

        // Then we'll exit if the user is not admin
        if(!message.member.roles.has(adminRole.id)) {
            return message.reply("You're not an admin, sorry!");
        }

        let configProps = Object.keys(guildConf).map(prop => {
            return `${prop}  :  ${guildConf[prop]}\n`;
        });
        message.channel.send(`The following are the server's current configuration:
    \`\`\`${configProps}\`\`\``);

    }
}
