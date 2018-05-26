$.holdReady(true);

const loginCheck = function() {
  let currentSessionID;
  let isBanned;

  const checkLogin = function() {
    currentSessionID = sessionStorage.getItem('projectBoltSessionID');
    loginCheck.checkBannedState().then(function(){
      console.log("Sending request");
      $.getJSON("login/check-session/"+currentSessionID, function () {})
          .done(function (data) {
            console.log("Request complete");
            console.log("Checking banned status be4 redirecting" + loginCheck.isBanned);
            if (data.sessionValid === true && loginCheck.isBanned === false) {

              document.getElementById("loader").style.display = "none";
              document.getElementById("mainContainer").style.display = "block";
              $.holdReady(false);
            }
            else
            {
              sessionStorage.clear();
              global.redirect("login");
            }
          })
          .fail(function () {
            console.log("error");
            global.redirect("login");
          })
    })
      .catch(
          console.log("checkBannedState promise got rejected")
      );

  };

  const checkBannedState = function() {
    //get userID
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: 'get',
        url: 'login/get-userID/'+sessionStorage.getItem('projectBoltSessionID'),
        success: function (data) {
          //get user Banned status
          $.ajax({
            type: 'get',
            url: 'login/get-banned-status/'+data["userID"],
            success: function (data) {
              loginCheck.isBanned = data[0].Banned;
              resolve();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange");
              console.log('jqXHR: ' + jqXHR);
              console.log('textStatus: ' + textStatus);
              console.log('errorThrown: ' + errorThrown);
            }
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange");
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
          global.redirect("login");
        }
      });
    });
  };


  // loginCheck namespace will reveal the following properties
  return {
    checkLogin: checkLogin,
    checkBannedState: checkBannedState,
    isBanned: isBanned
  }
}();
//  ============================================================== */


  loginCheck.checkLogin();
  console.log("Login Check is being called");

