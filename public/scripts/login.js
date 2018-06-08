/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* Login NAMESPACE
 ============================================================== */
const login = function() {
  "use strict";
  let usernameBox = $('#userNameBox');
  let loginBtn = $('#loginButton');
  let passwordBox = $('#passwordBox');
  let documentBody = $('body');

  const login = function(userdata) {
    $.ajax({
      type: 'post',
      data: userdata,
      url: 'login',
      success: function(data){
        sessionStorage.setItem("projectBoltSessionID", data.sessionID);
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        console.log("Checking banned status");
        $.getJSON("login/get-banned-status/"+sessionID, function () {})
        .done(function (bannedJSON) {
          console.log("Request complete");
          let banned = bannedJSON[0].Banned;
          if (!banned) {
            global.redirect("");
          }
          else
          {
            global.hideLoader();
            unfoldingHeader.unfoldHeader("Login failed: You are banned", "red", true);
          }  
        })
        .fail(function () {
          global.hideLoader();
          unfoldingHeader.unfoldHeader("Login failed: "+jqXHR.responseText, "red", true);
        })        
      },
      error: function(jqXHR, textStatus, errorThrown) {
        global.hideLoader();
        unfoldingHeader.unfoldHeader("Login failed: "+jqXHR.responseText, "red", true);
      }
    });
  };

  // Display appropriate message and return a boolean
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
    documentBody: documentBody,
    login: login,
    noEmptyFields: noEmptyFields
  };
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

          global.showLoader();
          // Send the AJAX request
          login.login(userdata);
        }
      });

      // Enter button clicked anywhere in the document triggers logging in
      login.documentBody.keyup(function(event) {
        if(event.keyCode === 13) {
          login.loginBtn.click();
        }
      });

      global.hideLoader();
    }
  })
  .fail(function () {
    console.log("error");
  });
});