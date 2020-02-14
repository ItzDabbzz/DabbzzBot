module.exports = {
    name: "eval",
    category: "owner",
    description: "evaluates any string as javascript code and executes it.",
    run: async (client, message, args) => {
        if (message.author.id !== config.ownerID) return;

        //await message.channel.send(`🏓 Pinging....`);
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            await message.channel.send(clean(evaled), {code: "xl"});
        } catch (err) {
            await message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

    }
};

function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


