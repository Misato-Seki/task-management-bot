// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { format, formatDate } = require('date-fns');
// const { utcToZonedTime } = require('date-fns-tz');
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
    const habits = await fetch(`${process.env.API_URL}/habits`, {
        headers: { 'x-api-key': process.env.BOT_API_KEY }
    }).then(res => res.json());

    const tasks = await fetch(`${process.env.API_URL}/tasks/today`, {
        headers: { 'x-api-key': process.env.BOT_API_KEY }
    }).then(res => res.json());

    const accessToken = await getAccessTokenFromRefreshToken()
    const events = await fetch(`${process.env.API_URL}/calendar/tomorrow`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())

    let eventMessage = '## 🗓️ Events:\n'
    if(!events || events.length === 0) {
        eventMessage += '- No events for today.'
    } else {
        eventMessage += events.map(event => {
            const start = event.start.dateTime || event.start.date;
            const timeZone = 'Europe/Helsinki';
            const date = new Date(start);
            const timeString = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone,
                hour12: false
            }).format(date);
            return `- ${event.summary} - ${timeString}`;
          }).join('\n');
    }
    let habitMessage = '\n## ✅ Habits:\n'
    if(!habits || habits.length === 0) {
        habitMessage += "- No habits for today.\n"
    } else {
        habitMessage += habits.map(habit => `- ${habit.title} - ${habit.logCount}/${habit.goal}`).join('\n')
    }
    let taskMessage = '\n## ✏️ Tasks:\n'
    if(!tasks.tasks || tasks.tasks.length === 0) {
        taskMessage += "- No tasks for today.\n"
    } else {
        tasks.tasks.forEach(task => {
            taskMessage += `- ${task.title}\n`
            if(task.checklist && task.checklist.length > 0) {
                task.checklist.forEach(item => {
                    taskMessage += `  - ${item.title} - ${format(new Date(item.deadline), "MMM dd (EEE)")}\n`
                })
            }
        })
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const message = `# ✨ ${format(tomorrow, "MMM dd (EEE)")}\n` + eventMessage + habitMessage + taskMessage;
    const channel = client.channels.cache.get(CHANNEL_ID);
    channel.send(message);
}

async function sendMonthlyReport() {
    const habits = await fetch(`${process.env.API_URL}/habits/monthly-report`, {
        headers: { 'x-api-key' : process.env.BOT_API_KEY }
    }).then(res => res.json())

    let message = `# 🌱 Monthly Report - ${format(new Date(), "MMM")}\n`;
    if(!habits || habits.length === 0) {
        message += "- No habits for this month.\n";
    }
    else {
        message += habits.map(habit => {
            return `- ${habit.title} - ${habit.logCount}/${habit.goal} (${habit.progress * 100}%)`
        }).join('\n');
    }
    const channel = client.channels.cache.get(CHANNEL_ID);
    channel.send(message);
}

//
// async function fetchSettings() {
//     try {
//         const response = await fetch(`${process.env.API_URL}/setting`, {
//             headers: { 'x-api-key': process.env.BOT_API_KEY }
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     } catch (error) {
//         console.error('Error fetching settings:', error);
//         return { botMessageCronTime: '0 21 * * *' }; // Default cron time if fetch fails
//     }
// }


client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    //テスト送信: Bot起動時に1度だけ送信
    setTimeout(async () => {
        console.log(`[TEST] Cron job triggered at: ${new Date().toISOString()}`);
        try {
            await sendBotMessage();
            await sendMonthlyReport();
        } catch (error) {
            console.error('Error during delayed test execution:', error);
        }
    }, 5 * 60 * 1000); // 5分後に実行

    cron.schedule('0 21 * * *', () => {
        sendBotMessage();
    }, {
        timezone: 'Europe/Helsinki'
    });

    cron.schedule('0 23 * * *', () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if(tomorrow.getDate() === 1) {
            sendMonthlyReport();
        } 
    }, {
        timezone: 'Europe/Helsinki'
    })
});

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
