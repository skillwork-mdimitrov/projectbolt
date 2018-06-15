/* global NAMESPACE
 ==============================================================
 * A script for abstract, reusable functions                 */

const global = function() {
  // Initially create an empty array, if "questionsVisited" session exists, the array is filled with the contents of the session
  let questionsVisited = sessionStorage.getItem("questionsVisited") ? JSON.parse(sessionStorage.getItem('questionsVisited')) : [];

  // Register to which question the user is going
  const trackQuestionsVisited = (indicator, questionID) => {
    // indicator needs to be a jQuery object
    indicator.on("click", () => {
      // Store the questionID visited
      questionsVisited.push(questionID);
      sessionStorage.setItem("questionsVisited", JSON.stringify(questionsVisited)); // store the array in the session (to persists through pages)
    })
  };

  /* @return {true} if the field is NOT empty
  ============================================================== */
  const fieldNotEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length > 0;
    }
  };

  /* @return {true} if the field IS empty
  ============================================================== */
  const fieldIsEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length === 0;
    }
  };

  /* Remove element from array by value
  * const myArr = ["one", "two", "three", "four"];
  * rmElemFromArray(myArr, "two");
  ============================================================== */
  const rmElemFromArray = function remove(array, element) {
    "use strict";
    const value = array.indexOf(element);

    if (value !== -1) {
      array.splice(value, 1);
      return true;
    }
    else {
      return false;
    }
  };

  const showLoader = function(hideMainContent) {
    if (hideMainContent === true) {
      document.getElementById("mainContainer").style.display = "none";
    }
    document.getElementById("loader").style.display = "block";
  };

  const hideLoader = function() {
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("loader").style.display = "none";
  };

  const redirect = function redirect(route) {
    if (route === undefined) {
      route = "";
    }
    if(window.location.href.includes("projectboltrenew.azurewebsites")) {
      window.location.href = "https://projectboltrenew.azurewebsites.net/"+route;
    }
    else {
      let portIndex = window.location.href.indexOf(":3000");
      let baseUrl = window.location.href.substring(0, portIndex);
      window.location.href = baseUrl+":3000/"+route;
    }
  };

  const logout = function logout() { 
    sessionStorage.removeItem("projectBoltSessionID");

    // TODO THINK ABOUT THIS
    // Reset the visited pages
    sessionStorage.removeItem("questionsVisited");
    questionsVisited.length = 0;

    redirect("login");
  };

  /* Console.log an AJAX request error
   * functionName example: logout.name
   * jqXHR examplse: $.ajax( . . . error(function(jqXHR)); $.getJSON().fail(function(jqXHR)
   * DRAWBACKS: ↓
   * NOT GOOD for anonymous functions (You would need to do something like "const buttonID = this.id" and pass that as the first parameter
   * The exact line from where the error got logged will be lost, but it will be known that logAJAXErr function logged it */
  const logAJAXErr = function(functionName, jqXHR) {
    console.log(`${logAJAXErr.name} reporting: 
                  ${functionName} AJAX request failed. Details: ↓
                  Status: ${jqXHR.status}
                  Error thrown: ${jqXHR.statusText}
                  responseText: ↓
                  ${jqXHR.responseText}`);

    /* @returns {duplicatedKey} if the server response contains the phrase in the if includes()
     ============================================================== */
    /* Example of how to use the returned "duplicatedKey: ↓
    *  if(global.logAJAXErr(postAnswer.name, jqXHR) === "duplicatedKey") {
    *     unfoldingHeader.unfoldHeader("This answer already exists", "red");
    *  } */
    if(jqXHR.responseText.includes("Violation of UNIQUE KEY")) {
      return "duplicatedKey";
    }
    // Add your else if here
    else {
      return false;
    }
  };

  const getUniqueLogId = function(N) {
    // Return a random string of N characters
    return Array(N+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, N);   
  };

  const logPromise = function(promise, sender, message) {
    let logID = getUniqueLogId(10);
    console.log(logID + ": " + message + " from " + sender);
    promise.then(() => {
      console.log(logID + ": Completed in " + sender);
    }).catch((reason) => {
      if (typeof reason === 'object') {
        reason = JSON.stringify(reason);
      }
      console.log(logID + ": Error in " + sender + ": " + reason);
    }); 
  };


  /* @return {true} if user is going away from our domain
  ============================================================== */
  const leavingSite = function() {
    let leaving = true;
    if(window.location.href.includes("projectboltrenew.azurewebsites")) {
      leaving = false;
    }
    else if(window.location.href.includes("localhost")) {
      leaving = false;
    }
    return leaving;
  };

  // @return {unique []}
  const rmArrDuplicates = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
  };

  /* @return {date: YYYY-MM-DD}
  ============================================================== */
  const getTodaysDate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; // January is 0
    var yyyy = today.getFullYear();

    if(dd<10) {
      dd = '0' + dd;
    }

    if(mm<10) {
      mm = '0' + mm;
    }

    // Extend if needed, adjust today = mm +'/'+ dd +'/'+ yyyy to change the format
    today = yyyy + "/" + mm + "/" + dd;
    return today;
  };

  const sendStatistics = () => {
    // @return {true} if the user has visited some questions
    const statsNotEmpty = () => questionsVisited.length > 0;
    // @return [] of unique values only (so user can't spam the same question)7
    const getUniqueVisited = () => rmArrDuplicates(questionsVisited);

    // JSON'ize and stringify the body to be send
    const JSONstringifyBody = () => {
      return {
        visited: JSON.stringify(getUniqueVisited()),
        date: JSON.stringify(getTodaysDate())
      };
    };

    if(statsNotEmpty()) {
      $.post("/sendStatistics", JSONstringifyBody());
      return true;
    }
    return false;
  };

  // Pages with global.js will fire this event when user is about to leave the page
  window.onbeforeunload = function () {
    if (leavingSite()) {
      // TODO Send AJAX with the clicks statistics here
      console.log("hey dojo");
    }
  };

  return {
    trackQuestionsVisited: trackQuestionsVisited,
    questionsVisited: questionsVisited,
    // TODO remove from here most likely
    sendStatistics: sendStatistics,
    fieldNotEmpty: fieldNotEmpty,
    fieldIsEmpty: fieldIsEmpty,
    rmElemFromArray: rmElemFromArray,
    showLoader: showLoader,
    hideLoader: hideLoader,
    redirect: redirect,
    logout: logout,
    logAJAXErr: logAJAXErr,
    logPromise: logPromise
  };
}();
//  ============================================================== */