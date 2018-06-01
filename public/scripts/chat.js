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
		chatroom.append("<p class='message'>" + "[<time class='date' title='"+new Date().toISOString()+"'>"+new Date().toISOString()+"</time>"+"] "+ data.username + ": " + data.message + "</p>")
		time();
	});
	
	function time() {
		$("time").each(function(){
			$(this).text($.timeago($(this).attr('title')));
		});
	}
	
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
	});
	
	// Handle the socket.io connections
	function rooms (){

		var socket = io('/rooms', { transports: ['websocket'] });

		// When socket connects, get a list of chatrooms
		socket.on('connect', function () {

		  // Update rooms list upon emitting updateRoomsList event
		  socket.on('updateRoomsList', function(room) {

			// Display an error message upon a user error(i.e. creating a room with an existing title)
			$('.room-create p.message').remove();
			if(room.error != null){
			  $('.room-create').append(`<p class="message error">${room.error}</p>`);
			}else{
			  app.helpers.updateRoomsList(room);
			}
		  });

		  // Whenever the user hits the create button, emit createRoom event.
		  $('.room-create button').on('click', function(e) {
			var inputEle = $("input[name='title']");
			var roomTitle = inputEle.val().trim();
			if(roomTitle !== '') {
			  socket.emit('createRoom', roomTitle);
			  inputEle.val('');
			}
		  });

		});
	}

	function chat (roomId, username){
		
		var socket = io('/chatroom', { transports: ['websocket'] });

		  // When socket connects, join the current chatroom
		  socket.on('connect', function () {

			socket.emit('join', roomId);

			// Update users list upon emitting updateUsersList event
			socket.on('updateUsersList', function(users, clear) {

			  $('.container p.message').remove();
			  if(users.error != null){
				$('.container').html(`<p class="message error">${users.error}</p>`);
			  }else{
				app.helpers.updateUsersList(users, clear);
			  }
			});

			// Whenever the user hits the save button, emit newMessage event.
			$(".chat-message button").on('click', function(e) {

			  var textareaEle = $("textarea[name='message']");
			  var messageContent = textareaEle.val().trim();
			  if(messageContent !== '') {
				var message = { 
				  content: messageContent, 
				  username: username,
				  date: Date.now()
				};

				socket.emit('newMessage', roomId, message);
				textareaEle.val('');
				app.helpers.addMessage(message);
			  }
			});

			// Whenever a user leaves the current room, remove the user from users list
			socket.on('removeUser', function(userId) {
			  $('li#user-' + userId).remove();
			  app.helpers.updateNumOfUsers();
			});

			// Append a new message 
			socket.on('addMessage', function(message) {
			  app.helpers.addMessage(message);
			});
		  });
	}

    function helpers () {
	/*
		encodeHTML: function (str){
		  return $('<div />').text(str).html();
		},

		// Update rooms list
		updateRoomsList: function(room){
		  room.title = this.encodeHTML(room.title);
		  var html = `<a href="/chat/${room._id}"><li class="room-item">${room.title}</li></a>`;

		  if(html === ''){ return; }

		  if($(".room-list ul li").length > 0){
			$('.room-list ul').prepend(html);
		  }else{
			$('.room-list ul').html('').html(html);
		  }
		  
		  this.updateNumOfRooms();*/
    }

    // Update users list
    function updateUsersList (users, clear){
        if(users.constructor !== Array){
          users = [users];
        }
        var html = '';
        for(var user of users) {
          user.username = this.encodeHTML(user.username);
          html += `<li class="clearfix" id="user-${user._id}">
                     <img src="${user.picture}" alt="${user.username}" />
                     <div class="about">
                        <div class="name">${user.username}</div>
                        <div class="status"><i class="fa fa-circle online"></i> online</div>
                     </div></li>`;
        }
        if(html === ''){ return; }
        if(clear != null && clear == true){
          $('.users-list ul').html('').html(html);
        }else{
          $('.users-list ul').prepend(html);
        }
        this.updateNumOfUsers();
    }

    // Adding a new message to chat history
    function addMessage (message){
		message.date      = (new Date(message.date)).toLocaleString();
		message.username  = this.encodeHTML(message.username);
		message.content   = this.encodeHTML(message.content);

		var html = `<li>
					<div class="message-data">
					  <span class="message-data-name">${message.username}</span>
					  <span class="message-data-time">${message.date}</span>
					</div>
					<div class="message my-message" dir="auto">${message.content}</div>
				  </li>`;
		$(html).hide().appendTo('.chat-history ul').slideDown(200);

		// Keep scroll bar down
		$(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
    }

    /*Update number of rooms
    /This method MUST be called after adding a new room*/
    function updateNumOfRooms (){
      var num = $('.room-list ul li').length;
      $('.room-num-rooms').text(num +  " Room(s)");
    }

    /* Update number of online users in the current room
    / This method MUST be called after adding, or removing list element(s)*/
    function updateNumOfUsers (){
      var num = $('.users-list ul li').length;
      $('.chat-num-users').text(num +  " User(s)");
    }
}
)
