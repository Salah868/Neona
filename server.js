javascript
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const fs = require('fs');
const path = require('path');

const app = express();
require('dotenv').config();

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', passport.authenticate('discord'));

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    
    const html = fs.readFileSync(path.join(__dirname, 'dashboard.html'), 'utf8');
    const responseHtml = html
        .replace(/{{username}}/g, req.user.username)
        .replace(/{{discordId}}/g, req.user.id)
        .replace(/{{clientId}}/g, process.env.CLIENT_ID);
        
    res.send(responseHtml);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/configure', (req, res) => {
    // Handle the room configuration here
    res.send('Configuration Saved!'); // Replace with actual functionality
});

app.listen(3000, () => {
    console.log('Server is running on https://neona-bot.vercel.app');
});
