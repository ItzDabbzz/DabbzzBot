//R6 10Mans Bot by ItzDabbzz and SipCap

const { Client, Collection, RichEmbed } = require("discord.js");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);


// Initialize **or load** the server configurations
const Enmap = require('enmap');

const client = new Client({
    disableEveryone: true
});

// Here we load the config file that contains our token and our prefix values.
client.config = require("./config.js");
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Require our logger
client.logger = require("./handlers/Logger");

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./handlers/functions.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome EnMap module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.

//const guildConf = client.settings.ensure(message.guild.id, client.config.defaultSettings); 
//GUILD SETTINGS

//const settings = client.getSettings(member.guild.id);
//CLIENT SETTINGS

client.settings = new Enmap({name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'});

client.categories = fs.readdirSync("./commands/");

client.xp = new Enmap({name: "xp"});

const init = async () => {

//client.voiceBans = new Enmap({name: "vcbans"});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


// Generate a cache of client permissions for pretty perm names in commands.
client.levelCache = {};
for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
}

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        // If the file is not a JS file, ignore it (thanks, Apple)
        if (!file.endsWith(".js")) return;
        // Load the event file itself
        const event = require(`./events/${file}`);
        // Get just the event name from the file name
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        // without going into too many details, this means each event will be called with the client argument,
        // followed by its "normal" arguments, like message, member, etc etc.
        // This line is awesome by the way. Just sayin'.
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];

        client.logger.log(`${file} | event added`)

    });
    
});

client.levelCache = {};
for (let i = 0; i < client.config.permLevels.length; i++) {
  const thisLevel = client.config.permLevels[i];
  client.levelCache[thisLevel.name] = thisLevel.level;
}

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

client.on('raw', async event => {
    // `event.t` is the raw event name
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();

    // if the message is already in the cache, don't re-emit the event
    if (channel.messages.has(data.message_id)) return;

    // if you're on the master/v12 branch, use `channel.messages.fetch()`
    const message = await channel.fetchMessage(data.message_id);

    // custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
    // if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);

    client.emit(events[event.t], reaction, user);
});

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */
client.on('messageReactionAdd', (reaction, user) => {
    console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */
client.on('messageReactionRemove', (reaction, user) => {
    console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
});

// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */
client.on("messageUpdate", async(oldMessage, newMessage) => {
    const channel = oldMessage.guild.channels.find(channel => channel.name === "mod-logs")
    if (!channel) return;
    if (oldMessage.content === newMessage.content) return;
    if (newMessage.author.bot) return;

    const embed = new RichEmbed()
    .setTitle('Message Edited')
    .setURL(newMessage.url)
    .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL)
    .setColor('#EE82EE')
    .setThumbnail(oldMessage.author.displayAvatarURL)
    .addField('Original Message', (oldMessage.content.length <= 1024) ? oldMessage.content : `${oldMessage.content.substring(0, 1020)}...`, true)
    .addField('Edited Message', (newMessage.content.length <= 1024) ? newMessage.content : `${newMessage.content.substring(0, 1020)}...`, true)
    .addField('Channel', oldMessage.channel, true)
    .addField('Message Author', `${oldMessage.author} (${oldMessage.author.tag})`, true)
    .addField('Number of Edits', newMessage.edits.length, true)
    .setTimestamp();

    channel.send(embed);
});

// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */
client.on("messageDelete", async(message) => {
    const channel1 = message.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle('Message Deleted');
    embed.setURL(message.url);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL);
    embed.setThumbnail(message.author.displayAvatarURL);
    embed.addField('Deleted Text', (message.content.length <= 1024) ? message.content : `${message.content.substring(0, 1020)}...`, true);
    embed.addField('Channel', message.channel, true);
    embed.addField('Message Author', `${message.author} (${message.author.tag})`, true);
    (message.author) ? (message.author !== message.author) ? embed.addField('Deleted By', message.author, true): '' : '';
    (message.mentions.users.size === 0) ? embed.addField('Mentioned Users', 'None', true): embed.addField('Mentioned Users', `Mentioned Member Count: ${message.mentions.users.array().length} \n Mentioned Users List: \n ${message.mentions.users.array()}`, true);
    embed.setTimestamp();
    channel1.send(embed);
}); 


// channelCreate
/* Emitted whenever a channel is created.
PARAMETER    TYPE        DESCRIPTION
channel      Channel     The channel that was created    */
client.on("channelCreate", function(channel){
    const channel2 = channel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`✅ Channel ${channel2.name} Created ✅`);
    embed.setColor('#20fc3a');
    embed.setTimestamp();
    channel2.send(embed);
});


// channelDelete
/* Emitted whenever a channel is deleted.
PARAMETER   TYPE      DESCRIPTION
channel     Channel   The channel that was deleted    */
client.on("channelDelete", function(channel){
    const channel3 = channel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`❌ Channel ${channel3.name} Deleted ❌`);
    embed.setColor('#20fc3a');
    embed.setTimestamp();
    channel3.send(embed);
});

// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */
client.on("channelUpdate", async(oldChannel, newChannel) => {
    const channel = oldChannel.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle(`Channel ${oldChannel.name} Updated`);
    embed.setColor('#20fc3a');
    embed.addField('Name', (oldChannel.name == newChannel.name) ? "Updated: ❌" : `Updated: ✅ \n New Name: ${newChannel.name}`, true);
    embed.addField('Topic', (oldChannel.topic == newChannel.topic) ? "Updated: ❌" : `Updated: ✅ \n New Topic: ${newChannel.topic}`, true);
    embed.addField('Is NSFW?', (newChannel.nsfw) ? "✅" : "❌", true);
    embed.addField('Category', (newChannel.parent && oldChannel.parent.name == newChannel.parent.name) ? "Updated: ❌" : `Updated: ✅ \n New Category: ${newChannel.parent.name}`, true);
    embed.addField('Position', (oldChannel.position == newChannel.position) ? "Updated: ❌" : `Updated:  ✅ \n New Position: ${newChannel.position}`, true);
    embed.setFooter(`ID: ${newChannel.id}`);
    embed.setTimestamp();
    channel.send(embed);
}); 

// guildBanAdd
/* Emitted whenever a member is banned from a guild.
PARAMETER    TYPE          DESCRIPTION
guild        Guild         The guild that the ban occurred in
user         User          The user that was banned    */
client.on("guildBanAdd", function(guild, user){
    console.log(`a member is banned from a guild`);
});

// guildBanRemove
/* Emitted whenever a member is unbanned from a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that the unban occurred in
user         User         The user that was unbanned    */
client.on("guildBanRemove", function(guild, user){
    console.log(`a member is unbanned from a guild`);
});

// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */
client.on("guildMemberUpdate", function(oldMember, newMember){
    console.error(`a guild member changes - i.e. new role, removed role, nickname.`);
});


client.login(client.config.token);
};

init();
