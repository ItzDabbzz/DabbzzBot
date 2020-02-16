// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */
module.exports = async (reaction, user) => {
    console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
}