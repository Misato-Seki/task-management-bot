// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { format } = require('date-fns')
const { getAccessTokenFromRefreshToken } = require('./token')

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.

async function sendBotMessage() {
    const habits = await fetch(`${process.env.API_URL}/habits`).then(res => res.json());
    const tasks = await fetch(`${process.env.API_URL}/tasks/today`).then(res => res.json());

    const accessToken = await getAccessTokenFromRefreshToken()
    const events = await fetch(`${process.env.API_URL}/calendar/today`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())

    let eventMessage = '## Events:\n'
    if(events.length === 0) {
        eventMessage += '- No events for today.\n'
    } else {
        eventMessage += events.map(event => {
            const start = event.start.dateTime || event.start.date;
            return `- ${event.summary} (${format(new Date(start), "HH:mm", { timeZone: 'Europe/Helsinki' })})`;
          }).join('\n');
    }
    let habitMessage = '\n## Habits:\n'
    habitMessage += habits.map(habit => `- ${habit.title} (Progress: ${habit.logCount}/${habit.goal})`).join('\n')
    let taskMessage = '\n## Tasks:\n'
    tasks.tasks.forEach(task => {
        taskMessage += `- ${task.title}\n`
        if(task.checklist && task.checklist.length > 0) {
            task.checklist.forEach(item => {
                taskMessage += `  - ${item.title} (DueDate: ${format(new Date(item.deadline), "MMM dd (EEE)")})\n`
            })
        }

    })

    const message = `# 📋${format(new Date(), "MMM dd (EEE)")}\n` + eventMessage + habitMessage + taskMessage;
    const channel = client.channels.cache.get(CHANNEL_ID);
    channel.send(message);
}

client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    //テスト送信: Bot起動時に1度だけ送信
    sendBotMessage();

    cron.schedule('0 6 * * *', () => {
        sendBotMessage();
    },{
        timezone: 'Europe/Helsinki'
    });
});

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
