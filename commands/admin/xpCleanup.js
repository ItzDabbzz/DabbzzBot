module.exports = {
    name: "cleanup",
    category: "admin",
    description: "Cleans up the XP table",
    run: async (client, message, args) => {
        // Let's clean up the database of all "old" users,
        // and those who haven't been around for... say a month.

        // Get a filtered list (for this guild only).
        const filtered = client.xp.filter( p => p.guild === message.guild.id );

        // We then filter it again (ok we could just do this one, but for clarity's sake...)
        // So we get only users that haven't been online for a month, or are no longer in the guild.
        const rightNow = new Date();
        const toRemove = filtered.filter(data => {
            return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
        });

        toRemove.forEach(data => {
            client.xp.delete(`${message.guild.id}-${data.user}`);
        });

        message.channel.send(`I've cleaned up ${toRemove.size} old farts.`);
    }
}
