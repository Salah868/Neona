javascript
// server.js

require('dotenv').config();
const express = require('express');
const app = express();

// Access the client ID and secret
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(express.static('public')); // Serves files from the 'public' directory

app.get('/api/credentials', (req, res) => {
    // This is just a demonstration endpoint. Never send secrets to the client.
    res.json({ 
        clientId: clientId 
        // Do not send clientSecret to the client side
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log(`Client ID accessed: ${clientId}`);
});
