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
    $.ajax({url: "sqltest.js", success: function(result){
      global.searchedQuery.html(result);
    }});
  })
});

// module.exports.clickButton = clickButton;

