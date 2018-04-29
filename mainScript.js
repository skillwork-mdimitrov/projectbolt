/*globals $:false*/
/*jslint devel: true*/

let global = {
  // searchField: $('.searchField'),
  // buttonTest: $('.testButton')
  searchField: document.getElementsByClassName("searchField"),
  testButton: document.getElementsByClassName("testButton")
};

$(document).ready(function() {
  global.buttonTest.click(function(){
    console.log("Button clicked");
  });
});

module.exports.global = global;

