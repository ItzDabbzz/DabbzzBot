
// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Grab the settings for this server from Enmap.
    // If there is no guild, get default conf (DMs)
    const settings = message.settings = client.getSettings(message.guild);

    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);

    // If this is not in a DM, execute the points code.
    if(message.guild) {
        // We'll use the key often enough that simplifying it is worth the trouble.
        const key = `${message.guild.id}-${message.author.id}`;

        // Triggers on new users we haven't seen before.
        client.xp.ensure(key, {
            user: message.author.id,
            guild: message.guild.id,
            xp: 0,
            level: 1
        });
        client.xp.inc(key, "xp");

        // Calculate the user's current level
        const curLevel = Math.floor(0.2 * Math.sqrt(client.xp.get(key, "xp")));

        // Act upon level up by sending a message and updating the user's level in enmap.
        if (client.xp.get(key, "level") < curLevel) {
            await message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
            client.xp.set(key, curLevel, "level");
        }

          // Discord Invite Detector
        const invite = ['discord.gg', 'discord.io', 'discord.me'];
        if (settings.discordinvite == true) {
            if (invite.some(word => message.content.toLowerCase().includes(word))) {
            message.delete().catch(O_o => {});

            let embed = new Discord.RichEmbed()
                .setTitle('Discord Invite Detected')
                .setColor(client.config.embedRed)
                .setDescription(`${message.author}, you are not allowed to advertise other Discords`);
            message.channel.send(embed);

            console.log(chalk.green(`[${message.guild}]`) + ` ${message.author.username} advertised a Discord server in their message.`);
            return;
            }
        };
        
    }


    
    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // using this const varName = thing OR otherthign; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");


    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }

    cmd.run(client, message, args);
};