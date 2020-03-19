const {Client, RichEmbed} = require('discord.js');
const rethink = require('rethinkdbdash');
const tables = ["guilds", "punishments", "tickets", "partys", "users"];
const config = require('../config.json');

module.exports = class {
    constructor() {
        this.r = rethink({
            db: "r6bot",
            host: "192.168.1.122",
        })
    }

    init() {
        this.r(tables)
        .difference(this.r.tableList())
        .forEach(table => this.r.tableCreate(table))
        .run();
    }

    createGuild(guild) {
        return this.r.table("guilds").insert([{
            id: guild.id,
            guildname: guild.name,
            prefix: "!",
            modLogChannel: "mod-logs",
            welcomeEnabled: false,
            welcomeMessage: "Welcome %user% to the %server% you are the %member count% member",
            welcomeChannel: "welcome",
            autoRoleEnabled: false,
            autoRoleName: "Member",
            tlogChannel: "00000000000000000",
            reportsChannel: "00000000000000000",
            ticketsEnabled: true,
            inviteBlocker: true
          }]).run()
          .catch((e) => console.log(e))
      }

      async createPunish(client, message, type, user, reason, modLogs) {
        return this.r.table("punishments").insert([{
          guildid: message.guild.id,
          type: type,
          punisher: `${message.guild.id}-${message.author.id}`,
          offender: `${message.guild.id}-${user.id}`,
          reason: reason,
          time: client.db.r.now()
        }]).run()
        .then(r => client.sendPunishment(message, type, user, reason, modLogs, r.generated_keys))
        .catch((e) => console.log(e))
      }

      async createReport(client, message, user, reason, modLogs) {
        return this.r.table("punishments").insert([{
          guildid: message.guild.id,
          type: "report",
          punisher: `${message.guild.id}-${message.author.id}`,
          offender: `${message.guild.id}-${user.id}`,
          reason: reason,
          time: client.db.r.now()
        }]).run()
        .then(r => client.sendReport(message, user, reason, modLogs, r.generated_keys))
        .catch((e) => console.log(e))
      }

      async createTicket(client, message, channel, department, user, reason) {
        return this.r.table("tickets").insert([{
          guildid: message.guild.id,
          channel: channel.name,
          department: department,
          user: `${message.author.id}`,
          reason: reason,
          time: client.db.r.now()
        }]).run()
        .then(r => client.sendTicket(message, channel, department, user, reason, r.generated_keys))
        .catch((e) => console.log(e))
      }

      async createUser(client, elo, rank, party, user) {
        return this.r.table("users").insert([{
          elo: elo,
          rank: rank,
          party: party,
          user: `${user.id}`,
          time: client.db.r.now()
        }]).run()
        .then(r => client.sendUser(elo, rank, party, user, r.generated_keys))
        .catch((e) => console.log(e))
      }

      async updateGuildName(guildID, newGuildName) {
        return this.r.table("guilds").get(guildID).update({
            guildname: newGuildName
        }).run();
      }
    
      async updatePrefix(guildID, newPrefix) {
        return this.r.table("guilds").get(guildID).update({
          prefix: newPrefix
        }).run();
      }
    
      async updateLogs(guildID, newLogs) {
        return this.r.table("guilds").get(guildID).update({
          modLogChannel: newLogs
        }).run();
      }
    
      async toggleWelcome(guildID, newWelcome) {
        return this.r.table("guilds").get(guildID).update({
          welcomeEnabled: newWelcome
        }).run();
      }
    
      async updateWelcomeMessage(guildID, newWelcomeMessage) {
        return this.r.table("guilds").get(guildID).update({
          welcomeMessage: newWelcomeMessage
        }).run();
      }
    
      async updateWelcomeChannel(guildID, newWelcomeChannel) {
        return this.r.table("guilds").get(guildID).update({
          welcomeChannel: newWelcomeChannel
        }).run();
      }
    
      async toggleAutoRole(guildID, newAutoRole) {
        return this.r.table("guilds").get(guildID).update({
          autoRoleEnabled: newAutoRole
        }).run();
      }
    
      async updateAutoRoleName(guildID, newAutoRoleName) {
        return this.r.table("guilds").get(guildID).update({
          autoRoleName: newAutoRoleName
        }).run();
      }

      async updateTlogChannel(guildID, newTChan) {
          return this.r.table("guilds").get(guildID).update({
              tlogChannel: newTChan
          }).run();
      }

      async updateClogChannel(guildID, newCChan) {
        return this.r.table("guilds").get(guildID).update({
            clogChannel: newCChan
        }).run();
      }



}