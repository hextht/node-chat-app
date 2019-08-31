const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Filter = require('bad-words');
const moment = require('moment');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('view engine', 'hbs');
app.use(helmet());
app.use(express.static(publicPath));

io.on('connect', (socket) => {

    const timestamp = new Date().getTime();
    console.log(timestamp);
    console.log(chalk.green('New WebSocket connection  at ', moment(timestamp).format('h:mm:ss')));
    socket.emit('welcome', 'Welcome to our websocket party !');
    socket.broadcast.emit('newConnection', `A new user has joined the room at ${moment(timestamp).format('h:mm:ss')}`);

    socket.on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected.'));
        socket.broadcast.emit('disconnection', "A  user has left the room");
    })

    socket.on('sendMessage', (msg, callback) => {

        messageTimestamp = moment(msg.createdAt).format('h:mm:ss');
        let filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback(null, { timestamp: messageTimestamp, msg: "No need to be rude. you have been censored!" });
        }


        io.emit('distributeMessage', { timestamp: messageTimestamp, msg: msg });
        callback("delivered", null);
    });

    socket.on('locationMessage', (location, callback) => {
        locationTimestamp = moment().format('h:mm:ss')
        console.log(location);
        let msg = `
        Location: $ { location.latitude }, $ { location.longitude }
        `;
        // io.emit('distributeMessage', msg);
        io.emit('locationMessage', {
            msg: `
        https: //google.com/maps?q=${location.latitude},${location.longitude}`,
            timestamp: locationTimestamp
        });
        callback();
    })
})


server.listen(port, () => {
    console.log(chalk.blue(`Server is up, listening on port ${port}`));
})