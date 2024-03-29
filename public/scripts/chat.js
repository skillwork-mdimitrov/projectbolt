const chat = function() {
	// Make connections
	const chatSocket = io('/chat');

  /* DOM selectors
  ============================================================== */
	const message = $("#message");
	const send_message = $("#send_message");
	const chatroom = $("#chatroom");
	const feedback = $("#feedback");
	const connected = $("#connected");
	let username; // to be re-assigned later
	
	// In the chat field, enter will simulate click
	message.keyup(function(event) {
		if (event.keyCode === 13) {
			$("#send_message").click();
		}
	});

	// Emit message
	send_message.click(function(){
		if (global.fieldIsEmpty(message)) {
			unfoldingHeader.unfoldHeader("Message can't be empty", "orange", true);
			return false;
		}
		chatSocket.emit('new_message', {message : message.val()});
	});

	// Listen on new_message
	chatSocket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		//checking if user is the user typing :)
		if(data.username == username)
		{
			//ur own message
			chatroom.append("<p class='messageYours'>" + data.message +" <img style='width: 10vh;' src= ../images/"+data.username+".png alt="+data.username+"Picture"+"/> </p><br>");
		}
		else
		{
			//someone elses message :)
			chatroom.append("<p class='messageOthers'>"+"<img style='width: 10vh;' src= ../images/"+data.username+".png alt="+data.username+"Picture/>" + "[<time class='date' title='"+new Date().toISOString()+"'>"+new Date().toISOString()+"</time>"+"] "+ data.username + ": " + data.message + "</p><br>");
		}
		time();
		bottomChat();
	});
	
	chatSocket.on('updateUsers', function(message) {
		connected.html(message.activeUsers);
	});

	// Emit typing
	message.bind("keypress", () => {
		chatSocket.emit('typing');
	});
	
	// Listen on typing
	chatSocket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
	});
	
	// Automatic scroll down to the end of the chat
	const bottomChat = function() {
		var objDiv = document.getElementById("chatroom");
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	// Get the username from the json data
	const getUsername = function(data){
		username = data[0].Username;
		chatSocket.emit('changeUsername', {username : data[0].Username});
	}
	
	const time = function() {
		$("time").each(function(){
			$(this).text($.timeago($(this).attr('title')));
		});
	}
	return {
		getUsername: getUsername
	}	
}();

// Initial change of username towards active session
$(document).ready(function () {
	let loginCheckPromise = loginCheck.checkLogin();
	let loadNavigationPromise = navigation.loadNavigation();
	let initNotificationsPromise = notifications.initNotifications();

	Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
		let sessionid = sessionStorage.getItem("projectBoltSessionID");
		console.log("Started fetching username json");
		try{
			$.getJSON("login/get-username/"+sessionid, function () {})
			.done(function (data) {
				global.hideLoader();
				return chat.getUsername(data);
			});
		}
		catch (exception)
		{
			global.hideLoader();
			unfoldingHeader.unfoldHeader("Erro"+exception, "red");
			return false;
		}
	}).catch(() => {
		unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
		setTimeout(function(){ global.logout(); }, 5000);   
	});  	
});