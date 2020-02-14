module.exports = {
    name: "bans",
    category: "moderation",
    description: "Shows a list of users banned",
    run: async (client, message, args) => {
        let bans;
        message.guild.fetchBans()
            .then(function(bans) {
                if (bans.size == 0) {
                    message.channel.send("No one has been banned yet :white_check_mark:");
                } else {
                    let res = "**Banned Users**\n";
                    bans.forEach(function (user) {
                        res += '\n :point_right: ' + user.username;
                    })
                    message.channel.send(res);
                }
            })
            .catch(console.error);
    }
}
