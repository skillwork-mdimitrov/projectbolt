$.holdReady(true);

const loginCheck = function() {
  const checkLogin = function() {
    let sessionID = sessionStorage.getItem('projectBoltSessionID');
    console.log("Sending request");
    $.getJSON("login/check-session/"+sessionID, function () {})
    .done(function (data) {
      console.log("Request complete");
      if (data.sessionValid) {
        console.log("Checking banned status");
        $.getJSON("login/get-banned-status/"+sessionID, function () {})
        .done(function (bannedJSON) {
          console.log("Request complete");
          let banned = bannedJSON[0].Banned;
          if (!banned) {
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainContainer").style.display = "block"; // CHECK LATER
            $.holdReady(false);
          }
          else
          {
            sessionStorage.removeItem("projectBoltSessionID");
            global.redirect("login");
          }  
        })
        .fail(function () {
            console.log("error");
        })
      }
      else
      {
        sessionStorage.removeItem("projectBoltSessionID");
        global.redirect("login");
      }        
    })
    .fail(function () {
      sessionStorage.removeItem("projectBoltSessionID");
      global.redirect("login");
    })    
  };

  // loginCheck namespace will reveal the following properties
  return {
    checkLogin: checkLogin
  }
}();
//  ============================================================== */

console.log("Checking for valid login");
loginCheck.checkLogin();  