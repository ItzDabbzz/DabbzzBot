const { RichEmbed } = require('discord.js');

module.exports = {
    name: "r6help",
    aliases: ["r6h"],
    category: "r6",
    description: "Returns all Rainbow 6 Related Commands",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        let partyCommands = "";
          partyCommands += `**Party Commands**\n`;
          partyCommands += `**Party Help**: Shows Full Help Menu!\n`;
          partyCommands += `**Party Join <Party>**: Join A Party!\n`;
          partyCommands += `**Party Leave <Party>**: Leave A Party!\n`;
        

        let eloCommands = "";
          eloCommands += `**Elo Commands**\n`;
          eloCommands += `**elo info <user>**: Displays elo about you or another user\n`;
        
        let pages = [partyCommands, eloCommands];
        let page = 1;

        const embed = new RichEmbed()
        .setTitle("R6Bot")
        .setAuthor("R6 Help")
        .setColor("AQUA")
        .setDescription(pages[page-1])
        .setTimestamp(Date.now())
        .setFooter(`${client.config.footer} | R6 Help`, message.author.displayAvatarURL);

	message.channel.send(embed).then(msg => { //Send the embed and pass the new message object.
	    msg.react('⏪').then(r => { // Create fhe first reaction
            msg.react('⏩'); // Create The Second Reaction

            //Filters - These make sure the variables are currect before running
            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;//Back Filter
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id; //Forwards Filter

            const backwards = msg.createReactionCollector(backwardsFilter, {time:120000}); // Collector which has the filter passed through it. The time is in milliseconds.
            const forwards = msg.createReactionCollector(forwardsFilter, {time:120000}); // Second Collector

            //Backwards Collect Handler
            backwards.on('collect', r => { //When back reaction is found
                if(page === 1) return; // Cant go past page 1
                page--; // Push back the page number if cant go back.
                embed.setDescription(pages[page-1]); // Set Description
                embed.setFooter(`${client.config.footer} | Page ${page} of ${pages.length}`); //Set Footer
                msg.edit(embed) // Edit Message
                r.remove(r.users.filter( u => u === message.author).first());
            });

            //Forwards Collect Handler
            forwards.on('collect', r => {
                if(page === pages.length) return; // Cant go past max pages.
                page++; //Push fowards page number
                embed.setDescription(pages[page-1]); // Set Description
                embed.setFooter(`${client.config.footer} | Page ${page} of ${pages.length}`);//Set Footer
                msg.edit(embed)// Edit Message
                r.remove(r.users.filter( u => u === message.author).first());
            });
        });
    });
	await message.channel.stopTyping();
        
    }
};