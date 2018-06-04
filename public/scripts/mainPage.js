/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* mainPage NAMESPACE
 ============================================================== */
const mainPage = function() {
  "use strict";
  // DOM selectors
  const questionsTable = $('#questionsTable');
  const searchContainer = $('#searchContainer');

  // Nav bar
  const askQuestionBtn = $('#askQuestionBtn');
  const questionListBtn = $('#questionListBtn');
  const logoutBtn = $('#logoutBtn');

  // ENUMS of the navigation bar indices, sealed
  const NavBarIndex = Object.freeze({
    "1": askQuestionBtn,
    "2": questionListBtn
  });

  const navBarManipulation = function(){
    // Remove the black background from all navigation bar items
    const clearNavBg = () => {
      $('.nav ul li').removeClass("blackBg");
    };

    // Set a black background to an element
    const setNavBg = (element) => {
      element.addClass("blackBg");
    };

    // Clear all the black background from all li items and set one for an element
    const clearAndSetNavBg = (forElement) => {
      clearNavBg();
      setNavBg(forElement);
    };

    return {
      clearAndSetNavBg: clearAndSetNavBg
    };
  }(); // IIFE

  // "Click" a navigation bar tab and set the current tab in the session
  const goToNavTab = (tabNumber) => {
    localStorage.setItem("navTabNumber", tabNumber);
    NavBarIndex[tabNumber].click();
  };

  return {
    // Nav bar
    askQuestionBtn: askQuestionBtn,
    questionListBtn: questionListBtn,
    logoutBtn: logoutBtn,
    goToNavTab: goToNavTab,

    questionsTable: questionsTable,
    searchContainer: searchContainer,
    navBarManipulation: navBarManipulation // return functions
  };
}();
// ============================================================== */

$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
  ============================================================== */

  // On 'Ask a question' button click, fade out the questions table and when done, fade in the searching functionality
  mainPage.askQuestionBtn.on("click", () =>
    mainPage.questionsTable.fadeOut("fast", () => {
      mainPage.searchContainer.fadeIn("fast");

      // Clear nav bar bg colours and set black for this button
      mainPage.navBarManipulation.clearAndSetNavBg(mainPage.askQuestionBtn);

      // Set the navTabNumber to this tab
      localStorage.setItem("navTabNumber", "1");
    })
  );

  // On 'Questions list' button click, fade out the searching and when done, fade in the questions table
  mainPage.questionListBtn.on("click", () => {
    mainPage.searchContainer.fadeOut("fast", () =>
      mainPage.questionsTable.fadeIn("fast", () =>
        mainPage.questionsTable.css("display", "flex"))); // because fadeIn sets it to displays:block);

        // Clear nav bar bg colours and set black for this button
        mainPage.navBarManipulation.clearAndSetNavBg(mainPage.questionListBtn);

         // Set the navTabNumber to this tab
        localStorage.setItem("navTabNumber", "2");
  });

  mainPage.logoutBtn.on("click", () => global.logout());

  // After the button click events were defined ↓
  (() => {
    // navTabNumber session will be empty when mainPage is run initially in a new browser session */
    if(localStorage.getItem("navTabNumber") === null) {
      mainPage.goToNavTab("2"); // default tab
    }
    // "Click" a desired tab
    else {
      mainPage.goToNavTab(localStorage.getItem("navTabNumber"));
    }
  })(); // IIFE;
});