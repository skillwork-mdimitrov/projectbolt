/* Login NAMESPACE
 ============================================================== */
const login = function() {
  "use strict";
  let usernameBox = $('#userNameBox');
  let loginBtn = $('#loginButton');
  let passwordBox = $('#passwordBox');

  const login = function(userdata) {
      "use strict";
      $.ajax({
        type: 'post',
        data: userdata,
        url: 'login',
        success: function(data){
          sessionStorage.setItem("projectBoltSessionID", data.sessionID);
          global.redirect("");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader("Login failed", "red", true);
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
        }
      });
    };

  // Display appropriate msg and return a boolean
  const noEmptyFields = function() {
    if(global.fieldIsEmpty(usernameBox) && global.fieldIsEmpty(passwordBox)) {
      unfoldingHeader.unfoldHeader("Please fill in your credentials", "orange", true);
      return false;
    }
    else if(global.fieldIsEmpty(usernameBox)) {
      unfoldingHeader.unfoldHeader("Please fill in your username", "orange", true);
      return false;
    }
    else if(global.fieldIsEmpty(passwordBox)) {
      unfoldingHeader.unfoldHeader("Please fill in your password", "orange", true);
      return false;
    }
    else {
      return true; // No empty fields
    }
  };

  // aq namespace will reveal the following properties
  return {
    usernameBox: usernameBox,
    loginBtn: loginBtn,
    passwordBox: passwordBox,
    login: login,
    noEmptyFields: noEmptyFields
  }
}();
//  ============================================================== */

// When everything has loaded
$(document).ready(function() {
  "use strict";  
  let currentSessionID = sessionStorage.getItem('projectBoltSessionID');
  console.log("Sending request");
  $.getJSON("login/check-session/"+currentSessionID, function () {})
  .done(function (data) {
    console.log("Request complete");
    if (data.sessionValid === true) {      
      global.redirect("");
    }
    else
    {
      /* ATTACH EVENT LISTENERS
      ============================================================== */
      login.loginBtn.on("click", function() {
        // No empty fields
        if(login.noEmptyFields()) {
          // JSON'ize the data to be send
          let userdata = {
            username : login.usernameBox.val(),
            password : login.passwordBox.val()
          };
          // Send the AJAX request
          login.login(userdata);
        }
      });
    }
  })
  .fail(function () {
    console.log("Check session failed");
  })  
});