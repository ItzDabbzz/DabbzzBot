// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */
module.exports = async (reaction, user) => {
    console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
}