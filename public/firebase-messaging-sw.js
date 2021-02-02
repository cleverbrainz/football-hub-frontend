importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '123456654321'
});

const messaging = firebase.messaging();