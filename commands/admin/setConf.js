module.exports = {
    name: "setconf",
    category: "admin",
    description: "Changes a value of any key in the config",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "mod-logs") || message.channel;
        const guildConf = client.settings.ensure(message.guild.id, client.config.defaultSettings);
        const adminRole = message.guild.roles.find(role => role.name, guildConf.adminRole);
        if(!adminRole) return message.reply("Administrator Role Not Found");

        // Then we'll exit if the user is not admin
        if(!message.member.roles.has(adminRole.id)) {
            return message.reply("You're not an admin, sorry!");
        }
        // Let's get our key and value from the arguments.
        // This is array destructuring, by the way.
        const [prop, ...value] = args;
        // Example:
        // prop: "prefix"
        // value: ["+"]
        // (yes it's an array, we join it further down!)

        // We can check that the key exists to avoid having multiple useless,
        // unused keys in the config:
        if(!client.settings.has(message.guild.id, prop)) {
            return message.reply("This key is not in the configuration.");
        }

        // Now we can finally change the value. Here we only have strings for values
        // so we won't bother trying to make sure it's the right type and such.
        client.settings.set(message.guild.id, value.join(" "), prop);

        // We can confirm everything's done to the client.
        message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
    }
}
