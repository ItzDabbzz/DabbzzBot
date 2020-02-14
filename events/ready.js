module.exports = async (client) => {



    console.log(`Hi, ${client.user.username} is now online!`);

    await client.user.setPresence({
        status: "online",
        game: {
            name: "me getting developed",
            type: "STREAMING"
        }
    });
}