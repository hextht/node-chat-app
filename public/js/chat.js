const socket = io();


socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('welcome', (msg) => {

    const welcomeHeading = document.createElement('h4');
    welcomeHeading.className = 'chatmsg-heading'
    welcomeHeading.innerHTML = msg;
    welcomeHeading.setAttribute('id', 'chatHeader');
    document.querySelector('body').appendChild(welcomeHeading);
    document.querySelector('body').appendChild(document.createElement('hr'));

    console.log(msg);

});

socket.on('distributeMessage', (msg) => {
    const chatMsg = document.createElement('h6');
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    document.querySelector('body').appendChild(chatMsg);
    document.querySelector('body').appendChild(document.createElement('hr'));
});


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // input = document.getElementById("inputMsg");

    // We can access the form also through the event - it passes the target element (the form in our case)
    message = e.target.elements.message.value;
    // message = input.value;
    socket.emit('sendMessage', message);
});

function createControls() {


    var controlDiv = document.createElement('div');
    var inputMsg = document.createElement('input');
    var sendMsgBtn = document.createElement('button');
    var spanInput = document.createElement('span');
    var spanBtn = document.createElement('span');

    controlDiv.className = 'ctrl-div';
    inputMsg.className = 'inputMsg'
    sendMsgBtn.className = 'sendMsgBtn';

    spanInput.appendChild(inputMsg);
    spanBtn.appendChild(sendMsgBtn);
    controlDiv.appendChild(spanInput);
    controlDiv.appendChild(spanBtn);
    document.querySelector('body').appendChild(controlDiv);


}