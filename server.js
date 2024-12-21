const express = require('express');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();
require('dotenv').config();

app.use(session({ secret: 'your_secret' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Configure Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.get('/', (req, res) => {
    res.send('<a href="/login">Login with Discord</a>');
});

app.get('/login', passport.authenticate('discord'));

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    });

app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send('<h1>Dashboard</h1><p>Welcome, ' + req.user.username + '!</p>');
    // Here you can add more configuration options for the bot
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
