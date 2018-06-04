/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* redirectToIndex NAMESPACE
 ============================================================== */
const redirectToIndex = function() {
  "use strict";
  const goTo = function(toWhichTab) {
    $.get( "/", function() {
      localStorage.setItem("navTabNumber", toWhichTab); // adjust the local storage for the desired nav tab to go to
      // When mainPage got executed, it will grab the navTabNumber from the localStorage and go to that nav tab
      global.redirect("");
    })
    .fail(function(jqXHR) {
      unfoldingHeader.unfoldHeader("Couldn't redirect you back to the main page. Apologies :(", "red");
      global.logAJAXErr(goTo.name, jqXHR);
    });
  };

  return {
    goTo: goTo
  };
}();