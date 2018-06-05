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
    const setNavBg = (tabIndex) => {
      NavBarIndex[tabIndex].addClass("blackBg");
    };

    // Set currently selected nav bar index
    const setNavBarIndex = (index) => {
      localStorage.setItem("navTabNumber", index);
    };

    // Clear all the black background from all li items and set one for an element
    const clearAndSetNavBg = (tabIndex) => {
      clearNavBg();
      setNavBarIndex(tabIndex);
      setNavBg(tabIndex);
    };

    return {
      clearAndSetNavBg: clearAndSetNavBg
    };
  }(); // IIFE

  // "Click" a navigation bar tab and set the current tab in the session
  const goToNavTab = (tabIndex) => {
    localStorage.setItem("navTabNumber", tabIndex);
    NavBarIndex[tabIndex].click();
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

      // Set the colour and local storage for this button
      mainPage.navBarManipulation.clearAndSetNavBg("1");
    })
  );

  // On 'Questions list' button click, fade out the searching and when done, fade in the questions table
  mainPage.questionListBtn.on("click", () => {
    mainPage.searchContainer.fadeOut("fast", () =>
      mainPage.questionsTable.fadeIn("fast", () =>
        mainPage.questionsTable.css("display", "flex"))); // because fadeIn sets it to displays:block);

        // Set the colour and local storage for this button
        mainPage.navBarManipulation.clearAndSetNavBg("2");
  });

  mainPage.logoutBtn.on("click", () => global.logout());

  // After the button click events were defined and this script was run ↓
  (() => {
    // navTabNumber session will be empty when mainPage is run initially in a new browser session */
    if(localStorage.getItem("navTabNumber") === null) {
      mainPage.goToNavTab("2"); // default tab/page
    }
    // "Click" a desired tab (for example redirect can come from answers.html with a navTabNumber in set in the local storage)
    else {
      mainPage.goToNavTab(localStorage.getItem("navTabNumber"));
    }
  })(); // IIFE;
});