var config = require("./config.json");
var WebSocketServer = require("ws").Server, wss = new WebSocketServer({port: config.port});
var pg = require("pg"), listener, client, connString = "postgres://" + config.database.user + ":" + config.database.password + "@" + config.database.host + ":" + config.database.port + "/" + config.database.name;

wss.broadcast = function(channel, payload) {
	wss.clients.forEach(function(client){
		client.send(JSON.stringify({
			"channel": channel,
			"payload": payload
		}));
	});
};

function connectDB() {
	listener = new pg.Client(connString);
	listener.connect();
	listener.query("LISTEN t_log; LISTEN t_messages;");
	listener.on("notification", function(msg){ 
		if(msg.channel == "t_log")
			payload = msg.payload;
		else
			payload = "message";

		wss.broadcast(msg.channel, payload);
	});

	client = new pg.Client(connString);
	client.connect();
}

connectDB();