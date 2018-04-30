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
  global.searchBtn.on("click", function() {
    global.searchedQuery.html("<em>The search query is ... </em>" + global.searchField.val());
  })
});

// module.exports.clickButton = clickButton;

