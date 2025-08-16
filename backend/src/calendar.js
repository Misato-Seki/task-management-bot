const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

router.get('/calendar/today', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const filteredEvent = events.data.items.filter(event => event.colorId !== '7' && event.colorId !== undefined);
    res.json(filteredEvent);
  } catch (error) {
    console.error('Google Calendar API error:', error);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message || error });
  }
});

router.get('/calendar/tomorrow', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const filteredEvent = events.data.items.filter(event => event.colorId !== '7' && event.colorId !== undefined);
    res.json(filteredEvent);
  } catch (error) {
    console.error('Google Calendar API error:', error);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message || error });
  }
});

module.exports = router; 