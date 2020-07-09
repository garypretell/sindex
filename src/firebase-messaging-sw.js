importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: 'AIzaSyDYOaBhbUkBc20baL-oGkppcZxy3Wqxb04',
    authDomain: 'magnum-50f46.firebaseapp.com',
    databaseURL: 'https://magnum-50f46.firebaseio.com',
    projectId: 'magnum-50f46',
    storageBucket: 'magnum-50f46.appspot.com',
    messagingSenderId: '799541362116',
    appId: '1:799541362116:web:6dba15ca860db61fd8f891',
    measurementId: 'G-88N002VEJ8'
});
const messaging = firebase.messaging();