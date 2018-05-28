// BEWARE, chat.js doesn't use module pattern, global scope is polluted

$(document).ready(function() {
	// Make connections
	const socket = io();

	// DOM selectors
	const message = $("#message");
	const usernameextra = $("#usernamenew");
  const send_message = $("#send_message");
  const send_username = $("#send_username");
  const chatroom = $("#chatroom");
  const feedback = $("#feedback");
	let sessionid = sessionStorage.getItem("projectBoltSessionID");
  let username; // to be re-assigned later
	
	// Inital change of username towards active session
	$(document).ready(function () {
		console.log("Started fetching username json");
		$.getJSON("login/get-username/"+sessionid, function () {})
		  .done(function (data) {
        console.log("Recieved user json");
        return getUsername(data);
		  })
		  .fail(function () {
			  console.log("error");
			  return "Error";
		  })
	});

	// In the chat field, enter will simulate click
  message.keyup(function(event) {
		if (event.keyCode === 13) {
			$("#send_message").click();
		}
	});

  // In the change name field, enter will simulate click
  usernameextra.keyup(function(event) {
		if (event.keyCode === 13) {
			$("#send_username").click();
		}
	});
	
	// Get the username from the json data
	function getUsername(data){
		username = data[0].Username;
		socket.emit('changeUsername', {username : data[0].Username})
	}
	
	// Emit message
	send_message.click(function(){
		if (global.fieldIsEmpty(message)) {
      unfoldingHeader.unfoldHeader("Please type something...^^", "orange");
			return false;
		}
		socket.emit('new_message', {message : message.val()})
	});

	// Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	});
	
	// Emit a username
	send_username.click(function(){
		socket.emit('changeUsername', {username : username+"@"+usernameextra.val()})
	});
	
	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	});
	// Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});
