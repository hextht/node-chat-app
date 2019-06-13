const helmet = require('helmet');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Set the port we will listen to
const port = process.env.PORT || 3000;

// Set the path for the public folder
const publicPath = path.join(__dirname, "../public");

var app = express();

//  Set the template engine
app.set('view engine', 'hbs');
app.use(helmet());

// Express static midlware
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(chalk.green(`Server is UP on port ${port}`));
});