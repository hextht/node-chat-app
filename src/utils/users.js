const users = [];

// Add user - track a new user
const addUser = function({ id, username, room }) {
    // Clean the data :
    if (!username) {
        location.href = '/';
    }
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: "Username and room are required"
        };
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // Store the user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Remove user - stop tracking a user
const removeUser = function(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// getUser - fetch existing users   data
const getUser = function(id) {

    // user = user.trim().toLowerCase()
    return users.filter((user) => { return user.id === id })[0];

}

// getUsersInRoom - list the users in a room
const getUsersInRoom = function(room) {

    room = room.trim().toLowerCase()
    return users.filter((user) => { return user.room === room });

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}