/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* Login NAMESPACE
 ============================================================== */
const login = function() {
  "use strict";
  const scriptFilename = "login.js";

  let usernameBox = $('#userNameBox');
  let passwordBox = $('#passwordBox');
  let loginBtn = $('#loginButton');

  const login = function() {
    if(noEmptyFields()) {          
      global.showLoader();

      let loginPromise = $.post("login", {username: usernameBox.val(), password: passwordBox.val()});
      global.logPromise(loginPromise, scriptFilename, "Requesting login");

      loginPromise.then((sessionID) => {
        sessionStorage.setItem("projectBoltSessionID", sessionID);
        global.redirect("");
      }).catch(() => {
        global.hideLoader();
        unfoldingHeader.unfoldHeader("Login failed", "red", true);
      }); 
    }  
    else {
      unfoldingHeader.unfoldHeader("Please fill in your credentials", "orange", true);
    }  
  };

  // Display appropriate message and return a boolean
  const noEmptyFields = function() {
    if(global.fieldIsEmpty(usernameBox) || global.fieldIsEmpty(passwordBox)) {
      return false;
    }
    else {
      return true; // No empty fields
    }
  };

  // aq namespace will reveal the following properties
  return {
    scriptFilename: scriptFilename,
    loginBtn: loginBtn,
    login: login
  };
}();
//  ============================================================== */

// When everything has loaded
$(document).ready(function() {
  "use strict";  
  let sessionID = sessionStorage.getItem('projectBoltSessionID');
  
  let sessionValidPromise = $.get("login/session-valid/"+sessionID);
  global.logPromise(sessionValidPromise, login.scriptFilename, "Requesting session valid check");

  sessionValidPromise.then((sessionValid) => {
    if (sessionValid) {      
      global.redirect("");
    }
    else
    {
      /* ATTACH EVENT LISTENERS
      ============================================================== */
      login.loginBtn.on("click", function() {
        login.login();
      });

      // Enter button clicked anywhere in the document triggers logging in
      $('body').keyup(function(event) {
        if(event.keyCode === 13) {
          login.login();
        }
      });

      global.hideLoader();
    }
  });
});