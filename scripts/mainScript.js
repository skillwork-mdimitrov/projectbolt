/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* Global variables
 ============================================================== */
let global = {
  searchField: $('.searchField'),
  searchInput: $('#query'),
  questions: [] // will store all the questions from the database
};

var outsideResolve; // will become dbDataLoaded's Promise.resolve
var outsideReject; // will become dbDataLoaded's Promise.reject
var dbDataLoaded = new Promise(function(resolve, reject) {
  "use strict";
  outsideResolve = resolve;
  outsideReject = reject;
});
// =====================================================================================================================

/* Global functions
 ============================================================== */
// AJAX request for "dynamic_request_fetchDB" (will return all the rows from the db and store them in an array)
function fetchDB() {
  "use strict";
    $.ajax({
    type: "POST",
    url: "dynamic_request_fetchDB",
    success: function(result){
      // since the results coming from the AJAX request are as string, split by coma first and then store in array
      global.questions = result.split(",");
      // the results from this request will be stored in the questions variable.
      outsideResolve(global.questions);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error caught, status: " + textStatus + " error: " + errorThrown);
    }
  });
}
// =====================================================================================================================

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  global.searchInput.on("input", function() {
    fetchDB(); // send a request that fetches the db rows
    dbDataLoaded.then(function(resolve) {
      evaluateQuery(resolve);
    });
  });
});



