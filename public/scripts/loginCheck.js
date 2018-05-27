$.holdReady(true);

const loginCheck = function() {
  const checkLogin = function() {
    let currentSessionID = sessionStorage.getItem('projectBoltSessionID');
    console.log("Sending request");
    $.getJSON("login/check-session/"+currentSessionID, function () {})
    .done(function (data) {
      console.log("Request complete");
      console.log("Checking banned status");
      if (data.sessionValid) {
        getBannedState().then(function(banned){
          if (!banned) {
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainContainer").style.display = "block";
            $.holdReady(false);
          }
          else
          {
            sessionStorage.removeItem("projectBoltSessionID");
            global.redirect("login");
          }  
        })
        .catch((reason) => {
          sessionStorage.removeItem("projectBoltSessionID");
          global.redirect("login"); 
        });
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

  const getBannedState = function() {
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
              resolve(data[0].Banned);
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
    checkLogin: checkLogin
  }
}();
//  ============================================================== */

console.log("Checking for valid login");
loginCheck.checkLogin();  