//R6 10Mans Bot by ItzDabbzz and SipCap

const { Client, RichEmbed, Channel } = require("discord.js");
const fs = require("fs");
const dbFile = require('./handlers/db');

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
client.website = require("./website/dashboard.js");
client.db = new dbFile();
client.db.init();

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
/**fs.readdir("./events/", (err, files) => {
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
        //Event files are named after the Event being loaded

        client.logger.log(`${file} | event added`)

    });
    
});*/

// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */
client.on("message", async function(message){
        // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Grab the settings for this server from Enmap.
    // If there is no guild, get default conf (DMs)
    //const settings = client.settings.ensure(message.guild.id, client.config.defaultSettings);

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
   // if (message.content.indexOf(settings.prefix) !== 0) return;

    let prefix;

    prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run().catch(async err => {
        await client.db.createGuild(message.guild);
    });

    if (!prefix) {
        prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    };

    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

    const prefixes = [prefix, `<@!${client.user.id}>`, `<@${client.user.id}>`];
    
    prefix = prefixes.find(p => message.content.startsWith(p));

    if (message.content.indexOf(prefix) !== 0) return;
    if (!prefix) return;
    message.prefix = prefix

    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${prefix}\``);
    }


    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
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
        if (client.settings.discordinvite == true) {
            if (invite.some(word => message.content.toLowerCase().includes(word))) {
            message.delete().catch(O_o => {});

            let embed = new RichEmbed()
                .setTitle('Discord Invite Detected')
                .setColor(client.config.embedRed)
                .setTimestamp(Date.now())
                .setFooter(`${client.config.footer}`)
                .setDescription(`${message.author}, you are not allowed to advertise other Discords`);
            message.channel.send(embed);

            client.logger.log(chalk.green(`[${message.guild}]`) + ` ${message.author.username} advertised a Discord server in their message.`);
            return;
            }
        };
        
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
    }
});

// ready
/* Emitted when the client becomes ready to start working.    */
client.on("ready", async function(){
    client.logger.log(`the client becomes ready to start`);
	client.logger.log(`I am ready! Logged in as ${client.user.tag}!`);
	client.logger.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    await client.website.load(client);
    await client.user.setPresence({
        status: "online",
        game: {
            name: "getting developed!",
            type: "STREAMING"
        }
    });

	client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
	.then(link => {
		client.logger.log(`Generated bot invite link: ${link}`);
		inviteLink = link;
	});
});

// reconnecting
/* Emitted whenever the client tries to reconnect to the WebSocket.    */
client.on("reconnecting", function(){
    client.logger.log(`Reconnecting... [at ${new Date()}]`);
});

// resume
/* Emitted whenever a WebSocket resumes.
PARAMETER    TYPE          DESCRIPTION
replayed     number        The number of events that were replayed    */
client.on("resume", function(replayed){
    client.logger.log(`whenever a WebSocket resumes, ${replayed} replays`);
});

// disconnect
/* Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
PARAMETER    TYPE              DESCRIPTION
Event        CloseEvent        The WebSocket close event    */
client.on("disconnect", function(event){
    client.logger.log(`Disconnected at ${new Date()}.`);
});

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

// channelCreate
/* Emitted whenever a channel is created.
PARAMETER    TYPE        DESCRIPTION
channel      Channel     The channel that was created    */
client.on("channelCreate", function(channel){
        const channel1 = client.channels.find(channel => channel.name === "mod-logs")
        const embed = new RichEmbed();
        embed.setTitle(`✅ Channel ${channel.name} Created ✅`);
        embed.setColor('#20fc3a');
        embed.setTimestamp(Date.now());
        embed.setFooter(`${client.config.footer}`)
        channel1.send(embed);
});

// channelDelete
/* Emitted whenever a channel is deleted.
PARAMETER   TYPE      DESCRIPTION
channel     Channel   The channel that was deleted    */
client.on("channelDelete", function(channel){
        const channel3 = client.channels.find(channel => channel.name === "mod-logs")
        const embed = new RichEmbed();
        embed.setTitle(`❌ Channel ${channel.name} Deleted ❌`);
        embed.setColor('#20fc3a');
        embed.setFooter(`${client.config.footer}`)
        embed.setTimestamp(Date.now());
        channel3.send(embed);
});

// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */
client.on("channelUpdate", function(oldChannel, newChannel){
        const channel = newChannel.guild.channels.find(channel => channel.name === "mod-logs")
        const embed = new RichEmbed();
        embed.setTitle(`Channel ${oldChannel.name} Updated`);
        embed.setColor('#20fc3a');
        embed.addField('Name', (oldChannel.name == newChannel.name) ? "Updated: ❌" : `Updated: ✅ \n New Name: ${newChannel.name}`, true);
        embed.addField('Topic', (oldChannel.topic == newChannel.topic) ? "Updated: ❌" : `Updated: ✅ \n New Topic: ${newChannel.topic}`, true);
        embed.addField('Is NSFW?', (newChannel.nsfw) ? "✅" : "❌", true);
        embed.addField('Category', (newChannel.parent && oldChannel.parent.name == newChannel.parent.name) ? "Updated: ❌" : `Updated: ✅ \n New Category: ${newChannel.parent.name}`, true);
        embed.addField('Position', (oldChannel.position == newChannel.position) ? "Updated: ❌" : `Updated:  ✅ \n New Position: ${newChannel.position}`, true);
        embed.setFooter(`${client.config.footer} | ID: ${newChannel.id}`);0
        embed.setTimestamp(Date.now());
        channel.send(embed);
});

// emojiCreate
/* Emitted whenever a custom emoji is created in a guild.
PARAMETER    TYPE          DESCRIPTION
emoji        Emoji         The emoji that was created    */
client.on("emojiCreate", function(emoji){
    client.logger.log(`a custom emoji is created in a guild`);
});

// emojiDelete
/* Emitted whenever a custom guild emoji is deleted.
PARAMETER    TYPE         DESCRIPTION
emoji        Emoji        The emoji that was deleted    */
client.on("emojiDelete", function(emoji){
    client.logger.log(`a custom guild emoji is deleted`);
});

// emojiUpdate
/* Emitted whenever a custom guild emoji is updated.
PARAMETER    TYPE       DESCRIPTION
oldEmoji     Emoji      The old emoji
newEmoji     Emoji      The new emoji    */
client.on("emojiUpdate", function(oldEmoji, newEmoji){
    client.logger.log(`a custom guild emoji is updated`);
});

// guildBanAdd
/* Emitted whenever a member is banned from a guild.
PARAMETER    TYPE          DESCRIPTION
guild        Guild         The guild that the ban occurred in
user         User          The user that was banned    */
client.on("guildBanAdd", function(guild, user){
    client.logger.log(`a member is banned from a guild`);
});

// guildBanRemove
/* Emitted whenever a member is unbanned from a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that the unban occurred in
user         User         The user that was unbanned    */
client.on("guildBanRemove", function(guild, user){
    client.logger.log(`a member is unbanned from a guild`);
});

// guildCreate
/* Emitted whenever the client joins a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The created guild    */
client.on("guildCreate", async function(guild){
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
    
    const settings = client.getSettings(guild.id);

    await client.db.createGuild(guild);
});

// guildDelete
/* Emitted whenever a guild is deleted/left.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that was deleted    */
client.on("guildDelete", function(guild){
    client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

    // If the settings Enmap contains any guild overrides, remove them.
    // No use keeping stale data!
    if (client.settings.has(guild.id)) {
        client.settings.delete(guild.id);
    }
});

// guildUpdate
/* Emitted whenever a guild is updated - e.g. name change.
PARAMETER     TYPE      DESCRIPTION
oldGuild      Guild     The guild before the update
newGuild      Guild     The guild after the update    */
client.on("guildUpdate", async function(oldGuild, newGuild){
    if(oldGuild.name !== newGuild.name) {
        await client.db.updateGuildName(newGuild.id, newGuild.name);
    }
});

// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */
client.on("guildMemberAdd", async function(member){
    //const settings = client.getSettings(member.guild.id);

    // If welcome is off, don't proceed (don't welcome the user)
    //if (settings.welcomeEnabled !== "true") return;

    // Replace the placeholders in the welcome message with actual data
    //const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);

    // Send the welcome message to the welcome channel
    // There's a place for more configs here.
   // member.guild.channels.find(c => c.name === settings.welcomeChannel).send(welcomeMessage).catch(console.error);


    //get if autoRole is enabled in the db
    const autoRoleStatus = await client.db.r.table("guilds").get(member.guild.id).getField("autoRoleEnabled").run();
    //get the autoRole role.
    var autoRoleR = await client.db.r.table("guilds").get(member.guild.id).getField("autoRoleName").run();

    //If autoRoleStatus is true then..
    if(autoRoleStatus == true){
        //Var role = auroRole role
        var role = member.guild.roles.find(autoRole => autoRole.name === autoRoleR);
        //if role null then return..
        if(!role) return;
        try{
            //add a role to a user
            member.addRole(role, 'AutoRole');
        } catch (error){
            client.logger.log(`Error: ${error}`)
        }
    }
});

// guildMemberRemove
/* Emitted whenever a member leaves a guild, or is kicked.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has left/been kicked from the guild    */
client.on("guildMemberRemove", function(member){
    client.logger.log(`a member leaves a guild, or is kicked: ${member.tag}`);
});

// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */
client.on("guildMemberUpdate", function(oldMember, newMember){
    //client.logger.log(`a guild member changes - i.e. new role, removed role, nickname.`);
    const channel = newMember.guild.channels.find(channel => channel.name === "mod-logs")
    if (!channel) return;
    if(newMember.user.bot) return;

    const embed = new RichEmbed();
    embed.setTitle(`Member ${oldMember.user.username} Updated`)
    embed.setColor('#20fc3a')
    embed.addField('Name', (oldMember.displayName == newMember.displayName) ? "Updated: ❌" : `Updated: ✅ \n New Name: ${newMember.displayName}`, true)
    embed.setTimestamp(Date.now());
    embed.setFooter(`${client.config.footer}`);
    if(!newMember.nickname === null)
    embed.addField('Nickname', (oldMember.nickname == newMember.nickname) ? "Updated: ❌" : `Updated: ✅ \n New Name: ${newMember.nickname}`, true)

    
    channel.send(embed);
});

// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */
client.on("messageUpdate", function(oldMessage, newMessage){
    const channel = client.channels.find(channel => channel.name === "mod-logs")
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
    .setFooter(`${client.config.footer}`)
    .setTimestamp(Date.now());

    channel.send(embed);
});

// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */
client.on("messageDelete", function(message){
    if (!message.channel.name.startsWith('ticket') && !message.guild.channels.find(channel => channel.name === "open-a-ticket"))
    {
        const channel1 = client.channels.find(channel => channel.name === "mod-logs")
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
        embed.setTimestamp(Date.now());
        embed.setFooter(`${client.config.footer}`);
        channel1.send(embed);
    }
});

// roleCreate
/* Emitted whenever a role is created.
PARAMETER    TYPE        DESCRIPTION
role         Role        The role that was created    */
client.on("roleCreate", function(role){
    client.logger.error(`a role is created`);
});

// roleDelete
/* Emitted whenever a guild role is deleted.
PARAMETER    TYPE        DESCRIPTION
role         Role        The role that was deleted    */
client.on("roleDelete", function(role){
    client.logger.error(`a guild role is deleted`);
});

// roleUpdate
/* Emitted whenever a guild role is updated.
PARAMETER      TYPE        DESCRIPTION
oldRole        Role        The role before the update
newRole        Role        The role after the update    */
client.on("roleUpdate", function(oldRole, newRole){
    client.logger.error(`a guild role is updated`);
});

client.login(client.config.token);
};

init();
