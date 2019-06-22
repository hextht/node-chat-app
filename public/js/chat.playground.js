const socket = io();

socket.on('connect', (socket) => {
    console.log("Connected to server")
});

socket.on('disconnect', (socket) => {
    console.log('Disconnected from server');
});

socket.on('countUpdated', () => {
    console.log("The count has been updated");
});

document.querySelector("#increment").addEventListener('click', () => {
    console.log('Clicked');
    socket.emit('increment');
});

socket.on('countUpdated', (count) => {
    console.log('count has been updated to #', count);
})