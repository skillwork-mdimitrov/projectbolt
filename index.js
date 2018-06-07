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

// Notification web socket namespace
var notificationSocket = io.of('/notifications');
notificationSocket.on('connection', function(socket){
	console.log('Someone subscribed to notifications!');

	socket.on('newQuestion', function (data) {
    socket.broadcast.emit('newQuestion', data);
	});
	
	socket.on('newAnswer', function (data) {
    socket.broadcast.emit('newAnswer', data);
	});

	socket.on('disconnect', function(){
    console.log('Someone unsubscribed from notifications');
  });
});

// Chat web socket namespace
var chatSocket = io.of('/chat');
var chatUsers = []; // users chatting
chatSocket.on('connection', function(socket){
	//default username
	socket.username = "Anonymous"
	console.log(socket.username + " connected to the chat");
	
	//listen to changeUsername
	socket.on('changeUsername', (data) => {
		console.log(socket.username + " changed name to " + data.username);
		socket.username = data.username
		chatUsers.push(socket.username); // Add user to active users
		chatSocket.emit('updateUsers', {"activeUsers": chatUsers.toString()});	
	})
	
	//listen on new_message
	socket.on('new_message', (data) => {		
		var transmit = {date : new Date().toISOString(), username : socket.username, message : data.message};
		chatSocket.emit('new_message', transmit);
		console.log("User "+ transmit['username'] +" said \""+transmit['message']+"\""+" at " + getTime());
	})

	//listen on typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', {username : socket.username})
	})
	
	socket.on('disconnect', function () {
		console.log(socket.username + " disconnected from the chat");
		var userIndex = chatUsers.indexOf(socket.username);
		if (userIndex > -1) {
			chatUsers.splice(userIndex, 1);
		}
		chatSocket.emit('updateUsers', {"activeUsers": chatUsers.toString()});	
	})	
});

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