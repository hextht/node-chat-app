const socket = io();


socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('welcome', (msg) => {

    const welcomeHeading = document.createElement('h4');
    welcomeHeading.className = 'chatmsg-heading'
    welcomeHeading.innerHTML = msg;
    welcomeHeading.setAttribute('id', 'chatHeader');
    document.querySelector('#msgBox').appendChild(welcomeHeading);
    document.querySelector('#msgBox').appendChild(document.createElement('hr'));

    console.log(msg);

});

socket.on('distributeMessage', (msg) => {
    console.log(msg.substr(0, 4));
    const chatMsg = document.createElement('h5');
    // if (msg.substr(0, 4) === 'http') {
    //     const chatMsg = document.createElement('a');
    //     chatMsg.href = msg;
    // } else {
    //     const chatMsg = document.createElement('h5');
    // }
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    document.querySelector('#msgBox').appendChild(chatMsg);
    document.querySelector('#msgBox').appendChild(document.createElement('hr'));
    updateScroll()
});

socket.on('newConnection', (msg) => {
    const chatMsg = document.createElement('p');
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    chatMsg.style.color = 'blue';
    document.querySelector('#msgBox').appendChild(chatMsg);
    document.querySelector('#msgBox').appendChild(document.createElement('hr'));
    updateScroll();
});

socket.on('disconnection', (msg) => {
    const chatMsg = document.createElement('p');
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    chatMsg.style.color = 'red';
    document.querySelector('#msgBox').appendChild(chatMsg);
    document.querySelector('#msgBox').appendChild(document.createElement('hr'));
    updateScroll();
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // input = document.getElementById("inputMsg");

    // We can access the form also through the event - it passes the target element (the form in our case)
    message = e.target.elements.message.value;
    // message = input.value;
    socket.emit('sendMessage', message, (err, msg) => {
        if (err) {
            return console.log(err);
        }
        toast(msg || err);
    });
    e.target.elements.message.value = "";
});

document.querySelector('#sendLoc').addEventListener('click', (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Geolocatotion is not supported');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);
        let location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        socket.emit('sendLocation', location, (error) => {
            if (error) {
                return console.log(error);
            }
            //console.log("Location delivered")
            toast();
        });
    });

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

function updateScroll() {
    var element = document.getElementById("msgBox");
    element.scrollTop = element.scrollHeight;
}

function toast(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.textContent = msg;
    // Add the "show" class to DIV
    x.className = "show";
    //console.log("SHOW THIS ELEMENT", x);
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}