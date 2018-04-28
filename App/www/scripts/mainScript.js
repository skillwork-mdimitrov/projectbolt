/*globals $:false*/
/*jslint devel: true*/

let global = {
  searchField: $('.searchField'),
  buttonTest: $('.testButton')
};

$(document).ready(function() {
  global.buttonTest.click(function(){
    console.log("Button clicked");
  });
});


