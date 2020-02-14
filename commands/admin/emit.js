module.exports = {
    name: "emit",
    category: "admin",
    aliases: ["bemit", "event"],
    description: "Emits a event",
    usage: "<input>",
    run: (client, message, args) => {

        const guildConf = client.settings.ensure(message.guild.id, client.config.defaultSettings);
        const adminRole = message.guild.roles.find("name", guildConf.adminRole);
        if(!adminRole) return message.reply("Administrator Role Not Found");

        // Then we'll exit if the user is not admin
        if(!message.member.roles.has(adminRole.id)) {
            return message.reply("You're not an admin, sorry!");
        }

        message.delete();

        client.emit("error");
    }
}