const {Client, RichEmbed} = require("discord.js");

module.exports = {
    name: "ticket",
    category: "tickets",
    aliases: ["tick", "t"],
    description: "Opens a Ticket",
    usage: "<reason>",
    run: (client, message, args) => {

        const ID = Math.floor(Math.random() * 10) + 2000;
        const subject = args.join(" ") || "No Subject";

        const reactEmbed = new RichEmbed()
        .setColor("#13bd2a")
        .setTimestamp(Date.now())
        .setDescription(":mailbox: React to create your support ticket.");
        
        message.channel.send(reactEmbed)
        .then(function(msg) {
            msg.react('✅').then(() => msg.react('❎'));

            const filter = (reaction, user) => {
                return ['✅', '❎'].includes(reaction.emoji.name) && user.id !== msg.author.id;
            };

            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '❎') {

                    const successEmbed = new RichEmbed()
                        .setDescription(`:tickets: <@${message.author.id}> You have canceled your support request.`)
                        .setColor("#13bd2a")
                        .setFooter(`${client.config.footer}`)
                        .setTimestamp(Date.now());
                    message.channel.send(successEmbed);
                }

                if (reaction.emoji.name === '✅') {

                    const alreadyopen = new RichEmbed()
                        .setDescription(`:x: Cannot create a ticket because **ticket-${message.author.username}** already exists.`)
                        .setColor("#13bd2a")
                        .setFooter(`${client.config.footer}`);
                    if (message.guild.channels.find(TicketChannel => TicketChannel.name === 'ticket-' + message.author.username)) return message.channel.send(alreadyopen);
                    message.guild.createChannel(`ticket-${message.author.username}`, {
                        type: 'text',
                    }).then(TicketChannel => {
                        // Roles
                        let staff = message.guild.roles.find(supportRole => supportRole.name === `Staff`);
                        let everyone = message.guild.roles.find(everyoneRole => everyoneRole.name === "@everyone");
                        let department = message.guild.roles.find(DepartmentRole => DepartmentRole.name === `Support`);
                        let department2 = message.guild.roles.find(DepartmentRole => DepartmentRole.name === `Security`);
                        let department3 = message.guild.roles.find(DepartmentRole => DepartmentRole.name === `Sales`);

                        TicketChannel.overwritePermissions(everyone, { SEND_MESSAGES: false, READ_MESSAGES: false });
                        TicketChannel.overwritePermissions(department, { SEND_MESSAGES: false, READ_MESSAGES: false });
                        TicketChannel.overwritePermissions(department2, { SEND_MESSAGES: false, READ_MESSAGES: false });
                        TicketChannel.overwritePermissions(department3, { SEND_MESSAGES: false, READ_MESSAGES: false });
                        TicketChannel.overwritePermissions(staff, { SEND_MESSAGES: true, READ_MESSAGES: true });
                        TicketChannel.overwritePermissions(message.author, { SEND_MESSAGES: true, READ_MESSAGES: true });
                        TicketChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, READ_MESSAGES: true });

                        //Category
                        let category = message.guild.channels.find(c => c.name === 'Tickets');
                        if (category) {
                            TicketChannel.setParent(category.id);
                        } else {
                            if (message.guild.channels.get('Tickets')) {
                                TicketChannel.setParent(message.guild.channels.get('Tickets').id);
                            }
                        }

                        const ticketopened = new RichEmbed()
                        .setDescription(`:white_check_mark: <@${message.author.id}> You ticket has been created <#${TicketChannel.id}>`)
                        .setColor("#13bd2a")
                        .setTimestamp(Date.now())
                        .setFooter(`${client.config.footer}`);
                        //message.channel.send({embed: ticketopened});
                        //Commented ^ this out because of message spam. 
                    
                        // Ticket Message - ( Able to edit this message via the settings.json file )
                        const ticketMessage = `Hi! <@${message.author.id}>\n Your support ticket has been opened successfully\nPlease allow us some time to reach out to you.`;
                    
                        const Department_1 = "Support";
                        const Department_2 = "Security";
                        const Department_3 = "Sales";
                    
                        const Emoji_1 = "🎧";
                        const Emoji_2 = "🔐";
                        const Emoji_3 = "💵";
                        const user = message.author;
                        const TicketMessage = new RichEmbed()
                        .setDescription(ticketMessage, true)
                        .addField("Available Departments", `${Emoji_1} ${Department_1}\n${Emoji_2} ${Department_2}\n${Emoji_3} ${Department_3}`)
                        .setColor("#13bd2a")
                        .setTimestamp(Date.now())
                        .setFooter(`${client.config.footer}`);
                
                        if (subject != 'No Subject.') {
                            TicketChannel.setTopic(subject);
                        }
                        
                        
                
                    TicketChannel.send({embed: TicketMessage}).then(function(msg) {
                
                        msg.react(Emoji_1).then(() => msg.react(Emoji_2)).then(() => msg.react(Emoji_3));
                
                        const filter = (reaction, user) => {
                            return [Emoji_1, Emoji_2, Emoji_3].includes(reaction.emoji.name) && user.id !== msg.author.id;
                        };
                        
                        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first();
                            let deparmentFinal = "None"
                        if (reaction.emoji.name === `${Emoji_1}`) {
                            TicketChannel.overwritePermissions(staff, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            TicketChannel.overwritePermissions(department, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            deparmentFinal = Department_1;
                            msg.channel.send("You have contacted out " + department + "\nPlease wait patiently for somone to reach out to you.")
                        }
                
                        if (reaction.emoji.name === `${Emoji_2}`) {
                            TicketChannel.overwritePermissions(staff, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            TicketChannel.overwritePermissions(department2, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            deparmentFinal = Department_2;
                            msg.channel.send("You have contacted out " + department2 + "\nPlease wait patiently for somone to reach out to you.")
                        }
                
                        if (reaction.emoji.name === `${Emoji_3}`) {
                            TicketChannel.overwritePermissions(staff, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            TicketChannel.overwritePermissions(department3, { SEND_MESSAGES: true, READ_MESSAGES: true });
                            deparmentFinal = Department_3;
                            msg.channel.send("You have contacted out " + department3 + "\nPlease wait patiently for somone to reach out to you.")
                        }

                        
                
                        client.db.createTicket(client, message, TicketChannel, deparmentFinal, user, subject);

                        });

                
                    });

                        // Ticket Logging
                    const logEmbed = new RichEmbed()
                    .setTitle(":ticket: Logistics of your Ticket")
                    .addField("Ticket ID", ID, true)
                    .addField("User", `<@${message.author.id}>`, true)
                    .addField("Channel", `ticket#${ID}`, true)
                    .setColor("#13bd2a")
                    .setTimestamp(Date.now())
                    .setFooter(`${client.config.footer}`);

                    if (subject != 'No Subject.') {
                        logEmbed.addField('Subject', subject, true);
                    }

                    let logChannel = message.guild.channels.find(TicketChannel => TicketChannel.name === "ticket-logs");
                    if(!logChannel) return message.channel.send(`:x: Error! Could not find the logs channel **ticket-logs** `);

                    //logChannel.send({embed: logEmbed})
                   // message.author.send({embed: logEmbed})
                }).catch(err=>{console.error(err)});
        
                }
            })
        });
    }
}