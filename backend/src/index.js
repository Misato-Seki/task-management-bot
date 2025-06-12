const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./auth'); // Import the authentication routes from auth.js

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
  origin: process.env.BASE_FRONTEND_URL || 'http://localhost:3000', // Allow requests from the frontend
  credentials: true // Allow cookies to be sent with requests
}));

// set up session (=「この人はログイン中だよ」という情報を一時的に覚えておく仕組み)
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // connect passport to session = users stay logged in after authentication
app.use(authRoutes); // use the authentication routes

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json(user);
});

app.listen(8000, () => console.log('API listening on port 8000'));
