/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* Global variables
 ============================================================== */
let global = {
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
// jQuery AJAX request for "dynamic_request_fetchDB" (will return all the rows from the db and store them in an array)
function fetchDB() {
  "use strict";
  $.ajax({
    type: 'GET',
    url: 'dynamic_request_fetchDB',
    success: function(data){
      // the results from this request will be stored in the questions variable.
      // since the results coming from the AJAX request are as string, split by coma first and then store in array
      global.questions = data.split(",");
      outsideResolve(global.questions);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
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
    // TODO add catch in case promise failed
  });
});



