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
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    if (email !== ALLOWED_EMAIL) {
      return done(null, false);
    }
    return done(null, profile);
  }
));

// When someone visits /auth/google, they start the Google login process
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'] // what info to request from Google
  })
);

// When Google redirects back to our app, this route handles the response
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${BASE_FRONTEND_URL}/unauthorized` }),
  (req, res) => {
    // Successful authentication, redirect to the home page
    res.redirect(`${BASE_FRONTEND_URL}/dashboard`);
  }
);

module.exports = router;