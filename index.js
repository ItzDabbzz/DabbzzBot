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



/*
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
});*/


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
