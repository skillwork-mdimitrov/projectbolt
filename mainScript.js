/*globals $:false*/
/*jslint devel: true*/

// let global = {
//   // searchField: $('.searchField'),
//   // buttonTest: $('.testButton')
//   searchField: document.getElementsByClassName("searchField"),
//   testButton: document.getElementsByClassName("testButton")
// };

var searchBtn = document.getElementsByClassName("searchBtn");

searchBtn.addEventListener("click", function() {
  console.log("button was clicked");
});

// $(document).ready(function() {
//   global.buttonTest.click(function(){
//     console.log("Button clicked");
//   });
// });

// module.exports.clickButton = clickButton;

