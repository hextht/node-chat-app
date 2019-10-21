const socketIO = require("socket.io");
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const hbs = require("hbs");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const Filter = require("bad-words");
const moment = require("moment");
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require("./utils/users");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set("view engine", "hbs");
app.use(helmet());
app.use(express.static(publicPath));

function generateMessage(msg) {
    const timestamp = new Date().getTime();
    return {
        username: username,
        timestamp: moment(timestamp).format("h:mm:ss"),
        msg: msg
    };
}

io.on("connect", socket => {
    // Get the connection timestamp
    const timestamp = new Date().getTime();
    // console.log(timestamp);
    console.log(
        chalk.green(
            "New WebSocket connection  at ",
            moment(timestamp).format("h:mm:ss")
        )
    );

    // Send Welcome message on new connection - Disabled in favor of joining rooms and access the username and room
    // socket.emit('welcome', 'Welcome to our websocket party !');
    // socket.broadcast.emit('newConnection', `A new user has joined the room at ${moment(timestamp).format('h:mm:ss')}`);

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            console.log(chalk.yellow("Client disconnected: ", user.username));
            socket.broadcast.emit(
                "disconnection",
                `${user.username} has left the room `
            );

            // Update user list
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });

    socket.on("join", (options, callback) => {
        const timestamp = new Date().getTime();
        console.log("Debug: ", JSON.stringify(options));
        const { error, user } = addUser({
            id: socket.id,
            ...options
        });

        console.log(JSON.stringify(user));
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit("welcome", "Welcome to our websocket party !");
        socket.broadcast
            .to(user.room)
            .emit(
                "newConnection",
                `${user.username} has joined ${user.room} at ${moment(timestamp).format(
                    "h:mm:ss"
                )}`
            );
        // socket.broadcast.to(room).emit('newConnection', generateMessage(`${username} has joined`));

        // Send user list to users
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });


        callback();
    });

    socket.on("sendMessage", (msg, callback) => {
        messageTimestamp = moment(msg.createdAt).format("h:mm:ss");
        let filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback(null, {
                timestamp: messageTimestamp,
                msg: "No need to be rude. you have been censored!"
            });
        }

        const user = getUser(socket.id);
        if (!user) {
            return callback("User not logged in!");
        }

        console.log(msg);
        io.to(user.room).emit("distributeMessage", {
            timestamp: messageTimestamp,
            msg: msg,
            username: user.username
        });
        callback("delivered", null);
    });

    socket.on("locationMessage", (location, callback) => {
        locationTimestamp = moment().format("h:mm:ss");
        console.log(location);
        let msg = `
        Location: $ { location.latitude }, $ { location.longitude }
        `;

        const user = getUser(socket.id);

        if (!user) {
            callback("User not logged in !");
        }

        // io.emit('distributeMessage', msg);
        io.to(user.room).emit("locationMessage", {
            msg: `https: //google.com/maps?q=${location.latitude},${location.longitude}`,
            timestamp: locationTimestamp,
            username: user.username
        });
        callback("Location sent!");
    });
});

server.listen(port, () => {
    console.log(chalk.blue(`Server is up, listening on port ${port}`));
});