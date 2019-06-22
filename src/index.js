const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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

    socket.on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected.'));
    })

    socket.on('sendMessage', (msg) => {
        io.emit('distributeMessage', msg);
        console.log("Send Message: ", msg)
    })
})


server.listen(port, () => {
    console.log(chalk.blue(`Server is up, listening on port ${port}`));
})