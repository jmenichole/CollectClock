const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require('discord.js');
const User = require('./models/User');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

let io;
client.setIo = (socketIo) => {
    io = socketIo;
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Check for ready bonuses every 15 minutes
    setInterval(async () => {
        const users = await User.find({ 'globalSettings.dmNotifications': true });
        for (const user of users) {
            let userUpdated = false;
            const readyNow = user.casinoSettings.filter(c => {
                if (!c.lastCollected) return false;
                const rem = (c.lastCollected + c.cooldownHours * 3600000) - Date.now();
                const isReady = rem <= 0;
                
                // Only notify if ready AND not already notified for THIS collection cycle
                if (isReady && (!c.lastNotifiedAt || c.lastNotifiedAt < c.lastCollected)) {
                    c.lastNotifiedAt = Date.now();
                    userUpdated = true;
                    return true;
                }
                return false;
            });

            if (readyNow.length > 0) {
                try {
                    const discordUser = await client.users.fetch(user.discordId);
                    const list = readyNow.map(c => `• **${c.name}**`).join('\n');
                    await discordUser.send(`🔔 **Bonus Ready!**\nThe following casinos are ready to collect:\n${list}\n\n[Open Collect Clock](https://collectclock.com)`);
                } catch (err) {
                    console.error(`Failed to send DM to ${user.username}:`, err.message);
                }
            }
            
            if (userUpdated) {
                await user.save();
            }
        }
    }, 300000); // Check every 5 minutes now that it's more robust
});

client.on('messageCreate', async message => {
    // If message is in the Live Drops channel (1349602720780390423)
    if (message.channelId === '1349602720780390423' && !message.author.bot) {
        if (io) {
            io.emit('liveDrop', {
                content: message.content,
                author: message.author.username,
                timestamp: new Date()
            });
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ready') {
        const user = await User.findOne({ discordId: interaction.user.id });
        
        if (!user || !user.casinoSettings.length) {
            return interaction.reply({ content: "You haven't set up any casinos yet! Visit the website to sync your data.", ephemeral: true });
        }

        const readyList = user.casinoSettings.filter(c => {
            if (!c.lastCollected) return true;
            const rem = (c.lastCollected + c.cooldownHours * 3600000) - Date.now();
            return rem <= 0;
        });

        if (readyList.length === 0) {
            return interaction.reply({ content: "No bonuses are ready yet. Keep grinding!", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("🎰 Bonuses Ready to Collect!")
            .setColor(0x00ffa3)
            .setDescription(readyList.map(c => `**${c.name}** (${c.bonusAmount || 'N/A'})`).join('\n'))
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

if (process.env.DISCORD_BOT_TOKEN) {
    client.login(process.env.DISCORD_BOT_TOKEN);
}

module.exports = client;
