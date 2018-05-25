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
        document.getElementById("mainContainer").style.display = "block";
        $.holdReady(false);
      }
      else
      {
        global.redirect("login");
      }
    })
    .fail(function () {
      console.log("error");
      global.redirect("login");
    })
  };

  // loginCheck namespace will reveal the following properties
  return {
    checkLogin: checkLogin
  }
}();
//  ============================================================== */

loginCheck.checkLogin();