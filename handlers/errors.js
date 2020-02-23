// Used if a bot could not log a punishment.
const { Client, RichEmbed } = require('discord.js');
const config = require('../config')

// Used if no arguments are given.
module.exports.noArgs = async (message, exports) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Missing arguments!\nUsage \`${exports.help.usage}\``).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    const embed = new RichEmbed()
      .setTitle("An error has occurred!")
      .setColor(config.embedRed)
      .setFooter(message.author.tag, message.author.avatarURL);
    
    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

module.exports.couldNotLog = async (message, modLogs) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`)
        .setColor(config.embedRed)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if the bot could not DM a user.
module.exports.couldNotDM = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("Could not send DM to mentioned user").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('Could not send DM to mentioned user.')
        .setColor(config.embedRed)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if args isn't recognised in the 'edit' command
module.exports.settingNotRecognised = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This setting wasn't recognised.").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This setting wasn\'t recognised.')
        .setColor(config.embedRed)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if same setting is given in the 'edit' command
module.exports.sameSetting = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("The response given is already the set value").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('The response given is already the set value.')
        .setColor(config.embedRed)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if response isn't recognised in the 'edit' command
module.exports.responseNotRecognised = async (message, response) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`The value \`${response}\` could not be used`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`The value \`${response}\` could not be used.`)
        .setColor(config.embedRed)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};
