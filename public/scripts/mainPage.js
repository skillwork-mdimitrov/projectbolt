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
  const askQuestionBtn = $('#askQuestionBtn');
  const questionListBtn = $('#questionListBtn');
  const userProfileBtn = $('#userProfileBtn');
  const aboutPageBtn = $('#aboutPageBtn');
  const logoutBtn = $('#logoutBtn');

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

  return {
    questionsTable: questionsTable,
    searchContainer: searchContainer,
    askQuestionBtn: askQuestionBtn,
    questionListBtn: questionListBtn,
    userProfileBtn: userProfileBtn,
    aboutPageBtn: aboutPageBtn,
    logoutBtn: logoutBtn,

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
    })
  );

  // On 'Questions list' button click, fade out the searching and when done, fade in the questions table
  mainPage.questionListBtn.on("click", () => {
    mainPage.searchContainer.fadeOut("fast", () =>
      mainPage.questionsTable.fadeIn("fast", () =>
        mainPage.questionsTable.css("display", "flex"))); // because fadeIn sets it to displays:block);

        // Clear nav bar bg colours and set black for this button
        mainPage.navBarManipulation.clearAndSetNavBg(mainPage.questionListBtn);
  });

  mainPage.userProfileBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.aboutPageBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.logoutBtn.on("click", () => global.logout());
});