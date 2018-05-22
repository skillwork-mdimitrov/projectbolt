$.holdReady(true);

const loginCheck = function() {
  let currentSessionID;

  const checkLogin = function() {
    currentSessionID = sessionStorage.getItem('projectBoltSessionID');

    console.log("Sending request");
    $.getJSON("login/check-session/"+currentSessionID, function () {})
    .done(function (data) {
      console.log("Request complete");
      if (data.sessionValid === true) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
        $.holdReady(false);
      }
      else
      {
        if(window.location.href.includes("localhost")) {
          window.location.href = "http://localhost:3000/login";
        }
        else {
          window.location.href = "https://projectboltrenew.azurewebsites.net/login";
        }
      }
    })
    .fail(function () {
      console.log("error");
      if(window.location.href.includes("localhost")) {
        window.location.href = "http://localhost:3000/login";
      }
      else {
        window.location.href = "https://projectboltrenew.azurewebsites.net/login";
      }
    })
  };

  // loginCheck namespace will reveal the following properties
  return {
    checkLogin: checkLogin
  }
}();
//  ============================================================== */

loginCheck.checkLogin();