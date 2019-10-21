const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormBtn = document.querySelector('#sendBtn');
const $messageFormInput = document.querySelector('#inputMsg');
const $locationBtn = document.querySelector('#sendLoc');
const $messageBox = document.querySelector('#msgBox');
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Templates 1: Select the element in which you want to render the template
const $msgBox = document.querySelector('#msgBox');

// Templates 2: Select the template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// Options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('welcome', (msg) => {

    const welcomeHeading = document.createElement('h4');
    welcomeHeading.className = 'chatmsg-heading'
    welcomeHeading.innerHTML = msg;
    // welcomeHeading.style.marginLeft = '0.5rem';
    welcomeHeading.className = "ml-2";
    welcomeHeading.setAttribute('id', 'chatHeader');
    $messageBox.appendChild(welcomeHeading);
    $messageBox.appendChild(document.createElement('hr'));

    console.log(msg);

});

socket.on('distributeMessage', (msg) => {
    const html = Mustache.render(messageTemplate, { msg });
    $messageBox.insertAdjacentHTML('beforeend', html);
    console.log(msg);
    updateScroll();
});

socket.on('roomData', ({ room, users }) => {
    console.log(`UPDATE USERLIST: ${room} - ${users}`, )
    const html = Mustache.render(sidebarTemplate, { room, users });
    document.querySelector('#sidebar').innerHTML = html;
});

socket.on('locationMessage', (msg) => {

    console.log("LOGGING SUBSTRING 0,4 ",
        msg.msg.substr(0, 4));

    const html = Mustache.render(locationTemplate, {
        msg
    });
    $messageBox.insertAdjacentHTML('beforeend', html);

    updateScroll();
});

socket.on('newConnection', (msg) => {
    const chatMsg = document.createElement('p');
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    chatMsg.style.color = 'blue';
    $messageBox.appendChild(chatMsg);
    $messageBox.appendChild(document.createElement('hr'));
    updateScroll();
});

socket.on('disconnection', (msg) => {
    const chatMsg = document.createElement('p');
    chatMsg.innerHTML = msg;
    chatMsg.setAttribute('id', 'chatMsg');
    chatMsg.style.color = 'red';
    $messageBox.appendChild(chatMsg);
    $messageBox.appendChild(document.createElement('hr'));
    updateScroll();
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // input = document.getElementById("inputMsg");

    // Disable the form
    $messageFormBtn.setAttribute('disabled', 'disabled');
    // We can access the form also through the event - it passes the target element (the form in our case)
    message = e.target.elements.message.value;
    // message = input.value;
    socket.emit('sendMessage', message, (err, msg) => {
        // Enable the form
        $messageFormBtn.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
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
        socket.emit('locationMessage', location, (error) => {
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

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});