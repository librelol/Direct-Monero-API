const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Register '.mustache' extension with Mustache Express
app.engine('mustache', mustacheExpress());

// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'templates'));

// Set Mustache as the view engine
app.set('view engine', 'mustache');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'static' directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Use routes from the routes directory
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});