const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // GoogleStrategy = special method that lets users log in with Google

const router = express.Router();

const BASE_FRONTEND_URL = process.env.BASE_FRONTEND_URL || 'http://localhost:3000';
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

// how to save the user's info after logging in
passport.serializeUser((user, done) => done(null, user));
// how to retrieve the user's info after logging in
passport.deserializeUser((obj, done) => done(null, obj));

// starts the setup for logging in with Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    accessType: 'offline',
    prompt: 'consent'
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    if (email !== ALLOWED_EMAIL) {
      return done(null, false);
    }
    // accessTokenをprofileオブジェクトに含めておく
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    return done(null, profile);
  }
));

// When someone visits /auth/google, they start the Google login process
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'], // カレンダー読み取り権限を追加
    accessType: 'offline',
    prompt: 'consent'
  })
);

// When Google redirects back to our app, this route handles the response
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${BASE_FRONTEND_URL}/unauthorized` }),
  (req, res) => {
    // 認証後、accessTokenをセッションに保存
    if (req.user && req.user.accessToken) {
      req.session.accessToken = req.user.accessToken;
      if (req.user.refreshToken) {
        require('fs').writeFileSync('refreshToken.json', JSON.stringify({ refresh_token: req.user.refreshToken }))
      }
    }
    res.redirect(`${BASE_FRONTEND_URL}/dashboard`);
  }
);

// Route to check if the user is authenticated
router.get('/auth/check', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user, accessToken: req.session.accessToken });
  }
  return res.json({ authenticated: false });
});

// Logout
router.post('/auth/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    // Clears all session data
    req.session.destroy((err) => {
      if(err) {
        console.log('Failed to destroy session', err)
        return next(err)
      }
      // Removes the session cookie
      res.clearCookie('connect.sid')
      res.json({ success: true })
    })
  });
});

module.exports = router;

