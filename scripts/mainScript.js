/*globals $:false*/
/*jslint devel: true*/
"use strict";

// Global variables
let global = {
  searchField: $('.searchField'),
  searchBtn: $('#searchBtn'),
  searchedQuery: $('#searchedQuery')
};

// When everything has loaded
$(document).ready(function() {

  /* EVENT LISTENERS
   ============================================================== */
  global.searchBtn.on("click", function() {
    // global.searchedQuery.html("<em>The search query is ... </em>" + global.searchField.val());

    // Send AJAX request on searchBtn click
    $.ajax({url: "scripts/sqltest/sqltest.js",
      success: function(result){ // HC URL + exposed server architecture (will fix later)
        // Cover all JS scenarios for falsy results
        if(result === 'undefined' || typeof result === 'undefined' || result === null) {
          global.searchedQuery.html("Couldn't fetch results from the database");
        }
        // Correct results, display them
        else {
          global.searchedQuery.html(result);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("Status: " + textStatus); alert("Error: " + errorThrown);
        global.searchedQuery.html("Bad request");
      }
      });
  })
});

