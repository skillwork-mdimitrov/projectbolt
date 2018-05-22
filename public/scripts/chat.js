$(document).ready(function() {
	//make connections
	var socket = io();
	//buttons and inputs
	var message = $("#message")
	//var username = $("#username")
	var username
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	
	getUsername();
	
	getUsername(function())
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
    			if (this.readyState == 4 && this.status == 200) {
        			var myObj = JSON.parse(this.responseText);
        			document.getElementById("demo").innerHTML = myObj.name;
			}
		};
		xmlhttp.open("GET", "https://projectboltrenew.azurewebsites.net/login/get-username/0", true);
		xmlhttp.send();
		socket.emit('changeUsername', {username : username.val()})
	}
	
	//Emit message
	send_message.click(function(){
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
		socket.emit('changeUsername', {username : username.val()})
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
