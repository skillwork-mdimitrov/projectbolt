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
    // URL is hardcoded, not secure way of requesting for server files (will be fixed)
    $.ajax({url: "scripts/sqltest/sqltest.js", success: function(result){
      global.searchedQuery.html(result);
    }});
  })
});

// module.exports.clickButton = clickButton;

