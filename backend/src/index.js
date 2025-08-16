const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./auth');
const calendarRoutes = require('./calendar');
const habitRoutes = require('./habit')
const taskRoutes = require('./task');
const cron = require('node-cron');

const app = express();
const prisma = new PrismaClient();

// node-cronで毎月1日0時にHabitLogを全削除
cron.schedule('0 0 1 * *', async () => {
  try {
    const deleted = await prisma.habitLog.deleteMany({});
    console.log(`Deleted ${deleted.count} habit logs`);
  } catch (error) {
    console.error('[CRON] Failed to delete habit logs:', error);
  }
},{
  timezone: 'Europe/Helsinki'
});

app.use(express.json());

app.use(cors({
  origin: process.env.BASE_FRONTEND_URL || 'http://localhost:3000', // Allow requests from the frontend
  credentials: true // Allow cookies to be sent with requests
}));

// set up session (=「この人はログイン中だよ」という情報を一時的に覚えておく仕組み)
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // connect passport to session = users stay logged in after authentication
app.use(authRoutes); // use the authentication routes
app.use(calendarRoutes);
app.use(habitRoutes);
app.use(taskRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(8000, () => console.log('API listening on port 8000'));
