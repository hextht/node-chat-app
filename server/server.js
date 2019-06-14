const helmet = require('helmet');
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const hbs = require('hbs');
const fs = require('fs');

// Set the port we will listen to
const port = process.env.PORT || 3000;

// Set the path for the public folder
const publicPath = path.join(__dirname, "../public");

var app = express();

// Create the http server
var server = http.createServer((app));

// Add Socket IO
var io = socketIO(server);

//  Set the template engine
app.set('view engine', 'hbs');
app.use(helmet());

// Express static midlware
app.use(express.static(publicPath));

// Register event
io.on('connection', (socket) => {
    console.log(chalk.blue('New user connected'));


    socket.on('disconnect', (socket) => {
        console.log("User was disconnected");
    });
});





server.listen(port, () => {
    console.log(chalk.green(`Server is UP on port ${port}`));
});