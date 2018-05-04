/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

// Global variables
let global = {
  searchField: $('.searchField'),
  searchBtn: $('#searchBtn'),
  searchedQuery: $('#searchedQuery'),
  questions: [] // will store all the questions from the database
};

// Global functions
function sendRequestSQL() {
  "use strict";
  try {
    // VARIABLES
    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (this.readyState === DONE && this.status === OK) {
        global.searchedQuery.html(this.responseText); // the response.write results will be displayed here
      }
    };
    xhttp.open("POST", "scripts/sqltest/sqltest.js", true);
    xhttp.send();
  }
  catch(e) {
    console.log('Caught Exception: ' + e.message);
  }
}

// Fetch the whole database
function fetchDB() {
  "use strict";
  try {
    // VARIABLES
    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (this.readyState === DONE && this.status === OK) {
        // the results from this request will be stored in the questions variable
        global.questions = this.responseText.split("\n");
      }
    };
    xhttp.open("POST", "dynamic_request_fetchDB", true);
    xhttp.send();
  }
  catch(e) {
    console.log('Caught Exception: ' + e.message);
  }
}

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  global.searchBtn.on("click", function() {
    // sendRequestSQL();
    fetchDB(); // send a request that fetches the db rows
    // hacky async ... wait 2 seconds (so the results had for sure arrived and then display them)
    setTimeout(function() {
      evaluate_query(global.questions);
    }, 2000);
  });
});



