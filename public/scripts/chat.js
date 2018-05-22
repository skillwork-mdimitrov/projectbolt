$(document).ready(function() {
	//make connections
	var socket = io();
	//buttons and inputs
	var message = $("#message")
	//var username = $("#usernamenew")
	var username
	var usernameextra = $("#usernamenew")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var sessionid = sessionStorage.getItem("projectBoltSessionID");
	
	//inital change of useranme towards active session
	$(document).ready(function () {
		console.log("Started fetching username json");
		$.getJSON("login/get-username/"+sessionid, function () {})
		  .done(function (data) {
			console.log("Recieved user json");
			getUsername(data);
		  })
		  .fail(function () {
			console.log("error");
		  })
	});

	$("#message").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#send_message").click();
		}
	});
	
	$("#usernamenew").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#send_username").click();
		}
	});
	
	//Get the username from the json data
	function getUsername(data){
		username = data[0].Username;
		socket.emit('changeUsername', {username : data[0].Username})
	}
	
	//Emit message
	send_message.click(function(){
		if (message.val()==null || message.val()=="")
		{
      unfoldingHeader.unfoldHeader("Please type something...^^", "orange", true);
			return false;
		}
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})
	
	//Emit a username
	send_username.click(function(){
		socket.emit('changeUsername', {username : username+"@"+usernameextra.val()})
	})
	
	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})
	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});
