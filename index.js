#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('projectbolt:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

io.on('connection', function(socket){
	var users = []; //count the users
	
	reloadUsers(); // Send the count to all the users
	//default username
	socket.username = "Anonymous"
	setHeight();
	//listen to changeUsername
	socket.on('changeUsername', (data) => {
		socket.username = data.username
		console.log("user " + socket.username + " connected");
	})
	
	//listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
		users.push(socket.username); // Add user to active users
		console.log("Users typing"+users.toString());
		var transmit = {date : new Date().toISOString(), username : socket.username, message : data.message};
		io.sockets.emit('new_message', transmit);
		console.log("user "+ transmit['username'] +" said \""+transmit['message']+"\""+" at "+getTime());
	})
	function getTime(){
		var today = new Date();
		var mi = today.getMinutes();
		var hr = today.getHours();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(mi<10) {
			mi = '0'+dd
		} 

		if(hr<10) {
			hr = '0'+mm
		} 
		
		
		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 

		today = "["+hr+":"+mi+"] " + mm + '/' + dd + '/' + yyyy;
		return today
	}
	//listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
	})
	socket.on('disconnect', function () { // Disconnection of the client
		users -= 1;
		reloadUsers();
		console.log("disconnect...");
		/*var pseudo; //in case we want a list of usernames
		pseudo = socket.username;
		var index = pseudoArray.indexOf(pseudo);
		pseudo.slice(index - 1, 1);*/
	})
	function reloadUsers() { // Send the count of the users to all
		console.log("users connected: "+users.toString());
		io.sockets.emit('nbUsers', {"nb": users.toString()});
	}
	const scrollbar = $("#slimScrollBar ui-draggable");
	function setHeight() {
		scrollbar.height('603');
		scrollbar.css('overflow', 'visible')
	}
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log("Server running at http://localhost:%d", port); // New
  debug('Listening on ' + bind);
}