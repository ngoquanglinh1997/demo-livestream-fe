// plugins/socket-io.js

import Vue from 'vue';
import io from 'socket.io-client';

const socket = io('https://your-socket-io-server-url'); // Replace with your Socket.io server URL

export default ({ app }) => {
  // Optionally, you can listen for events and perform actions here
  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
    // You can dispatch an action or commit a mutation to handle the connection status in your Vuex store
    // For example: store.commit('socket/setConnected', true);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io server');
    // For example: store.commit('socket/setConnected', false);
  });

  // You can listen to more events and perform actions here

  // Inject the socket into the context
  app.$socket = socket;

};
