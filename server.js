const express = require('express');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();
require('dotenv').config();

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize and deserialize user
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

// Home Route
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Discord Bot Dashboard</h1>
        <a href="/login">Login with Discord</a>
    `);
});

// Login Route
app.get('/login', passport.authenticate('discord'));

// Callback Route
app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

// Dashboard Route
app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const botInviteURL = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot`;

    res.send(`
        <h1>Dashboard</h1>
        <p>Welcome, ${req.user.username}!</p>
        <p><strong>Your Discord ID:</strong> ${req.user.id}</p>
        <a href="${botInviteURL}">Invite Bot to Your Server</a>
        <h2>Configuration Options:</h2>
        <form action="/configure" method="POST">
            <label for="room">Configure Room:</label>
            <input type="text" id="room" name="room">
            <button type="submit">Save Configuration</button>
        </form>
        <a href='/logout'>Logout</a>
    `);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Configure Route (Add POST method in future development)
app.post('/configure', (req, res) => {
    // Handle the room configuration here
    res.send('Configuration Saved!'); // Replace with actual functionality
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on https://neona-bot.vercel.app');
});
