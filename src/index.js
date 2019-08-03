const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('view engine', 'hbs');
app.use(helmet());
app.use(express.static(publicPath));

io.on('connect', (socket) => {

    console.log(chalk.green('New WebSocket connection.'));
    socket.emit('welcome', 'Welcome to our websocket party !');
    socket.broadcast.emit('newConnection', "A new user has joined the room");

    socket.on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected.'));
        socket.broadcast.emit('disconnection', "A  user has left the room");
    })

    socket.on('sendMessage', (msg, callback) => {

        let filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback(null, "No need to be rude. you have been censored!");
        }

        io.emit('distributeMessage', msg);
    });

    socket.on('sendLocation', (location, callback) => {
        console.log(location);
        let msg = `Location: ${location.latitude}, ${location.longitude}`;
        // io.emit('distributeMessage', msg);
        io.emit('distributeMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
        callback();
    })
})


server.listen(port, () => {
    console.log(chalk.blue(`Server is up, listening on port ${port}`));
})