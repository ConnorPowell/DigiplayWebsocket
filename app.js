// Load in the .env file
require('dotenv').config()

// Websocket & Postgres Client packages
const WebSocket = require('ws');
const { Client } = require('pg');

// List of triggers we need from the database
const LISTEN_TRIGGERS = [
	't_log',
	't_messages',
	't_configuration',
];

// Start our websocket
const wss = new WebSocket.Server({
	port: process.env.PORT
});

// Broadcast to each client the payload and channel
function broadcast(channel, payload) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify({
			channel: channel,
			payload: payload,
		}));
	});
};

async function setupDatabaseConnection() {
	const client = new Client();
	await client.connect();

	// Query the server to listen to our triggers
	client.query(LISTEN_TRIGGERS.reduce((accumulator, trigger) => {
		return `LISTEN ${trigger};${accumulator}`;
	}, ''));
	
	// When we receive a message
	// Dispatch a message broadcast to the clients
	client.on('notification', ({ channel, payload }) => {
		// Set broadcast payload depending on message type
		let rawPayload;
		if(channel == 't_log' || channel == 't_configuration') {
			rawPayload = JSON.parse(payload);
		}
		else {
			rawPayload = 'message';
		}

		broadcast(channel, rawPayload);
	});
}

// Every 10 seconds ping connected clients
// This is required to keep the connection open
// As browsers will terminate a websocket which hasn't
// communicated for some time
setInterval(() => {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify({
			channel: 'ping',
			payload: 'hello',
		}));
	})
}, 10000);

setupDatabaseConnection();