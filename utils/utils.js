module.exports = {
    Discord: require('discord.js'),
    waitForResponse: function (userid, channel) {
    return new Promise((resolve, reject) => {
        channel.awaitMessages(m => m.author.id == userid, { max: 1 })
            .then(msgs => {
                resolve(msgs.first());
            })
            .catch(reject)
        })
    },
    waitForReaction: function (emojis, userid, message) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(emojis)) emojis = [emojis];
            message.awaitReactions((reaction, user) => emojis.includes(reaction.emoji.name) && user.id == userid, { max: 1 })
                .then(reactions => {
                    resolve(reactions.first());
                })
                .catch(reject)
        })
    },
    getEmoji: function (number) {
        if (number == 1) return "\u0031\u20E3";
        if (number == 2) return "\u0032\u20E3";
        if (number == 3) return "\u0033\u20E3";
        if (number == 4) return "\u0034\u20E3";
        if (number == 5) return "\u0035\u20E3";
        if (number == 6) return "\u0036\u20E3";
        if (number == 7) return "\u0037\u20E3";
        if (number == 8) return "\u0038\u20E3";
        if (number == 9) return "\u0039\u20E3";
        if (number == 10) return "\uD83D\uDD1F";
    },
    
}