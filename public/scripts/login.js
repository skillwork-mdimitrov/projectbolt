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
          window.location.href = "https://projectboltrenew.azurewebsites.net";
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
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
});