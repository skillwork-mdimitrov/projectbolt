const loginCheck = function() {
  const scriptFilename = "loginCheck.js";

  const checkLogin = function() {
    return new Promise((resolve, reject) => {
      let sessionID = sessionStorage.getItem('projectBoltSessionID');

      let sessionValidPromise = $.get("login/session-valid/"+sessionID);
      global.logPromise(sessionValidPromise, scriptFilename, "Requesting session valid check");
      let bannedStatusPromise = $.get("login/get-banned-status/"+sessionID);
      global.logPromise(bannedStatusPromise, scriptFilename, "Requesting user ban status");

      Promise.all([sessionValidPromise, bannedStatusPromise]).then((values) => {
        let sessionValid = values[0]; // Return value from sessionValidPromise
        let banned = values[1];       // Return value from bannedStatusPromise

        if (sessionValid) {
          if (!banned) {
            resolve();
          }
          else {
            global.logout();
          }
        }
        else {
          global.logout();
        }
      }).catch(() => {
        global.logout();
      });   
    });
  };

  return {
    scriptFilename: scriptFilename,
    checkLogin: checkLogin
  }
}();