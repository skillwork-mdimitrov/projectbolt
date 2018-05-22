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
          if(window.location.href.includes("localhost")) {
            window.location.href = "http://localhost:3000";
          }
          else {
            window.location.href = "https://projectboltrenew.azurewebsites.net";
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader("Login failed", "red", false);
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
        }
      });
    };
  // aq namespace will reveal the following properties
  return {
    usernameBox: usernameBox,
    loginBtn: loginBtn,
    passwordBox: passwordBox,
    login: login
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
      if(window.location.href.includes("localhost")) {
        window.location.href = "http://localhost:3000";
      }
      else {
        window.location.href = "https://projectboltrenew.azurewebsites.net";
      }
    }
    else
    {
      document.getElementById("loader").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
      /* ATTACH EVENT LISTENERS
      ============================================================== */
      login.loginBtn.on("click", function() {
        let userdata = {
          username : login.usernameBox.val(),
          password : login.passwordBox.val()
        };
        // Send the AJAX request
        login.login(userdata);
      });
    }
  })
  .fail(function () {
    console.log("error");
  })  
});