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

// Create the express application
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

var count = 0;

// Register event
io.on('connection', (socket) => {
    console.log(chalk.blue('New user connected'));

    // Emit an event on the particular socket and pass the count variable
    socket.emit('countUpdated', count)

    // Listen for the disconnect event (system event)
    socket.on('disconnect', (socket) => {
        console.log("User was disconnected");
    });

    // Set listener for the 'increment' event
    socket.on('increment', () => {
        count++;
        console.log(count);
        // emit countUpdated event to the particular socket
        // socket.emit('countUpdated', count);

        // emit event to all connected clients
        io.emit('countUpdated', count);
    });

});


server.listen(port, () => {
    console.log(chalk.green(`Server is UP on port ${port}`));
});