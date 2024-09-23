const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'static' directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve the React app from the 'templates' directory
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});