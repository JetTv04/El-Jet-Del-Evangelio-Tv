// Service Worker para Notificaciones PWA y Caché del Sitio
const CACHE_NAME = 'eljet-tv-v3';
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './avion.gif',
  './manifest.json'
];

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBBTT3w-gKAnjnylo3MapQrYURMW3eexXs",
  authDomain: "eljettv-a09f8.firebaseapp.com",
  databaseURL: "https://eljettv-a09f8-default-rtdb.firebaseio.com",
  projectId: "eljettv-a09f8",
  storageBucket: "eljettv-a09f8.firebasestorage.app",
  messagingSenderId: "1064986191642",
  appId: "1:1064986191642:web:0d4b87ac0195b27853eea3"
});

const messaging = firebase.messaging();

// Evento de Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(err => console.log('Cache addAll error:', err));
    })
  );
  self.skipWaiting();
});

// Evento de Activación para limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento de Intercepción de Red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Mensajería Push en segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || '✈️ El Jet del Evangelio Web-Tv';
  const notificationOptions = {
    body: payload.notification.body || '¡Estamos en vivo! Únete a la transmisión.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Plane_icon_font_awesome.svg/512px-Plane_icon_font_awesome.svg.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
